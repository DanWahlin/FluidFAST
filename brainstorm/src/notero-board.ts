import {
  customElement,
  FASTElement,
  attr,
  html,
  when,
  Observable
} from "@microsoft/fast-element";
import { Notero } from './services/noteroDataObject';
import { INote, IUser } from './shared/interfaces';
import { styles } from './css';

const template = html<NoteroBoardElement>`
  <div>
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
  </div>
`;

@customElement({
  name: 'notero-board',
  template,
  styles
})
export class NoteroBoardElement extends FASTElement {
    @attr _model: Notero;
    @attr notes: INote[];
    @attr user: IUser;
    @attr users: IUser[];
    @attr highlightMine: boolean;

    get model() {
      Observable.track(this, 'model');
      return this._model;
    }
  
    set model(value: Notero) {
      if (!this._model && value) {
        value.on('changed', (changeType) => this.changed(changeType)); 
      }
      this._model = value;
      Observable.notify(this, 'model');
    }

    changed(changeType: any) {
      this.notes = this.model.getNotesFromBoard();
      this.user = this.model.getUser();
      this.users = this.model.getUsers();
    }

    onHighlightMine(event: any) {
        this.highlightMine = event.detail;
    }

    disconnectedCallback() {
      this.model.off('changed', (changeType) => this.changed(changeType));
    }
}