import { Controller } from "./common/Controller.js";
import { DetailView } from "../view/detail/DetailView.js";
import { EventBus } from "../EventBus.js";
import { AccountModel } from "../model/AccountModel.js";
import { StoreModel } from "../model/StoreModel.js";
import { PersonModel } from "../model/PersonModel.js";
import { TypeModel } from "../model/TypeModel.js";
import { DetailModel } from "../model/DetailModel.js";
import { Aggregation } from "../common/Aggregation.js";
import { ReceiptModel } from "../model/ReceiptModel.js";
import { LineModel } from "../model/LineModel.js";
import { OpenImageDialog } from "../dialogs/OpenImageDialog.js";
import { ScannerResultDialog } from "../dialogs/ScannerResultDialog.js";
import { ImportFragmentDialog } from "../dialogs/ImportFragmentDialog.js";
import { ImportFragmentSuccessDialog } from "../dialogs/ImportFragmentSuccessDialog.js";
import { BulkDialog } from "../dialogs/BulkDialog.js";
import { ConfirmDialog } from "../dialogs/ConfirmDialog.js";

export class DetailController extends Controller {
    constructor (oDomRef) {
        super(oDomRef);

        const oDetail = new DetailView();
        const oDetailContainer = this.createContainer("detail")
            .setContent(oDetail);

        oDetail.setParent(oDetailContainer.getNode())
            .addModel(DetailModel, "viewModel")
            .addModel(ReceiptModel, "receipt")
            .addModel(LineModel, "lines")
            .addModel(AccountModel, "account")
            .addModel(StoreModel, "store")
            .addModel(PersonModel, "person")
            .addModel(TypeModel, "type");

        // detail base view
        oDetail
            .bindProperty("new-i18n", "viewModel", ["new-i18n"])
            .bindProperty("delete-i18n", "viewModel", ["delete-i18n"])
            .bindProperty("no-receipt", "viewModel", ["no-receipt"])
            .bindProperty("no-receipt-i18n", "viewModel", ["no-receipt-i18n"]);

        // ReceiptDetail
        oDetail
            .bindProperty("id-i18n", "viewModel", ["id-i18n"])
            .bindProperty("date-i18n", "viewModel", ["date-i18n"])
            .bindProperty("store-i18n", "viewModel", ["store-i18n"])
            .bindProperty("account-i18n", "viewModel", ["account-i18n"])
            .bindAggregation("stores", new Aggregation("store", ["stores"])
                .bindProperty("text", "store", ["DisplayName"])
                .bindProperty("value", "store", ["ID"])
            )
            .bindAggregation("accounts", new Aggregation("account", ["accounts"])
                .bindProperty("text", "account", ["DisplayName"])
                .bindProperty("value", "account", ["ID"])
            )
            .bindProperty("id", "receipt", ["ID"])
            .bindProperty("date", "receipt", ["Date"])
            .bindProperty("store", "receipt", ["Store"])
            .bindProperty("account", "receipt", ["Account"])
            .bindProperty("comment", "receipt", ["Comment"])
            .bindProperty("sum", "viewModel", ["Sum"]);

        // ReceiptLines
        oDetail
            .bindProperty("bulk-i18n", "viewModel", ["bulk-i18n"])
            .bindAggregation("receiptLines", new Aggregation("lines", ["lines"])
                .bindAggregation("persons", new Aggregation("person", ["persons"])
                    .bindProperty("text", "person", ["DisplayName"])
                    .bindProperty("value", "person", ["ID"])
                )
                .bindAggregation("types", new Aggregation("type", ["types"])
                    .bindProperty("text", "type", ["DisplayName"])
                    .bindProperty("value", "type", ["ID"])
                )
                .bindProperty("id", "lines", ["ID"])
                .bindProperty("person", "lines", ["Billing"])
                .bindProperty("type", "lines", ["Type"])
                .bindProperty("value", "lines", ["Value"])
                .bindProperty("selected", "lines", ["Selected"])
            );

        // Scanner
        oDetail
            .bindProperty("imageSrc", "viewModel", ["imageSrc"])
            .bindProperty("busy", "viewModel", ["busy"])
            .bindProperty("load-i18n", "viewModel", ["load-i18n"])
            .bindProperty("start-i18n", "viewModel", ["start-i18n"])
            .bindProperty("dnd-i18n", "viewModel", ["dnd-i18n"]);

        oDetail
            .addEventListener("accountChange", this.onAccountChange, this)
            .addEventListener("dateChange", this.onDateChange, this)
            .addEventListener("commentChange", this.onCommentChange, this)
            .addEventListener("lineChange", this.onLineChange, this)
            .addEventListener("lineAdd", this.onLineAdd, this)
            .addEventListener("lineRemove", this.onLineRemove, this)
            .addEventListener("lineSelect", this.onLineSelect, this)
            .addEventListener("storeChange", this.onStoreChange, this)
            .addEventListener("new", this.onNew, this)
            .addEventListener("delete", this.onDelete, this)
            .addEventListener("loadImageOrFragment", this.onLoadImageOrFragment, this)
            .addEventListener("startScanner", this.onStartScanner, this)
            .addEventListener("selectAll", this.onSelectAll, this)
            .addEventListener("unselectAll", this.onUnselectAll, this)
            .addEventListener("bulkAction", this.onBulkAction, this);

        EventBus.listen("navigation", this.onNavigation, this);
        EventBus.listen("tesseract-result", this.onScannerResults, this);
        EventBus.listen("fragment-succuess", this.onFragmentSuccess, this);
    }

    onNavigation (sSection) {
        this.getContainer("detail").setVisibilty(sSection === "detail");
    }

    onScannerResults (aResult) {
        DetailModel.setBusy(false);
        ScannerResultDialog.show().then(oResult => {
            if (oResult.response === 0) { // replace
                DetailModel.replaceReceiptLines(aResult);
            } else if (oResult.response === 1) { // append
                DetailModel.appendReceiptLines(aResult);
            }
        }).catch(() => {});
    }

    onStartScanner (oEvent) {
        const oData = oEvent.customData;
        EventBus.sendToCurrentWindow("tesseract-start", oData.image, oData.selection);
        DetailModel.setBusy(true);
    }

    onLoadImageOrFragment (oEvent) {
        const aFiles = oEvent.customData.files;
        if (Array.isArray(aFiles)) {
            const aImageFiles = aFiles.filter(sItem => {
                const sFile = sItem.toUpperCase();
                return sFile.endsWith(".PNG") || sFile.endsWith(".JPG") || sFile.endsWith(".JPEG");
            });
            const aImportFiles = aFiles.filter(sItem => {
                const sFile = sItem.toUpperCase();
                return sFile.endsWith(".FRAGMENT.XML");
            });

            if (aImageFiles.length) {
                aImageFiles.sort();
                DetailModel.setImageSrc(aImageFiles[0]);
            } else if (aImportFiles.length) {
                ImportFragmentDialog.show(aImportFiles.length).then(() => {
                    DetailModel.importFragments(aImportFiles);
                }).catch(() => {});
            }
        } else {
            OpenImageDialog.show().then(sPath => {
                if (sPath) {
                    DetailModel.setImageSrc(sPath);
                }
            }).catch(() => {});
        }
    }

    onFragmentSuccess (oEvent) {
        ImportFragmentSuccessDialog.show().catch(() => {});
    }

    onAccountChange (oEvent) {
        ReceiptModel.setAccount(oEvent.customData.account);
    }

    onDateChange (oEvent) {
        ReceiptModel.setDate(oEvent.customData.date);
    }

    onStoreChange (oEvent) {
        ReceiptModel.setStore(oEvent.customData.store);
    }

    onCommentChange (oEvent) {
        ReceiptModel.setComment(oEvent.customData.comment);
    }

    onLineAdd (oEvent) {
        LineModel.addEntry(oEvent.customData.id);
    }

    onLineChange (oEvent) {
        const oData = oEvent.customData;
        LineModel.updateEntry(oData.id, oData.receipt, oData.value, oData.person, oData.type);
    }

    onLineSelect (oEvent) {
        const oData = oEvent.customData;
        LineModel.selectEntry(oData.id, oData.selected);
    }

    onLineRemove (oEvent) {
        LineModel.deleteEntry(oEvent.customData.id);
    }

    onNew (oEvent) {
        DetailModel.newReceipt();
    }

    onDelete (oEvent) {
        ConfirmDialog.show()
            .then(() => {
                return DetailModel.deleteReceipt(oEvent.customData.id);
            })
            .catch(() => {});
    }

    onSelectAll (oEvent) {
        LineModel.selectAll();
    }

    onUnselectAll (oEvent) {
        LineModel.unselectAll();
    }

    onBulkAction (oEvent) {
        BulkDialog.show()
            .then(oResult => {
                LineModel.updateBulk(oResult.person, oResult.type);
            })
            .catch(() => {});
    }
}
