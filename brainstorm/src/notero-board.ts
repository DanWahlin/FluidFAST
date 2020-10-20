import {
  customElement,
  FASTElement,
  attr,
  html,
  when
} from "@microsoft/fast-element";
import { Notero } from './services/noteroDataObject';
import { INote, IUser } from './shared/interfaces';

const template = html<NoteroBoardElement>`
  ${when(x => x.model, html<NoteroBoardElement>`
    <div>
      <pad-tag
        :model="${x => x.model}"
        :user="${x => x.user}"
        :users="${x => x.users}"
        :highlightMine="${x => x.highlightMine}"
        @on-highlight-mine="${(x,c) => x.onHighlightMine(c.event)}"></pad-tag>
      <board-tag
        :model="${x => x.model}"
        :notes="${x => x.notes}"
        :user="${x => x.user}"
        :highlightMine="${x => x.highlightMine}"></board-tag>
    </div>
  `)}
`;

@customElement({
  name: 'notero-board-tag',
  template
})
export class NoteroBoardElement extends FASTElement {
    @attr model: Notero;
    @attr notes: INote[];
    @attr user: IUser;
    @attr users: IUser[];
    @attr highlightMine: boolean;

    connectedCallback() {
      super.connectedCallback();
      this.model.on('changed', (changeType) => this.changed(changeType)); 
    }

    changed(changeType?: any) {
      this.notes = this.model.getNotesFromBoard();
      this.user = this.model.getUser();
      this.users = this.model.getUsers();
    }

    onHighlightMine(event: Event) {
        this.highlightMine = true; // highlight;
    }

    disconnectedCallback() {
      this.model.off('changed', (changeType) => this.changed(changeType));
    }
}