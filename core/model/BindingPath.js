export class BindingPath {
    constructor (sPath) {
        this.path = this.parsePath(sPath);
    }

    parsePath (sPath) {
        if (sPath.indexOf(".") > -1) {
            return sPath.split(".");
        }
        if (sPath.indexOf("/") > -1) {
            return sPath.split("/");
        }
        return [sPath];
    }

    getDot () {
        return this.path.join(".");
    }

    getArray () {
        return this.path;
    }

    getSlash () {
        return this.path.join("/");
    }
}
