import { EventSubscription } from "fbemitter";
export declare type ListenerFunction<TAction> = (action: TAction) => void;
export interface ActionDetails {
    ActionClass: Function;
    EventType: string;
    ListenersLength: number;
}
export declare class ActionEmitter {
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
     * @param action {TAction} Action class instance.
     */
    private searchActionDetailsByAction<TAction>(action);
    /**
     * Search action details by Action class function.
     *
     * @param actionClass {Function} Action class function.
     */
    private searchActionDetailsByActionClass(actionClass);
    /**
     * Return new ActionDetails object with initial values.
     *
     * @param actionClass {Function} Action class function.
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
     * A subscription is returned that can be called to remove the listener.
     *
     * @param actionClass {Function} Action class function.
     * @param listener {ListenerFunction<TAction>} Listener callback function.
     */
    addListener<TAction>(actionClass: Function, listener: ListenerFunction<TAction>): EventSubscription;
    /**
     * Emits an action event with the given data.
     * All callbacks that are listening to the particular action event will be notified.
     *
     * @param action {TAction} Action class instance.
     */
    emit<TAction>(action: TAction): void;
    /**
     * Return an array of listeners that are currently registered for the given action class.
     *
     * @param actionClass {Function} Action class function.
     */
    listeners(actionClass: Function): Array<Function>;
    /**
     * Similar to addListener() but the callback is removed after it is invoked once.
     * A subscription is returned that can be called to remove the listener.
     *
     * @param actionClass {Function} Action class function.
     * @param listener {ListenerFunction<TAction>} Listener callback function.
     */
    once<TAction>(actionClass: Function, listener: ListenerFunction<TAction>): EventSubscription;
    /**
     * Removes all of the registered listeners.
     * If provide actionClass, only listeners for that action class are removed.
     *
     * @param actionClass {Function} Action class function.
     */
    removeAllListeners(actionClass?: Function): void;
}
