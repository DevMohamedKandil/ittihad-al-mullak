using DbUp;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;

namespace IttihadAlMullak.Infrastructure.Persistence;

/// <summary>
/// نظام DbUp — نفس نمط Afzaz (DbUpdater + SqlMigrationScripts):
///
/// - في التطوير: EF Migrations بتشتغل مباشرة (MigrateAsync) للسرعة.
/// - للتوزيع/الإنتاج: كل migration بيتحول لسكريبت SQL بـ Generate-Scripts.ps1
///   وبيتطبق هنا بـ DbUp، وبيتسجل في جدول SchemaVersions (مرة واحدة لكل سكريبت).
/// - الجسر BridgeEfHistory بينقل اللي اتطبق بـ EF لجدول SchemaVersions
///   عشان DbUp ميعيدش تنفيذ سكريبتات الـ migrations المتطبقة بالفعل (زي MoveMigrationsToSchemaVersions عندهم).
/// - السكريبتات اليدوية (Views، إصلاحات بيانات...) بتتحط في نفس الفولدر
///   باسم بتاريخ عشان الترتيب: yyyyMMddHHmmss_وصف.sql
/// </summary>
public static class SqlScriptRunner
{
    public static void Run(string connectionString, string scriptsPath, ILogger logger)
    {
        BridgeEfHistoryToSchemaVersions(connectionString);

        if (!Directory.Exists(scriptsPath) || Directory.GetFiles(scriptsPath, "*.sql").Length == 0)
        {
            logger.LogInformation("DbUp: no SQL scripts found in {Path}", scriptsPath);
            return;
        }

        var upgrader = DeployChanges.To
            .SqlDatabase(connectionString)
            .WithScriptsFromFileSystem(scriptsPath)
            .LogToConsole()
            .Build();

        if (!upgrader.IsUpgradeRequired())
        {
            logger.LogInformation("DbUp: all scripts already applied");
            return;
        }

        var result = upgrader.PerformUpgrade();
        if (!result.Successful)
            throw new InvalidOperationException($"DbUp script failed: {result.Error?.Message}", result.Error);

        logger.LogInformation("DbUp: applied {Count} script(s) successfully", result.Scripts.Count());
    }

    /// <summary>
    /// تسجيل الـ EF Migrations المتطبقة في SchemaVersions بنفس صيغة أسماء السكريبتات المولدة
    /// — نفس فكرة MoveMigrationsToSchemaVersions في Afzaz بالظبط.
    /// </summary>
    private static void BridgeEfHistoryToSchemaVersions(string connectionString)
    {
        using var connection = new SqlConnection(connectionString);
        connection.Open();
        using var command = connection.CreateCommand();
        command.CommandText = """
            IF OBJECT_ID(N'dbo.SchemaVersions', N'U') IS NULL
            BEGIN
                CREATE TABLE [dbo].[SchemaVersions] (
                    [Id] INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
                    [ScriptName] NVARCHAR(255) NOT NULL,
                    [Applied] DATETIME NOT NULL
                );
            END;

            IF OBJECT_ID(N'dbo.__EFMigrationsHistory', N'U') IS NOT NULL
            BEGIN
                INSERT INTO [dbo].[SchemaVersions] (ScriptName, Applied)
                SELECT h.MigrationId + '.sql', GETDATE()
                FROM [dbo].[__EFMigrationsHistory] h
                WHERE NOT EXISTS (
                    SELECT 1 FROM [dbo].[SchemaVersions] s WHERE s.ScriptName = h.MigrationId + '.sql'
                );
            END;
            """;
        command.ExecuteNonQuery();
    }
}
