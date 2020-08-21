import { findKeysInMap } from "./Utils.js";

export class EventWrapper {
    constructor () {
        this.handler = new Map();
    }

    _addBoundHandler (sChannel, fnHandler, oScope) {
        const fnBoundHandler = oScope ? fnHandler.bind(oScope) : fnHandler;
        const oKey = {
            channel: sChannel,
            handler: fnHandler,
            scope: oScope
        };
        if (this.handler.get(oKey)) {
            throw new Error("this method was already bound in this scope for this channel");
        }
        this.handler.set(oKey, fnBoundHandler);
        return fnBoundHandler;
    }

    _getBoundHandler (sChannel, fnHandler, oScope, bRemove = false) {
        let oKey = {
            channel: sChannel,
            handler: fnHandler,
            scope: oScope
        };
        oKey = findKeysInMap(this.handler, (oMapKey) => {
            return oMapKey.channel === oKey.channel &&
                oMapKey.handler === oKey.handler &&
                oMapKey.scope === oKey.scope;
        })[0];
        const fnBoundHandler = this.handler.get(oKey);
        if (bRemove && this.handler.has(oKey)) {
            this.handler.delete(oKey);
        }
        return fnBoundHandler;
    }

    on (sChannel, fnHandler, oScope) {
        return this._addBoundHandler(sChannel, fnHandler, oScope);
    }

    handleEvent (sEventName, ...args) {
        const aKeys = findKeysInMap(this.handler, (oMapKey) => {
            return oMapKey.channel === sEventName;
        });
        aKeys.forEach(oKey => {
            const fnHandler = this.handler.get(oKey);
            try {
                fnHandler(...args);
            } catch (oErr) {
                // the handler might be undefined
                // console.error(oErr, oKey.scope);
            }
        });
    }

    removeListener (sChannel, fnHandler, oScope) {
        return this._getBoundHandler(sChannel, fnHandler, oScope, true);
    }

    removeEvent (sEventName) {
        const aKeys = findKeysInMap(this.handler, (oMapKey) => {
            return oMapKey.channel === sEventName;
        });
        aKeys.forEach(oKey => {
            this.handler.delete(oKey);
        });
    }
}
