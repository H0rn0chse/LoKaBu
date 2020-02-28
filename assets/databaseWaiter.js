const Deferred = require("./deferred");

function DatabaseWaiter () {
    this.aPromises = [];
    this.aDatabases = [];

    document.addEventListener("databaseOpened_Level_0", (oEvent) => {
        this.reset();
    });
};

DatabaseWaiter.prototype.add = function (oDatabase) {
    if (!oDatabase.get()) {
        const oDeferred = new Deferred();
        this.aPromises.push(oDeferred.promise);
        oDatabase.refresh(oDeferred.resolve);
        this.aDatabases.push(oDatabase);
    }
};

DatabaseWaiter.prototype.getPromise = function () {
    return Promise.all(this.aPromises);
};

DatabaseWaiter.prototype.reset = function () {
    this.aPromises = [];
    this.aDatabases.forEach((oDatabase) => {
        const oDeferred = new Deferred();
        this.aPromises.push(oDeferred.promise);
        oDatabase.refresh(oDeferred.resolve);
    });
    return Promise.all(this.aPromises);
};

module.exports = DatabaseWaiter;
