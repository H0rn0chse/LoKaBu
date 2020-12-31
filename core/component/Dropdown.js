import { XmlFragment } from "./XmlFragment.js";

export class Dropdown extends XmlFragment {
    constructor (...args) {
        super(...args);
        this.name = "Dropdown";

        this.properties = [...this.properties, "items", "value"];
        this.events = [...this.events, "change"];

        window.dd = this;
    }

    render () {
        this.getSelect().afterChildUpdate = () => {
            this.getSelect().getBinding("value").triggerUpdate();
        };

        this.status.push("rendered");
    }

    attachChange (oHandler) {
        oHandler.bindProperties(this);
        this.getSelect().attachChange(oHandler);
    }

    setItems (aItems) {
    }

    setValue (sValue) {
    }

    getValue () {
        return this.getSelect().getDomRef().value;
    }

    getSelect () {
        return this.children[0];
    }
}
