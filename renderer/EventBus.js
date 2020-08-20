import { EventManager } from "./common/EventManager.js";
import { Deferred } from "./common/Deferred.js";
import { EventWrapper } from "./common/EventWrapper.js";

class _EventBus extends EventManager {
    constructor () {
        super();

        this.ipc = new Deferred();
        this.windows = {};

        this.ipcEvents = new EventWrapper();
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

    sendTo (sWindow, ...args) {
        Promise.all([
            this.waitFor(sWindow),
            this.ipc.promise
        ]).then(([id, ipc]) => {
            ipc.sendTo(id, ...args);
        });
    }

    sendToDatabase (...args) {
        this.sendTo("database", ...args);
    }

    sendToBrowser (...args) {
        this.sendTo("browser", ...args);
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

        oIpcRenderer.on("eventBus", (oEvent, oIpcMap) => {
            Object.keys(oIpcMap).forEach((sKey) => {
                this.resolve(sKey, oIpcMap[sKey]);
            });
            // cleanup of closed windows
            Object.keys(this.windows).forEach((sWindow) => {
                if (!this.windows[sWindow].isPending && oIpcMap[sWindow] === undefined) {
                    delete this.windows[sWindow];
                }
            });
        });
    }

    resolve (sWindow, iId) {
        this._waitFor(sWindow).resolve(iId);
    }

    _waitFor (sWindow) {
        if (!this.windows[sWindow]) {
            this.windows[sWindow] = new Deferred();
        }
        return this.windows[sWindow];
    }

    waitFor (sWindow) {
        return this._waitFor(sWindow).promise;
    }
};

export const EventBus = new _EventBus();
