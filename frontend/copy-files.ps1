# Установка кодировки UTF-8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Получаем путь к директории скрипта
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Пути к исходным папкам (абсолютные)
$sourceFolders = @(

    (Join-Path $scriptPath "assets")
    (Join-Path $scriptPath "compasobles")
    (Join-Path $scriptPath "components")
    (Join-Path $scriptPath "layouts")
(Join-Path $scriptPath "middleware")
(Join-Path $scriptPath "pages")
(Join-Path $scriptPath "plugins")
(Join-Path $scriptPath "stores")
(Join-Path $scriptPath "types")
(Join-Path $scriptPath "utils")

)

# Путь к целевой папке (абсолютный)
$destinationFolder = Join-Path $scriptPath "output_files"

Write-Host "Script directory: $scriptPath"
Write-Host "Destination folder will be: $destinationFolder"

Write-Host "Starting file copy process..."

# Создаем целевую папку, если она не существует
if (-not (Test-Path -Path $destinationFolder)) {
    New-Item -ItemType Directory -Path $destinationFolder
    Write-Host "Created destination folder: $destinationFolder"
}

# Папки для исключения
$excludeFolders = @("node_modules", ".nuxt", ".output", "dist")

# Расширения файлов для копирования
$extensions = @("*.css", "*.vue", "*.ts")

$filesCopied = 0

try {
    foreach ($sourceFolder in $sourceFolders) {
        Write-Host "`nProcessing folder: $sourceFolder"
        
        if (Test-Path -Path $sourceFolder) {
            foreach ($extension in $extensions) {
                Write-Host "  Looking for files: $extension"
                
                $files = Get-ChildItem -Path $sourceFolder -Filter $extension -Recurse | 
                Where-Object { 
                    $filePath = $_.FullName
                    $exclude = $false
                    foreach ($excludeFolder in $excludeFolders) {
                        if ($filePath -match "\\$excludeFolder\\") {
                            $exclude = $true
                            break
                        }
                    }
                    -not $exclude
                }

                foreach ($file in $files) {
                    Copy-Item -Path $file.FullName -Destination $destinationFolder
                    Write-Host "    Copied: $($file.Name)" -ForegroundColor Green
                    $filesCopied++
                }
            }
        } else {
            Write-Host "Folder not found: $sourceFolder" -ForegroundColor Yellow
        }
    }

    Write-Host "`nCopy process completed!" -ForegroundColor Green
    Write-Host "Total files copied: $filesCopied" -ForegroundColor Green
    
} catch {
    Write-Host "`nAn error occurred!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} finally {
    Write-Host "`nPress any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}