const { dialog } = require('electron').remote;

const i18nHelper = require("./../helper/i18n");

function open () {
    return i18nHelper.getProperty("database.abort").then((sText) => {
        return dialog.showMessageBox({
            type: "warning",
            message: sText
        });
    });
}

module.exports = {
    open
};
