const fs = require("fs");

export class Lock {
    constructor (sPath, fnAbort) {
        this.fnAbort = fnAbort;
        this.locked = false;
        this.lockFilePath = sPath + ".lock";
    }

    abort (oEvent, sFileName) {
        if (this.getTimestamp() !== this.since) {
            this.fnAbort();
        }
    }

    close () {
        if (!fs.existsSync(this.lockFilePath)) {
            this.locked = true;
            this.since = new Date().getTime();
            fs.writeFileSync(this.lockFilePath, this.since);
            this.oWatcher = fs.watch(this.lockFilePath, this.abort.bind(this));
            return true;
        }
        return false;
    }

    forceClose () {
        if (this.oWatcher) {
            this.oWatcher.close();
        }
        this.locked = true;
        this.since = new Date().getTime();
        fs.writeFileSync(this.lockFilePath, this.since);
        this.oWatcher = fs.watch(this.lockFilePath, this.abort.bind(this));
    }

    open () {
        if (this.locked) {
            this.locked = false;
            this.oWatcher.close();
            fs.unlinkSync(this.lockFilePath);
            return true;
        }
        return false;
    }

    forceOpen () {
        if (this.locked) {
            this.locked = false;
            this.oWatcher.close();
        }
    }

    getTimestamp () {
        if (this.lockFilePath) {
            return parseInt(fs.readFileSync(this.lockFilePath, "utf8"));
        }
        return 0;
    }
};
