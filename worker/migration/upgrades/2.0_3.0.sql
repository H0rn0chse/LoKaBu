PRAGMA foreign_keys=off;
BEGIN TRANSACTION;
DROP VIEW view_ReceiptList;

-- Update version
UPDATE Settings
SET Version = '3.0';

/*================================================================================
    Translations got removed from table
================================================================================*/
DROP TABLE i18n;

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

COMMIT;
PRAGMA foreign_keys=on;