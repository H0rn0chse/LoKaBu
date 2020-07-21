export class EventManager {
    constructor () {
        this.eventHandler = {};
        this.eventManager = [];
    }

    addEvent (sEventName) {
        this.eventHandler[sEventName] = [];
        return this;
    }

    addEvents (aEventNames) {
        aEventNames.forEach(sEventName => {
            this.addEvent(sEventName);
        });
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

    addGenericListener (oEventManager) {
        this.eventManager.push(oEventManager);
        return this;
    }

    handleEvent (sEventName, ...args) {
        if (!this.eventHandler[sEventName]) {
            this.addEvent(sEventName);
        }
        this.eventHandler[sEventName].forEach(fnHandler => {
            fnHandler(...args);
        });
        this.eventManager.forEach(oEventManager => {
            oEventManager.handleEvent(sEventName, ...args);
        });
        return this;
    }
};
