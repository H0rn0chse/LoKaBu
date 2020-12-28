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
    destroyTemplateManager () {
        this.templateId = null;
        this.templates = null;
        this.items = null;
    }
}
