import { Controller } from "../common/Controller.js";
import { Settings } from "../../view/settings/Settings.js";
import { EventBus } from "../../EventBus.js";

export class SettingsController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oSettings = new Settings();
        const oSettingsContainer = this.createContainer("settings")
            .setContent(oSettings);

        oSettings.setParent(oSettingsContainer.getNode());

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("settings").getContent().setVisibilty(sSection === "settings");
    }
}
