import { EventEmitter, EventSubscription } from "fbemitter";
import { AnyAction } from "./actions/any-action";


export type ListenerFunction<TAction> = (action: TAction) => void;

export interface ActionDetails {
    ActionClass: Function;
    EventType: string;
    ListenersLength: number;
}


const EVENT_TYPE_PREFIX = "ACTION_EMMITER";


export class ActionEmitter {

    private fbEmmiter = new EventEmitter();
    private actionsList = new Array<ActionDetails>();
    private uniqueEventTypeNumber = 0;


    /**
     * Generate and return next event type unique string.
     */
    private get getNextEventType(): string {
        return `${EVENT_TYPE_PREFIX}__${++this.uniqueEventTypeNumber}`;
    }


    /**
     * Search action details by contructed action class.
     *
     * @param action {TAction} Action class instance.
     */
    private searchActionDetailsByAction<TAction>(action: TAction): ActionDetails | undefined {
        for (let i = 0; i < this.actionsList.length; i++) {
            let actionDetails = this.actionsList[i];
            if (action instanceof actionDetails.ActionClass) {
                return actionDetails;
            }
        }
    }


    /**
     * Search action details by Action class function.
     *
     * @param actionClass {Function} Action class function.
     */
    private searchActionDetailsByActionClass(actionClass: Function): ActionDetails | undefined {
        for (let i = 0; i < this.actionsList.length; i++) {
            let actionDetails = this.actionsList[i];
            if (actionDetails.ActionClass === actionClass) {
                return actionDetails;
            }
        }
    }


    /**
     * Return new ActionDetails object with initial values.
     *
     * @param actionClass {Function} Action class function.
     */
    private createNewActionDetails(actionClass: Function): ActionDetails {
        return {
            ActionClass: actionClass,
            EventType: this.getNextEventType,
            ListenersLength: 0
        };
    }


    /**
     * Call proxy subscription remover if proxySubscription provided.
     * Decrease actionDetails listeners length.
     * Remove action from actionsList if listeners list is empty.
     *
     * @param foundActionDetails {ActionDetails} ActionDetails instance from actionList.
     * @param proxySubscription {EventSubscription}
     */
    private subscriptionRemover(actionDetails?: ActionDetails, proxySubscription?: EventSubscription) {
        if (proxySubscription != null) {
            proxySubscription.remove();
        }
        if (actionDetails == null) {
            return;
        }
        if (actionDetails.ListenersLength > 1) {
            actionDetails.ListenersLength--;
            return;
        }
        this.removeActionListeners(actionDetails);
    }


    /**
     * Delete actionDetails and filter actionList.
     *
     * @param foundActionDetails {ActionDetails} ActionDetails instance from actionList.
     */
    private removeActionListeners(actionDetails: ActionDetails): void {
        let index = this.actionsList.indexOf(actionDetails);
        if (index === -1) {
            return;
        }
        this.actionsList.splice(index, 1);
    }


    /**
     * Reset actionsList and start uniqueEventTypeNumber from zero.
     *
     */
    private removeAllActionsListeners() {
        this.actionsList = new Array<ActionDetails>();
        this.uniqueEventTypeNumber = 0;
    }


    private isValidFunction(maybeFunction: any): boolean {
        return typeof maybeFunction === "function";
    }


    /**
     * Register a specific callback to be called on a particular action event.
     * A subscription is returned that can be called to remove the listener.
     *
     * @param actionClass {Function} Action class function.
     * @param listener {ListenerFunction<TAction>} Listener callback function.
     */
    public addListener<TAction>(actionClass: Function, listener: ListenerFunction<TAction>): EventSubscription {
        if (!this.isValidFunction(actionClass)) {
            throw new Error("ActionEmitter.addListener(): `actionClass` is not a class or function.");
        }

        if (!this.isValidFunction(listener)) {
            throw new Error("ActionEmitter.addListener(): `listener` is not a function.");
        }

        let foundActionDetails = this.searchActionDetailsByActionClass(actionClass);

        if (foundActionDetails == null) {
            let index = this.actionsList.push(this.createNewActionDetails(actionClass)) - 1;
            foundActionDetails = this.actionsList[index];
        }

        let proxyListener = (action: TAction) => {
            listener(action);
        };

        let proxySubscription = this.fbEmmiter.addListener(foundActionDetails.EventType, proxyListener);

        foundActionDetails.ListenersLength++;

        return {
            ...proxySubscription,
            remove: this.subscriptionRemover.bind(this, foundActionDetails, proxySubscription)
        };
    }


    /**
     * Emits an action event with the given data.
     * All callbacks that are listening to the particular action event will be notified.
     *
     * @param action {TAction} Action class instance.
     */
    public emit<TAction>(action: TAction): void {
        if (typeof action !== "object") {
            throw new Error("ActioEmiter.emit(): `action` is not a proper object.");
        }

        let foundAction = this.searchActionDetailsByAction(action);
        if (foundAction != null) {
            this.fbEmmiter.emit(foundAction.EventType, action);
        }

        let foundAnyAction = this.searchActionDetailsByActionClass(AnyAction);
        if (foundAnyAction != null) {
            let anyAction = new AnyAction(action);
            this.fbEmmiter.emit(foundAnyAction.EventType, anyAction);
        }
    }


    /**
     * Return an array of listeners that are currently registered for the given action class.
     *
     * @param actionClass {Function} Action class function.
     */
    public listeners(actionClass: Function): Array<Function> {
        let foundAction = this.searchActionDetailsByActionClass(actionClass);
        if (foundAction != null) {
            return this.fbEmmiter.listeners(foundAction.EventType);
        }
        return [];
    }


    /**
     * Return listeners count that are currently registered for the given action class.
     * If action class is not specified, method will return all registered action listeners count.
     *
     * @param actionClass {Function} Action class function.
     */
    public listenersCount(actionClass?: Function): number {
        if (actionClass != null) {
            let actionDetails = this.searchActionDetailsByActionClass(actionClass);
            return actionDetails != null ? actionDetails.ListenersLength : 0;
        } else {
            let count = 0;
            for (let i = 0; i < this.actionsList.length; i++) {
                let actionDetails = this.actionsList[i];
                count += actionDetails.ListenersLength;
            }
            return count;
        }
    }


    /**
     * Similar to addListener() but the callback is removed after it is invoked once.
     * A subscription is returned that can be called to remove the listener.
     *
     * @param actionClass {Function} Action class function.
     * @param listener {ListenerFunction<TAction>} Listener callback function.
     */
    public once<TAction>(actionClass: Function, listener: ListenerFunction<TAction>): EventSubscription {
        if (!this.isValidFunction(actionClass)) {
            throw new Error("ActionEmitter.once(): `actionClass` is not a class or function.");
        }

        if (!this.isValidFunction(listener)) {
            throw new Error("ActionEmitter.once(): `listener` is not a function.");
        }

        let foundActionDetails = this.searchActionDetailsByActionClass(actionClass);

        if (foundActionDetails == null) {
            let index = this.actionsList.push(this.createNewActionDetails(actionClass)) - 1;
            foundActionDetails = this.actionsList[index];
        }

        let proxyListener = (action: TAction) => {
            listener(action);
            this.subscriptionRemover(foundActionDetails);
        };

        foundActionDetails.ListenersLength++;

        let proxySubscription = this.fbEmmiter.once(foundActionDetails.EventType, proxyListener);

        return {
            context: proxySubscription.context,
            listener: proxySubscription.listener,
            remove: this.subscriptionRemover.bind(this, foundActionDetails, proxySubscription)
        };
    }


    /**
     * Removes all of the registered listeners.
     * If provide actionClass, only listeners for that action class are removed.
     *
     * @param actionClass {Function} Action class function.
     */
    public removeAllListeners(actionClass?: Function): void {
        let eventType: string | undefined;
        let foundActionDetails: ActionDetails | undefined;

        if (actionClass != null) {
            foundActionDetails = this.searchActionDetailsByActionClass(actionClass);
            if (foundActionDetails == null) {
                return;
            }
            eventType = foundActionDetails.EventType;
        }

        this.fbEmmiter.removeAllListeners(eventType);
        if (foundActionDetails != null) {
            this.removeActionListeners(foundActionDetails);
        } else {
            this.removeAllActionsListeners();
        }
    }
}
