import {
    customElement,
    FASTElement,
    attr,
    html
} from "@microsoft/fast-element";
import { NoteroContainerFactory } from './services/containerCode';
import { FluidLoaderService } from './services/fluidLoaderService';
import { Notero } from './services/noteroDataObject';
import './assets/styles.scss';

const template = html<NoteroElement>`
  <div>
    <h1>Brainstorm Fluid Demo</h1>
    This demonstration shows how to use Fluid distributed data structures to sync data across multiple clients.
    After starting the demo (see the readme for instructions), copy the browser's URL into another tab to create another Fluid client. 
    <br /><br />
    To get started click on the yellow sticky note and press the "Share my idea" button. To vote for a note, click on it. All notes and votes
    will be synced across connected clients.
    <br />
    <notero-board-tag :model="${x => x.dataObject}"></notero-board-tag>
  </div>
`;

@customElement({
    name: 'notero-app',
    template
})
export class NoteroElement extends FASTElement {
    @attr dataObject: Notero;

    async connectedCallback() {
      super.connectedCallback();
      const fluidService = new FluidLoaderService();
      this.dataObject = await fluidService.loadDataObject<Notero>(NoteroContainerFactory);
    }
}
