<#
 Dev launcher for Viza Stock (Windows PowerShell)
 Starts backend (Spring Boot) and frontend (Vite) with sane defaults.
#>

param(
  [string]$Profile = "dev",
  [string]$ApiUrl = "http://localhost:8080/api",
  [switch]$Rebuild
)

$ErrorActionPreference = 'Stop'

# Set environment variables for this session
$env:SPRING_PROFILES_ACTIVE = $Profile
$env:VITE_API_URL = $ApiUrl

# Resolve project root and mvnw
$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Mvnw = Join-Path $Root "mvnw.cmd"

# Backup H2 database file before starting (safety net)
$DbFile = Join-Path $Root "data\dev-db.mv.db"
if (Test-Path $DbFile) {
  $BackupDir = Join-Path $Root "data\backups"
  if (-not (Test-Path $BackupDir)) { New-Item -ItemType Directory -Path $BackupDir | Out-Null }
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $BackupFile = Join-Path $BackupDir "dev-db-$stamp.mv.db"
  Copy-Item $DbFile $BackupFile -Force
  Write-Host "[dev] Backup H2 criado: $BackupFile" -ForegroundColor DarkGreen
}

# Build backend if needed
if ($Rebuild) {
  Write-Host "[dev] Compiling backend (skip tests)..." -ForegroundColor Cyan
  & $Mvnw -q compile -DskipTests
  if ($LASTEXITCODE -ne 0) { Write-Error "[dev] Compile failed" }
}

Write-Host "[dev] Starting backend (H2 dev) on http://localhost:8080 ..." -ForegroundColor Green
$backend = Start-Process -FilePath $Mvnw -ArgumentList "spring-boot:run" -WorkingDirectory $Root -PassThru

Write-Host "[dev] Starting frontend on http://localhost:5175 ..." -ForegroundColor Green
$FrontendCmd = "npm run dev"
$frontend = Start-Process -FilePath "powershell" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command `$`"$FrontendCmd`$`"" -PassThru

Write-Host "`n==================================================" -ForegroundColor Yellow
Write-Host " Dev environment launched" -ForegroundColor Yellow
Write-Host " Frontend: http://localhost:5175/" -ForegroundColor Yellow
Write-Host " Backend:  http://localhost:8080/api" -ForegroundColor Yellow
Write-Host " H2 Console: http://localhost:8080/h2-console (JDBC: jdbc:h2:file:./data/dev-db)" -ForegroundColor Yellow
Write-Host " Stop: close the spawned PowerShell windows" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Yellow