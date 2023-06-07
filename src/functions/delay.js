"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export default function delay(t:any, v: any) {
//     return new Promise(function(resolve) { 
//         setTimeout(resolve.bind(null, v), t)
//     });
//   }
function delay(v) {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, v));
    });
}
exports.default = delay;
