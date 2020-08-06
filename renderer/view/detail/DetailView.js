import { DomElement } from "../common/DomElement.js";
import { ReceiptDetail } from "./ReceiptDetail.js";
import { MultiView } from "../common/MultiView.js";
import { Scanner } from "./Scanner.js";
import { LineDetail } from "./LineDetail.js";
import { FlexContainer } from "../common/FlexContainer.js";
import { loadCss } from "../../common/Utils.js";

loadCss("/renderer/view/Detail/DetailView.css");

export class DetailView extends MultiView {
    constructor () {
        super();
        this.name = "DetailView";

        this.addEvents([
            "new",
            "delete"
        ]);
        this.addView("receiptDetail", new ReceiptDetail()
            .addGenericListener(this));

        this.addView("lineDetail", new LineDetail()
            .addGenericListener(this));

        this.addView("scanner", new Scanner()
            .addGenericListener(this));
    }

    render () {
        // base DOM element
        const oElement = new DomElement("section")
            .addClass("detail")
            .appendNode(new FlexContainer("div", { flexDirection: "row" })
                .addClass("detailActions")
                .appendNode(new DomElement("div")
                    .addClass("button")
                    .setText(this.getTranslation("new-i18n"))
                    .addEventListener("click", this.onNew, this)
                )
                .appendNode(new DomElement("div")
                    .addClass("button")
                    .setText(this.getTranslation("delete-i18n"))
                    .addEventListener("click", this.onDelete, this)
                )
            );

        if (!this.getProperty("no-receipt")) {
            oElement.appendNode(new FlexContainer("div", { flexDirection: "row" })
                .appendNode(new DomElement("div", { flexBasis: "100%" })
                    .addClass("detailColumn")
                    .setChildView(this.getView("receiptDetail"))
                )
                .appendNode(new DomElement("div", { flexBasis: "100%" })
                    .addClass("detailColumn")
                    .setChildView(this.getView("lineDetail"))
                )
                .appendNode(new DomElement("div", { flexBasis: "100%" })
                    .addClass("detailColumn")
                    .setChildView(this.getView("scanner"))
                )
            );
        } else {
            oElement.appendNode(new DomElement("div")
                .setText(this.getTranslation("no-receipt-i18n"))
            );
        }

        return oElement.getNode();
    }

    onNew (oEvent) {
        this.handleEvent("new", oEvent);
    }

    onDelete (oEvent) {
        oEvent.customData = {
            id: this.getProperty("id")
        };
        this.handleEvent("delete", oEvent);
    }
};
