import { Emitter } from "./emitter";
import { Action } from "./action";


Emitter.emit(new Action("someString", 66));

Emitter.emit(new Action("someString", 77));
