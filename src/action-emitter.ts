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
     * @param action {TAction} Constructed action class.
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
     * Search action details by instance of action class.
     * 
     * @param actionClass {Function} Instance of action class.
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
     * @param actionClass {Function} Instance of action class.
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
    private removeActionListeners(actionDetails: ActionDetails | undefined): void {
        actionDetails = undefined;
        this.actionsList.filter(x => x != null);
    }


    /**
     * Reset actionsList and start uniqueEventTypeNumber from zero.
     * 
     */
    private removeAllActionsListeners() {
        this.actionsList = new Array<ActionDetails>();
        this.uniqueEventTypeNumber = 0;
    }


    /**
     * Register a specific callback to be called on a particular action event. 
     * A token is returned that can be used to remove the listener.
     * 
     * @param actionClass {Function} Instance of action class.
     * @param listener {ListenerFunction<TAction>} Listener callback function.
     */
    public addListener<TAction>(actionClass: Function, listener: ListenerFunction<TAction>): EventSubscription {
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
     * @param action {TAction} Constructed action class.
     */
    public emit<TAction>(action: TAction): void {
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
     * @param actionClass {Function} Instance of action class.
     */
    public listeners(actionClass: Function): Array<Function> {
        let foundAction = this.searchActionDetailsByActionClass(actionClass);
        if (foundAction != null) {
            return this.fbEmmiter.listeners(foundAction.EventType);
        }
        return [];
    }


    /**
     * Similar to addListener() but the callback is removed after it is invoked once. 
     * A token is returned that can be used to remove the listener.
     * 
     * @param actionClass {Function} Instance of action class.
     * @param listener {ListenerFunction<TAction>} Listener callback function.
     */
    public once<TAction>(actionClass: Function, listener: ListenerFunction<TAction>): EventSubscription {
        let foundActionDetails = this.searchActionDetailsByActionClass(actionClass);

        if (foundActionDetails == null) {
            let index = this.actionsList.push(this.createNewActionDetails(actionClass)) - 1;
            foundActionDetails = this.actionsList[index];
        }

        let proxyListener = (action: TAction) => {
            listener(action);
            this.subscriptionRemover(foundActionDetails);
        };

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
     * @param actionClass {Function} Instance of action class.
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
