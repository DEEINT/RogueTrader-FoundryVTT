$target = '.\release'
$targetFile = ".\rogue-trader.zip"

New-Item -Path $target -ItemType Directory -ErrorAction SilentlyContinue

#gulp buildAll

Copy-Item -Path ".\asset" -Destination $target -Recurse
Copy-Item -Path ".\lang" -Destination $target -Recurse
Copy-Item -Path ".\logo" -Destination $target -Recurse
Copy-Item -Path ".\template" -Destination $target -Recurse
Copy-item -Path ".\CONTRIBUTING.md" -Destination $target
Copy-item -Path ".\README.md" -Destination $target
Copy-item -Path ".\LICENSE" -Destination $target
Copy-item -Path ".\system.json" -Destination $target
Copy-item -Path ".\template.json" -Destination $target

if(Test-Path -Path $targetFile -PathType Leaf) {
	Remove-Item $targetFile
}

$compress = @{
	Path = "$target\*"
	CompressionLevel = "Optimal"
	DestinationPath = $targetFile
}
Compress-Archive @compress

Remove-Item $target -Recurse