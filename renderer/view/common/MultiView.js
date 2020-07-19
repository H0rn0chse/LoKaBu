import { View } from "./View.js";

export class MultiView extends View {
    constructor () {
        super();
        this.subViews = {};
    }

    addView (sName, oView) {
        this.subViews[sName] = oView;
    }

    applyBindingsToSubViews () {
        Object.values(this.subViews).forEach(subView => {
            subView.setModels(this.getModels());
            subView.setBindings(this);
        });
    }

    getView (sName) {
        return this.subViews[sName];
    }

    update () {
        this.applyBindingsToSubViews();
        super.update();
        this.updateSubViews();
    }

    updateSubViews () {
        Object.values(this.subViews).forEach(subView => {
            subView.update();
        });
    }
};
