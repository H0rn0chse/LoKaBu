import { EventPipeline } from "./EventPipeline.js";

export class EventManager {
    constructor () {
        this.events = new EventPipeline();
        this.eventsOnce = new EventPipeline();
        this.eventManager = [];
    }

    addEventListener (sEventName, fnHandler, oScope) {
        this.events.on(sEventName, fnHandler, oScope);
        return this;
    }

    addEventListenerOnce (sEventName, fnHandler, oScope) {
        this.eventsOnce.on(sEventName, fnHandler, oScope);
        return this;
    }

    addGenericListener (oEventManager) {
        this.eventManager.push(oEventManager);
        return this;
    }

    handleEvent (sEventName, ...args) {
        this.events.handleEvent(sEventName, ...args);

        this.eventsOnce.handleEvent(sEventName, ...args);
        this.eventsOnce.removeEvent(sEventName);

        this.eventManager.forEach(oEventManager => {
            oEventManager.handleEvent(sEventName, ...args);
        });
        return this;
    }

    removeEventListener (sEventName, fnHandler, oScope) {
        return this.events.removeListener(sEventName, fnHandler, oScope);
    }
};
