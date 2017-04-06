import { Emitter } from "./emitter";
import { MyAction } from "./my-action";


Emitter.emit(new MyAction("someString", 66));

Emitter.emit(new MyAction("someString", 77));
