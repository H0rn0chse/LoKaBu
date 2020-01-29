"use strict";

const fs = require('fs').promises

const importHtml = (href) => {
	
	return fs.readFile(href, 'utf-8').then(function (data) {
		document.getElementById('content').innerHTML += data
	})
}

exports.importHtml = importHtml