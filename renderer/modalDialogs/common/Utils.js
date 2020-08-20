const { shell } = require('electron');

export function applyTranslations (oTranslations) {
    const aItems = Array.from(document.querySelectorAll("[data-trans]"));

    aItems.forEach(oItem => {
        const sScriptCode = oItem.dataset.trans;
        const sTranslation = oTranslations[sScriptCode];
        oItem.innerText = sTranslation || sScriptCode;
    });
}

export function openUrl (sUrl) {
    const bUrl = sUrl.startsWith('http:') || sUrl.startsWith('https:');
    if (bUrl) {
        shell.openExternal(sUrl);
    }
}
