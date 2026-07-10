# توليد سكريبت SQL لكل EF Migration — نفس نمط Generate-Scripts.ps1 في Afzaz
# الاستخدام: .\Generate-Scripts.ps1  (من فولدر ittihad-backend)
# الناتج بيتحط في SqlScripts وبيتطبق تلقائياً بـ DbUp عند تشغيل الـ API

param(
    [string]$OutputDir = ".\src\IttihadAlMullak.Api\SqlScripts\"
)

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

Write-Host "Fetching migrations..."
$migrations = dotnet ef migrations list --project .\src\IttihadAlMullak.Infrastructure --startup-project .\src\IttihadAlMullak.Api --no-build
$migrationList = $migrations -split "`n" | Where-Object { $_ -match '^\d{14}_' } | ForEach-Object { ($_ -replace '\s*\(Pending\)$', '').Trim() }

if ($migrationList.Count -eq 0) {
    Write-Host "No migrations found."
    exit 1
}

Write-Host "Found $($migrationList.Count) migrations."

$previous = "0"
foreach ($migration in $migrationList) {
    $file = Join-Path $OutputDir "$migration.sql"
    if (Test-Path $file) {
        Write-Host "skip (exists): $migration"
    }
    else {
        Write-Host "generating: $migration"
        dotnet ef migrations script $previous $migration --project .\src\IttihadAlMullak.Infrastructure --startup-project .\src\IttihadAlMullak.Api --output $file --no-build
    }
    $previous = $migration
}

Write-Host "Done. Scripts in $OutputDir"
