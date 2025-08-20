call buildScript_wav2ogg.bat "..\Assets\oozaru\dist\sounds" "sounds" && ^
rollup -c && ^
call buildScript_buildStaging.bat && ^
call buildScript_directoryParser.bat ".\staging\dist" && ^
call buildScript_buildZip.bat