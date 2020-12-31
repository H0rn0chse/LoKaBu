import { filterMapByKey } from "../common/Utils.js";

export class TemplateManager {
    constructor () {
        this.templates = new Map();
        this.items = new Map();
    }

    getTemplate (sTemplateId) {
        return this.templates.get(sTemplateId);
    }

    addTemplate (sTemplateId, oModule, oAttributes) {
        const oTemplate = {
            Module: oModule,
            attributes: oAttributes
        };
        return this.templates.set(sTemplateId, oTemplate);
    }

    createItem (sTemplateId) {
        const oTemplate = this.getTemplate(sTemplateId);
        return new oTemplate.Module(oTemplate.attributes);
    }

    setItem (sTemplateId, sItemIndex, oNewItem) {
        const sId = `${sTemplateId}-${sItemIndex}`;
        const oOldItem = this.items.get(sId);
        if (oOldItem && oOldItem.destroy) {
            oOldItem.destroy();
        }
        this.items.set(sId, oNewItem);
    }

    getItem (sTemplateId, sItemIndex) {
        const sId = `${sTemplateId}-${sItemIndex}`;
        return this.items.get(sId);
    }

    getItemById (sId) {
        return this.items.get(sId);
    }

    removeItem (sTemplateId, sItemIndex) {
        const sId = `${sTemplateId}-${sItemIndex}`;
        const oItem = this.items.get(sId);
        if (oItem && oItem.destroy) {
            oItem.destroy();
            this.items.delete(sId);
        } else if (oItem) {
            this.items.delete(sId);
        }
    }

    getItemKeys (sTemplateId) {
        return filterMapByKey(this.items, sTemplateId).sort(this.sortItemKeys);
    }

    sortItemKeys (sKey1, sKey2) {
        const aParts1 = sKey1.split("-");
        const aParts2 = sKey2.split("-");

        if (aParts1[0] === aParts2[0]) {
            aParts1[1] = parseInt(aParts1[1], 10);
            aParts2[1] = parseInt(aParts2[1], 10);

            if (aParts1[1] < aParts2[1]) {
                return -1;
            }
            if (aParts1[1] > aParts2[1]) {
                return 1;
            }
            return 0;
        }
        if (aParts1[0] < aParts2[0]) {
            return -1;
        }
        return 1;
    }

    destroyTemplateManager () {
        this.templateId = null;
        this.templates = null;
        this.items = null;
    }
}
