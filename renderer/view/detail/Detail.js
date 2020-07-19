// import { load } from "../../../assets/load.js";
import { DomElement } from "../common/DomElement.js";
import { ReceiptDetail } from "./ReceiptDetail.js";
import { MultiView } from "../common/MultiView.js";
import { Scanner } from "./Scanner.js";
import { LineDetail } from "./LineDetail.js";
import { FlexContainer } from "../common/FlexContainer.js";

// load.css("/renderer/view/header/Header.css");

export class Detail extends MultiView {
    constructor () {
        super();
        this.addEvent("storeChange");
        this.addEvent("save");
        this.addView("receiptDetail", new ReceiptDetail()
            .addEventListener("storeChange", this.onStoreChange, this)
        );
        this.addView("lineDetail", new LineDetail());
        this.addView("scanner", new Scanner());
    }

    render () {
        // base DOM element
        const oNode = new DomElement("section")
            .addClass("detail")
            .appendNode(new DomElement("h3")
                .setText(this.getProperty("title-translation"))
            )
            .appendNode(new FlexContainer("div", { flexDirection: "row", justifyContent: "space-evenly" })
                .appendNode(new DomElement("div")
                    .setChildView(this.getView("receiptDetail"))
                )
                .appendNode(new DomElement("div")
                    .setChildView(this.getView("lineDetail"))
                )
                .appendNode(new DomElement("div")
                    .setChildView(this.getView("scanner"))
                )
            )
            .appendNode(new DomElement("div")
                .appendNode(new DomElement("div"))
                .setText("Click to Submit")
                .addEventHandler("click", this.onSave, this)
            )
            .getNode();

        return oNode;
    }

    onStoreChange (oEvent) {
        this.handleEvent("storeChange", oEvent);
    }

    onSave (oEvent) {
        this.handleEvent("save", oEvent);
    }
};
