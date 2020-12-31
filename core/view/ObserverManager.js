export class ObserverManager {
    constructor () {
        this.observer = new Map();
    }

    async getObserverTarget () {
        console.error("ObserverManager.getTarget should be implemented by the derived class");
    }

    async addObserver (oHandler, oConfig) {
        // remove old observer if present
        this.removeObserver(oHandler);
        // add new observer
        const oTarget = await this.getObserverTarget();
        if (oTarget) {
            const oObserver = new MutationObserver(oHandler.getBoundHandler());
            oObserver.observe(oTarget, oConfig);
            this.observer.set(oHandler, oObserver);
        }
    }

    removeObserver (oHandler) {
        const oObserver = this.observer.get(oHandler);
        if (oObserver) {
            oObserver.disconnect();
            this.observer.delete(oHandler);
        }
    }

    containsAddedNodes (aRecord) {
        let bResult = false;
        aRecord.forEach(oRecord => {
            if (bResult) {
                return;
            }
            if (oRecord.addedNodes.length) {
                bResult = true;
            }
        });
        return bResult;
    }

    containsRemovedNodes (aRecord) {
        let bResult = false;
        aRecord.forEach(oRecord => {
            if (bResult) {
                return;
            }
            if (oRecord.removedNodes.length) {
                bResult = true;
            }
        });
        return bResult;
    }

    destroyObserverManager () {
        this.observer.forEach((oObserver, oHandler) => {
            oObserver.disconnect();
            this.observer.delete(oHandler);
            oHandler.destroy();
        });
        this.observer = null;
    }
}
