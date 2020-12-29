import { EventWrapper } from "../../core/common/EventWrapper.js";
import { objectGet, objectSet } from "../common/Utils.js";
import { BindingPath } from "./BindingPath.js";

const onChange = require("on-change");

export class Model2 {
    constructor (oData = {}) {
        this.data = onChange(oData, this.notify.bind(this));
        this.listener = new EventWrapper();
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
        this.listener.on(oPath.getDot(), oHandler.getHandler(), oHandler.getScope());
    }

    unsubscribe (oPath, oHandler) {
        this.listener.removeListener(oPath.getDot(), oHandler.getHandler(), oHandler.getScope());
    }

    getData (oPath) {
        return objectGet(this.data, oPath.getArray());
    }
}
