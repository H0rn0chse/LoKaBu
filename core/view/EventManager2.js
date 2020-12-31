export class EventManager2 {
    constructor () {
        this.eventHandler = new Map();
    }

    attachEventHandler (sEventName, oHandler, oEventTarget) {
        const oOldHandler = this.eventHandler.get(sEventName);
        if (oOldHandler) {
            oEventTarget.removeEventListener(sEventName, oOldHandler.getBoundHandler());
            oOldHandler.destroy();
        }
        this.eventHandler.set(sEventName, oHandler);
        oEventTarget.addEventListener(sEventName, oHandler.getBoundHandler());
    }

    destroyEventManager () {
        this.eventHandler.forEach(oHandler => {
            oHandler.destroy();
        });
    }
}
