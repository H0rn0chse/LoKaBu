export class EventManager2 {
    constructor () {
        this.eventHandler = new Map();
    }

    attachEventHandler (sName, oHandler, oEventTarget) {
        const oOldHandler = this.eventHandler.get(sName);
        if (oOldHandler) {
            oEventTarget.removeEventListener(sName, oOldHandler.getBoundHandler());
            oOldHandler.destroy();
        }
        this.eventHandler.set(sName, oHandler);
        oEventTarget.addEventListener(sName, oHandler.getBoundHandler());
    }

    destroyEventManager () {
        this.eventHandler.forEach(oHandler => {
            oHandler.destroy();
        });
    }
}
