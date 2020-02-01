const oDatabaseInfo = require("../databaseObjects/databaseInfo");

window.newSection = {
    init: function () {
        console.log("Section new was initialized");
    },
    readConfig: function () {
        // window.ipcRenderer.sendTo(window.iDatabaseId, "read-config");
        console.log(oDatabaseInfo.get());
    }
};
