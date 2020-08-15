# ipc Channels
This document describes the usage of the ipc (Inter-Process Communication) channels in LoKaBu.

## From Browser to Worker

Channel | Value | Description
--- | --- | ---
accounts-create | { \<string>DisplayName, \<number>Owner } | Signals to create a new account with the given object.
accounts-read | - | Signals to retrieve all accounts.
accounts-update | { \<number>ID, \<string>DisplayName, \<number>Owner } | Signals to update a account with the given object.
database-create | \<string>>Path | Signals to create a database at the described path.
database-force | \<bool>Force, \<string>Path | Signals whether the user wants to override the lock of the requested database.
database-open | \<string>Path (optional) | Signals to open a specific database described by path or the user database by default.
helper-firstReceipt | - | Signals to retrieve the id of the first receipt.
i18n-read | - | Signals to retrieve all translations.
lines-create | { \<number>Receipt, \<number>Value, \<number>Billing, \<number>Type } | Signals to create a new line with given data.
lines-delete | { \<number>ID } or { \<number>Receipt } | Signals to delete the given line (or the all the lines which belong to the given receipt).
lines-read | { \<number>Receipt } | Signals to retrieve all lines of the given receipt.
lines-update | { \<number>ID, \<number>Receipt, \<number>Value, \<number>Billing, \<number>Type } | Signals to update a line with the given data.
persons-create | { \<string>DisplayName } | Signals to create a new person with the given object.
persons-read | - | Signals to retrieve all persons.
persons-update | { \<number>ID, \<string>DisplayName } | Signals to update a person with the given object.
receipts-create | { \<number>Date, \<number>Account, \<string>Comment, \<number>Store } | Signals to create a new receipt with the given data.
receipts-delete | { \<number>ID } | Signals to delete the given receipt.
receipts-read | { \<number>ID } | Signals to read the data of the given receipt.
receipts-update | { \<number>ID, \<number>Date, \<number>Account, \<string>Comment, \<number>Store } | Signals to update a receipt with the given data.
receiptList-read |  \<ReceiptListFilter>[], \<number>Page, \<string>SortColumn, \<string>SortDirection | Signals to retrieve a list of receipts according to the given parameters.
settings-read | - | Signals to retrieve all settings.
settings-update | { \<number>Person, \<number>Type, \<number>Account, \<number>Store, \<string>Language, \<string>DefaultDir } | Signals to update settings. Note settings are saved by database and not by user, except `DefaultDir` which is only saved for the current user.
stores-create | { \<string>DisplayName } | Signals to create a new store with the given object.
stores-read | - | Signals to retrieve all stores.
stores-update | { \<number>ID, \<string>DisplayName } | Signals to update a store with the given object.
types-create | { \<string>DisplayName } | Signals to create a new type with the given object.
types-read | - | Signals to retrieve all types.
types-update | { \<number>ID, \<string>DisplayName } | Signals to update a type with the given object.

## From Worker to Browser

Channel | Value | Description
--- | --- | ---
accounts-create | { \<number>lastInsertRowid } | Confirms the creation of a new account.
accounts-read | { \<number>ID, \<string>DisplayName, \<number>Owner }[] | List of all accounts.
accounts-update | - | Confirms the update of a account.
database-abort | \<bool>shutdown | Signals that the lock of database was opened by another process. In case the shutdown flag was set to true the user database lock was removed.
database-error | \<string>Error | Signals that some uncaught database error occurred.
database-locked | \<string>LockTimestamp \<string>Database | Signals that the database the user was trying to open is locked.
database-open | - | Signals a browser that a new database was successfully opened.
database-upgrade | \<string>AppVersion, \<string>SourceVersion, \<string>TargetVersion, \<string>Path | Signals that the database the user was trying to open is outdated.
database-upgrade-success | - | Signals that the database upgrade was successful.
database-upgrade-failure | - | Signals that the database upgrade failed.
helper-firstReceipt | \<number>ID | Value of the first receipt.
i18n-read | { \<string>scriptCode, \<string>de, \<string>en_GB }[] | List of all translations.
lines-create | { \<number>lastInsertRowid } | Confirms the creation of a new line.
lines-delete | - | Confirms the deletion of a line.
lines-read | { \<number>ID, \<number>Receipt, \<number>Value, \<number>Billing, \<number>Type }[] | List of all lines of a specific receipt.
lines-update | - |  Confirms the update of a new line.
persons-create | { \<number>lastInsertRowid } | Confirms the creation of a new person.
persons-read | { \<number>ID, \<string>DisplayName }[] | List of all persons.
persons-update | - | Confirms the update of a person.
receipts-create | { \<number>lastInsertRowid } | Confirms the creation of a new receipt.
receipts-delete | - | Confirms the deletion of a receipt.
receipts-read | {\<number>ID , \<number>Date, \<number>Account, \<string>Comment, \<number>Store } | Value of the requested receipt.
receipts-update | - | Confirms the update of a receipt.
receiptList-read |  { \<number>ID, \<number>Date, \<number>Account, \<number>Store, \<string>Comment, \<number>ReceiptSum, \<number>Types[], \<number>Persons[], \<number>LineValues[] }[] | List of all receipts which matched the search. Note: The amount of results is limited by the paging mechanism.
settings-read | { \<number>Person, \<number>Type, \<number>Account, \<number>Store, \<string>Language, \<string>DefaultDir, \<string>CurrentDir } | Object with all settings values.
settings-update | - | Confirms the update of the settings.
stores-create | { \<number>lastInsertRowid } |Confirms the creation of a new store.
stores-read | { \<number>ID, \<string>DisplayName }[] | List of all stores.
stores-update | - | Confirms the update of a store.
types-create | { \<number>lastInsertRowid } |Confirms the creation of a new type.
types-read | { \<number>ID, \<string>DisplayName }[] | List of all types.
types-update | - | Confirms the update of a store.

## From Main To Window

Channel | Value | Description
--- | --- | ---
appVersion | \<string>AppVersion | The Version of the app according to the package.json.
eventBus | \<number>Id | The webContents id of the other window.
shutdown | - | Signals that the app is about to get closed.

## From Window To Main

Channel | Value | Description
--- | --- | ---
appVersion | - | Signals to retrieve the app version.
windowLoaded | - | Signals that the sending window is done with the initial loading.
windowProcessClosed | - | Signals that the sending window has all cleanup done.