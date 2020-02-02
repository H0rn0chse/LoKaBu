const Deferred = require("./deferred");

function DatabaseWaiter () {
    const aDatabasePromises = [];

    return {
        add: function (oDatabase) {
            if (!oDatabase.get()) {
                const oDeferred = new Deferred();
                aDatabasePromises.push(oDeferred.promise);
                oDatabase.refresh(oDeferred.resolve);
            }
        },
        getPromise: function () {
            return Promise.all(aDatabasePromises);
        }
    };
};

module.exports = DatabaseWaiter;
