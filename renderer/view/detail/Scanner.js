import { View } from "../common/View.js";
import { DomElement } from "../common/DomElement.js";
import { loadCss } from "../../common/Utils.js";
import { ImageSelection } from "../common/ImageSelection.js";
import { BusyIndicator } from "../common/BusyIndicator.js";

loadCss("/renderer/view/detail/Scanner.css");

export class Scanner extends View {
    constructor (...args) {
        super(...args);
        this.name = "ScannerView";

        this.outerDragLevel = 0;
        this.innerDragLevel = 0;

        this.bodyListener = [{
            event: "dragenter",
            handler: this.onAppDragEnter.bind(this)
        }, {
            event: "dragend",
            handler: this.onDragEnd.bind(this)
        }, {
            event: "dragleave",
            handler: this.onAppDragLeave.bind(this)
        }, {
            event: "drop",
            handler: this.onDragEnd.bind(this)
        }, {
            event: "dragover",
            handler: this.onDragOver.bind(this)
        }];

        this.bodyListener.forEach(handler => {
            document.body.addEventListener(handler.event, handler.handler, true);
        });
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
            )
            .appendNode(new DomElement("div")
                .setId("scanner-dropArea")
                .addClass("scanner-dropArea")
                .appendNode(new DomElement("div")
                    .setText(this.getTranslation("dnd-i18n"))
                )
                .addEventListener("dragenter", this.onDragEnter, this)
                .addEventListener("dragleave", this.onDragLeave, this)
                .addEventListener("dragover", this.onDragOver, this)
                .addEventListener("drop", this.onDrop, this)
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
                );
        }

        if (this.getProperty("busy")) {
            oElement.appendNode(new DomElement("div")
                .addClass("scanner-busyArea")
                .appendNode(new BusyIndicator())
            );
        }

        return oElement.getNode();
    }

    onDragEnd () {
        this.getNodeById("scanner-dropArea").style.display = "none";
        this.outerDragLevel = 0;
    }

    onAppDragEnter (oEvent) {
        this.getNodeById("scanner-dropArea").style.display = "flex";
        this.outerDragLevel++;
    }

    onAppDragLeave () {
        this.outerDragLevel--;
        if (this.outerDragLevel === 0) {
            this.getNodeById("scanner-dropArea").style.display = "none";
        }
    }

    onDragOver (oEvent) {
        oEvent.preventDefault();
    }

    onDragEnter (oEvent) {
        this.getNodeById("scanner-dropArea").style.background = "rgba(var(--bg-element-base_rgb), 0.8)";
        this.getNodeById("scanner-dropArea").style.color = "var(--element-font)";
        this.innerDragLevel++;
    }

    onDragLeave () {
        this.innerDragLevel--;

        if (this.innerDragLevel === 0) {
            this.getNodeById("scanner-dropArea").style.background = "";
            this.getNodeById("scanner-dropArea").style.color = "";
        }
    }

    onDrop (oEvent) {
        oEvent.stopPropagation();
        oEvent.preventDefault();

        this.outerDragLevel = 0;
        this.innerDragLevel = 0;
        this.getNodeById("scanner-dropArea").style.background = "";
        this.getNodeById("scanner-dropArea").style.color = "";
        const aFiles = Array.from(oEvent.dataTransfer.items)
            .filter(oItem => {
                return oItem.kind === "file";
            })
            .map(oItem => {
                return oItem.getAsFile().path;
            });
        oEvent.customData = {
            files: aFiles
        };
        this.handleEvent("loadImageOrFragment", oEvent);
    }

    destroy () {
        this.bodyListener.forEach(handler => {
            document.body.removeEventListener(handler.event, handler.handler);
        });
        super.destroy();
    }

    onLoadImage (oEvent) {
        if (!this.getProperty("busy")) {
            this.handleEvent("loadImageOrFragment", oEvent);
        }
    }

    onStartScanner (oEvent) {
        const oSelection = this.getNodeById("selection");
        const oImage = this.getNodeById("image");
        const bBusy = this.getProperty("busy");

        if (!bBusy && this.getProperty("imageSrc") && oSelection.style.width !== "" && oImage.src !== "") {
            oEvent.customData = {
                image: oImage,
                selection: oSelection
            };
            this.handleEvent("startScanner", oEvent);
        }
    }
};
