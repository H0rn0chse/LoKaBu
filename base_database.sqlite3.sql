BEGIN TRANSACTION;
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
CREATE TABLE IF NOT EXISTS "i18n" (
	"scriptCode"	TEXT NOT NULL,
	"de"	TEXT,
	"en_GB"	TEXT,
	PRIMARY KEY("scriptCode")
);
CREATE TABLE IF NOT EXISTS "Lines" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"Receipt"	INTEGER NOT NULL,
	"Value"	INTEGER NOT NULL,
	"Billing"	INTEGER NOT NULL,
	"Type"	INTEGER NOT NULL,
	FOREIGN KEY("Type") REFERENCES "Types"("ID"),
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "Accounts" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"DisplayName"	TEXT NOT NULL,
	"Owner"	INTEGER NOT NULL,
	FOREIGN KEY("Owner") REFERENCES "Persons"("ID"),
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "Persons" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"DisplayName"	TEXT NOT NULL,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "Stores" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"DisplayName"	TEXT NOT NULL,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "Types" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"DisplayName"	TEXT NOT NULL,
	PRIMARY KEY("ID")
);
CREATE TABLE IF NOT EXISTS "Settings" (
	"Person"	INTEGER NOT NULL,
	"Type"	INTEGER NOT NULL,
	"Account"	INTEGER NOT NULL,
	"Store"	INTEGER NOT NULL,
	"Version"	TEXT NOT NULL,
	"PageItems"	INTEGER NOT NULL,
	"Language"	TEXT,
	"DefaultDir"	TEXT,
	FOREIGN KEY("Account") REFERENCES "Accounts"("ID"),
	FOREIGN KEY("Person") REFERENCES "Persons"("ID"),
	FOREIGN KEY("Store") REFERENCES "Stores"("ID"),
	FOREIGN KEY("Type") REFERENCES "Types"("ID")
);
INSERT INTO "Receipts" VALUES (1,1582156800,1,'This Receipts is here for test purposes',1);
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
INSERT INTO "i18n" VALUES ('detail.message.override','Möchtest du noch nicht gespeicherten Belegdaten verwerfen?','Do you want to deny the unsaved changes to the receipt?');
INSERT INTO "i18n" VALUES ('database.locked','Die Datenbank die du gerade öffnen möchtest ist seit $ gesperrt. Bitte bestätige, dass du die Sperrung aufheben möchtest. Bedenke aber, dass dies Andere und ihre Arbeit beeinträchtigen könnte.','The database you''re trying to access is locked since $. Please confirm that you want to unlock it. But keep in mind that this might affect others and their work.');
INSERT INTO "i18n" VALUES ('database.abort','Die geteilte Datenbank wurde von einer anderen Person bearbeitet. Bitte öffne die geteilte Datenbank erneut oder starte das Programm neu.','Your open database was opened by another person. Please reopen the shared database or restart the program.');
INSERT INTO "i18n" VALUES ('settings.createSharedDatabase','Erstelle Datenbank','Create database');
INSERT INTO "i18n" VALUES ('settings.openSharedDatabase','Öffne Datenbank','Open database');
INSERT INTO "i18n" VALUES ('settings.openUserDatabase','Öffne Nutzerdatenbank','Open user database');
INSERT INTO "i18n" VALUES ('settings.setDefaultDatabase','Setze aktuelle Datenbank als Standard','Set current database as default');
INSERT INTO "i18n" VALUES ('common.confirm','Bestätigen','Confirm');
INSERT INTO "i18n" VALUES ('database.openDefault','Öffne Nutzerdatenbank','Open user database');
INSERT INTO "i18n" VALUES ('settings.databaseSettings','Datenbankeinstellungen','Database settings');
INSERT INTO "i18n" VALUES ('settings.currentDatabase','Aktuelle Datenbank','Current database');
INSERT INTO "i18n" VALUES ('settings.createDatabase','Datenbank erstellen...','Create Database...');
INSERT INTO "i18n" VALUES ('settings.openDatabase','Datenbank öffnen...','Open Database...');
INSERT INTO "i18n" VALUES ('common.default','Standard','Default');
INSERT INTO "i18n" VALUES ('detail.newReceipt','Neuer Beleg...','New Receipt...');
INSERT INTO "i18n" VALUES ('detail.deleteReceipt','Beleg löschen...','Delete Receipt...');
INSERT INTO "i18n" VALUES ('detail.noReceipt','Es gibt keine Belege zum bearbeiten','There are no receipts to edit');
INSERT INTO "i18n" VALUES ('settings.language','Spracheinstellungen','Language Settings');
INSERT INTO "i18n" VALUES ('database.upgrade','Die geöffnete Datenbank erfüllt die erforderte Mindestversion nicht. Um die Version $AppVersion von Lokabu weiter nutzen zu können, müssen sie ein Datenbankupgrade von $SourceVersion zu $TargetVersion vornehmen.','The database you opended does not have the required minimum version. If you want to proceed using the version $AppVersion of Lokabu, you need to do a database upgrade from $SourceVersion to $TargetVersion.');
INSERT INTO "i18n" VALUES ('database.success','Die Datenbank  Operation war erfolgreich.','The database operation was successful');
INSERT INTO "i18n" VALUES ('database.failure','Die Datenbank  Operation ist fehlgheschlagen.','The database operation failed');
INSERT INTO "i18n" VALUES ('database.error','Es ist ein unerwarteter Datenbankfehler aufgetreten:','An unexpected database error occurred:');
INSERT INTO "i18n" VALUES ('dialog.confirm','Sind sie sicher, dass sie fortfahren wollen? Diese Aktion ist nicht umkehrbar und kann andere Nutzer beeinträchtigen.','Are you sure you want to proceed? This action is not reversible and may affect other users.');
INSERT INTO "Lines" VALUES (1,1,4200,1,1);
INSERT INTO "Accounts" VALUES (1,'TestAccount',1);
INSERT INTO "Persons" VALUES (1,'TestPerson');
INSERT INTO "Stores" VALUES (1,'TestStore');
INSERT INTO "Types" VALUES (1,'TestType');
INSERT INTO "Settings" VALUES (1,1,1,1,'2.0',10,'en_GB','');
CREATE VIEW view_ReceiptList AS
	SELECT
		r.ID as ID,
		r.Date as Date,
		r.Account as Account,
		r.Store as Store,
		r.Comment as Comment,
		aggLines.ReceiptSum as ReceiptSum,
		aggLines.Types,
		aggLines.Persons,
		aggLines.LineValues
	FROM Receipts r
		LEFT JOIN (
			SELECT
				l.Receipt as ReceiptID,
				json_group_array(DISTINCT l.Type) as Types,
				json_group_array(DISTINCT l.Billing) as Persons,
				json_group_array(DISTINCT l.Value) as LineValues,
				SUM(Value) as ReceiptSum
			FROM Lines l
			GROUP BY l.Receipt
		) as aggLines
			ON aggLines.ReceiptID = r.ID;
COMMIT;
