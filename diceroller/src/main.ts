import {
    customElement,
    FASTElement,
    html,
    attr,
    observable
} from "@microsoft/fast-element";
import { DiceRollerContainerRuntimeFactory } from './services/containerCode';
import { DiceRoller } from './services/dicerollerDataObject';
import { FluidLoaderService } from './services/fluidLoaderService';

const template = html<DiceRollerElement>`
    <div>
        <h1>Dice Roller Fluid Demo</h1>
        This demonstration shows how to use Fluid distributed data structures to sync data across multiple clients.
        After starting the demo (see the readme for instructions), copy the browser's URL into another tab to create another Fluid client. 
        <br /><br />
        After multiple clients are available, click the Roll button to sync rolls across all of the clients.
        <br />
        <div style="text-align: center">
        <div style="font-size: 200px;color: ${x => x.diceCharColor}">
            ${x => x.diceChar}
        </div>
        <button style="font-size: 50px" @click="${x => x.roll()}">Roll</button>
        </div>
    </div>
`;

@customElement({
    name: 'dice-roller',
    template
})
export class DiceRollerElement extends FASTElement {
    @attr diceCharColor: string;
    @observable diceChar: string;
    dataObject: DiceRoller;

    async connectedCallback() {
        super.connectedCallback();

        // Load Fluid DataObject
        const fluidService = new FluidLoaderService();
        this.dataObject = await fluidService.loadDataObject<DiceRoller>(DiceRollerContainerRuntimeFactory);
        this.dataObject.on('diceRolled', (val) => this.updateDiceChar(val));
        this.updateDiceChar(this.dataObject.value);
    }

    public roll() {
        this.dataObject.roll();
    }

    updateDiceChar(val: number) {
        // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
        this.diceChar = String.fromCodePoint(0x267F + val);
        this.diceCharColor = `hsl(${val * 60}, 70%, 50%)`;
    }

    disconnectedCallback() {
        this.dataObject.on('diceRolled', (val) => this.updateDiceChar(val));
    }
}