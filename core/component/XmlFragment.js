import { Component } from "./Component.js";
import { XmlHelper } from "../view/XmlHelper.js";

export class XmlFragment extends Component {
    constructor (...args) {
        super(...args);
        this.name = "XmlFragment";

        this.xmlTree = null;
        this.xmlPath = "core/component";
    }

    async init (oView) {
        const oFragment = await XmlHelper.loadFragment(`${this.xmlPath}/${this.name}`);
        this.xmlTree = await XmlHelper.parse(oFragment, this);

        await this.iterateChildren("init", [oView]);
        super.init(oView);
    }
}
