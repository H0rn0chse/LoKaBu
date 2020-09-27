PRAGMA foreign_keys=off;
BEGIN TRANSACTION;

-- Update version
UPDATE Settings
SET Version = '3.2';

/*================================================================================
    Restore Views
================================================================================*/
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