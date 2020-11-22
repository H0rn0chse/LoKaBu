PRAGMA foreign_keys=off;
BEGIN TRANSACTION;
DROP VIEW view_Analysis;
DROP VIEW view_ReceiptList;

/*================================================================================
    Schema of Receipts table changed
================================================================================*/
ALTER TABLE Receipts RENAME TO Receipts_temp;
-- Apply schema of new Receipts table
CREATE TABLE Receipts (
	ID	INTEGER NOT NULL UNIQUE,
	Date	INTEGER NOT NULL,
	Account	INTEGER NOT NULL,
	Comment	TEXT,
	Store	INTEGER NOT NULL,
	DuplicateHint	TEXT,
	Created	INTEGER NOT NULL,
	Updated	INTEGER NOT NULL,
	FOREIGN KEY(Store) REFERENCES Stores(ID),
	FOREIGN KEY(Account) REFERENCES Accounts(ID),
	PRIMARY KEY(ID)
);
-- copy old data to new table
INSERT INTO Receipts(ID, Date, Account, Comment, Store, DuplicateHint, Created, Updated)
SELECT ID, Date, Account, Comment, Store, '[]', 0, 0
FROM Receipts_temp;
-- Delete temporary table
DROP TABLE Receipts_temp;

-- Update version
UPDATE Settings
SET Version = '3.4';

/*================================================================================
    Restore and Update Views
	 - view_ReceiptList was extended with Created and Updated
================================================================================*/
CREATE VIEW view_ReceiptList AS
	SELECT
		r.ID as ID,
		r.Date as Date,
		r.Account as Account,
		r.Store as Store,
		r.Comment as Comment,
		r.Created as Created,
		r.Updated as Updated,
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

CREATE VIEW view_Analysis AS
    SELECT
        l.ID as ID,
        strftime('%Y-%m', r.Date, 'unixepoch') as Date,
        r.Account as SourceAccount,
        r.Comment as Comment,
        r.Store as Store,
        l.Value as Value,
        l.Account as TargetAccount,
        l.Type as Type,
        l.Billing as Person
    FROM Lines l
        LEFT JOIN Receipts r
            ON r.ID = l.Receipt
    ORDER BY r.Date;

COMMIT;
PRAGMA foreign_keys=on;