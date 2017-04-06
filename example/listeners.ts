import { AnyAction } from "action-emitter";
import { MyAction } from "./my-action";
import { Emitter } from "./emitter";


// Creating listener
let subscription = Emitter.addListener<MyAction>(MyAction, action => {
    console.log(`Action emitted with someValue: ${action.SomeValue} and secondValue: ${action.SecondValue}.`);
    if (action.SecondValue === 77) {
        console.log("Removing subscription...");
        // Removing listener
        subscription.remove();
    }
});


// Createing once listener
Emitter.once<MyAction>(MyAction, action => {
    console.log(`Action emitted with someValue: ${action.SomeValue} and secondValue: ${action.SecondValue}.`);
});


// Creating once listener
let onceSubscription = Emitter.once<MyAction>(MyAction, action => { });
// Removing once listener
onceSubscription.remove();

// Creating listener for any action
Emitter.addListener(AnyAction, anyAction => {
    let actionInstance = anyAction.Action;
    console.log(actionInstance);
});
