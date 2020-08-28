/* eslint-disable no-unused-vars */
import { HeaderController } from "./controller/HeaderController.js";
import { Controller } from "./controller/common/Controller.js";
import { DetailController } from "./controller/DetailController.js";
import { SettingsController } from "./controller/SettingsController.js";
import { AnalysisController } from "./controller/AnalysisController.js";
import { HistoryController } from "./controller/HistoryController.js";
import { EventBus } from "./EventBus.js";
import { DialogImports } from "./DialogImports.js";
import { TesseractController } from "./controller/TesseractController.js";
const { remote } = require("electron");

export class AppController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        this.blockApp();

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

        const oTesseract = this.createContainer("tesseract");
        oTesseract.setContent(new TesseractController(oTesseract.getNode()));

        EventBus.listen("blockApp", this.blockApp, this);
        EventBus.listen("unblockApp", this.unblockApp, this);
        EventBus.listen("database-abort", this.onAbort, this);
        EventBus.listenOnce("database-open", this.unblockApp, this);
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

    onAbort (oEvent, bShutdown) {
        if (bShutdown) {
            this.shutdown();
        }
    }

    shutdown () {
        remote.getCurrentWindow().close();
    }
};
