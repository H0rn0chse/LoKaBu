const { dialog } = require('electron').remote;

function open () {
    return dialog.showSaveDialog({
        filters: [
            {
                name: "database",
                extensions: ["sqlite3"]
            }
        ],
        properties: ["openFile"]
    });
}

module.exports = {
    open
};
