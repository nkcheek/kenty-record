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
    { "date": "2026/10/10", "media": [
        { "type": "video", "src": "images/story/20261010-1.mp4" }
    
    ] },
    { "date": "2026/10/09", "media": [
        { "type": "image", "src": "images/story/20261009-1.mp4" },
        { "type": "video", "src": "images/story/20261009-2.jpg" },
        { "type": "video", "src": "images/story/20261009-3.mp4" },
        { "type": "video", "src": "images/story/20261009-4.mp4" },
        { "type": "video", "src": "images/story/20261009-5.mp4" },
        { "type": "image", "src": "images/story/20261009-6.mp4" },
        { "type": "video", "src": "images/story/20261009-7.jpg" }
    ] },
    { "date": "2026/10/08", "media": [
        { "type": "video", "src": "images/story/2026108-1.mp4" },
        { "type": "video", "src": "images/story/20261008-2.mp4" },
        { "type": "video", "src": "images/story/20261008-3.mp4" },
        { "type": "video", "src": "images/story/20261008-4.mp4" }
    ] }
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
