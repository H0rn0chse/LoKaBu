import { EventWrapper } from "../../core/common/EventWrapper.js";
import { objectGet } from "../common/Utils.js";

const onChange = require("on-change");

export class Model2 {
    constructor (oData = {}) {
        this.data = onChange(oData, this.notify);
        this.listener = new EventWrapper();
    }

    notify (path, value, previousValue, name) {
        this.listener.handleEvent(path, value);
    }

    subscribe (sPath, fnHandler, oScope) {
        this.listener.on(sPath, fnHandler, oScope);
    }

    unsubscribe (sPath, fnHandler, oScope) {
        this.listener.removeListener(sPath, fnHandler, oScope);
    }

    getData (path) {
        return objectGet(this.data, path);
    }
}
