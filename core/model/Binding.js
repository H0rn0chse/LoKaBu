export class Binding {
    constructor (oHandler) {
        this.handler = oHandler;
    }

    getData () {
        // To be implemented by the Binding
    }

    triggerUpdate () {
        console.error("update triggered");
        window.binding = this;
        this.handler.call(this.getData());
    }
}
