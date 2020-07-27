import { EventManager } from "./common/EventManager.js";
import { Deferred } from "./common/Deferred.js";

class _EventBus extends EventManager {
    constructor () {
        super();
        this.ipc = new Deferred();
        this.database = new Deferred();
    }

    listen (sChannel, fnCallback, oScope) {
        this.ipc.promise.then(ipc => {
            let fnBoundCallback = fnCallback;
            if (oScope) {
                fnBoundCallback = fnBoundCallback.bind(oScope);
            }
            ipc.on(sChannel, fnBoundCallback);
        });
        this.addEventListener(sChannel, fnCallback, oScope);
    }

    sendToDatabase (...args) {
        Promise.all([
            this.database.promise,
            this.ipc.promise
        ]).then(([database, ipc]) => {
            ipc.sendTo(database, ...args);
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
            this.database.resolve(sMessage);
        });
    }
};

export const EventBus = new _EventBus();
