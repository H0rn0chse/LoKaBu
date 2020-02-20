const DatabaseWaiter = require("../../assets/databaseWaiter");

const oI18n = require("../databaseObjects/i18n");
const oSettings = require("../databaseObjects/settings");

const oDatabaseWaiter = new DatabaseWaiter();
oDatabaseWaiter.add(oI18n);
oDatabaseWaiter.add(oSettings);

module.exports = {
    applyToAll: function () {
        return this.applyToChildren(document);
    },
    applyToChildren: function (oNode) {
        const aItems = Array.from(oNode.querySelectorAll("[data-lang]"));
        return Promise.all(aItems.map((oItem) => {
            return this.getProperty(oItem.dataset.lang).then((sText) => {
                oItem.innerText = sText;
            });
        }));
    },
    getProperty: function (sScriptCode) {
        return oDatabaseWaiter.getPromise().then(() => {
            const sLangCode = oSettings.getProperty("Language");
            const oI18nItem = oI18n.get().find((oItem) => {
                return oItem.scriptCode === sScriptCode;
            });

            return oI18nItem && oI18nItem[sLangCode] ? oI18nItem[sLangCode] : sScriptCode;
        });
    },
    getLanguages: function () {
        return Object.keys(oI18n.get()[0]).filter((sKey) => {
            return sKey !== "scriptCode";
        }).sort();
    }
};
