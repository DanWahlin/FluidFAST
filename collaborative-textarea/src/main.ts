import {
    customElement,
    FASTElement,
    html,
    ref,
    observable
} from "@microsoft/fast-element";
import { SharedString } from '@fluidframework/sequence';
import { FluidLoaderService } from './services/fluidLoaderService';
import { CollaborativeText } from './services/collaborative-text.dataobject';
import { CollaborativeTextContainerRuntimeFactory } from './services/containerCode';

const template = html<CollaborativeTextAreaElement>`
    <div>
        <br />
        <!-- There are a lot of different ways content can be inserted into a textarea
            and not all of them trigger a onBeforeInput event. To ensure we are grabbing
            the correct selection before we modify the shared string we need to make sure
            updateSelection is being called for multiple cases. 
        -->
        <textarea ${ref('textArea')}
            rows="20"
            cols="50"
            @beforeinput="${x => x.updateSelection()}"
            @keydown="${x => x.updateSelection()}"
            @click="${x => x.updateSelection()}"
            @contextmenu="${x => x.updateSelection()}"
            @input="${(x, c) => x.handleChange(c.event)}"
            :value="${x => x.text}"></textarea>
    </div>
`;

@customElement({
    name: 'collab-text',
    template
})
export class CollaborativeTextAreaElement extends FASTElement {
    @observable text: string = '';
    textArea: HTMLTextAreaElement;
    sharedString: SharedString;
    dataObject: CollaborativeText;
    selectionEnd = 0;
    selectionStart = 0;

    async connectedCallback() {
        super.connectedCallback();

        // Load Fluid DataObject
        const fluidService = new FluidLoaderService();
        this.dataObject = await fluidService.loadDataObject<CollaborativeText>(CollaborativeTextContainerRuntimeFactory);
        this.sharedString = this.dataObject.text as SharedString;
        if (this.sharedString) {
            this.text = this.sharedString.getText();
            // Sets an event listener so we can update our state as the value changes
            this.sharedString.on('sequenceDelta', (e) => this.sequenceDeltaChanged(e));
        }
    }

    sequenceDeltaChanged(event: any) {
        const newText = this.sharedString.getText();
        // We only need to insert if the text changed.
        if (newText === this.text) {
            return;
        }

        // If the event is our own then just insert the text
        if (event.isLocal) {
            this.text = newText;
            return;
        }

        // Because we did not make the change we need to manage the remote
        // character insertion.
        const remoteCaretStart = event.first.position;
        const remoteCaretEnd = event.last.position + event.last.segment.cachedLength;
        const charactersModifiedCount = newText.length - this.text.length;

        this.updateSelection();
        const currentCaretStart = this.selectionStart;
        const currentCaretEnd = this.selectionEnd;

        let newCaretStart = 0;
        let newCaretEnd = 0;

        // Remote text inserted/removed after our cp range
        if (currentCaretEnd <= remoteCaretStart) {
            // cp stays where it was before.
            newCaretStart = currentCaretStart;
            newCaretEnd = currentCaretEnd;
        } else if (currentCaretStart > (remoteCaretEnd - 1)) {
            // Remote text inserted/removed before our cp range
            // We need to move our cp the number of characters inserted/removed
            // to ensure we are in the same position
            newCaretStart = currentCaretStart + charactersModifiedCount;
            newCaretEnd = currentCaretEnd + charactersModifiedCount;
        } else {
            // Remote text is overlapping cp

            // The remote changes occurred inside current selection
            if (remoteCaretEnd <= currentCaretEnd && remoteCaretStart > currentCaretStart) {
                // Our selection needs to include remote changes
                newCaretStart = currentCaretStart;
                newCaretEnd = currentCaretEnd + charactersModifiedCount;
            } else if (remoteCaretEnd >= currentCaretEnd && remoteCaretStart <= currentCaretStart) {
                // The remote changes encompass our location

                // Our selection has been removed
                // Move our cp to the beginning of the new text insertion
                newCaretStart = remoteCaretStart;
                newCaretEnd = remoteCaretStart;
            } else {
                // We have partial overlapping selection with the changes.
                // This makes things a lot harder to manage so for now we will just remove the current selection
                // and place it to the remote caret start.
                newCaretStart = remoteCaretStart;
                newCaretEnd = remoteCaretStart;
            }
        }

        this.text = newText;
        this.setCaretPosition(newCaretStart, newCaretEnd);
    }


    setCaretPosition(newStart: number, newEnd: number) {
        if (this.textArea) {
            this.textArea.selectionStart = newStart;
            this.textArea.selectionEnd = newEnd;
        }
    }

    updateSelection() {
        if (this.textArea) {
            this.selectionStart = this.textArea.selectionStart ? this.textArea.selectionStart : 0;
            this.selectionEnd = this.textArea.selectionEnd ? this.textArea.selectionEnd : 0;
        }
        // Stop FAST from calling preventDefault()
        return true;
    }

    handleChange(event: any) {
        // We need to set the value here to keep the input responsive to the user
        const currentTarget = event.currentTarget;
        const newText = currentTarget.value;
        const textLength = (this.text) ? this.text.length : 0;
        const charactersModifiedCount = textLength - newText.length;
        this.text = newText;

        // Get the new caret position and use that to get the text that was inserted
        const newPosition = currentTarget.selectionStart ? currentTarget.selectionStart : 0;
        const isTextInserted = newPosition - this.selectionStart > 0;
        if (this.sharedString) {
            if (isTextInserted) {
                const insertedText = newText.substring(this.selectionStart, newPosition);
                const changeRangeLength = this.selectionEnd - this.selectionStart;
                if (changeRangeLength === 0) {
                    this.sharedString.insertText(this.selectionStart, insertedText);
                } else {
                    this.sharedString.replaceText(this.selectionStart, this.selectionEnd, insertedText);
                }
            } else {
                // Text was removed
                this.sharedString.removeText(newPosition, newPosition + charactersModifiedCount);
            }
        }
    }

    disconnectedCallback() {
        this.dataObject.on('sequenceDelta', (data) => this.sequenceDeltaChanged(data));
    }
}