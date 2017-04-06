import { Emitter } from "./emitter";
import { MyAction } from "./my-action";

// Emitting created my action
Emitter.emit(new MyAction("someString", 66));
Emitter.emit(new MyAction("someString", 77));
