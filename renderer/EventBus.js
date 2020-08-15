import { EventManager } from "./common/EventManager.js";
import { Deferred } from "./common/Deferred.js";
import { EventPipeline } from "./common/EventPipeline.js";

class _EventBus extends EventManager {
    constructor () {
        super();
        this.ipc = new Deferred();
        this.database = new Deferred();
        this.ipcEvents = new EventPipeline();
    }

    listen (sChannel, fnHandler, oScope) {
        const fnBoundHandler = this.ipcEvents.on(sChannel, fnHandler, oScope);
        this.ipc.promise.then(ipc => {
            ipc.on(sChannel, fnBoundHandler);
        });
        this.addEventListener(sChannel, fnHandler, oScope);
    }

    listenOnce (sChannel, fnHandler, oScope) {
        const fnBoundHandler = oScope ? fnHandler.bind(oScope) : fnHandler;
        this.ipc.promise.then(ipc => {
            ipc.once(sChannel, fnBoundHandler);
        });
        this.addEventListenerOnce(sChannel, fnHandler, oScope);
    }

    removeHandler (sChannel, fnHandler, oScope) {
        const fnBoundHandler = this.ipcEvents.removeListener(sChannel, fnHandler, oScope);
        this.ipc.promise.then(ipc => {
            ipc.removeListener(sChannel, fnBoundHandler);
        });
        this.removeEventListener(sChannel, fnHandler, oScope);
    }

    sendToDatabase (...args) {
        Promise.all([
            this.database.promise,
            this.ipc.promise
        ]).then(([database, ipc]) => {
            ipc.sendTo(database, ...args);
        });
    }

    sendToBrowser (...args) {
        this.sendToDatabase(...args);
    }

    sendToCurrentWindow (sEventName, ...args) {
        this.handleEvent(sEventName, ...args);
    }

    sendToMain (...args) {
        this.ipc.promise.then(ipc => {
            ipc.send(...args);
        });
    }

    setIpcRenderer (oIpcRenderer) {
        this.ipc.resolve(oIpcRenderer);

        oIpcRenderer.once("eventBus", (oEvent, sMessage) => {
            this.database.resolve(sMessage);
        });
    }
};

export const EventBus = new _EventBus();
