import { Emitter } from "./emitter";
import { Action } from "./action";


// Removing only specified action listeners
Emitter.removeAllListeners(Action);

// Removing all listeners
Emitter.removeAllListeners();
