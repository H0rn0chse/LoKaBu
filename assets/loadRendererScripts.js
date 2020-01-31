const glob = require('glob');

var aFiles = glob.sync("renderer-process/**/*.js");

aFiles.forEach((sPath) => {
    require("./../" + sPath);
});
