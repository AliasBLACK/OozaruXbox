xcopy "..\Assets\oozaru\dist\scripts\data\audioHooks.jsonc" ".\dist\scripts\data\"  /Y /I && ^
xcopy "..\Assets\oozaru\dist\scripts\data\bgmSets.jsonc" ".\dist\scripts\data\"  /Y /I && ^
wav2ogg.bat "..\Assets\oozaru\dist\sounds" ".\dist\sounds" && ^
directoryParser.bat ".\dist" && ^
rollup -c && tar -a -h -cf glyphica.zip assets dist runtime scripts index.html oozaru.json styles.css directories.js