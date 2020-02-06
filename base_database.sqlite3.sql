BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Lines" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"Receipt"	INTEGER NOT NULL,
	"Value"	INTEGER NOT NULL,
	"Billing"	INTEGER NOT NULL,
	"Type"	INTEGER NOT NULL,
	PRIMARY KEY("ID"),
	FOREIGN KEY("Type") REFERENCES "Types"("ID")
);
CREATE TABLE IF NOT EXISTS "Settings" (
	"Person"	INTEGER NOT NULL,
	"Type"	INTEGER NOT NULL,
	"Version"	TEXT NOT NULL,
	"PageItems"	INTEGER NOT NULL,
	"Language"	TEXT,
	FOREIGN KEY("Person") REFERENCES "Persons"("ID"),
	FOREIGN KEY("Type") REFERENCES "Types"("ID")
);
CREATE TABLE IF NOT EXISTS "i18n" (
	"scriptCode"	TEXT NOT NULL,
	"de"	TEXT,
	"en_GB"	TEXT,
	PRIMARY KEY("scriptCode")
);
CREATE TABLE IF NOT EXISTS "Receipts" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"Date"	INTEGER NOT NULL,
	"Account"	INTEGER NOT NULL,
	"Comment"	TEXT,
	"Store"	INTEGER,
	FOREIGN KEY("Account") REFERENCES "Accounts"("ID"),
	FOREIGN KEY("Store") REFERENCES "Stores"("ID"),
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "Stores" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"DisplayName"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "Types" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"DisplayName"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "Persons" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"DisplayName"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "Accounts" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"DisplayName"	TEXT NOT NULL UNIQUE,
	"Owner"	INTEGER NOT NULL,
	PRIMARY KEY("ID"),
	FOREIGN KEY("Owner") REFERENCES "Persons"("ID")
);
INSERT INTO "Settings" VALUES (1,1,'1.2',50,'en_GB');
INSERT INTO "i18n" VALUES ('edit.section.title','Bearbeiten','Edit');
INSERT INTO "i18n" VALUES ('new.section.title','Neu','New');
INSERT INTO "i18n" VALUES ('analysis.section.title','Diagramme','Analysis');
INSERT INTO "i18n" VALUES ('history.section.title','Verlauf','History');
INSERT INTO "i18n" VALUES ('settings.section.title','Einstellungen','Settings');
INSERT INTO "i18n" VALUES ('settings.defaultValues','Standardwerte','Default values');
INSERT INTO "i18n" VALUES ('common.billingAccount','Abrechnungsperson','Billing account');
INSERT INTO "i18n" VALUES ('common.billingType','Abrechnungstyp','Billing type');
INSERT INTO "i18n" VALUES ('settings.lists','Listen','Lists');
INSERT INTO "i18n" VALUES ('common.persons','Personen','Persons');
INSERT INTO "i18n" VALUES ('common.accounts','Accounts','Accounts');
INSERT INTO "i18n" VALUES ('common.types','Typen','Types');
INSERT INTO "i18n" VALUES ('common.stores','Läden','Stores');
INSERT INTO "i18n" VALUES ('common.save','Speichern','Save');
INSERT INTO "i18n" VALUES ('common.language','Sprache','Language');
INSERT INTO "Stores" VALUES (1,'Store1');
INSERT INTO "Types" VALUES (1,'Type1');
INSERT INTO "Persons" VALUES (1,'Person1');
INSERT INTO "Persons" VALUES (2,'aTest');
INSERT INTO "Accounts" VALUES (1,'Account1',1);
CREATE VIEW view_databaseInfo as SELECT count(DISTINCT r.ID) AS ReceiptCount, json_group_array(DISTINCT l.ID) AS LineIdList, json_group_array(DISTINCT r.ID) AS ReceiptIdList from Receipts r LEFT JOIN Lines l;
CREATE VIEW view_ReceiptList AS SELECT r.ID as ReceiptID, r.Date as ReceiptDate, a.DisplayName as ReceiptAccount, s.DisplayName as ReceiptStore, r.Comment as ReceiptComment, aggLines.ReceiptValue as ReceiptValue, aggLines.LineTypes, aggLines.LinePersons, aggLines.LineValues FROM Receipts r LEFT JOIN Accounts a ON a.ID = r.Account LEFT Join Stores s ON s.ID = r.Store LEFT JOIN (SELECT l.Receipt as ReceiptID, json_group_array(DISTINCT t.DisplayName) as LineTypes, json_group_array(DISTINCT p.DisplayName) as LinePersons, json_group_array(DISTINCT l.Value) as LineValues, SUM(Value) as ReceiptValue FROM Lines l LEFT JOIN Types t ON t.ID = l.Type LEFT JOIN Persons p ON p.ID = l.Billing GROUP BY l.Receipt) aggLines ON aggLines.ReceiptID = r.ID;
CREATE VIEW view_ReceiptDetail AS SELECT l.ID as LineID, r.ID as ReceiptID, r.Date as ReceiptDate, r.Account as ReceiptAccount, r.Store as ReceiptStore, r.Comment as ReceiptComment, l.Value as LineValue, l.Billing as LineBilling, l.Type as LineType FROM Lines l LEFT JOIN Receipts r ON l.Receipt = r.ID;
CREATE VIEW view_ReceiptAnalysis as SELECT r.Date as sortDate, r.ID as yID, l.Value as yValue, strftime('%m-%Y', datetime(r.Date, 'unixepoch')) as xTime, a.DisplayName as xAccount, s.DisplayName as xStore, t.DisplayName as xType, p.DisplayName as xBilling FROM Lines l LEFT JOIN Receipts r ON r.ID = l.Receipt LEFT JOIN Persons p ON p.ID = l.Billing LEFT JOIN Types t ON t.ID = l.Type LEFT JOIN Stores s ON s.ID = r.Store LEFT JOIN Accounts a on a.ID = r.Account;
COMMIT;
