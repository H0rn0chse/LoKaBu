/* eslint-disable no-unused-vars */
import { HeaderController } from "./controller/header/HeaderController.js";
import { Controller } from "./controller/common/Controller.js";
import { DetailController } from "./controller/detail/DetailController.js";
import { SettingsController } from "./controller/settings/SettingsController.js";
import { AnalysisController } from "./controller/analysis/AnalysisController.js";
import { HistoryController } from "./controller/history/HistoryController.js";
import { EventBus } from "./EventBus.js";
import { DatabaseManager } from "./DatabaseManager.js";
const { remote } = require("electron");

export class AppController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oHeader = this.createContainer("header");
        oHeader.setContent(new HeaderController(oHeader.getNode()));

        const oDetail = this.createContainer("detail");
        oDetail.setContent(new DetailController(oDetail.getNode()));

        const oHistory = this.createContainer("history");
        oHistory.setContent(new HistoryController(oHistory.getNode()));

        const oAnalysis = this.createContainer("analysis");
        oAnalysis.setContent(new AnalysisController(oAnalysis.getNode()));

        const oSettings = this.createContainer("settings");
        oSettings.setContent(new SettingsController(oSettings.getNode()));

        EventBus.listen("blockApp", this.blockApp, this);
        EventBus.listen("unblockApp", this.unblockApp, this);
    }

    start () {
        EventBus.sendToCurrentWindow("navigation", "detail");
        this.update();
    }

    blockApp () {
        remote.getCurrentWindow().setEnabled(false);
    }

    unblockApp () {
        remote.getCurrentWindow().setEnabled(true);
    }
};
