window.newSection = {
    init: function () {
        console.log("new");
    },
    readConfig: function () {
        window.ipcRenderer.sendTo(window.iDatabaseId, "read-config");
    }
};
