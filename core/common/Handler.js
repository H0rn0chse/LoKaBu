import { Cloneable } from "./Cloneable.js";

export class Handler extends Cloneable {
    constructor (fnHandler, oScope, fnBoundHandler) {
        super();
        this.handler = fnHandler;
        this.scope = oScope;
        this.boundHandler = fnBoundHandler || fnHandler.bind(oScope);
        this.isBound = false;
    }

    bindProperties (...args) {
        this.isBound = true;
        this.boundHandler = this.handler.bind(this.scope, ...args);
    }

    getScope () {
        return this.scope;
    }

    getHandler () {
        return this.handler;
    }

    getBoundHandler () {
        return this.boundHandler;
    }

    call (...args) {
        this.boundHandler(...args);
    }

    clone () {
        return new Handler(this.handler, this.scope, this.boundHandler);
    }

    destroy () {
        this.handler = null;
        this.scope = null;
        this.boundHandler = null;
    }
}
