@echo off
setlocal EnableDelayedExpansion

:: === Usage ===
:: buildScript_wav2ogg.bat "C:\input\wav" "C:\output\ogg"

if "%~1"=="" (
    echo [ERROR] Please provide an input folder.
    echo Usage: %~nx0 "C:\input" "C:\output"
    exit /b 1
)
if "%~2"=="" (
    echo [ERROR] Please provide an output folder.
    echo Usage: %~nx0 "C:\input" "C:\output"
    exit /b 1
)

set "IN=%~1"
set "OUT=%~2"

:: Make sure output folder exists
if not exist "%OUT%" (
    echo Creating output folder "%OUT%"
    mkdir "%OUT%"
)

:: Convert WAV files
for %%F in ("%IN%\*.wav") do (
    set "FILENAME=%%~nF"
    set "OUTFILE=%OUT%\!FILENAME!.ogg"

    if exist "!OUTFILE!" (
        echo Skipping "%%~nxF"
    ) else (
        echo Converting "%%~nxF" to "!OUTFILE!"
        ffmpeg -y -i "%%F" -c:a libvorbis "!OUTFILE!"
        if errorlevel 1 (
            echo [ERROR] Failed to convert "%%~nxF"
            exit /b 1
        )
    )
)

echo Done.
endlocal
exit /b 0
