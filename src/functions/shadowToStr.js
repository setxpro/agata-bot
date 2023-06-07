"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertString3 = exports.convertString = void 0;
function convertString(str) {
    // Verifica se a string tem pelo menos 4 caracteres
    if (str.length >= 4) {
        // Extrai os primeiros 4 caracteres da string
        const prefixo = str.slice(0, 4);
        // Substitui os caracteres extraídos por asteriscos
        const asteriscos = "*".repeat(4);
        const resultado = asteriscos + str.slice(4);
        return resultado;
    }
    else {
        // Retorna a string original se tiver menos de 4 caracteres
        return str;
    }
}
exports.convertString = convertString;
function convertString3(str) {
    // Verifica se a string tem pelo menos 3 caracteres
    if (str.length >= 3) {
        // Extrai os primeiros 3 caracteres da string
        const prefixo = str.slice(0, 3);
        // Substitui os caracteres extraídos por asteriscos
        const asteriscos = "*".repeat(3);
        const resultado = asteriscos + str.slice(3);
        return resultado;
    }
    else {
        // Retorna a string original se tiver menos de 3 caracteres
        return str;
    }
}
exports.convertString3 = convertString3;
