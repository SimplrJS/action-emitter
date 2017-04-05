(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var AnyAction = (function () {
    function AnyAction(action) {
        this.action = action;
    }
    Object.defineProperty(AnyAction.prototype, "Action", {
        get: function () {
            return this.action;
        },
        enumerable: true,
        configurable: true
    });
    return AnyAction;
}());
exports.AnyAction = AnyAction;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fbemitter_1 = __webpack_require__(3);
var any_action_1 = __webpack_require__(0);
var EVENT_TYPE_PREFIX = "ACTION_EMMITER";
var ActionEmmiter = (function () {
    function ActionEmmiter() {
        this.fbEmmiter = new fbemitter_1.EventEmitter();
        this.actionsList = new Array();
        this.uniqueEventTypeNumber = 0;
    }
    Object.defineProperty(ActionEmmiter.prototype, "getNextEventType", {
        /**
         * Generate and return next event type unique string.
         */
        get: function () {
            return EVENT_TYPE_PREFIX + "__" + ++this.uniqueEventTypeNumber;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Search action details by contructed action class.
     *
     * @param action {TAction} Constructed action class.
     */
    ActionEmmiter.prototype.searchActionDetailsByAction = function (action) {
        for (var i = 0; i < this.actionsList.length; i++) {
            var actionDetails = this.actionsList[i];
            if (action instanceof actionDetails.ActionClass) {
                return actionDetails;
            }
        }
    };
    /**
     * Search action details by instance of action class.
     *
     * @param actionClass {Function} Instance of action class.
     */
    ActionEmmiter.prototype.searchActionDetailsByActionClass = function (actionClass) {
        for (var i = 0; i < this.actionsList.length; i++) {
            var actionDetails = this.actionsList[i];
            if (actionDetails.ActionClass === actionClass) {
                return actionDetails;
            }
        }
    };
    /**
     * Return new ActionDetails object with initial values.
     *
     * @param actionClass {Function} Instance of action class.
     */
    ActionEmmiter.prototype.createNewActionDetails = function (actionClass) {
        return {
            ActionClass: actionClass,
            EventType: this.getNextEventType,
            ListenersLength: 0
        };
    };
    /**
     * Call proxy subscription remover if proxySubscription provided.
     * Decrease actionDetails listeners length.
     * Remove action from actionsList if listeners list is empty.
     *
     * @param foundActionDetails {ActionDetails} ActionDetails instance from actionList.
     * @param proxySubscription {EventSubscription}
     */
    ActionEmmiter.prototype.subscriptionRemover = function (actionDetails, proxySubscription) {
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
    };
    /**
     * Delete actionDetails and filter actionList.
     *
     * @param foundActionDetails {ActionDetails} ActionDetails instance from actionList.
     */
    ActionEmmiter.prototype.removeActionListeners = function (actionDetails) {
        actionDetails = undefined;
        this.actionsList.filter(function (x) { return x != null; });
    };
    /**
     * Reset actionsList and start uniqueEventTypeNumber from zero.
     *
     */
    ActionEmmiter.prototype.removeAllActionsListeners = function () {
        this.actionsList = new Array();
        this.uniqueEventTypeNumber = 0;
    };
    /**
     * Register a specific callback to be called on a particular action event.
     * A token is returned that can be used to remove the listener.
     *
     * @param actionClass {Function} Instance of action class.
     * @param listener {ListenerFunction<TAction>} Listener callback function.
     */
    ActionEmmiter.prototype.addListener = function (actionClass, listener) {
        var foundActionDetails = this.searchActionDetailsByActionClass(actionClass);
        if (foundActionDetails == null) {
            var index = this.actionsList.push(this.createNewActionDetails(actionClass)) - 1;
            foundActionDetails = this.actionsList[index];
        }
        var proxyListener = function (action) {
            listener(action);
        };
        var proxySubscription = this.fbEmmiter.addListener(foundActionDetails.EventType, proxyListener);
        foundActionDetails.ListenersLength++;
        return __assign({}, proxySubscription, { remove: this.subscriptionRemover.bind(this, foundActionDetails, proxySubscription) });
    };
    /**
     * Emits an action event with the given data.
     * All callbacks that are listening to the particular action event will be notified.
     *
     * @param action {TAction} Constructed action class.
     */
    ActionEmmiter.prototype.emit = function (action) {
        var foundAction = this.searchActionDetailsByAction(action);
        if (foundAction != null) {
            this.fbEmmiter.emit(foundAction.EventType, action);
        }
        var foundAnyAction = this.searchActionDetailsByActionClass(any_action_1.AnyAction);
        if (foundAnyAction != null) {
            var anyAction = new any_action_1.AnyAction(action);
            this.fbEmmiter.emit(foundAnyAction.EventType, anyAction);
        }
    };
    /**
     * Return an array of listeners that are currently registered for the given action class.
     *
     * @param actionClass {Function} Instance of action class.
     */
    ActionEmmiter.prototype.listeners = function (actionClass) {
        var foundAction = this.searchActionDetailsByActionClass(actionClass);
        if (foundAction != null) {
            return this.fbEmmiter.listeners(foundAction.EventType);
        }
        return [];
    };
    /**
     * Similar to addListener() but the callback is removed after it is invoked once.
     * A token is returned that can be used to remove the listener.
     *
     * @param actionClass {Function} Instance of action class.
     * @param listener {ListenerFunction<TAction>} Listener callback function.
     */
    ActionEmmiter.prototype.once = function (actionClass, listener) {
        var _this = this;
        var foundActionDetails = this.searchActionDetailsByActionClass(actionClass);
        if (foundActionDetails == null) {
            var index = this.actionsList.push(this.createNewActionDetails(actionClass)) - 1;
            foundActionDetails = this.actionsList[index];
        }
        var proxyListener = function (action) {
            listener(action);
            _this.subscriptionRemover(foundActionDetails);
        };
        var proxySubscription = this.fbEmmiter.once(foundActionDetails.EventType, proxyListener);
        return {
            context: proxySubscription.context,
            listener: proxySubscription.listener,
            remove: this.subscriptionRemover.bind(this, foundActionDetails, proxySubscription)
        };
    };
    /**
     * Removes all of the registered listeners.
     * If provide actionClass, only listeners for that action class are removed.
     *
     * @param actionClass {Function} Instance of action class.
     */
    ActionEmmiter.prototype.removeAllListeners = function (actionClass) {
        var eventType;
        var foundActionDetails;
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
        }
        else {
            this.removeAllActionsListeners();
        }
    };
    return ActionEmmiter;
}());
exports.ActionEmmiter = ActionEmmiter;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
var action_emmiter_1 = __webpack_require__(1);
exports.ActionEmmiter = action_emmiter_1.ActionEmmiter;
var any_action_1 = __webpack_require__(0);
exports.AnyAction = any_action_1.AnyAction;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("fbemitter");

/***/ })
/******/ ])));