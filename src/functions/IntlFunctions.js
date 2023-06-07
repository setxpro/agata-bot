"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relaiveDateFormatter = exports.dateFormatter = exports.currencyFormatter = exports.numberFormatterCompact = void 0;
const numberFormatterCompact = (value, locale) => {
    return new Intl.NumberFormat(locale, {
        notation: 'compact'
    }).format(value);
}; // 2K
exports.numberFormatterCompact = numberFormatterCompact;
const currencyFormatter = (currency, locale) => {
    return new Intl.NumberFormat(locale, {
        currency: 'BRL',
        style: 'currency'
    }).format(currency);
}; // R$ 2.000,00
exports.currencyFormatter = currencyFormatter;
const dateFormatter = (date, locale) => {
    return Intl.DateTimeFormat(locale, {
        dateStyle: 'short'
    }).format(date);
};
exports.dateFormatter = dateFormatter;
const relaiveDateFormatter = (amount, locale) => {
    return new Intl.RelativeTimeFormat(locale, {
        numeric: 'auto'
    }).format(amount, 'hours');
};
exports.relaiveDateFormatter = relaiveDateFormatter;
