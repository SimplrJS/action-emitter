import { EventSubscription } from "fbemitter";
export declare type ListenerFunction<TAction> = (action: TAction) => void;
export interface ActionDetails {
    ActionClass: Function;
    EventType: string;
    ListenersLength: number;
}
export declare class ActionEmmiter {
    private fbEmmiter;
    private actionsList;
    private uniqueEventTypeNumber;
    /**
     * Generate and return next event type unique string.
     */
    private readonly getNextEventType;
    /**
     * Search action details by contructed action class.
     *
     * @param action {TAction} Constructed action class.
     */
    private searchActionDetailsByAction<TAction>(action);
    /**
     * Search action details by instance of action class.
     *
     * @param actionClass {Function} Instance of action class.
     */
    private searchActionDetailsByActionClass(actionClass);
    /**
     * Return new ActionDetails object with initial values.
     *
     * @param actionClass {Function} Instance of action class.
     */
    private createNewActionDetails(actionClass);
    /**
     * Call proxy subscription remover if proxySubscription provided.
     * Decrease actionDetails listeners length.
     * Remove action from actionsList if listeners list is empty.
     *
     * @param foundActionDetails {ActionDetails} ActionDetails instance from actionList.
     * @param proxySubscription {EventSubscription}
     */
    private subscriptionRemover(actionDetails?, proxySubscription?);
    /**
     * Delete actionDetails and filter actionList.
     *
     * @param foundActionDetails {ActionDetails} ActionDetails instance from actionList.
     */
    private removeActionListeners(actionDetails);
    /**
     * Reset actionsList and start uniqueEventTypeNumber from zero.
     *
     */
    private removeAllActionsListeners();
    /**
     * Register a specific callback to be called on a particular action event.
     * A token is returned that can be used to remove the listener.
     *
     * @param actionClass {Function} Instance of action class.
     * @param listener {ListenerFunction<TAction>} Listener callback function.
     */
    addListener<TAction>(actionClass: Function, listener: ListenerFunction<TAction>): EventSubscription;
    /**
     * Emits an action event with the given data.
     * All callbacks that are listening to the particular action event will be notified.
     *
     * @param action {TAction} Constructed action class.
     */
    emit<TAction>(action: TAction): void;
    /**
     * Return an array of listeners that are currently registered for the given action class.
     *
     * @param actionClass {Function} Instance of action class.
     */
    listeners(actionClass: Function): Array<Function>;
    /**
     * Similar to addListener() but the callback is removed after it is invoked once.
     * A token is returned that can be used to remove the listener.
     *
     * @param actionClass {Function} Instance of action class.
     * @param listener {ListenerFunction<TAction>} Listener callback function.
     */
    once<TAction>(actionClass: Function, listener: ListenerFunction<TAction>): EventSubscription;
    /**
     * Removes all of the registered listeners.
     * If provide actionClass, only listeners for that action class are removed.
     *
     * @param actionClass {Function} Instance of action class.
     */
    removeAllListeners(actionClass?: Function): void;
}
