export class ViewElement {
    constructor () {
        this.parentView = null;
    }

    init () {
        // To be implemented by the Element
    }

    setView (oView) {
        this.parentView = oView;
    }

    getModel (sModel) {
        return this.parentView.getModel(sModel);
    }

    getHandler (sKey) {
        return this.parentView.getHandler(sKey);
    }

    destroyViewElement () {
        this.parentView = null;
    }
}
