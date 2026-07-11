IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Buildings] (
    [Id] int NOT NULL IDENTITY,
    [Code] nvarchar(max) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Address] nvarchar(max) NOT NULL,
    [FloorsCount] int NOT NULL,
    [ApartmentsCount] int NOT NULL,
    [MonthlySubscription] decimal(18,2) NOT NULL,
    [DueDay] int NOT NULL,
    [Phone] nvarchar(max) NULL,
    [WhatsApp] nvarchar(max) NULL,
    [Email] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Buildings] PRIMARY KEY ([Id])
);

CREATE TABLE [PermissionActions] (
    [Id] int NOT NULL IDENTITY,
    [Key] nvarchar(450) NOT NULL,
    [NameAr] nvarchar(max) NOT NULL,
    [NameEn] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_PermissionActions] PRIMARY KEY ([Id])
);

CREATE TABLE [Screens] (
    [Id] int NOT NULL IDENTITY,
    [Key] nvarchar(450) NOT NULL,
    [NameAr] nvarchar(max) NOT NULL,
    [NameEn] nvarchar(max) NOT NULL,
    [SortOrder] int NOT NULL,
    CONSTRAINT [PK_Screens] PRIMARY KEY ([Id])
);

CREATE TABLE [Conversations] (
    [Id] int NOT NULL IDENTITY,
    [BuildingId] int NOT NULL,
    [Name] nvarchar(max) NULL,
    [IsGroup] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Conversations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Conversations_Buildings_BuildingId] FOREIGN KEY ([BuildingId]) REFERENCES [Buildings] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Expenses] (
    [Id] int NOT NULL IDENTITY,
    [BuildingId] int NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [Category] nvarchar(max) NOT NULL,
    [Date] datetime2 NOT NULL,
    [Notes] nvarchar(max) NULL,
    CONSTRAINT [PK_Expenses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Expenses_Buildings_BuildingId] FOREIGN KEY ([BuildingId]) REFERENCES [Buildings] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(200) NOT NULL,
    [Phone] nvarchar(20) NOT NULL,
    [Email] nvarchar(max) NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Role] int NOT NULL,
    [IsActive] bit NOT NULL,
    [BuildingId] int NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Users_Buildings_BuildingId] FOREIGN KEY ([BuildingId]) REFERENCES [Buildings] ([Id])
);

CREATE TABLE [RolePermissions] (
    [Id] int NOT NULL IDENTITY,
    [Role] int NOT NULL,
    [ScreenId] int NOT NULL,
    [ActionId] int NOT NULL,
    CONSTRAINT [PK_RolePermissions] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RolePermissions_PermissionActions_ActionId] FOREIGN KEY ([ActionId]) REFERENCES [PermissionActions] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_RolePermissions_Screens_ScreenId] FOREIGN KEY ([ScreenId]) REFERENCES [Screens] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Announcements] (
    [Id] int NOT NULL IDENTITY,
    [BuildingId] int NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    [Type] int NOT NULL,
    [IsPinned] bit NOT NULL,
    [CreatedById] int NOT NULL,
    [ScheduledAt] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Announcements] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Announcements_Buildings_BuildingId] FOREIGN KEY ([BuildingId]) REFERENCES [Buildings] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Announcements_Users_CreatedById] FOREIGN KEY ([CreatedById]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Apartments] (
    [Id] int NOT NULL IDENTITY,
    [BuildingId] int NOT NULL,
    [Number] nvarchar(450) NOT NULL,
    [Floor] int NOT NULL,
    [OwnerId] int NULL,
    [TenantId] int NULL,
    CONSTRAINT [PK_Apartments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Apartments_Buildings_BuildingId] FOREIGN KEY ([BuildingId]) REFERENCES [Buildings] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Apartments_Users_OwnerId] FOREIGN KEY ([OwnerId]) REFERENCES [Users] ([Id]),
    CONSTRAINT [FK_Apartments_Users_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Users] ([Id])
);

CREATE TABLE [ConversationParticipants] (
    [Id] int NOT NULL IDENTITY,
    [ConversationId] int NOT NULL,
    [UserId] int NOT NULL,
    CONSTRAINT [PK_ConversationParticipants] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ConversationParticipants_Conversations_ConversationId] FOREIGN KEY ([ConversationId]) REFERENCES [Conversations] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_ConversationParticipants_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [DeviceTokens] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [Token] nvarchar(max) NOT NULL,
    [Platform] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_DeviceTokens] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_DeviceTokens_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Messages] (
    [Id] int NOT NULL IDENTITY,
    [ConversationId] int NOT NULL,
    [SenderId] int NOT NULL,
    [Content] nvarchar(max) NOT NULL,
    [SentAt] datetime2 NOT NULL,
    [ReadAt] datetime2 NULL,
    CONSTRAINT [PK_Messages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Messages_Conversations_ConversationId] FOREIGN KEY ([ConversationId]) REFERENCES [Conversations] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Messages_Users_SenderId] FOREIGN KEY ([SenderId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Notifications] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Body] nvarchar(max) NOT NULL,
    [Channel] int NOT NULL,
    [IsRead] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Notifications] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Notifications_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [RefreshTokens] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [Token] nvarchar(450) NOT NULL,
    [ExpiresAt] datetime2 NOT NULL,
    [RevokedAt] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_RefreshTokens] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RefreshTokens_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Invoices] (
    [Id] int NOT NULL IDENTITY,
    [Number] nvarchar(450) NOT NULL,
    [BuildingId] int NOT NULL,
    [ApartmentId] int NOT NULL,
    [Title] nvarchar(max) NOT NULL,
    [Period] nvarchar(max) NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [DueDate] datetime2 NOT NULL,
    [Type] int NOT NULL,
    [Status] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Invoices] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Invoices_Apartments_ApartmentId] FOREIGN KEY ([ApartmentId]) REFERENCES [Apartments] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Invoices_Buildings_BuildingId] FOREIGN KEY ([BuildingId]) REFERENCES [Buildings] ([Id])
);

CREATE TABLE [MaintenanceRequests] (
    [Id] int NOT NULL IDENTITY,
    [BuildingId] int NOT NULL,
    [ApartmentId] int NULL,
    [Title] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Category] nvarchar(max) NULL,
    [RequesterId] int NOT NULL,
    [Status] int NOT NULL,
    [Priority] int NOT NULL,
    [AssignedTo] nvarchar(max) NULL,
    [RejectionReason] nvarchar(max) NULL,
    [Photos] nvarchar(max) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [ResolvedAt] datetime2 NULL,
    CONSTRAINT [PK_MaintenanceRequests] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MaintenanceRequests_Apartments_ApartmentId] FOREIGN KEY ([ApartmentId]) REFERENCES [Apartments] ([Id]),
    CONSTRAINT [FK_MaintenanceRequests_Buildings_BuildingId] FOREIGN KEY ([BuildingId]) REFERENCES [Buildings] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_MaintenanceRequests_Users_RequesterId] FOREIGN KEY ([RequesterId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [Payments] (
    [Id] int NOT NULL IDENTITY,
    [InvoiceId] int NOT NULL,
    [Amount] decimal(18,2) NOT NULL,
    [Method] int NOT NULL,
    [PaidById] int NULL,
    [PaidAt] datetime2 NOT NULL,
    [Reference] nvarchar(max) NULL,
    CONSTRAINT [PK_Payments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Payments_Invoices_InvoiceId] FOREIGN KEY ([InvoiceId]) REFERENCES [Invoices] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Payments_Users_PaidById] FOREIGN KEY ([PaidById]) REFERENCES [Users] ([Id])
);

CREATE INDEX [IX_Announcements_BuildingId] ON [Announcements] ([BuildingId]);

CREATE INDEX [IX_Announcements_CreatedById] ON [Announcements] ([CreatedById]);

CREATE UNIQUE INDEX [IX_Apartments_BuildingId_Number] ON [Apartments] ([BuildingId], [Number]);

CREATE INDEX [IX_Apartments_OwnerId] ON [Apartments] ([OwnerId]);

CREATE INDEX [IX_Apartments_TenantId] ON [Apartments] ([TenantId]);

CREATE UNIQUE INDEX [IX_ConversationParticipants_ConversationId_UserId] ON [ConversationParticipants] ([ConversationId], [UserId]);

CREATE INDEX [IX_ConversationParticipants_UserId] ON [ConversationParticipants] ([UserId]);

CREATE INDEX [IX_Conversations_BuildingId] ON [Conversations] ([BuildingId]);

CREATE INDEX [IX_DeviceTokens_UserId] ON [DeviceTokens] ([UserId]);

CREATE INDEX [IX_Expenses_BuildingId] ON [Expenses] ([BuildingId]);

CREATE INDEX [IX_Invoices_ApartmentId] ON [Invoices] ([ApartmentId]);

CREATE UNIQUE INDEX [IX_Invoices_BuildingId_Number] ON [Invoices] ([BuildingId], [Number]);

CREATE INDEX [IX_MaintenanceRequests_ApartmentId] ON [MaintenanceRequests] ([ApartmentId]);

CREATE INDEX [IX_MaintenanceRequests_BuildingId] ON [MaintenanceRequests] ([BuildingId]);

CREATE INDEX [IX_MaintenanceRequests_RequesterId] ON [MaintenanceRequests] ([RequesterId]);

CREATE INDEX [IX_Messages_ConversationId] ON [Messages] ([ConversationId]);

CREATE INDEX [IX_Messages_SenderId] ON [Messages] ([SenderId]);

CREATE INDEX [IX_Notifications_UserId] ON [Notifications] ([UserId]);

CREATE INDEX [IX_Payments_InvoiceId] ON [Payments] ([InvoiceId]);

CREATE INDEX [IX_Payments_PaidById] ON [Payments] ([PaidById]);

CREATE UNIQUE INDEX [IX_PermissionActions_Key] ON [PermissionActions] ([Key]);

CREATE UNIQUE INDEX [IX_RefreshTokens_Token] ON [RefreshTokens] ([Token]);

CREATE INDEX [IX_RefreshTokens_UserId] ON [RefreshTokens] ([UserId]);

CREATE INDEX [IX_RolePermissions_ActionId] ON [RolePermissions] ([ActionId]);

CREATE UNIQUE INDEX [IX_RolePermissions_Role_ScreenId_ActionId] ON [RolePermissions] ([Role], [ScreenId], [ActionId]);

CREATE INDEX [IX_RolePermissions_ScreenId] ON [RolePermissions] ([ScreenId]);

CREATE UNIQUE INDEX [IX_Screens_Key] ON [Screens] ([Key]);

CREATE INDEX [IX_Users_BuildingId] ON [Users] ([BuildingId]);

CREATE UNIQUE INDEX [IX_Users_Phone] ON [Users] ([Phone]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260710195236_InitialCreate', N'9.0.11');

COMMIT;
GO

