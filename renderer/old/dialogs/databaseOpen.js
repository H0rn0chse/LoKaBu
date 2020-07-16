const { dialog } = require('electron').remote;

function open () {
    return dialog.showOpenDialog({
        filters: [
            {
                name: "database",
                extensions: ["sqlite3"]
            }
        ],
        properties: ["createDirectory"]
    });
}

module.exports = {
    open
};
