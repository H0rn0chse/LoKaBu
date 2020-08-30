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
	FOREIGN KEY("Type") REFERENCES "Types"("ID"),
	FOREIGN KEY("Account") REFERENCES "Accounts"("ID"),
	FOREIGN KEY("Store") REFERENCES "Stores"("ID"),
	FOREIGN KEY("Person") REFERENCES "Persons"("ID")
);
CREATE TABLE IF NOT EXISTS "Lines" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"Receipt"	INTEGER NOT NULL,
	"Value"	INTEGER NOT NULL,
	"Billing"	INTEGER NOT NULL,
	"Type"	INTEGER NOT NULL,
	"Account"	INTEGER,
	FOREIGN KEY("Type") REFERENCES "Types"("ID"),
	FOREIGN KEY("Account") REFERENCES "Accounts"("ID"),
	PRIMARY KEY("ID")
);
INSERT INTO "Receipts" VALUES (1,1582156800,1,'This Receipts is here for test purposes',1);
INSERT INTO "Accounts" VALUES (1,'TestAccount',1);
INSERT INTO "Persons" VALUES (1,'TestPerson');
INSERT INTO "Stores" VALUES (1,'TestStore');
INSERT INTO "Types" VALUES (1,'TestType');
INSERT INTO "Settings" VALUES (1,1,1,1,'3.1',10,'en_GB','');
INSERT INTO "Lines" VALUES (1,1,4200,1,1,NULL);
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
