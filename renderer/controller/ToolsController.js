import { Controller } from "../../core/controller/Controller.js";
import { EventBus } from "../EventBus.js";
import { ToolsView } from "../view/tools/ToolsView.js";
import { ToolsModel } from "../model/ToolsModel.js";
import { Aggregation } from "../../core/common/Aggregation.js";
import { ConfirmDialog } from "../dialogs/ConfirmDialog.js";

export class ToolsController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oTools = new ToolsView();
        const oToolsContainer = this.createContainer("tools")
            .setContent(oTools);

        oTools.setParent(oToolsContainer.getNode())
            .addModel(ToolsModel, "viewModel");

        // Navigation
        oTools
            .bindProperty("selectedItem", "viewModel", ["selectedItem"])
            .bindAggregation("items", new Aggregation("viewModel", ["items"])
                .bindProperty("id", "viewModel", ["id"])
                .bindProperty("i18n", "viewModel", ["i18n"])
                .bindProperty("selected", "viewModel", ["selected"])
            );

        // Main
        oTools
            .bindProperty("description-i18n", "viewModel", ["description-i18n"]);

        // Duplicates
        oTools
            .bindProperty("selectedDuplicate", "viewModel", ["selectedDuplicate"])
            .bindProperty("findDuplicates-i18n", "viewModel", ["findDuplicates-i18n"])
            .bindProperty("confirm-i18n", "viewModel", ["confirm-i18n"])
            .bindProperty("confirmMessage-i18n", "viewModel", ["confirmMessage-i18n"])
            .bindProperty("hint-i18n", "viewModel", ["hint-i18n"])
            .bindAggregation("duplicates", new Aggregation("viewModel", ["duplicates"])
                .bindProperty("id", "viewModel", ["id"])
                .bindProperty("selected", "viewModel", ["selected"])
            )
            .bindAggregation("duplicateData", new Aggregation("viewModel", ["duplicateData"])
                .bindProperty("id", "viewModel", ["ID"])
                .bindProperty("date", "viewModel", ["Date"])
                .bindProperty("sum", "viewModel", ["ReceiptSum"])
                .bindProperty("account", "viewModel", ["Account"])
                .bindProperty("store", "viewModel", ["Store"])
                .bindProperty("lines", "viewModel", ["Lines"])
                .bindProperty("comment", "viewModel", ["Comment"])
                .bindProperty("delete-trans", "lang", ["common.delete"])
                .bindProperty("id-trans", "lang", ["common.id"])
                .bindProperty("date-trans", "lang", ["common.date"])
                .bindProperty("sum-trans", "lang", ["common.sum"])
                .bindProperty("account-trans", "lang", ["common.account"])
                .bindProperty("store-trans", "lang", ["common.store"])
                .bindProperty("lines-trans", "lang", ["common.lines"])
            );

        EventBus.listen("navigation", this.onNavigation, this);

        oTools
            .addEventListener("nav", this.onNav, this)
            .addEventListener("duplicateNav", this.onDuplicateNav, this)
            .addEventListener("duplicateFind", this.onDuplicateFind, this)
            .addEventListener("deleteDuplicate", this.onDeleteDuplicate, this)
            .addEventListener("duplicateConfirm", this.onDuplicateConfirm, this);
    }

    onNavigation (sSection) {
        this.getContainer("tools").setVisibilty(sSection === "tools");
    }

    onNav (oEvent) {
        const oData = oEvent.customData;
        ToolsModel.setSelectedItem(oData.id);
    }

    onDuplicateNav (oEvent) {
        const oData = oEvent.customData;
        ToolsModel.setSelectedDuplicate(oData.id);
    }

    onDuplicateFind (oEvent) {
        ToolsModel.findDuplicates();
    }

    onDuplicateConfirm (oEvent) {
        const oData = oEvent.customData;
        ConfirmDialog.show(oData.confirm)
            .then(() => {
                ToolsModel.confirmDuplicate();
            })
            .catch(() => {});
    }

    onDeleteDuplicate (oEvent) {
        const oData = oEvent.customData;
        ConfirmDialog.show()
            .then(() => {
                ToolsModel.deleteReceipt(oData.id);
            })
            .catch(() => {});
    }
}
