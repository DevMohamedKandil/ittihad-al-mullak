BEGIN TRANSACTION;
ALTER TABLE [RefreshTokens] ADD [ActiveBuildingId] int NULL;

CREATE TABLE [UserBuildings] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [BuildingId] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_UserBuildings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserBuildings_Buildings_BuildingId] FOREIGN KEY ([BuildingId]) REFERENCES [Buildings] ([Id]),
    CONSTRAINT [FK_UserBuildings_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_UserBuildings_BuildingId] ON [UserBuildings] ([BuildingId]);

CREATE UNIQUE INDEX [IX_UserBuildings_UserId_BuildingId] ON [UserBuildings] ([UserId], [BuildingId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260711142636_AddUserBuildings', N'9.0.11');

COMMIT;
GO

