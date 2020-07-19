export const databaseHelper = {
    getUsedIds: function (oDatabase, sTable) {
        let sSql = `
        SELECT ROWID
        FROM $Table
        `;
        sSql = sSql.replace(/\$Table/g, sTable);
        const oStmt = oDatabase.prepare(sSql);
        return oStmt.all();
    },
    getNextId: function (oDatabase, sTable) {
        let aUsedIds = this.getUsedIds(oDatabase, sTable);
        aUsedIds = aUsedIds.map((oRow) => {
            return oRow.ID;
        });
        let iNewId = 1;
        while (aUsedIds.includes(iNewId)) {
            iNewId++;
        }
        return iNewId;
    }
};
