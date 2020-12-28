export class Binding {
    constructor (oHandler) {
        this.handler = oHandler;
    }

    getData () {
        // To be implemented by the Binding
    }

    getPath () {
        // used for template binding
        // To be implemented by the Binding
    }

    getModel () {
        // used for template binding
        // To be implemented by the Binding
    }

    triggerUpdate () {
        this.handler.call(this.getData());
    }

    destroy () {
        this.handler = null;
    }
}
