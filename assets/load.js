const fs = require('fs').promises;
const glob = require('glob');
const path = require('path');

module.exports = {
    html: (sPath) => {
        return fs.readFile(path.join(__dirname, "/../", sPath), 'utf-8').then(function (sData) {
            document.getElementById('content').innerHTML += sData;
        });
    },
    rendererScripts: () => {
        var aFiles = glob.sync(__dirname.replace(/\\/g, "/") + "/../renderer-process/*!(worker)*/*.js");

        aFiles.forEach((sPath) => {
            require(sPath);
        });
    },
    workerScripts: (sWorker) => {
        var aFiles = glob.sync(__dirname.replace(/\\/g, "/") + "/../renderer-process/*+(worker)*/*+(" + sWorker + ")*/*.js");

        aFiles.forEach((sPath) => {
            require(sPath);
        });
    }
};
