import { FASTElement } from "@microsoft/fast-element";
import { DiceRoller } from './services/dicerollerDataObject';
export declare class DiceRollerElement extends FASTElement {
    diceCharColor: string;
    diceChar: string;
    dataObject: DiceRoller;
    connectedCallback(): void;
    roll(): void;
    updateDiceChar(val: number): void;
    disconnectedCallback(): void;
}
//# sourceMappingURL=main.d.ts.map