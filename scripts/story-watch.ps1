# 保存ボタンを押すだけで、GitHubに反映されるようにする「見張り」スクリプト
#   ・取り込みフォルダ(下の $Inbox)に、ZIPや画像・動画が入ったら、自動で story-import.ps1 を動かす
#   ・ZIPがふだんの「ダウンロード」フォルダに保存される場合は、下の $ZipNameContains に
#     「ZIPの名前に含まれる言葉」を入れると、その名前のZIPだけを自動で取り込みフォルダに移す
#   ・動かしている間だけ、見張る(このウィンドウを閉じると止まる)
param(
    [string]$Inbox = "$env:USERPROFILE\Downloads\ig-story",   # 取り込みフォルダ
    [string]$Downloads = "$env:USERPROFILE\Downloads",         # ふだんのダウンロード先
    [string]$ZipNameContains = "",                              # ← ここに、ZIPの名前に含まれる言葉(例: instagram)
    [int]$Interval = 10                                         # 何秒ごとに見るか
)

$import = Join-Path $PSScriptRoot 'story-import.ps1'
$exts = '.zip', '.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov', '.m4v', '.webm'
$sizes = @{}

if (-not (Test-Path $Inbox)) { New-Item -ItemType Directory -Path $Inbox | Out-Null }

# ファイルが保存し終わったか(大きさが変わらず、開ける)を調べる
function Test-Ready($f) {
    $key = $f.FullName
    $same = ($sizes[$key] -eq $f.Length)
    $sizes[$key] = $f.Length
    if (-not $same) { return $false }
    try {
        $s = [IO.File]::Open($f.FullName, 'Open', 'ReadWrite', 'None')
        $s.Close()
        return $true
    }
    catch { return $false }
}

Write-Host "見張りを始めました。"
Write-Host "  取り込みフォルダ: $Inbox"
if ($ZipNameContains -ne "") { Write-Host "  ダウンロードフォルダの、名前に「$ZipNameContains」を含むZIPも、自動で取り込みます" }
Write-Host "止めるときは、このウィンドウを閉じてください。"

while ($true) {
    try {
        # 1) ダウンロードフォルダに、名前の合うZIPが保存されたら、取り込みフォルダに移す
        if ($ZipNameContains -ne "") {
            $zips = @(Get-ChildItem -Path $Downloads -File -Filter *.zip | Where-Object { $_.Name -like "*$ZipNameContains*" })
            foreach ($z in $zips) {
                if (Test-Ready $z) {
                    Move-Item -LiteralPath $z.FullName -Destination (Join-Path $Inbox $z.Name) -Force
                    Write-Host ("[" + (Get-Date -Format "HH:mm:ss") + "] ZIPを見つけました: " + $z.Name)
                }
            }
        }

        # 2) 取り込みフォルダにファイルがあれば、保存が終わるのを待ってから取り込む
        $files = @(Get-ChildItem -Path $Inbox -File | Where-Object { $exts -contains $_.Extension.ToLower() })
        if ($files.Count -gt 0) {
            $ready = $true
            foreach ($f in $files) { if (-not (Test-Ready $f)) { $ready = $false } }
            if ($ready) {
                Write-Host ("[" + (Get-Date -Format "HH:mm:ss") + "] 取り込みを始めます")
                & $import -Inbox $Inbox
                $sizes.Clear()
            }
        }
    }
    catch {
        Write-Host ("エラー: " + $_.Exception.Message)
    }
    Start-Sleep -Seconds $Interval
}
