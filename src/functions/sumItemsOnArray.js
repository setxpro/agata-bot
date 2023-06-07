"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sumArray(arr) {
    let soma = 0;
    for (let i = 0; i < arr.length; i++) {
        soma += arr[i];
    }
    return soma;
}
exports.default = sumArray;
