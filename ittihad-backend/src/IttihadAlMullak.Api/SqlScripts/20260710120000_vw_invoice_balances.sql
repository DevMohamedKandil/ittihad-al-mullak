-- مثال على سكريبت DbUp: View لأرصدة الفواتير
-- أي ملف .sql هنا بيتنفذ مرة واحدة بس (بيتسجل في جدول SchemaVersions)
CREATE VIEW IF NOT EXISTS vw_InvoiceBalances AS
SELECT
    i.Id,
    i.Number,
    i.ApartmentId,
    i.Amount,
    COALESCE(SUM(p.Amount), 0) AS PaidAmount,
    i.Amount - COALESCE(SUM(p.Amount), 0) AS Balance
FROM Invoices i
LEFT JOIN Payments p ON p.InvoiceId = i.Id
GROUP BY i.Id, i.Number, i.ApartmentId, i.Amount;
