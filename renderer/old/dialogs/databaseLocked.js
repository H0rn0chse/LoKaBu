const { dialog } = require('electron').remote;

const oDateFormatter = require("../../assets/dateFormatter");
const i18nHelper = require("../helper/i18n");

function open (sMessage) {
    return Promise.all([
        i18nHelper.getProperty("database.locked"),
        i18nHelper.getProperty("common.confirm"),
        i18nHelper.getProperty("database.openDefault")
    ]).then((aResult) => {
        let sText = aResult[0];
        const sConfirmText = aResult[1];
        const sOpenText = aResult[2];
        const sDate = oDateFormatter.DateToFull(new Date(parseInt(sMessage, 10)));
        if (sText.includes("$")) {
            sText = sText.replace(/\$/g, sDate);
        } else {
            sText += " - " + sDate;
        }

        return dialog.showMessageBox({
            type: "warning",
            message: sText,
            buttons: [sConfirmText, sOpenText]
        }).then((oResult) => {
            if (oResult.response === 0) {
                return Promise.resolve();
            }
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject();
        });
    });
}

module.exports = {
    open
};
