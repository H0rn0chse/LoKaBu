const Deferred = require("../../assets/deferred");
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
        const oSettingsDeferred = new Deferred();
        const oI18nDeferred = new Deferred();

        oSettings.refresh(oSettingsDeferred.resolve);
        oI18n.refresh(oI18nDeferred.resolve);

        return Promise.all([
            oSettingsDeferred.promise,
            oI18n.promise
        ]).then(() => {
            const sLangCode = oSettings.getProperty("Language");
            const oI18nItem = oI18n.get().find((oItem) => {
                return oItem.scriptCode === sScriptCode;
            });

            return oI18nItem[sLangCode] ? oI18nItem[sLangCode] : sScriptCode;
        });
    }
};
