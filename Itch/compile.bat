call buildScript_wav2ogg.bat "..\Assets\oozaru\dist\sounds" "sounds" && ^
rollup -c && ^
call buildScript_buildStaging.bat && ^
if not exist "staging\dist\scripts\data\shaders" mkdir "staging\dist\scripts\data\shaders" && ^
xcopy /E /I /Y "shaders" "staging\dist\scripts\data\shaders" >nul && ^
call buildScript_directoryParser.bat ".\staging\dist" && ^
call buildScript_buildZip.bat