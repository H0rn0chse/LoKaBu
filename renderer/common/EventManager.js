export class EventManager {
    constructor () {
        this.eventHandler = {};
    }

    addEvent (sEventName) {
        this.eventHandler[sEventName] = [];
    }

    addEventListener (sEventName, fnHandler, oScope) {
        const fnBoundHandler = oScope ? fnHandler.bind(oScope) : fnHandler;

        if (!Array.isArray(this.eventHandler[sEventName])) {
            this.eventHandler[sEventName] = [];
        }
        this.eventHandler[sEventName].push(fnBoundHandler);
    }

    handleEvent (sEventName, oEvent) {
        this.eventHandler[sEventName].forEach(fnHandler => {
            fnHandler(oEvent);
        });
    }
};
