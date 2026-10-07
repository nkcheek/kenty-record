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
    "comment": "U:nityとの出会いも美味しいご飯との巡り合わせも良い思い出。

ありがとうU:nity Taipei",
    "url": "https://youtu.be/B0a4H1DuHLs?si=rANybXcyerMmQWJX"   // ← 例: https://www.youtube.com/watch?v=xxxxxxxxxxx
  },
  {
    "date": "2026/09/15",
    "title": "【襲来⁉︎】漢江バスキング",
    "comment": "ソウル・漢江に集まってくれたU:nityと過ごした時間

U:nity Seoul ありがとう。

10月3. 4日オリンピックホールで",
    "url": "https://youtu.be/0sXtQ5iq-CM?si=W4eqr4fV_NrEnZTw"
  },
  {
    "date": "2026/09/08",
    "title": "【K-POPの友達】同じ誕生日のボムギュと韓国で遊んだ",
    "comment": "いやぁ、好きだね。
ボムギュ。
なんか似てるのよ。空気感が。
多分同い年だったら、ライバルだったかも。笑
それくらいかっこいい。
それくらい好き。
この想いはCan't Stopで最初はキュンだよね。

韓国にバスキング行った帰りに
一緒に遊びました。
HYBE大きかったです。たのしい

今度は、僕の家にくるみたいです。ボムギュヤ
",
    "url": "https://youtu.be/a6cSGxEdewQ?si=qOW3J1MCR4CsXyeO"
  }
];
