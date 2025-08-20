@echo off
setlocal enabledelayedexpansion

:: Ensure all paths are relative to this batch file
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

set STAGE=staging

rem === Cleanup old staging folder ===
if exist "%STAGE%" rmdir /s /q "%STAGE%"
mkdir "%STAGE%"

rem === Step 1: Copy root files from ../Assets/oozaru ===
copy "..\Assets\oozaru\index.html" "%STAGE%\" >nul
copy "..\Assets\oozaru\oozaru.json" "%STAGE%\" >nul
copy "..\Assets\oozaru\styles.css" "%STAGE%\" >nul

rem === Step 2: Copy oozaru folders ===
xcopy /E /I /Y "..\Assets\oozaru\runtime" "%STAGE%\runtime\" >nul
xcopy /E /I /Y "..\Assets\oozaru\scripts" "%STAGE%\scripts\" >nul
xcopy /E /I /Y "..\Assets\oozaru\assets" "%STAGE%\assets\" >nul

rem === Step 3: Copy dist excluding scripts and sounds ===
robocopy "..\Assets\oozaru\dist" "%STAGE%\dist" /E /XD scripts sounds >nul

rem === Step 4: Copy JSON files from dist/scripts/data ===
if not exist "%STAGE%\dist\scripts\data" mkdir "%STAGE%\dist\scripts\data"
copy "..\Assets\oozaru\dist\scripts\data\audioHooks.jsonc" "%STAGE%\dist\scripts\data\" >nul
copy "..\Assets\oozaru\dist\scripts\data\bgmSets.jsonc" "%STAGE%\dist\scripts\data\" >nul

rem === Step 5: Move main.js into dist/scripts/core ===
if not exist "%STAGE%\dist\scripts\core" mkdir "%STAGE%\dist\scripts\core"
move "%SCRIPT_DIR%main.js" "%STAGE%\dist\scripts\core\" >nul

rem === Step 6: Move sounds folder from bat directory to dist ===
xcopy /E /I /Y "%SCRIPT_DIR%sounds" "%STAGE%\dist\sounds\" >nul

echo Staging folder created: %STAGE%
endlocal
exit /b 0
