import { Handler } from "../common/Handler.js";
import { MultiClass } from "../common/MultiClass.js";
import { clearObject } from "../common/Utils.js";
import { BindingManager } from "./BindingManager.js";
import { EventManager2 } from "./EventManager2.js";
import { TemplateManager } from "./TemplateManager.js";
import { TreeElement } from "./TreeElement.js";
import { ViewElement } from "./ViewElement.js";

export class Component extends MultiClass(ViewElement, BindingManager, TemplateManager, TreeElement, EventManager2) {
    constructor (oAttributes) {
        super();
        this.name = "Component";
        this.properties = ["childNodes"];
        this.events = [];
        this.attributes = oAttributes || {};
    }

    render () {
        console.warning("Component.render should be implemented by the derived class");
    }

    init (oView) {
        this.setView(oView);
        this.render();
        this.bindAttributes();
    }

    bindAttributes () {
        for (const [key, value] of Object.entries(this.attributes)) {
            if (this.properties.includes(key)) {
                const oBindingInfo = this.parseBindingPath(value);
                oBindingInfo.model = this.getModel(oBindingInfo.model);

                const oHandler = this.getHandler(key);
                var oBinding = this.createBinding(oBindingInfo, oHandler);

                // set Binding and update
                this.setBinding(key, oBinding);
                oBinding.triggerUpdate();
            } else if (this.events.includes(key)) {
                const oEventHandler = this.getEventHandler(value);
                const fnComponentHandler = this.getHandler(key);
                if (oEventHandler && fnComponentHandler) {
                    fnComponentHandler(oEventHandler);
                }
            } else {
                console.error(`property ${key} is not supported in this component: ${this.name}`);
            }
        }
    }

    getHandler (sKey) {
        if (this.properties.includes(sKey)) {
            const sHandler = `set${sKey.charAt(0).toUpperCase()}${sKey.slice(1)}`;
            const fnHandler = this[sHandler] || this.getDefaultPropertyHandler(sKey);
            return new Handler(fnHandler, this);
        }
        if (this.events.includes(sKey)) {
            const sHandler = `attach${sKey.charAt(0).toUpperCase()}${sKey.slice(1)}`;
            const fnHandler = this[sHandler] || function () {};
            return fnHandler.bind(this);
        }
    }

    getDefaultPropertyHandler (sKey) {
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
                this.setItem(sPropertyName, iIndex, oItem);

                // add item as childNode into the tree
                this.addChildComponent(oItem);

                // set bindingContext for relative bindings
                oItem.setBindingContext(oContext.model, oContext.path, iIndex);

                // init child for initial rendering
                oItem.init(oView);
            }
        });
        // Remove all items, which were deleted
        const aItemKeys = this.getItemKeys(sPropertyName);
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
        // To be extended by the Component
        this.iterateChildren("destroy");
        this.destroyViewElement();
        this.destroyBindingManager();
        this.destroyTemplateManager();
        this.destroyTreeElement();
        this.destroyEventManager();
        clearObject(this);
    }
}
