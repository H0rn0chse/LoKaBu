import { View } from "./View.js";

export class MultiView extends View {
    constructor () {
        super();
        this.subViews = {};
    }

    addView (sName, View) {
        const oView = new View();
        oView.addGenericListener(this);

        this.subViews[sName] = oView;
        return this;
    }

    applyBindingsToSubViews () {
        Object.values(this.subViews).forEach(subView => {
            subView.setModels(this.getModels());
            subView.setBindings(this);
        });
        return this;
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
