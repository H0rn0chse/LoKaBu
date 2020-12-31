import { View2 } from "./View2.js";
import { XmlHelper } from "./XmlHelper.js";

export class XmlView extends View2 {
    constructor (controller, path) {
        super(controller);
        this.xmlPath = path;
        this.xmlTree = null;
    }

    async buildTree () {
        const oView = await XmlHelper.loadView(this.xmlPath);
        this.xmlTree = await XmlHelper.parse(oView, this);
    }

    async initTree () {
        await this.iterateChildren("init", [this]);
        await this.iterateChildren("render");
        await this.iterateChildren("bindProperties");
        await this.iterateChildren("attachEvents");
        await this.iterateChildren("updateBindings");
    }
};
