PRAGMA foreign_keys=off;
BEGIN TRANSACTION;
DROP VIEW view_Analysis;
DROP VIEW view_ReceiptList;

/*================================================================================
    Schema of Lines table changed
================================================================================*/
ALTER TABLE Lines RENAME TO Lines_temp;
-- Apply schema of new Lines table
CREATE TABLE Lines (
	ID	INTEGER NOT NULL UNIQUE,
	Receipt	INTEGER NOT NULL,
	Value	INTEGER NOT NULL,
	Billing	INTEGER NOT NULL,
	Type	INTEGER NOT NULL,
	Account	INTEGER,
	PRIMARY KEY(ID),
	FOREIGN KEY(Type) REFERENCES Types(ID),
	FOREIGN KEY(Account) REFERENCES Accounts(ID),
    FOREIGN KEY(Billing) REFERENCES Persons(ID)
);
-- copy old data to new table
INSERT INTO Lines(ID, Receipt, Value, Billing, Type)
SELECT ID, Receipt, Value, Billing, Type
FROM Lines_temp;
-- Delete temporary table
DROP TABLE Lines_temp;

-- Update version
UPDATE Settings
SET Version = '3.3';

/*================================================================================
    Restore Views
================================================================================*/
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