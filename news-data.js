// ============================================================
//  Newsの記録(新しい順に自動で並びます)
//   ・公式サイト(https://www.nakajimakento.com/news/)のNewsを、記録として残すデータです
//   ・書くのは「日付」「種類」「タイトル」「リンク先」だけ。本文や画像は写しません
//   ・新しいNewsは、{ } を1つコピーして、いちばん上に足します
//     (前の { } のうしろに「,」を付ける。いちばん最後のうしろには付けない)
//   ・タイトルの中に「"」を使うときは、「\"」のように、前に「\」を付けます
//   ・トップページには新しい3件が出て、すべての記録は news.html で見られます
// ============================================================
const newsData = [
  { "date": "2026/10/19", "category": "Release", "title": "中島健人 Live Blu-ray & DVD『\"IDOL1ST 中島健人\" LIVE TOUR 2026』1/20(水)発売決定！", "url": "https://www.nakajimakento.com/news/" },
  { "date": "2026/10/19", "category": "Release", "title": "中島健人 4thシングル「超☆HENSHIN」12/16(水)発売決定！", "url": "https://www.nakajimakento.com/news/" },
  { "date": "2026/09/25", "category": "Media", "title": "メディア情報更新（ON VOICE Vol.5）", "url": "https://www.nakajimakento.com/news/" }
];
