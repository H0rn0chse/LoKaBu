export class Binding {
    constructor (oHandler) {
        this.handler = oHandler;
    }

    getHandler () {
        return this.handler;
    }

    getData () {
        console.error("Binding.getData should be implemented by the derived class");
    }

    getPath () {
        // used for template binding
        console.error("Binding.getPath should be implemented by the derived class");
    }

    updatePath () {
        // used for template binding
        console.error("Binding.updatePath should be implemented by the derived class");
    }

    getModel () {
        // used for template binding
        console.error("Binding.getModel should be implemented by the derived class");
    }

    getBindingInfo () {
        console.error("Binding.getBindingInfo should be implemented by the derived class");
    }

    triggerUpdate () {
        this.handler.call(this.getData());
    }

    destroy () {
        this.handler = null;
    }
}
