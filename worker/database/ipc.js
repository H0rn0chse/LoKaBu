import { Deferred } from "../../renderer/common/Deferred.js";

class _ipc {
    constructor () {
        this.ipc = new Deferred();
        this.renderer = new Deferred();
    }

    on (...args) {
        this.ipc.promise.then(ipc => {
            ipc.on(...args);
        });
    }

    once (...args) {
        this.ipc.promise.then(ipc => {
            ipc.once(...args);
        });
    }

    send (...args) {
        this.ipc.promise.then(ipc => {
            ipc.send(...args);
        });
    }

    sendToRenderer (...args) {
        Promise.all([
            this.ipc.promise,
            this.renderer.promise
        ]).then(([ipc, renderer]) => {
            ipc.sendTo(renderer, ...args);
        });
    }

    setIpc (ipc) {
        this.ipc.resolve(ipc);
    }

    setRendererId (sId) {
        this.renderer.resolve(sId);
    }
}

export const ipc = new _ipc();
