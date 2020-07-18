import { EventManager } from "./common/EventManager.js";

class _EventBus extends EventManager {
    listen (sChannel, fnCallback, oScope) {
        this.ipcRenderer.on(sChannel, fnCallback, oScope);
        this.addEventListener(sChannel, fnCallback, oScope);
    }

    sendToDatabase (...args) {
        this.ipcRenderer.sendTo(this.database, ...args);
    }

    sendToBrowser (sEventName, ...args) {
        this.handleEvent(sEventName, ...args);
    }

    sendToMain (...args) {
        this.ipcRenderer.send(...args);
    }

    setIpcRenderer (oIpcRenderer) {
        this.ipcRenderer = oIpcRenderer;

        this.ipcRenderer.once("databaseChannel", (oEvent, sMessage) => {
            this.database = sMessage;
        });
    }
};

export const EventBus = new _EventBus();
