$releaseFile = ".\rogue-trader.zip"
$destinationFolder = '..\..\FoundryVTT\Data\systems\rogue-trader'

Invoke-Expression -command .\createReleaseZip.ps1
Remove-Item $destinationFolder\* -Recurse
Expand-Archive -Path $releaseFile -DestinationPath $destinationFolder