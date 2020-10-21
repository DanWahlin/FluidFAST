import {
  customElement,
  FASTElement,
  observable,
  html
} from "@microsoft/fast-element";
import { IUser } from './shared/interfaces';
import { styles } from './css';

const template = html<UserNameElement>`
    <div class="userName">
      <span>${x => x.user.name }</span>
      <span class="userCount">
        (with ${x => x.userCount - 1} ${x => x.userCount === 2 ? "person" : "people"})
      </span>
    </div>  
`;

@customElement({
  name: 'user-name',
  template,
  styles
})
export class UserNameElement extends FASTElement {
  @observable user: IUser;
  @observable userCount: number;
}