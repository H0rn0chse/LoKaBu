PRAGMA foreign_keys=off;
BEGIN TRANSACTION;

/*================================================================================
    Schema of Settings table changed
================================================================================*/
ALTER TABLE Settings RENAME TO Settings_temp;
-- Apply schema of new Settings table
CREATE TABLE Settings (
	Person	INTEGER NOT NULL,
	Typ	INTEGER NOT NULL,
	Version	TEXT NOT NULL,
	PageItems	INTEGER NOT NULL,
	FOREIGN KEY(Typ) REFERENCES Types(ID),
	FOREIGN KEY(Person) REFERENCES Persons(ID)
);
-- copy old data to new table
INSERT INTO Settings(Person, Typ, Version, PageItems)
SELECT Person, Typ, '1.1', 10
FROM Settings_temp;
-- Delete temporary table
DROP TABLE Settings_temp;

/*================================================================================
    Create Views
================================================================================*/
CREATE VIEW view_ReceiptDetail AS
	SELECT
		l.ID as LineID,
		r.ID as ReceiptID,
		r.Date as ReceiptDate,
		r.Account as ReceiptAccount,
		r.Store as ReceiptStore,
		r.Comment as ReceiptComment,

		l.Value as LineValue,
		l.Billing as LineBilling,
		l.Typ as LineType


	FROM Lines l
	LEFT JOIN Receipts r
		ON l.Receipt = r.ID;
CREATE VIEW view_ReceiptAnalysis as
	SELECT
		r.Date as sortDate,

		r.ID as yID,
		l.Value as yValue,

		strftime('%m-%Y', datetime(r.Date, 'unixepoch')) as xTime,
		a.DisplayName as xAccount,
		s.DisplayName as xStore,
		t.DisplayName as xTyp,
		p.DisplayName as xBilling

	FROM Lines l
	LEFT JOIN Receipts r
		ON r.ID = l.Receipt
	LEFT JOIN Persons p
		ON p.ID = l.Billing
	LEFT JOIN Types t
		ON t.ID = l.Typ
	LEFT JOIN Stores s
		ON s.ID = r.Store
	LEFT JOIN Accounts a
		on a.ID = r.Account;
CREATE VIEW view_ReceiptList AS
	SELECT
		r.ID as ReceiptID,
		r.Date as ReceiptDate,
		a.DisplayName as ReceiptAccount,
		s.DisplayName as ReceiptStore,
		r.Comment as ReceiptComment,

		aggLines.ReceiptValue as ReceiptValue,
		aggLines.LineTypes,
		aggLines.LinePersons,
		aggLines.LineValues


	FROM Receipts r
	LEFT JOIN Accounts a
		ON a.ID = r.Account
	LEFT Join Stores s
		ON s.ID = r.Store
	LEFT JOIN (SELECT
			l.Receipt as ReceiptID,
			json_group_array(DISTINCT t.DisplayName) as LineTypes,
			json_group_array(DISTINCT p.DisplayName) as LinePersons,
			json_group_array(DISTINCT l.Value) as LineValues,
			SUM(Value) as ReceiptValue
		FROM Lines l
		LEFT JOIN Types t
			ON t.ID = l.Typ
		LEFT JOIN Persons p
			ON p.ID = l.Billing
	GROUP BY l.Receipt) aggLines
		ON aggLines.ReceiptID = r.ID;
CREATE VIEW view_databaseInfo
as
SELECT
	count(DISTINCT r.ID) AS ReceiptCount,
	json_group_array(DISTINCT l.ID) AS LineIdList,
	json_group_array(DISTINCT r.ID) AS ReceiptIdList
from Receipts r
LEFT JOIN Lines l
LEFT JOIN Settings s;

COMMIT;
PRAGMA foreign_keys=on;