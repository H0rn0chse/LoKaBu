import { View2 } from "./View2.js";
import { XMLHelper } from "./XMLHelper.js";

export class XMLView extends View2 {
    constructor (controller, path) {
        super(controller);
        this.XMLPath = path;
        this.XMLTree = null;
    }

    async buildTree () {
        const oView = await XMLHelper.loadView(this.XMLPath);
        this.XMLTree = await XMLHelper.parse(oView, this);
    }

    async initTree () {
        console.error("view init");
        this.iterateChildren("init", [this]);
    }
};
