import { Action } from "./action";
import { Emitter } from "./emitter";

// Creating listener
let subscription = Emitter.addListener<Action>(Action, action => {
    console.log(`Action emitted with someValue: ${action.SomeValue} and secondValue: ${action.SecondValue}.`);
    if (action.SecondValue === 77) {
        console.log("Removing subscription...");
        // Removing listener
        subscription.remove();
    }
});

// Createing once listener
Emitter.once<Action>(Action, action => {
    console.log(`Action emitted with someValue: ${action.SomeValue} and secondValue: ${action.SecondValue}.`);
});


// Creating once listener
let onceSubscription = Emitter.once<Action>(Action, action => { });
// Removing once listener
onceSubscription.remove();
