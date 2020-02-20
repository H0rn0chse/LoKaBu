module.exports = {
    UnixToDate: function (sUnixTimestamp) {
        return new Date(parseInt(sUnixTimestamp, 10) * 1000);
    },
    DateToInput: function (dDate) {
        return dDate.getFullYear() + "-" + (dDate.getMonth() + 1).toString().padStart(2, "0") + "-" + dDate.getDate().toString().padStart(2, "0");
    },
    UnixToInput: function (sUnixTimestamp) {
        return this.DateToInput(this.UnixToDate(sUnixTimestamp));
    },
    InputToDate: function (sInputValue) {
        return new Date(sInputValue);
    },
    DateToUnix: function (dDate) {
        return dDate.getTime() / 1000;
    },
    InputToUnix: function (sInputValue) {
        return this.DateToUnix(this.InputToDate(sInputValue));
    }
};
