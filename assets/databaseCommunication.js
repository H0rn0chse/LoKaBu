const DatabaseInterface = require("./databaseInterface");

const oDatabase = new DatabaseInterface("base_database.sqlite3", (oErr) => {
    if (oErr) {
        window.ipcRenderer.send("log", oErr);
    } else {
        window.ipcRenderer.send("log", "database was loaded");
    }
});

window.ipcRenderer.on("read-config", (oEvent, sMessage) => {
    oDatabase.readConfig((oErr, oResult) => {
        if (oErr) {
            window.ipcRenderer.send("log", oErr);
        } else {
            window.ipcRenderer.sendTo(window.iRendererId, "read-config", oResult);
        }
    });
});
