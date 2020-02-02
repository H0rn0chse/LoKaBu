const DatabaseWaiter = require("../../assets/databaseWaiter");

const oI18n = require("../databaseObjects/i18n");
const oSettings = require("../databaseObjects/settings");

module.exports = {
    applyToAll: function () {
        const aItems = document.querySelectorAll("[data-lang]");
        aItems.forEach((oItem) => {
            this.getProperty(oItem.dataset.lang).then((sText) => {
                oItem.innerText = sText;
            });
        });
    },
    getProperty: function (sScriptCode) {
        const oDatabaseWaiter = new DatabaseWaiter();
        oDatabaseWaiter.add(oI18n);
        oDatabaseWaiter.add(oSettings);

        return oDatabaseWaiter.getPromise().then(() => {
            const sLangCode = oSettings.getProperty("Language");
            const oI18nItem = oI18n.get().find((oItem) => {
                return oItem.scriptCode === sScriptCode;
            });

            return oI18nItem[sLangCode] ? oI18nItem[sLangCode] : sScriptCode;
        });
    }
};
