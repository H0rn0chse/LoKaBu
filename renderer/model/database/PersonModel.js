import { EventBus } from "../../EventBus.js";
import { DatabaseModel } from "../common/DatabaseModel.js";

class _PersonModel extends DatabaseModel {
    constructor (oData) {
        super(oData, "persons");
    }

    addEntry () {
        const oEntry = {
            DisplayName: ""
        };
        EventBus.sendToDatabase("persons-create", oEntry);
    }

    updateEntry (iId, sDisplayName) {
        const oEntry = {
            ID: iId,
            DisplayName: sDisplayName
        };
        EventBus.sendToDatabase("persons-update", oEntry);
    }

    processCreate () {
        EventBus.sendToDatabase("persons-read");
    }

    processRead (...args) {
        super.processRead(...args);
        console.log("PersonsModel loaded");
    }

    processUpdate () {
        EventBus.sendToDatabase("persons-read");
    }
}

export const PersonModel = new _PersonModel({
    persons: []
});
