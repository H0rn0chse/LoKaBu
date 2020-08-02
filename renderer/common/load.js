const fs = require('fs').promises;
const glob = require('glob');
const path = require('path');

const aCssFiles = [];

export const load = {
    html: (sPath) => {
        return fs.readFile(path.join(__dirname, "/../", sPath), 'utf-8').then(function (sData) {
            document.getElementById('content').innerHTML += sData;
        });
    },
    css: (sPath) => {
        if (!aCssFiles.includes(sPath)) {
            document.head.innerHTML += `<link type="text/css" rel="stylesheet" href=.${sPath}>`;
            aCssFiles.push(aCssFiles);
        }
    },
    rendererScripts: () => {
        var aFiles = glob.sync(__dirname.replace(/\\/g, "/") + "/../renderer-process/*!(worker)*/*.js");

        aFiles.forEach((sPath) => {
            require(sPath);
        });
    },
    workerScripts: (sWorker) => {
        var aFiles = glob.sync(__dirname.replace(/\\/g, "/") + `/../*+(worker)*/*+(${sWorker})*/*.js`);

        aFiles.forEach((sPath) => {
            if (sPath.endsWith("Lock.js") && sPath.endsWith("databaseConnection.js")) {
                return;
            }
            require(sPath);
        });
    }
};
