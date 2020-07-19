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
        this.addView("receiptDetail", new ReceiptDetail());
        this.addView("lineDetail", new LineDetail());
        this.addView("scanner", new Scanner());
    }

    render () {
        const oFlex = new FlexContainer("div", {
            flexDirection: "row",
            justifyContent: "space-evenly"
        });

        // base DOM element
        const oBase = new DomElement("section")
            .addClass("detail")
            .appendNode(new DomElement("h3")
                .setText(this.getProperty("title"))
            )
            .appendNode(oFlex);

        // Adding subViews to flexContainer
        this.getView("receiptDetail").setParent(oFlex.createItem("div").getNode());
        this.getView("lineDetail").setParent(oFlex.createItem("div").getNode());
        this.getView("scanner").setParent(oFlex.createItem("div").getNode());

        return oBase.getNode();
    }
};
