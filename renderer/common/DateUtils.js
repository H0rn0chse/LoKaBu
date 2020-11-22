import { LanguageModel } from "../model/LanguageModel.js";

export function UnixToDate (sUnixTimestamp) {
    return new Date(parseInt(sUnixTimestamp, 10) * 1000);
}

export function DateToInput (dDate) {
    return `${dDate.getFullYear()}-${(dDate.getMonth() + 1).toString().padStart(2, "0")}-${dDate.getDate().toString().padStart(2, "0")}`;
}

export function DateToFull (dDate) {
    return `${DateToDateString(dDate)} ${(dDate.getHours()).toString().padStart(2, "0")}:${(dDate.getMinutes()).toString().padStart(2, "0")}:${(dDate.getSeconds()).toString().padStart(2, "0")}`;
}

export function DateToDateString (dDate) {
    return `${dDate.getDate().toString().padStart(2, "0")}.${(dDate.getMonth() + 1).toString().padStart(2, "0")}.${dDate.getFullYear()}`;
}

export function UnixToInput (sUnixTimestamp) {
    return DateToInput(UnixToDate(sUnixTimestamp));
}

export function InputToDate (sInputValue) {
    return new Date(sInputValue);
}

export function DateToUnix (dDate) {
    return dDate.getTime() / 1000;
}

export function InputToUnix (sInputValue) {
    return DateToUnix(InputToDate(sInputValue));
}

/**
 * Translates the month based on the current language
 * @param {string} sMonthKey MMM eg: Jan
 */
export function translateMonth (sMonthKey) {
    return LanguageModel.get([`time.month.${sMonthKey}`]) || "";
}
