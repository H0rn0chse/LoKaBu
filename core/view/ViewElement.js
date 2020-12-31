export class ViewElement {
    constructor () {
        this.parentView = null;
    }

    async init () {
        console.error("ViewElement.init should be implemented by the derived class");
    }

    setView (oView) {
        this.parentView = oView;
    }

    getView () {
        return this.parentView;
    }

    getModel (sModel) {
        return this.parentView.getModel(sModel);
    }

    getEventHandler (sName) {
        return this.parentView.getEventHandler(sName);
    }

    destroyViewElement () {
        this.parentView = null;
    }
}
