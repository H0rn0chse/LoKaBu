export class EventManager {
    constructor () {
        this.eventHandler = {};
    }

    addEvent (sEventName) {
        this.eventHandler[sEventName] = [];
        return this;
    }

    addEventListener (sEventName, fnHandler, oScope) {
        const fnBoundHandler = oScope ? fnHandler.bind(oScope) : fnHandler;

        if (!Array.isArray(this.eventHandler[sEventName])) {
            this.eventHandler[sEventName] = [];
        }
        this.eventHandler[sEventName].push(fnBoundHandler);
        return this;
    }

    handleEvent (sEventName, ...args) {
        this.eventHandler[sEventName].forEach(fnHandler => {
            fnHandler(...args);
        });
        return this;
    }
};
