$path = 'C:/Frontend/moon-flovers/moon-flowers/src/components/ui/bonus-counter/useBonusCounter.ts'
$bytes = [System.IO.File]::ReadAllBytes($path)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)

$start = $content.IndexOf("const pointDigits")
$end = $content.IndexOf("};", $start) + 2

$newBlock = "const pointDigits = Math.max(0, points).toString().split(`"`");`r`n`r`n  return {`r`n    points,`r`n    isReady,`r`n    pointDigits,`r`n    isMaxed: points >= 500,`r`n  };"

$result = $content.Substring(0, $start) + $newBlock + $content.Substring($end)
[System.IO.File]::WriteAllText($path, $result, (New-Object System.Text.UTF8Encoding $false))
Write-Host "DONE"
