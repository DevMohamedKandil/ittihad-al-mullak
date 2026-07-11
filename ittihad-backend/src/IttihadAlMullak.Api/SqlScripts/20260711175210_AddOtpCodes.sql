BEGIN TRANSACTION;
CREATE TABLE [OtpCodes] (
    [Id] int NOT NULL IDENTITY,
    [Phone] nvarchar(450) NOT NULL,
    [CodeHash] nvarchar(max) NOT NULL,
    [Channel] int NOT NULL,
    [Attempts] int NOT NULL,
    [Consumed] bit NOT NULL,
    [ExpiresAt] datetime2 NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_OtpCodes] PRIMARY KEY ([Id])
);

CREATE INDEX [IX_OtpCodes_Phone_Consumed_ExpiresAt] ON [OtpCodes] ([Phone], [Consumed], [ExpiresAt]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260711175210_AddOtpCodes', N'9.0.11');

COMMIT;
GO

