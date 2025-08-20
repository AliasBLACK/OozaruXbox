@echo off
setlocal enabledelayedexpansion

set STAGE=staging
set ZIPFILE=glyphica.zip

if exist "%ZIPFILE%" del "%ZIPFILE%"

tar -a -cf "%ZIPFILE%" -C "%STAGE%" *
if errorlevel 1 (
    echo [ERROR] Failed to create zip!
    endlocal
    exit /b 1
)

echo Archive created: %ZIPFILE%
endlocal
exit /b 0
