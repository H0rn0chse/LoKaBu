import { Controller } from "../common/Controller.js";
import { HistoryView } from "../../view/history/HistoryView.js";
import { EventBus } from "../../EventBus.js";
import { HistoryModel } from "../../model/HistoryModel.js";
import { Aggregation } from "../../common/Aggregation.js";
import { AccountModel } from "../../model/AccountModel.js";
import { DetailModel } from "../../model/DetailModel.js";
import { objectGet } from "../../common/Utils.js";

export class HistoryController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oHistory = new HistoryView();
        const oHistoryContainer = this.createContainer("history")
            .setContent(oHistory);

        oHistory.setParent(oHistoryContainer.getNode())
            .addModel(HistoryModel, "viewModel")
            .addModel(AccountModel, "account");

        // Base view
        oHistory
            .bindProperty("currentPage", "viewModel", ["CurrentPage"])
            .bindProperty("pageCount", "viewModel", ["PageCount"]);

        // FilterBox
        oHistory
            .bindAggregation("filter", new Aggregation("viewModel", ["filter"]));

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
                .bindProperty("id", "viewModel", ["ID"])
                .bindProperty("account-ref", "viewModel", ["AccountRef"])
                .bindProperty("account", "account", "account-ref")
                .bindProperty("date", "viewModel", ["Date"])
                .bindProperty("value", "viewModel", ["ReceiptSum"])
                .bindProperty("edit", "lang", ["common.edit"])
            );

        oHistory
            .addEventListener("editLine", this.onEditLine, this)
            .addEventListener("navBefore", this.onPaging.bind(this, "before"))
            .addEventListener("navNext", this.onPaging.bind(this, "next"))
            .addEventListener("sort", this.onSort, this)
            .addEventListener("addFilter", this.onAddFilter, this)
            .addEventListener("updateFilter", this.onUpdateFilter, this)
            .addEventListener("deleteFilter", this.onDeleteFilter, this);

        EventBus.listen("navigation", this.onNavigation, this);
    }

    onNavigation (sSection) {
        this.getContainer("history").setVisibilty(sSection === "history");
    }

    onPaging (sDirection, oEvent) {
        switch (sDirection) {
            case "next":
                HistoryModel.readNext();
                break;
            case "before":
                HistoryModel.readBefore();
                break;
            default:
        }
    }

    onSort (oEvent) {
        const oData = oEvent.customData;
        HistoryModel.setSort(oData.id, oData.direction);
        HistoryModel.read();
    }

    onEditLine (oEvent) {
        DetailModel.readReceipt(oEvent.customData.id);
        EventBus.sendToCurrentWindow("navigation", "detail");
    }

    onAddFilter (oEvent) {
        HistoryModel.addFilter();
    }

    onUpdateFilter (oEvent) {
        const oCustomData = objectGet(oEvent, ["customData"]);
        if (oCustomData) {
            HistoryModel.setFilterColumn(oCustomData.filter, oCustomData.column);
        }
        HistoryModel.read();
    }

    onDeleteFilter (oEvent) {
        HistoryModel.deleteFilter(oEvent.customData.id);
        HistoryModel.read();
    }
};
