import {
  customElement,
  FASTElement,
  observable,
  html
} from "@microsoft/fast-element";
import { IUser } from './shared/interfaces';

const template = html<UserNameElement>`
    <div class="userName">
      <span>${x => x.user.name }</span>
      <span class="userCount">
        ${x => x.userCount === 2 ? "person" : "people"}
      </span>
    </div>  
`;

@customElement({
  name: 'user-name-tag',
  template
})
export class UserNameElement extends FASTElement {
  @observable user: IUser;
  @observable userCount: number;
}