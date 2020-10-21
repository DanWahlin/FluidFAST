import {
  customElement,
  FASTElement,
  attr,
  html,
  css,
  when
} from "@microsoft/fast-element";
import { Notero } from "./services/noteroDataObject";
import { IUser } from "./shared/interfaces";
import { styles } from './css';

const template = html<PadElement>`
  <div class="container">
    <div class="pad">
      <div class="note editor">
        <textarea
          class="note-text"
          @keyup="${(x,c) => x.onKeyUp(c.event)}"
          @focus="${(x,c) => x.onNoteFocus(c.event)}"
          :value="${x => x.noteValue}"
        ></textarea>
      </div>
      <button class="button" :disabled="${x => x.disabled}" @click="${x => x.createNote()}">
        Share my idea
      </button>
      <button class="button" :disabled="${x => x.disabled}" @click="${x => x.handleHighlight()}">
        ${x => x.highlightMine ? "Stop highlighting" : "Highlight my ideas" }
      </button>
      ${when(x => x.user && x.users, html<PadElement>`
        <user-name :user="${x => x.user}" :userCount="${x => x.users.length}"></user-name>
      `)}
    </div>
  </div>
`;

@customElement({
  name: 'pad-tag',
  template,
  styles
})
export class PadElement extends FASTElement {
    model: Notero;
    @attr user: IUser;
    @attr users: IUser[];
    @attr highlightMine: boolean;
    @attr noteValue = '';
    @attr disabled: boolean;

    createNote() {
      this.model.createNote(this.noteValue);
      this.noteValue = '';
    }

    onNoteFocus(e: any) {
      if (!this.noteValue.length && this.model) {
        this.noteValue = this.model.createDemoNote();
      }
    }

    onKeyUp(e: any) {
      // Handle enter
      if (e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
        this.model.createNote(this.noteValue);
        this.noteValue = '';
        e.target.blur();
      } else {
        this.noteValue = e.target;
      }
    }

    handleHighlight() {
        this.highlightMine = !this.highlightMine;
        this.$emit("on-highlight-mine", this.highlightMine);
    }
}