import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { loadCss } from "../../common/Utils.js";
import { ImageSelection } from "../common/ImageSelection.js";

loadCss("/renderer/view/detail/Scanner.css");

export class Scanner extends View {
    constructor (...args) {
        super(...args);
        this.name = "ScannerView";
    }

    render () {
        const oElement = new DomElement("section")
            .addClass("scanner")
            .appendNode(new DomElement("div")
                .addClass("scanner-buttonArea")
                .appendNode(new DomElement("div")
                    .addClass("button")
                    .setText(this.getTranslation("load-i18n"))
                    .addEventListener("click", this.onLoadImage, this)
                )
                .appendNode(new DomElement("div")
                    .addClass("button")
                    .setText(this.getTranslation("start-i18n"))
                    .addEventListener("click", this.onStartScanner, this)
                )
            );
        if (this.getProperty("imageSrc")) {
            oElement
                .appendNode(new ImageSelection()
                    .setId("selection")
                )
                .appendNode(new DomElement("img")
                    .setSrc(this.getProperty("imageSrc"))
                    .setId("image")
                    .addEventListener("dragstart", this.preventDefault, this)
                    .addEventListener("drag", this.preventDefault, this)
                )
                .appendNode(new DomElement("canvas")
                    .setId("canvas")
                );
        }

        return oElement.getNode();
    }

    onLoadImage (oEvent) {
        this.handleEvent("loadImage", oEvent);
    }

    onStartScanner (oEvent) {
        this.handleEvent("startScanner", oEvent);
    }
};
