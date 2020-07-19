const fs = require("fs");
const path = require("path");

export class Lock {
    constructor (fnAbort) {
        this.fnAbort = fnAbort;
        this.bLocked = false;
    }

    abort () {
        this.fnAbort();
    }

    close (sDir) {
        try {
            fs.lstatSync("/some/path").isDirectory();
            this.sLockFilePath = path.join(sDir, "lock");
        } catch (err) {
            this.sLockFilePath = sDir + ".lock";
        }

        if (!fs.existsSync(this.sLockFilePath)) {
            this.bLocked = true;
            this.iSince = new Date().getTime();
            fs.writeFileSync(this.sLockFilePath, this.iSince);
            this.oWatcher = fs.watch(this.sLockFilePath, this.abort.bind(this));
            return true;
        }
        return false;
    }

    forceClose (sPath) {
        if (this.oWatcher) {
            this.oWatcher.close();
        }
        this.sLockFilePath = sPath || this.sLockFilePath;
        this.bLocked = true;
        this.iSince = new Date().getTime();
        fs.writeFileSync(this.sLockFilePath, this.iSince);
        this.oWatcher = fs.watch(this.sLockFilePath, this.abort.bind(this));
    }

    open () {
        if (this.bLocked) {
            this.bLocked = false;
            this.oWatcher.close();
            fs.unlinkSync(this.sLockFilePath);
            return true;
        }
        return false;
    }

    forceOpen () {
        if (this.bLocked) {
            this.bLocked = false;
            this.oWatcher.close();
        }
    }

    getTimestamp () {
        if (this.sLockFilePath) {
            return fs.readFileSync(this.sLockFilePath, "utf8");
        }
        return 0;
    }
};
