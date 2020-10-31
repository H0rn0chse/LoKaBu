import { getColor } from "../../common/ColorUtils.js";
import { textToHtml } from "../../common/Utils.js";
import { DomElement } from "./DomElement.js";

const feather = require('feather-icons');

export class Icon extends DomElement {
    constructor (sIcon, oOptions = {}) {
        super("svg");

        if (oOptions.size) {
            oOptions.width = oOptions.size;
            oOptions.height = oOptions.size;
        }
        if (!oOptions.color) {
            oOptions.color = getColor("--bg-element-base");
        }
        if (!oOptions["stroke-width"]) {
            oOptions["stroke-width"] = "2.5";
        }

        if (feather.icons[sIcon]) {
            this.node = textToHtml(feather.icons[sIcon].toSvg(oOptions));
        }
        return this;
    }
}
