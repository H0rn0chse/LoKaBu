import { Handler } from "../common/Handler.js";
import { MultiClass } from "../common/MultiClass.js";
import { clearObject } from "../common/Utils.js";
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
        const fnHandler = this[sHandler] || this.getDefaultSetter(sKey);
        return new Handler(fnHandler, this);
    }

    getDefaultSetter (sKey) {
        return vValue => {
            this[sKey] = vValue;
        };
    }

    defaultItemFactory (aItems, sPropertyName, sTemplateId) {
        const oContext = this.getBindingContext(sPropertyName);
        const oView = this.getView();

        aItems.forEach((item, iIndex) => {
            // Add all items, which are missing
            if (!this.getItem(sPropertyName, iIndex)) {
                const oItem = this.createItem(sTemplateId);

                // add item for removing it later
                this.addItem(sPropertyName, iIndex, oItem);

                // add item as childNode into the tree
                this.addChildComponent(oItem);

                // set bindingContext for relative bindings
                oItem.setBindingContext(oContext.model, oContext.path, iIndex);

                // init child for initial rendering
                oItem.init(oView);
            }
        });
        // Remove all items, which were deleted
        const aItemKeys = this.getItems(sPropertyName);
        aItemKeys.forEach(sKey => {
            const iIndex = sKey.split("-")[1];
            if (!aItems[iIndex]) {
                this.removeItem(sTemplateId, iIndex);
            }
        });
        this.orderItemsByDomRef(aItemKeys);
    }

    orderItemsByDomRef (aItemKeys) {
        const oParentDomRef = this.getDomRef();
        const aChildDomRefs = [];
        aItemKeys.forEach(sKey => {
            const oChild = this.getItemById(sKey);
            if (oChild) {
                const oChildDomRef = oChild.getDomRef();
                aChildDomRefs.push(oParentDomRef.removeChild(oChildDomRef));
            }
        });
        aChildDomRefs.forEach(oChildDomRef => {
            oParentDomRef.appendChild(oChildDomRef);
        });
    }

    destroy () {
        this.iterateChildren("destroy");
        this.destroyViewElement();
        this.destroyBindingManager();
        this.destroyTemplateManager();
        this.destroyTreeElement();
        clearObject(this);
    }
}
