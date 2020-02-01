const sqlite3 = require("sqlite3").verbose();

function DatabaseInterface (sPath, fnOpenCallback) {
    const oDb = new sqlite3.Database(sPath, sqlite3.OPEN_READWRITE, fnOpenCallback);
    return {
        closeDatabase: function () {
            if (oDb) {
                oDb.close();
            }
        },
        readConfig: function (fnCallback) {
            const sSql = `
            SELECT *
            FROM Accounts
            `;
            return oDb.get(sSql, fnCallback);
        }
    };
};

module.exports = DatabaseInterface;
