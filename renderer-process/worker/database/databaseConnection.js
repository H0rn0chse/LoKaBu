const sqlite3 = require("sqlite3").verbose();

window.oDatabase = new sqlite3.Database("base_database.sqlite3", sqlite3.OPEN_READWRITE, (oErr) => {
    if (oErr) {
        window.ipcRenderer.send("log", oErr);
    } else {
        window.ipcRenderer.send("log", "database was loaded");
    }
});
