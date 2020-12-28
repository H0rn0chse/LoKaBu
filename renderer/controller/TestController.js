import { EventBus } from "../EventBus.js";
import { TestModel } from "../model/TestModel.js";
import { Controller2 } from "../../core/controller/Controller2.js";
import { XMLView } from "../../core/view/XMLView.js";

export class TestController extends Controller2 {
    constructor (oDomRef) {
        super(oDomRef);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    initModels () {
        this.setModel(undefined, TestModel);
    }

    initViews () {
        const oView = new XMLView(this, "renderer/view/test/TestView");
        this.setContainerItem("testView", oView);
        oView.init();
    }

    onNavigation (sSection) {
        this.getContainer("test").setVisibilty(sSection === "test");
    }

    onTestClick (oComponent) {
        console.error("click worked", oComponent);
    }
}
