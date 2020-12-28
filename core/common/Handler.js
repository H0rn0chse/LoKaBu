export class Handler {
    constructor (fnHandler, oScope) {
        this.handler = fnHandler;
        this.scope = oScope;
        this.boundHandler = fnHandler.bind(oScope);
    }

    bindProperties (...args) {
        this.boundHandler = this.handler.bind(this.scope, ...args);
    }

    get () {
        return {
            handler: this.handler,
            boundHandler: this.boundHandler,
            scope: this.scope
        };
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
