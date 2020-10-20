import {
  customElement,
  FASTElement,
  repeat,
  when,
  attr,
  observable,
  html
} from "@microsoft/fast-element";
import { Notero } from './services/noteroDataObject';
import { INote, INoteWithVotes, IUser } from './shared/interfaces';

const template = html<BoardElement>`
    <div class="board">
        ${when(x => x.notes, html`
          <div>
            ${repeat(x => x.notes, html`
              <note-tag
                :note="${x => x}"
                :count="${x => x.votes}"
                :user="${x => x.user}"
                :highlightMine="${x => x.highlightMine}"
                @click="${x => x.vote(x)}"></note-tag>
            `)}
          </div>
        `)}
    </div>
`;

@customElement({
  name: 'board-tag',
  template
})
export class BoardElement extends FASTElement {
  @attr model: Notero;
  @attr user: IUser;
  @attr highlightMine: boolean;
  @observable notes: INoteWithVotes[];

  vote(note: INote) {
      this.model.vote(note);
  }
}