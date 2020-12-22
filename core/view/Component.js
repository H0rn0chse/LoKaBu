import { Handler } from "../common/Handler.js";
import { MultiClass } from "../common/MultiClass.js";
import { BindingManager } from "./BindingManager.js";
import { TemplateManager } from "./TemplateManager.js";
import { TreeElement } from "./TreeElement.js";
import { ViewElement } from "./ViewElement.js";

export class Component extends MultiClass(ViewElement, BindingManager, TemplateManager, TreeElement) {
    constructor (oAttributes) {
        super();
        this.properties = ["childNodes"];
        this.events = [];
        this.attributes = oAttributes || {};
    }

    render () {
        // To be implemented by the Component
    }

    init (oView) {
        this.setView(oView);
        console.error("component init");
        this.render();
        this.bindAttributes();
    }

    bindAttributes () {
        console.error(`binding attributes: ${JSON.stringify(Object.keys(this.attributes))}`);
        for (const [key, value] of Object.entries(this.attributes)) {
            if (this.properties.includes(key)) {
                const oBindingInfo = this.parseBindingPath(value);
                oBindingInfo.model = this.getModel(oBindingInfo.model);

                const oHandler = this.getSetter(key);
                var oBinding = this.createBinding(oBindingInfo, oHandler);

                console.error(`binding ${key} / ${value} created`);

                // set Binding and update
                this.setBinding(key, oBinding);
                oBinding.triggerUpdate();
            } else {
                console.error(`property ${key} is not supported in this component`);
            }
        }
    }

    getSetter (sKey) {
        const sHandler = `set${sKey.charAt(0).toUpperCase()}${sKey.slice(1)}`;
        return new Handler(this[sHandler], this);
    }
}
