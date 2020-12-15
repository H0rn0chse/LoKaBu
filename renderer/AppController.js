/* eslint-disable no-unused-vars */
import { HeaderController } from "./controller/HeaderController.js";
import { Controller } from "../core/controller/Controller.js";
import { DetailController } from "./controller/DetailController.js";
import { SettingsController } from "./controller/SettingsController.js";
import { AnalysisController } from "./controller/AnalysisController.js";
import { HistoryController } from "./controller/HistoryController.js";
import { EventBus } from "./EventBus.js";
import { DialogImports } from "./DialogImports.js";
import { TesseractController } from "./controller/TesseractController.js";
import { ToolsController } from "./controller/ToolsController.js";
import { BusyController } from "./controller/BusyController.js";
const { remote } = require("electron");

export class AppController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        this.blockApp();

        this.registerController("header", HeaderController);
        this.registerController("detail", DetailController);
        this.registerController("history", HistoryController);
        this.registerController("analysis", AnalysisController);
        this.registerController("tools", ToolsController);
        this.registerController("settings", SettingsController);
        this.registerController("tesseract", TesseractController);
        this.registerController("busy", BusyController);

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

    registerController (sContainer, Controller) {
        const oContainer = this.createContainer(sContainer);
        oContainer.setContent(new Controller(oContainer.getNode()));
    }
};
