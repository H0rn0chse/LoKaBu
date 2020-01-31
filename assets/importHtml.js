"use strict";

const fs = require('fs').promises;

const importHtml = (sPath) => {
    return fs.readFile(sPath, 'utf-8').then(function (sData) {
        document.getElementById('content').innerHTML += sData;
    });
};

exports.importHtml = importHtml;
