import { Handler } from "../common/Handler.js";
import { MultiClass } from "../common/MultiClass.js";
import { clearObject } from "../common/Utils.js";
import { BindingManager } from "../view/BindingManager.js";
import { EventManager2 } from "../view/EventManager2.js";
import { ObserverManager } from "../view/ObserverManager.js";
import { TemplateManager } from "../view/TemplateManager.js";
import { TreeElement } from "../view/TreeElement.js";
import { ViewElement } from "../view/ViewElement.js";

export class Component extends MultiClass(ViewElement, BindingManager, TemplateManager, TreeElement, EventManager2, ObserverManager) {
    constructor (oAttributes) {
        super();
        this.name = "Component";
        this.properties = ["childNodes"];
        this.events = [];
        this.attributes = oAttributes || {};
        this.status = ["created"];
    }

    async init (oView) {
        this.setView(oView);
        this.status.push("initialized");
    }

    render () {
        this.status.push("rendered");
        console.warn("Component.render should be implemented by the derived class");
    }

    bindProperties () {
        for (const [key, value] of Object.entries(this.attributes)) {
            this.bindProperty(key, value);
        }
        this.status.push("propertiesBound");
    }

    bindProperty (key, value) {
        if (this.properties.includes(key)) {
            let oBindingInfo = this.parseBindingPath(value);

            if (oBindingInfo.isForwarded) {
                const oForwardedBinding = this.getForwardedBinding(oBindingInfo.contextPath);
                const oNewBindingInfo = oForwardedBinding.getBindingInfo();
                if (oBindingInfo.path && oNewBindingInfo.path) {
                    oNewBindingInfo.path += `.${oBindingInfo}`;
                }
                oBindingInfo = oNewBindingInfo;
            } else {
                oBindingInfo.model = this.getModel(oBindingInfo.model);
            }

            const oHandler = this.getPropertyHandler(key);
            const oBinding = this.createBinding(oBindingInfo, oHandler);

            this.setBinding(key, oBinding);
        }
    }

    getPropertyHandler (sPropertyName) {
        if (this.properties.includes(sPropertyName)) {
            const sHandler = `set${sPropertyName.charAt(0).toUpperCase()}${sPropertyName.slice(1)}`;
            let fnHandler = this[sHandler];
            if (!fnHandler) {
                // set value on component by default
                fnHandler = function (vValue) {
                    this[sPropertyName] = vValue;
                };
            }
            return new Handler(fnHandler, this);
        }
    }

    attachEvents () {
        for (const [key, value] of Object.entries(this.attributes)) {
            this.attachEvent(key, value);
        }
        this.status.push("eventsAttached");
    }

    attachEvent (sEventName, sHandlerName) {
        if (this.events.includes(sEventName)) {
            const oEventHandler = this.getEventHandler(sHandlerName);
            const sHandler = `attach${sEventName.charAt(0).toUpperCase()}${sEventName.slice(1)}`;
            if (oEventHandler && this[sHandler]) {
                this[sHandler](oEventHandler);
            }
        }
    }

    async defaultItemFactory (aItems, sPropertyName, sTemplateId) {
        const oContext = this.getBindingContext(sPropertyName);
        const oView = this.getView();

        const aResult = aItems.map(async (item, iIndex) => {
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
                await oItem.init(oView);
                await oItem.render();
                await oItem.bindProperties();
                await oItem.attachEvents();
                await oItem.updateBindings();
            }
        });
        await Promise.all(aResult);

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

    getForwardedBinding (sName) {
        const oResult = {
            found: false,
            binding: null
        };
        const fnGetBinding = function (oParent, oResult) {
            if (oResult.found) {
                return;
            }
            if (oParent.getBinding) {
                const oBinding = oParent.getBinding(sName);
                if (oBinding) {
                    oResult.found = true;
                    oResult.binding = oBinding;
                }
            }
        };
        this.iterateParents(fnGetBinding, [oResult]);
        return oResult.binding;
    }

    updateBindings (...args) {
        super.updateBindings(...args);
        this.status.push("bindingsUpdated");
    }

    destroy () {
        // To be extended by the Component
        this.iterateChildren("destroy");
        this.destroyViewElement();
        this.destroyBindingManager();
        this.destroyTemplateManager();
        this.destroyTreeElement();
        this.destroyEventManager();
        this.destroyObserverManager();
        clearObject(this);
    }
}
