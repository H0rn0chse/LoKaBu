import { filterMapByKey } from "../common/Utils.js";

export class TemplateManager {
    constructor () {
        this.templateId = null;
        this.templates = new Map();
        this.items = new Map();
    }

    getTemplate (sId) {
        return this.templates.get(sId);
    }

    addTemplate (sId, oModule, oAttributes) {
        const oTemplate = {
            Module: oModule,
            attributes: oAttributes
        };
        return this.templates.set(sId, oTemplate);
    }

    createItem (sId, oContext) {
        const oTemplate = this.getTemplate(sId);
        return new oTemplate.Module(oTemplate.attributes);
    }

    addItem (sTemplateId, sItemId, oNewItem) {
        const sId = `${sTemplateId}-${sItemId}`;
        const oOldItem = this.items.get(sId);
        if (oOldItem && oOldItem.destroy) {
            oOldItem.destroy();
        }
        this.items.set(sId, oNewItem);
    }

    getItem (sTemplateId, sItemId) {
        const sId = `${sTemplateId}-${sItemId}`;
        return this.items.get(sId);
    }

    getItemById (sId) {
        return this.items.get(sId);
    }

    removeItem (sTemplateId, sItemId) {
        const sId = `${sTemplateId}-${sItemId}`;
        const oItem = this.items.get(sId);
        if (oItem && oItem.destroy) {
            oItem.destroy();
            this.items.delete(sId);
        } else if (oItem) {
            this.items.delete(sId);
        }
    }

    getItems (sTemplateId) {
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
