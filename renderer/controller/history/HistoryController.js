import { Controller } from "../common/Controller.js";
import { History } from "../../view/history/History.js";
import { EventBus } from "../../EventBus.js";
import { HistoryModel } from "../../model/view/HistoryModel.js";
import { LanguageModel } from "../../model/database/LanguageModel.js";
import { Aggregation } from "../../common/Aggregation.js";
import { AccountModel } from "../../model/database/AccountModel.js";

export class HistoryController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oHistory = new History();
        const oHistoryContainer = this.createContainer("history")
            .setContent(oHistory);

        oHistory.setParent(oHistoryContainer.getNode())
            .addModel(HistoryModel, "viewModel")
            .addModel(AccountModel, "account")
            .addModel(LanguageModel, "lang");

        // Base view
        oHistory
            .bindProperty("currentPage", "viewModel", ["currentPage"])
            .bindProperty("pageCount", "viewModel", ["pageCount"]);

        // SortBar
        oHistory
            .bindAggregation("sort", new Aggregation("viewModel", ["sort"])
                .bindProperty("id", "viewModel", ["id"])
                .bindProperty("text-i18n", "viewModel", ["text-i18n"])
                .bindProperty("text", "lang", "text-i18n")
                .bindProperty("selected", "viewModel", ["selected"])
                .bindProperty("direction", "viewModel", ["direction"])
            );

        // LineEntries
        oHistory
            .bindAggregation("entries", new Aggregation("viewModel", ["entries"])
                .bindProperty("id", "viewModel", ["id"])
                .bindProperty("account-id", "viewModel", ["account"])
                .bindProperty("account", "account", "account-id")
                .bindProperty("date", "viewModel", ["date"])
                .bindProperty("value", "viewModel", ["value"])
                .bindProperty("edit", "lang", ["common.edit"])
            );

        oHistory
            .addEventListener("editLine", this.onEditLine, this)
            .addEventListener("navBefore", this.onPaging.bind(this, "before"))
            .addEventListener("navNext", this.onPaging.bind(this, "next"))
            .addEventListener("sort", this.onSort, this);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("history").setVisibilty(sSection === "history");
    }

    onPaging (sDirection, oEvent) {
        console.log(sDirection, oEvent);
    }

    onSort (oEvent) {
        console.log("sort", oEvent.customData);
    }

    onEditLine (oEvent) {
        console.log("editLine", oEvent.customData);
    }
};
