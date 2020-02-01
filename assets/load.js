const fs = require('fs').promises;
const glob = require('glob');

module.exports = {
    html: (sPath) => {
        return fs.readFile(sPath, 'utf-8').then(function (sData) {
            document.getElementById('content').innerHTML += sData;
        });
    },
    rendererScripts: () => {
        var aFiles = glob.sync("renderer-process/*!(worker)*/*.js");

        aFiles.forEach((sPath) => {
            require("./../" + sPath);
        });
    },
    workerScripts: (sWorker) => {
        var aFiles = glob.sync("renderer-process/*+(worker)*/*+(" + sWorker + ")*/*.js");

        aFiles.forEach((sPath) => {
            require("./../" + sPath);
        });
    }
};
