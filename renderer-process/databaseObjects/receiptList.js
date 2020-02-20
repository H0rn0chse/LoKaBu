const FilterOption = require("./../../assets/filterOption");
function ReceiptList () {
    let aReceiptList;
    const aFilterOptions = [];
    const aRefreshCallbacks = [];
    const oListenerCallbacks = {};
    let bRequestPending = true;
    let iCurrentPage = 0;
    let sCurrentSortColumn = "ReceiptID";
    let sCurrentSortDirection = "ASC";

    window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-read-list");
    window.ipcRenderer.on("receiptList-read-list", (oEvent, oResult) => {
        bRequestPending = false;
        aReceiptList = oResult;

        aRefreshCallbacks.forEach(function (fnCallback) {
            fnCallback();
        });
        aRefreshCallbacks.splice(0, aRefreshCallbacks.length);

        Object.keys(oListenerCallbacks).forEach((sKey) => {
            oListenerCallbacks[sKey](aReceiptList);
        });
    });

    window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-read-filter");
    window.ipcRenderer.on("receiptList-read-filter", (oEvent, aResult) => {
        aResult.forEach((oResult) => {
            if (oResult) {
                aFilterOptions.push(new FilterOption(oResult, true));
            }
        });
    });
    return {
        get: function () {
            if (Array.isArray(aReceiptList)) {
                aReceiptList.sort((a, b) => {
                    if (sCurrentSortDirection === "ASC") {
                        return a[sCurrentSortColumn].toString().localeCompare(b[sCurrentSortColumn].toString(), "en", { numeric: "true" });
                    }
                    return b[sCurrentSortColumn].toString().localeCompare(a[sCurrentSortColumn].toString(), "en", { numeric: "true" });
                });
            }
            return aReceiptList;
        },
        getFilterOptions: function () {
            return aFilterOptions;
        },
        applyFilter: function (aFilterOptions) {
            iCurrentPage = 0;
            const aValidatedFilterOptions = [];
            aFilterOptions.forEach((oFilterOption) => {
                aValidatedFilterOptions.push(new FilterOption(oFilterOption));
            });
            window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-write-filter", aValidatedFilterOptions, iCurrentPage, sCurrentSortColumn, sCurrentSortDirection);
        },
        applySort: function (aFilterOptions, sColumn, sDirection) {
            sCurrentSortColumn = sColumn;
            sCurrentSortDirection = sDirection;
            const aValidatedFilterOptions = [];
            aFilterOptions.forEach((oFilterOption) => {
                aValidatedFilterOptions.push(new FilterOption(oFilterOption));
            });
            window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-write-filter", aValidatedFilterOptions, iCurrentPage, sCurrentSortColumn, sCurrentSortDirection);
        },
        update: function (aReceiptList) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-write-list", aReceiptList);
        },
        refresh: function (fnCallback) {
            aRefreshCallbacks.push(fnCallback);
            if (!bRequestPending) {
                bRequestPending = true;
                window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-read-list");
            }
        },
        add: function (oReceipt) {
            window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-write-object", oReceipt);
        },
        getPages: function () {
            return {
                currentPage: (iCurrentPage + 1),
                pageCount: aReceiptList[0].PageCount
            };
        },
        nextPage: function (aFilterOptions) {
            if (iCurrentPage < aReceiptList[0].PageCount - 1) {
                iCurrentPage = (iCurrentPage + 1) % aReceiptList[0].PageCount;
                const aValidatedFilterOptions = [];
                aFilterOptions.forEach((oFilterOption) => {
                    aValidatedFilterOptions.push(new FilterOption(oFilterOption));
                });
                window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-write-filter", aValidatedFilterOptions, iCurrentPage, sCurrentSortColumn, sCurrentSortDirection);
            }
        },
        prevPage: function (aFilterOptions) {
            if (iCurrentPage > 0) {
                iCurrentPage = Math.abs(iCurrentPage - 1) % aReceiptList[0].PageCount;
                const aValidatedFilterOptions = [];
                aFilterOptions.forEach((oFilterOption) => {
                    aValidatedFilterOptions.push(new FilterOption(oFilterOption));
                });
                window.ipcRenderer.sendTo(window.iDatabaseId, "receiptList-write-filter", aValidatedFilterOptions, iCurrentPage, sCurrentSortColumn, sCurrentSortDirection);
            }
        },
        addListener: function (sName, fnCallback) {
            oListenerCallbacks[sName] = fnCallback;
        },
        removeListener: function (sName) {
            delete oListenerCallbacks[sName];
        }
    };
};

const oInstance = new ReceiptList();
module.exports = oInstance;
