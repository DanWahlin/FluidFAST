import {
  customElement,
  FASTElement,
  attr,
  html,
  when
} from "@microsoft/fast-element";
import { INoteWithVotes, IUser } from './shared/interfaces';

const template = html<NoteElement>`
  ${when(x => x.note && x.note.user, html<NoteElement>`
    <button class="note"
      class="${x => x.note.user.id != x.user.id && x.highlightMine ? 'others': '' }">
        ${when(x => x.count > 0, html<NoteElement>`
          <span class="note-badge ${x => x.note.currentUserVoted ? 'voted': '' }">
            ${x => x.count}
          </span>
        `)}
      <span class="note-text">${x => x.note.text}</span>
    </button>  
  `)}
`;

@customElement({
  name: 'note-tag',
  template
})
export class NoteElement extends FASTElement {
  @attr note: INoteWithVotes;
  @attr highlightMine: boolean;
  @attr user: IUser;
  @attr count: number;
}
