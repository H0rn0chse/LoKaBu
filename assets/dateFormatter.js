export function UnixToDate (sUnixTimestamp) {
    return new Date(parseInt(sUnixTimestamp, 10) * 1000);
}

export function DateToInput (dDate) {
    return dDate.getFullYear() + "-" + (dDate.getMonth() + 1).toString().padStart(2, "0") + "-" + dDate.getDate().toString().padStart(2, "0");
}

export function DateToFull (dDate) {
    return dDate.getDate().toString().padStart(2, "0") + "." + (dDate.getMonth() + 1).toString().padStart(2, "0") + "." + dDate.getFullYear() + " " + (dDate.getHours()).toString().padStart(2, "0") + ":" + (dDate.getMinutes()).toString().padStart(2, "0") + ":" + (dDate.getSeconds()).toString().padStart(2, "0");
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

