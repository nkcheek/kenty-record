// ============================================================
//  Instagram ページの内容(新しい順に自動で並びます)
//   ・画像や動画は images/ig フォルダなどに入れて、src にその場所を書く
//     (動画は mp4。src を "" にすると、仮の青い四角が出ます)
//   ・Storys: 同じ日付に複数あるときは media の中に { } を並べる
//     (表示のときにタップすると、順番に切り替わります)
//   ・Feeds / Reels: 1投稿ぶんが { } 1つ。url にInstagramの投稿のURLを入れると、
//     詳細画面から元の投稿に飛べます(省略可)
//   ・{ } の間は「,」で区切る。いちばん最後のうしろには付けない。「"」「,」は半角
// ============================================================
const instagramAccount = "https://www.instagram.com/";   // ← InstagramアカウントのURLに書き換える

const instagramData = {
  stories: [
    { "date": "2026/10/09", "media": [ { "type": "image", "src": "" }, { "type": "video", "src": "" } ] },
    { "date": "2026/10/08", "media": [ { "type": "video", "src": "" } ] },
    { "date": "2026/10/07", "media": [ { "type": "image", "src": "" } ] },
    { "date": "2026/09/28", "media": [ { "type": "image", "src": "" } ] },
    { "date": "2026/09/12", "media": [ { "type": "image", "src": "" }, { "type": "image", "src": "" } ] },
    { "date": "2026/08/20", "media": [ { "type": "video", "src": "" } ] }
  ],
  feeds: [
    { "date": "2026/10/05", "type": "image", "src": "", "url": "" },
    { "date": "2026/10/01", "type": "image", "src": "", "url": "" },
    { "date": "2026/09/25", "type": "image", "src": "", "url": "" },
    { "date": "2026/09/18", "type": "image", "src": "", "url": "" },
    { "date": "2026/09/10", "type": "image", "src": "", "url": "" },
    { "date": "2026/09/02", "type": "image", "src": "", "url": "" }
  ],
  reels: [
    { "date": "2026/10/06", "type": "video", "src": "", "url": "" },
    { "date": "2026/09/30", "type": "video", "src": "", "url": "" },
    { "date": "2026/09/22", "type": "video", "src": "", "url": "" },
    { "date": "2026/09/14", "type": "video", "src": "", "url": "" },
    { "date": "2026/09/06", "type": "video", "src": "", "url": "" },
    { "date": "2026/08/29", "type": "video", "src": "", "url": "" }
  ]
};
