import { load } from "../../assets/load.js";

load.css("/renderer/common/flexLine.css");

export class FlexLineContainer {
    constructor (oDomRef) {
        this.node = document.createElement("div");
        this.node.classList.add("flexLineContainer");
        oDomRef.appendChild(this.node);
    }
}
