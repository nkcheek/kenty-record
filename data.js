// ============================================================
//  毎週の追加のしかた
//   1. 文字起こしを「メモ帳」に貼り付け、txt フォルダに
//      「放送日.txt」（例: 20261010.txt）で保存する（文字コードは UTF-8）
//   2. 音声ファイルを audio フォルダに入れる（例: 20261010.mp3）
//   3. 下のリストの最後の } のうしろに「,」を付け、
//      その下に、次のひな形をコピーして貼り、中身を書き換える
//
//   ---- ひな形（ここから）----
//   {
//     "id": "ep80",
//     "date": "2026/10/10",
//     "episode": "第80回",
//     "title": "中島健人のエヌトワ",
//     "audio": "audio/20261010.mp3",
//     "transcript": "txt/20261010.txt",
//     "image": "images/20261010.jpg",   ← Xの投稿の画像(省略可。なければ仮の写真)
//     "links": [
//       { "title": "公式Xポスト", "url": "ここにURL" }
//     ],
//     "terms": []
//   }
//   ---- ひな形（ここまで）----
//
//   ※ 回と回の間は「,」で区切る。いちばん最後の } のうしろには付けない。
//   ※ 「 " 」や「,」は半角で書く。
// ============================================================

const radioData = [
  {
    "id": "ep76",
    "date": "2026/09/12",
    "episode": "第76回",
    "title": "中島健人のエヌトワ",
    "audio": "audio/20260912.mp3",
    "transcript": "txt/20260912.txt",
    "image": "image/20260912.jpg",
    "links": [
      {
        "title": "公式Xポスト",
        "url": "https://x.com/ntowa78MHz/status/2098703160995160331?s=20"
      }
    ],
    "terms": []
  },
  {
    "id": "ep77",
    "date": "2026/09/19",
    "episode": "第77回",
    "title": "中島健人のエヌトワ",
    "audio": "audio/20260919.mp3",
    "transcript": "txt/20260919.txt",
    "image": "image/20260919.jpg",
    "links": [
      {
        "title": "公式Xポスト",
        "url": "https://x.com/ntowa78MHz/status/2101239875949203502?s=20"
      }
    ],
    "terms": []
  },
  {
    "id": "ep78",
    "date": "2026/09/26",
    "episode": "第78回",
    "title": "中島健人のエヌトワ",
    "audio": "audio/20260926.mp3",
    "transcript": "txt/20260926.txt",
    "image": "image/20260926.jpg",
    "links": [
      {
        "title": "公式Xポスト",
        "url": "https://x.com/ntowa78MHz/status/2103776591264551074?s=20"
      }
    ],
    "terms": []
  },
  {
    "id": "ep79",
    "date": "2026/10/03",
    "episode": "第79回",
    "title": "中島健人のエヌトワ",
    "audio": "audio/20261003.mp3",
    "transcript": "txt/20261003.txt",
    "image": "image/20261003.jpg",
    "links": [
      {
        "title": "公式Xポスト",
        "url": "https://x.com/ntowa78MHz/status/2106313306483109998?s=20"
      }
    ],
    "terms": []
  }
];
