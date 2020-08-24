import { DomElement } from "./DomElement.js";
import { loadCss } from "../../common/Utils.js";

loadCss("/renderer/view/common/ImageSelection.css");

export class ImageSelection extends DomElement {
    constructor () {
        super("div");
        this.addClass("imgSelection");

        this.mouseDown = false;
        this.initialTopLeftPosition = {
            x: 0,
            y: 0
        };

        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    onMouseDown (oEvent) {
        if (oEvent.target.tagName === "IMG" || oEvent.target === this.node) {
            this.mouseDown = true;

            this.node.style.left = oEvent.clientX + "px";
            this.initialTopLeftPosition.x = oEvent.clientX;
            this.node.style.top = oEvent.clientY + "px";
            this.initialTopLeftPosition.y = oEvent.clientY;
            this.node.style.width = "0px";
            this.node.style.height = "0px";
        }
    }

    onMouseMove (oEvent) {
        if (this.mouseDown && (oEvent.target.tagName === "IMG" || oEvent.target === this.node)) {
            var iWidth = oEvent.clientX - this.initialTopLeftPosition.x;
            var iHeight = oEvent.clientY - this.initialTopLeftPosition.y;
            if (iWidth < 0) {
                this.node.style.left = oEvent.clientX + "px";
            }
            if (iHeight < 0) {
                this.node.style.top = oEvent.clientY + "px";
            }
            this.node.style.width = Math.abs(iWidth) + "px";
            this.node.style.height = Math.abs(iHeight) + "px";
        }
    }

    onMouseUp (oEvent) {
        this.mouseDown = false;
    }
}
