/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { DataObject, DataObjectFactory } from "@fluidframework/aqueduct";
/**
 * The DiceRoller is our data object that implements the IDiceRoller interface.
 */
export declare class DiceRoller extends DataObject {
    /**
     * initializingFirstTime is run only once by the first client to create the DataObject.  Here we use it to
     * initialize the state of the DataObject.
     */
    protected initializingFirstTime(): Promise<void>;
    /**
     * hasInitialized is run by each client as they load the DataObject.  Here we use it to set up usage of the
     * DataObject, by registering an event listener for dice rolls.
     */
    protected hasInitialized(): Promise<void>;
    get value(): any;
    readonly roll: () => void;
}
/**
 * The DataObjectFactory is used by Fluid Framework to instantiate our DataObject.  We provide it with a unique name
 * and the constructor it will call.  In this scenario, the third and fourth arguments are not used.
 */
export declare const DiceRollerInstantiationFactory: DataObjectFactory<DiceRoller, object, unknown>;
//# sourceMappingURL=dicerollerDataObject.d.ts.map