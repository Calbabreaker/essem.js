/*!
 * essem.js - v0.0.0
 * Compiled Sun, 24 Jan 2021 02:15:57 GMT
 *
 * Free to use under the MIT LICENSE.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ESSEM = {}));
}(this, (function (exports) { 'use strict';

    class Application {
        constructor() { }
        test() {
            console.log("Testing");
        }
    }

    const VERSION = "0.0.0";

    exports.Application = Application;
    exports.VERSION = VERSION;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=essem.js.map
