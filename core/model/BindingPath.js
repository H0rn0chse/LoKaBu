import { Cloneable } from "../common/Cloneable.js";
export class BindingPath extends Cloneable {
    constructor (sPath) {
        super();
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

    setBindingContext (sContext) {
        const aContextPath = this.parsePath(sContext);
        if (aContextPath[aContextPath.length - 1] === "") {
            aContextPath.splice(aContextPath.length - 1, 1);
        }
        const aPath = this.path.splice(0, this.path.length);
        if (aPath[0] === "") {
            aPath.splice(0, 1);
        }
        this.path = [...aContextPath, ...aPath];
    }

    clone () {
        return new BindingPath(this.path);
    }

    destroy () {
        this.path = null;
    }
}
