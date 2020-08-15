import { DomElement } from "./DomElement.js";
import { BindingManager } from "../../common/BindingManager.js";
import { EventManager } from "../../common/EventManager.js";
import { MultiClass } from "../../common/MultiClass.js";
import { LanguageModel } from "../../model/LanguageModel.js";

export class View extends MultiClass(BindingManager, EventManager) {
    constructor () {
        super();
        this.name = "";
        this.parent = null;
        this.models = {};
        this.visibilty = true;
        this.childs = [];

        this.addModel(LanguageModel, "lang");
    }

    addGenericListenerToChild (oChild) {
        oChild.addGenericListener(this);
    }

    addModel (oModel, sName) {
        this.models[sName] = oModel;
        oModel.addEventListener("update", this.update, this);
        return this;
    }

    removeModel (sModel) {
        const oModel = this.models[sModel];
        if (oModel) {
            oModel.removeEventListener("update", this.update, this);
            delete this.models[sModel];
        }
        return this;
    }

    getModel (sName) {
        return this.models[sName];
    }

    clearContent () {
        this.childs.forEach(oChild => {
            oChild.destroy();
        });
        this.childs = [];

        this.node.innerHTML = "";
        return this;
    }

    getAggregation (sAggregation) {
        const oBinding = this.getAggregationBinding(sAggregation);
        if (oBinding !== undefined) {
            const oModel = this.models[oBinding.model];
            if (oModel !== undefined) {
                const aData = oModel.get(oBinding.path);
                if (Array.isArray(aData)) {
                    return aData;
                }
                console.error(`${oBinding.model} => ${JSON.stringify(oBinding.path)} did not return an array`, this);
            } else {
                console.error(`${oBinding.model} was not added to this view`, this);
            }
        } else {
            console.error(`${sAggregation} was not bound to this view`, this);
        }
        return [];
    }

    getModels () {
        return this.models;
    }

    getParent () {
        return this.parent;
    }

    getProperty (sProperty, bSupressError = false) {
        const oBinding = this.getPropertyBinding(sProperty);
        if (oBinding !== undefined) {
            const oModel = this.models[oBinding.model];
            if (oModel !== undefined) {
                let aArgs;
                // regular binding
                if (Array.isArray(oBinding.path)) {
                    const oBindingContext = this.getBindingContext();
                    if (oBinding.model === oBindingContext.model) {
                        aArgs = [oBinding.path, oBindingContext.path];
                    } else {
                        aArgs = [oBinding.path, []];
                    }
                // relative binding
                } else {
                    const vProperty = this.getProperty(oBinding.path);
                    const oBindingContext = this.getBindingContext();
                    if (oBinding.model === oBindingContext.model) {
                        aArgs = [vProperty, oBindingContext.path];
                    } else {
                        aArgs = [vProperty, []];
                    }
                }
                const oData = oModel.get(...aArgs);
                if (oData !== undefined) {
                    return oData;
                }
                if (!bSupressError) {
                    console.warn(`${oBinding.model} => ${JSON.stringify(aArgs)} was undefined`, this);
                }
            } else {
                if (!bSupressError) {
                    console.error(`${oBinding.model} was not added to this view`, this);
                }
            }
        } else {
            if (!bSupressError) {
                console.error(`${sProperty} was not bound to this view`, this);
            }
        }
        return this.getPropertyDefault(sProperty);
    }

    getTranslation (vProperty) {
        let aPath = vProperty;
        if (!Array.isArray(vProperty)) {
            aPath = this.getProperty(vProperty);
        }

        const oModel = this.getModel("lang");
        return oModel.get(aPath) || aPath[aPath.length - 1];
    }

    getPropertyDefault (sProperty) {
        return "";
    }

    getNodeById (sId, oSource) {
        let oRoot;
        if (oSource) {
            oRoot = oSource;
        } else if (this.node) {
            oRoot = this.node;
        } else {
            oRoot = document;
        }

        const oNode = oRoot.querySelector(`[id^="${sId}-"]`);
        return oNode || {};
    }

    render () {
        return new DomElement("div").getNode();
    }

    renderAggregation (oDomRef, sAggregation, Constructor, fnAfterBinding = () => {}) {
        const aItems = this.getAggregation(sAggregation);
        const oBinding = this.getAggregationBinding(sAggregation);

        aItems.forEach((oItem, iIndex) => {
            const oChild = new Constructor();
            // add child for later cleanup
            this.childs.push(oChild);

            oChild.setModels(this.getModels());
            oChild.setBindings(oBinding);
            oChild.setBindingContext(oBinding, iIndex);
            oChild.bindProperty(undefined, oBinding.model, []);
            oChild.setParent(oDomRef);
            fnAfterBinding(oChild);
            oChild.update();
        });
        return this;
    }

    setParent (oDomRef) {
        this.parent = oDomRef;
        return this;
    }

    setModels (oModels) {
        this.models = oModels;
        return this;
    }

    update () {
        if (this.parent) {
            console.debug(`${this.getName()} was rendered`);
            if (this.node) {
                this.clearContent();
            } else {
                this.node = new DomElement("div").getNode();
            }
            this.updateParent();
            var oNode = this.render();
            this.node.parentElement.replaceChild(oNode, this.node);
            this.node = oNode;
        }
        return this;
    }

    updateParent () {
        // node has no DOM parent
        if (this.node.parentElement === null) {
            this.parent.appendChild(this.node);
        // node has different DOM parent
        } else if (this.parent !== this.node.parentElement) {
            this.node.parentElement.removeChild(this.node);
            this.parent.appendChild(this.node);
        }
        return this;
    }

    getName () {
        return this.name;
    }

    destroy () {
        // remove all childs
        this.childs.forEach(oChild => {
            oChild.destroy();
        });
        // remove all model update listener
        Object.keys(this.models).forEach(sModel => {
            this.models[sModel].removeEventListener("update", this.update, this);
        });
    }
};
