export class Handler {
    constructor (fnHandler, oScope) {
        this.handler = fnHandler;
        this.scope = oScope;
        this.boundHandler = fnHandler.bind(oScope);
    }

    bindProperties (...args) {
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

    destroy () {
        this.handler = null;
        this.scope = null;
        this.boundHandler = null;
    }
}
