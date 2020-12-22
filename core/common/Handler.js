export class Handler {
    constructor (fnHandler, oScope) {
        this.handler = fnHandler;
        this.scope = oScope;
        this.boundHandler = fnHandler.bind(oScope);
    }

    get () {
        return {
            handler: this.handler,
            scope: this.scope
        };
    }

    call (...args) {
        this.boundHandler(...args);
    }
}
