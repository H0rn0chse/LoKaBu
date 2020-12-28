import { EventWrapper } from "../../core/common/EventWrapper.js";
import { objectGet, objectSet } from "../common/Utils.js";
import { BindingPath } from "./BindingPath.js";

const onChange = require("on-change");

export class Model2 {
    constructor (oData = {}) {
        this.data = onChange(oData, this.notify.bind(this));
        this.listener = new EventWrapper();
        window.model = this;
    }

    setData (oPath, vValue) {
        objectSet(this.data, oPath.getArray(), vValue);
    }

    notify (path, value, previousValue, name) {
        const oPath = new BindingPath(path);
        let sIndex;
        if (oPath.isItemPath()) {
            sIndex = parseInt(oPath.pop(), 10);
        }
        this.listener.handleEvent(oPath.getDot(), this.getData(oPath), sIndex);
    }

    subscribe (oPath, oHandler) {
        const oHelper = oHandler.get();
        this.listener.on(oPath.getDot(), oHelper.handler, oHelper.scope);
    }

    unsubscribe (oPath, oHandler) {
        const oHelper = oHandler.get();
        this.listener.removeListener(oPath.getDot(), oHelper.handler, oHelper.scope);
    }

    getData (oPath) {
        return objectGet(this.data, oPath.getArray());
    }
}
