@echo off
setlocal EnableExtensions EnableDelayedExpansion

:: USAGE: genfsjson_grouped.bat [rootDir] [outputFile]
set "ROOT=%~1"
if "%ROOT%"=="" set "ROOT=%CD%"
set "OUT=%~2"
if "%OUT%"=="" set "OUT=%CD%\directories.js"

pushd "%ROOT%" >nul 2>&1 || (echo [ERROR] Can't cd into "%ROOT%". & exit /b 1)

set "BASE=%CD%"
set "BASEPAT=%BASE%"
if not "%BASEPAT:~-1%"=="\" set "BASEPAT=%BASEPAT%\"

> "%OUT%" echo export default {

set "COUNT=0"

:: Get all directories including root
for /f "delims=" %%D in ('dir /b /s /ad') do (
    set "REL=%%~fD"
    set "REL=!REL:%BASEPAT%=!"
    if "!REL!"=="" (
        set "DISPLAY=@/"
        set "REALPATH=%BASEPAT%"
    ) else (
        set "DISPLAY=@/!REL:\=/!"
        set "REALPATH=%BASEPAT%!REL!"
    )

    set /a COUNT+=1
    if !COUNT! gtr 1 >> "%OUT%" echo ,

    >> "%OUT%" echo   "!DISPLAY!": [

    set "ITEMCOUNT=0"

    :: --- Directories first ---
    for /f "delims=" %%E in ('dir /b /a:d "!REALPATH!" 2^>nul') do (
        set "SUBDISPLAY=!DISPLAY!/%%E"
        set "SUBDISPLAY=!SUBDISPLAY:@//=@/!"
        set /a ITEMCOUNT+=1
        if !ITEMCOUNT! gtr 1 >> "%OUT%" echo ,
        >> "%OUT%" echo     {"isDirectory":true,"fileName":"%%E","fullPath":"!SUBDISPLAY!","depth":0,"extension":""}
    )

    :: --- Files ---
    for /f "delims=" %%F in ('dir /b /a:-d "!REALPATH!" 2^>nul') do (
        set "EXT=%%~xF"
        set "SUBDISPLAY=!DISPLAY!/%%F"
        set "SUBDISPLAY=!SUBDISPLAY:@//=@/!"
        set /a ITEMCOUNT+=1
        if !ITEMCOUNT! gtr 1 >> "%OUT%" echo ,
        >> "%OUT%" echo     {"isDirectory":false,"fileName":"%%F","fullPath":"!SUBDISPLAY!","depth":0,"extension":"!EXT!"}
    )

    >> "%OUT%" echo   ]
)

>> "%OUT%" echo }
popd >nul
echo Wrote grouped manifest to "%OUT%"
exit /b 0
