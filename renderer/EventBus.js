import { EventManager } from "./common/EventManager.js";
import { Deferred } from "./common/Deferred.js";

class _EventBus extends EventManager {
    constructor () {
        super();
        this.ipc = new Deferred();
    }

    listen (sChannel, fnCallback, oScope) {
        this.ipc.promise.then(ipc => {
            ipc.on(sChannel, fnCallback, oScope);
        });
        this.addEventListener(sChannel, fnCallback, oScope);
    }

    sendToDatabase (...args) {
        this.ipc.promise.then(ipc => {
            ipc.sendTo(this.database, ...args);
        });
    }

    sendToBrowser (sEventName, ...args) {
        this.handleEvent(sEventName, ...args);
    }

    sendToMain (...args) {
        this.ipc.promise.then(ipc => {
            ipc.send(...args);
        });
    }

    setIpcRenderer (oIpcRenderer) {
        this.ipc.resolve(oIpcRenderer);

        oIpcRenderer.once("databaseChannel", (oEvent, sMessage) => {
            this.database = sMessage;
        });
    }
};

export const EventBus = new _EventBus();
