import { EventBus } from "../EventBus.js";
import { TestModel } from "../model/TestModel.js";
import { Controller2 } from "../../core/controller/Controller2.js";
import { XmlView } from "../../core/view/XmlView.js";

export class TestController extends Controller2 {
    constructor (oDomRef) {
        super(oDomRef);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    initModels () {
        this.setModel(undefined, TestModel);
    }

    initViews () {
        const oView = new XmlView(this, "renderer/view/test/TestView");
        this.setContainerElement("testView", oView);
        oView.init();
    }

    onNavigation (sSection) {
        this.getContainer("testView").setVisibilty(sSection === "test");
    }

    onTestClick (oComponent, oEvent) {
        console.error("click worked", oComponent, oEvent);
    }

    onValueChange (oComponent, oEvent) {
        const oContext = oComponent.getBindingContext("value");
        const sValue = oComponent.getValue();
        oContext.model.setData(oContext.path, sValue);
    }
}
