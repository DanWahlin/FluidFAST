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
import { styles } from './css';

const template = html<BoardElement>`
  <div class="board">
      <div>
        ${repeat(x => x.notes, html`
          <note-tag
            :note="${note => note}"
            :count="${note => note.votes}"
            :user="${(x,ctx) => ctx.parent.user}"
            :highlightMine="${(x,ctx) => ctx.parent.highlightMine}"
            @click="${(note, ctx) => ctx.parent.vote(note)}"></note-tag>
        `)}
      </div>
  </div>
`;

@customElement({
  name: 'board-tag',
  template,
  styles
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