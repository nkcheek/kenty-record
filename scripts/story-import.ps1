# Instagramのストーリーを、images\story に取り込んで、GitHubに送るスクリプト
#   1. 保存したファイル(ZIPのままでOK)を「取り込みフォルダ」に入れておく(下の $Inbox)
#   2. このスクリプトを動かすと、ZIPを開き、名前を「日付-番号」に直して images\story に移し、
#      Commit と Push まで行う(あとはGitHub側で instagram-data.js が自動で更新される)
param(
    [string]$Inbox = "$env:USERPROFILE\Downloads\ig-story",   # 保存したファイルを入れるフォルダ
    [string]$Date = "",                                        # 日付を指定したいとき(例: 20261010)。空なら、ファイルの日付
    [switch]$NoPush                                            # 付けると、取り込みだけで、GitHubには送らない
)

$Repo = Split-Path -Parent $PSScriptRoot
$Dest = Join-Path $Repo 'images\story'
$Done = Join-Path $Inbox 'done'
$exts = '.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov', '.m4v', '.webm'

foreach ($d in @($Inbox, $Dest)) {
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d | Out-Null }
}

# ZIPで保存されたものは、いったん一時フォルダに開く
$tmp = Join-Path $env:TEMP ("ig-story-" + [guid]::NewGuid().ToString('N'))
$zips = @(Get-ChildItem -Path $Inbox -File -Filter *.zip)
foreach ($z in $zips) {
    $to = Join-Path $tmp ([IO.Path]::GetFileNameWithoutExtension($z.Name))
    try {
        Expand-Archive -LiteralPath $z.FullName -DestinationPath $to -Force
    }
    catch {
        Write-Host "ZIPを開けませんでした: $($z.Name)"
    }
}

# 取り込むファイル = フォルダ直下のファイル + ZIPの中のファイル(古い順)
$sources = @(Get-ChildItem -Path $Inbox -File | Where-Object { $exts -contains $_.Extension.ToLower() })
if (Test-Path $tmp) {
    $sources += @(Get-ChildItem -Path $tmp -File -Recurse | Where-Object { $exts -contains $_.Extension.ToLower() })
}
$files = @($sources | Sort-Object LastWriteTime, Name)

if ($files.Count -eq 0) {
    Write-Host "取り込むファイルがありません。次のフォルダに、保存したファイル(ZIPでも可)を入れてください:"
    Write-Host "  $Inbox"
    if (Test-Path $tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force }
    exit 0
}

$moved = 0
foreach ($f in $files) {
    if ($Date -ne "") { $day = $Date } else { $day = $f.LastWriteTime.ToString('yyyyMMdd') }
    if ($day -notmatch '^\d{8}$') { Write-Host "日付の形が正しくありません: $day"; exit 1 }

    # その日の、いちばん大きい番号の次を使う
    $max = 0
    foreach ($e in Get-ChildItem -Path $Dest -File -Filter "$day-*") {
        if ($e.BaseName -match '^\d{8}-(\d+)$') {
            $n = [int]$Matches[1]
            if ($n -gt $max) { $max = $n }
        }
    }
    $newName = "{0}-{1}{2}" -f $day, ($max + 1), $f.Extension.ToLower()
    Move-Item -LiteralPath $f.FullName -Destination (Join-Path $Dest $newName)
    Write-Host "取り込みました: $($f.Name)  ->  images\story\$newName"
    $moved++
}
Write-Host "$moved 件を取り込みました。"

# 開いたZIPは、done フォルダに移しておく(あとで消してOK)
if ($zips.Count -gt 0) {
    if (-not (Test-Path $Done)) { New-Item -ItemType Directory -Path $Done | Out-Null }
    foreach ($z in $zips) {
        $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
        Move-Item -LiteralPath $z.FullName -Destination (Join-Path $Done ($stamp + "-" + $z.Name))
    }
}
if (Test-Path $tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force }

if ($NoPush) { exit 0 }

$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
    Write-Host "Git が見つかりません。GitHub Desktop を開いて、Commit と Push をしてください。"
    exit 0
}

Push-Location $Repo
try {
    git add images/story
    git commit -m ("Add stories " + (Get-Date -Format "yyyy-MM-dd"))
    if ($LASTEXITCODE -ne 0) { Write-Host "Commit できませんでした。"; exit 1 }
    git pull --rebase
    git push
    if ($LASTEXITCODE -ne 0) { Write-Host "Push できませんでした。GitHub Desktop で確認してください。"; exit 1 }
    Write-Host "GitHubに送りました。1〜2分後に、サイトに反映されます。"
}
finally {
    Pop-Location
}
