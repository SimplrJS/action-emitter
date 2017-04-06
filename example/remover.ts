import { Emitter } from "./emitter";
import { MyAction } from "./my-action";


// Removing only specified action listener
Emitter.removeAllListeners(MyAction);


// Removing all listeners
Emitter.removeAllListeners();
