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
INSERT INTO "Lines" VALUES (1,1,4200,1,1);
INSERT INTO "Settings" VALUES (1,1,'1.2',10,'en_GB');
INSERT INTO "i18n" VALUES ('detail.section.title','Beleg Details','Receipt details');
INSERT INTO "i18n" VALUES ('analysis.section.title','Auswertung','Analysis');
INSERT INTO "i18n" VALUES ('history.section.title','Verlauf','History');
INSERT INTO "i18n" VALUES ('settings.section.title','Einstellungen','Settings');
INSERT INTO "i18n" VALUES ('settings.defaultValues','Standardwerte','Default values');
INSERT INTO "i18n" VALUES ('common.billingAccount','Abrechnungsperson','Billing account');
INSERT INTO "i18n" VALUES ('common.billingType','Abrechnungstyp','Billing type');
INSERT INTO "i18n" VALUES ('settings.lists','Listen','Lists');
INSERT INTO "i18n" VALUES ('common.persons','Personen','Persons');
INSERT INTO "i18n" VALUES ('common.accounts','Konten','Accounts');
INSERT INTO "i18n" VALUES ('common.types','Typen','Types');
INSERT INTO "i18n" VALUES ('common.stores','Läden','Stores');
INSERT INTO "i18n" VALUES ('common.save','Speichern','Save');
INSERT INTO "i18n" VALUES ('common.language','Sprache','Language');
INSERT INTO "i18n" VALUES ('new.section.title.long','Neuen Beleg anlegen','Add new receipt');
INSERT INTO "i18n" VALUES ('common.store','Laden','Store');
INSERT INTO "i18n" VALUES ('common.date','Datum','Date');
INSERT INTO "i18n" VALUES ('common.account','Konto','Account');
INSERT INTO "i18n" VALUES ('common.add','Hinzufügen','Add');
INSERT INTO "i18n" VALUES ('common.reset','Zurücksetzen','Reset');
INSERT INTO "i18n" VALUES ('common.result','Ergebnis','Result');
INSERT INTO "i18n" VALUES ('receipt.id','Belegnummer','Receipt id');
INSERT INTO "i18n" VALUES ('common.delete','Löschen','Delete');
INSERT INTO "i18n" VALUES ('common.cancel','Abbrechen','Cancel');
INSERT INTO "i18n" VALUES ('common.id','Id','Id');
INSERT INTO "i18n" VALUES ('common.value','Wert','Value');
INSERT INTO "i18n" VALUES ('common.edit','Bearbeiten','Edit');
INSERT INTO "i18n" VALUES ('analysis.grouping','Gruppierung','Grouping');
INSERT INTO "i18n" VALUES ('analysis.xAxis','x-Achse','X-Axis');
INSERT INTO "i18n" VALUES ('analysis.yAxis','y-Achse','Y-Axis');
INSERT INTO "i18n" VALUES ('filter.apply','Filter anwenden','Apply filter');
INSERT INTO "i18n" VALUES ('filter.ReceiptID','Belegnummer','Receipt id');
INSERT INTO "i18n" VALUES ('filter.ReceiptDate','Datum','Date');
INSERT INTO "i18n" VALUES ('filter.ReceiptAccount','Konto','Account');
INSERT INTO "i18n" VALUES ('filter.ReceiptStore','Laden','Store');
INSERT INTO "i18n" VALUES ('filter.ReceiptComment','Kommentar','Comment');
INSERT INTO "i18n" VALUES ('filter.ReceiptValue','Belegwert','Receipt value');
INSERT INTO "i18n" VALUES ('filter.LineTypes','Abrechnungstyp','Line type');
INSERT INTO "i18n" VALUES ('filter.LinePersons','Abrechnungsperson','Line person');
INSERT INTO "i18n" VALUES ('filter.LineValues','Positionswert','Line value');
INSERT INTO "i18n" VALUES ('filter.after','Nach','After');
INSERT INTO "i18n" VALUES ('filter.before','Vor','Before');
INSERT INTO "i18n" VALUES ('filter.unequal','Ungleich','Unequal');
INSERT INTO "i18n" VALUES ('filter.equal','Gleich','equal');
INSERT INTO "i18n" VALUES ('filter.greater','Größer','Greater');
INSERT INTO "i18n" VALUES ('filter.smaller','Kleiner','Smaller');
INSERT INTO "i18n" VALUES ('filter.contains','Enthält','Contains');
INSERT INTO "i18n" VALUES ('filter.containsNot','Enthält nicht','Contains not');
INSERT INTO "i18n" VALUES ('filter.all','Alle','All');
INSERT INTO "i18n" VALUES ('filter.none','Keiner','None');
INSERT INTO "i18n" VALUES ('filter.atLeastOne','Zumindest einer','At least one');
INSERT INTO "Receipts" VALUES (1,1582156800,1,'This Receipts is here for test purposes',1);
INSERT INTO "Stores" VALUES (1,'TestStore');
INSERT INTO "Types" VALUES (1,'TestType');
INSERT INTO "Persons" VALUES (1,'TestPerson');
INSERT INTO "Accounts" VALUES (1,'TestAccount',1);
CREATE VIEW view_databaseInfo as SELECT count(DISTINCT r.ID) AS ReceiptCount, json_group_array(DISTINCT l.ID) AS LineIdList, json_group_array(DISTINCT r.ID) AS ReceiptIdList from Receipts r LEFT JOIN Lines l;
CREATE VIEW view_ReceiptList AS SELECT r.ID as ReceiptID, r.Date as ReceiptDate, a.DisplayName as ReceiptAccount, s.DisplayName as ReceiptStore, r.Comment as ReceiptComment, aggLines.ReceiptValue as ReceiptValue, aggLines.LineTypes, aggLines.LinePersons, aggLines.LineValues FROM Receipts r LEFT JOIN Accounts a ON a.ID = r.Account LEFT Join Stores s ON s.ID = r.Store LEFT JOIN (SELECT l.Receipt as ReceiptID, json_group_array(DISTINCT t.DisplayName) as LineTypes, json_group_array(DISTINCT p.DisplayName) as LinePersons, json_group_array(DISTINCT l.Value) as LineValues, SUM(Value) as ReceiptValue FROM Lines l LEFT JOIN Types t ON t.ID = l.Type LEFT JOIN Persons p ON p.ID = l.Billing GROUP BY l.Receipt) aggLines ON aggLines.ReceiptID = r.ID;
CREATE VIEW view_ReceiptDetail AS SELECT l.ID as LineID, r.ID as ReceiptID, r.Date as ReceiptDate, r.Account as ReceiptAccount, r.Store as ReceiptStore, r.Comment as ReceiptComment, l.Value as LineValue, l.Billing as LineBilling, l.Type as LineType FROM Lines l LEFT JOIN Receipts r ON l.Receipt = r.ID;
CREATE VIEW view_ReceiptAnalysis as SELECT r.Date as sortDate, r.ID as yID, l.Value as yValue, strftime('%m-%Y', datetime(r.Date, 'unixepoch')) as xTime, a.DisplayName as xAccount, s.DisplayName as xStore, t.DisplayName as xType, p.DisplayName as xBilling FROM Lines l LEFT JOIN Receipts r ON r.ID = l.Receipt LEFT JOIN Persons p ON p.ID = l.Billing LEFT JOIN Types t ON t.ID = l.Type LEFT JOIN Stores s ON s.ID = r.Store LEFT JOIN Accounts a on a.ID = r.Account;
COMMIT;
