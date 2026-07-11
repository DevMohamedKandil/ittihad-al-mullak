BEGIN TRANSACTION;
ALTER TABLE [Payments] ADD [Status] int NOT NULL DEFAULT 2;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260711183650_AddPaymentStatus', N'9.0.11');

COMMIT;
GO

