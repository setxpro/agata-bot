"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateRandomNumber(length) {
    let result = "";
    let characters = "0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.default = generateRandomNumber;
