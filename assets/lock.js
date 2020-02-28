const fs = require("fs");
const path = require("path");

function Lock (fnAbort) {
    this.fnAbort = fnAbort;
    this.bLocked = false;
}

Lock.prototype.abort = function () {
    this.bLocked = false;
    this.fnAbort();
};

Lock.prototype.close = function (sDir) {
    this.sLockFilePath = path.join(sDir, "lock");

    if (!fs.existsSync(this.sLockFilePath)) {
        this.bLocked = true;
        this.iSince = new Date().getTime();
        fs.writeFileSync(this.sLockFilePath, this.iSince);
        this.oWatcher = fs.watch(this.sLockFilePath, this.abort.bind(this));
        return true;
    }
    return false;
};

Lock.prototype.forceClose = function (sPath) {
    if (this.oWatcher) {
        this.oWatcher.close();
    }
    this.sLockFilePath = sPath || this.sLockFilePath;
    this.bLocked = true;
    this.iSince = new Date().getTime();
    fs.writeFileSync(this.sLockFilePath, this.iSince);
    this.oWatcher = fs.watch(this.sLockFilePath, this.abort.bind(this));
};

Lock.prototype.open = function () {
    if (this.bLocked) {
        this.oWatcher.close();
        fs.unlinkSync(this.sLockFilePath);
        return true;
    }
    return false;
};

Lock.prototype.getTimestamp = function () {
    if (this.sLockFilePath) {
        return fs.readFileSync(this.sLockFilePath, "utf8");
    }
    return 0;
};

module.exports = Lock;
