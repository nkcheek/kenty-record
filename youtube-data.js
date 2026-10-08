// ============================================================
//  YouTube ページの内容（上から順に表示されます）
//   1. 下の youtubeChannel を、チャンネルのURLに書き換える
//   2. 動画を足すときは { ... } を1つコピーして、最後の ] の前に貼る
//      （前の } のうしろに「,」を付けるのを忘れずに）
//   3. url には、YouTubeの動画ページのURLをそのまま貼る
//      サムネイルは、このURLから自動で取ってきます
// ============================================================
const youtubeChannel = "https://www.youtube.com/@n_kento_official/videos";   // ← チャンネルのURLに書き換える

const youtubeData = [
  {
    "date": "2026/10/07",
    "title": "【爆食】アジアツアー台北の夜",
    "comment": "U:nityとの出会いも美味しいご飯との巡り合わせも良い思い出。\n\nありがとうU:nity Taipei",
    "url": "https://youtu.be/B0a4H1DuHLs?si=rANybXcyerMmQWJX"
  },
  {
    "date": "2026/09/15",
    "title": "【襲来⁉︎】漢江バスキング",
    "comment": "ソウル・漢江に集まってくれたU:nityと過ごした時間\n\nU:nity Seoul ありがとう。\n\n10月3. 4日オリンピックホールで",
    "url": "https://youtu.be/0sXtQ5iq-CM?si=W4eqr4fV_NrEnZTw"
  },
  {
    "date": "2026/09/08",
    "title": "【K-POPの友達】同じ誕生日のボムギュと韓国で遊んだ",
    "comment": "いやぁ、好きだね。\nボムギュ。\nなんか似てるのよ。空気感が。\n多分同い年だったら、ライバルだったかも。笑\nそれくらいかっこいい。\nそれくらい好き。\nこの想いはCan't Stopで最初はキュンだよね。\n\n韓国にバスキング行った帰りに\n一緒に遊びました。\nHYBE大きかったです。たのしい\n\n今度は、僕の家にくるみたいです。ボムギュヤ",
    "url": "https://youtu.be/a6cSGxEdewQ?si=qOW3J1MCR4CsXyeO"
  },
  {
    "date": "2026/09/04",
    "title": "バンコクで薔薇500本配った。",
    "comment": "バンコクで薔薇500本配りました。\n\nバスキングも。みてね。",
    "url": "https://youtu.be/gLGGXh2L684?si=0gEac8o3x8rI8_9g"
  },
  {
    "date": "2026/08/28",
    "title": "バンコクで楽しい一夜を過ごしてみた",
    "comment": "アジアツアーのプロモーションでバンコクに行きました。
仕事の合間の短い時間でも楽しかった。\n素敵です。\n\n古い友人にお土産も買いました。\n新しい友人にも出会いました。\nバンコク　ありがとう",
    "url": "https://youtu.be/5OJ8bxqGyYA?si=umAHdvly_rEFuq38"
  },
];
