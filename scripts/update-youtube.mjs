// 中島健人 Official YouTube Channel の新しい動画を見つけて、youtube-data.js に足すスクリプト。
//  ・YouTube が公開している「更新情報(RSS)」を読みます(ログインや特別な許可は要りません)
//  ・すでに youtube-data.js にある動画は、そのまま残します(手で直したタイトルやコメントも消えません)
//  ・新しい動画だけ、日付・タイトル・説明文(コメント)を足して、新しい順に並べます
import fs from 'node:fs';

const CHANNEL_ID = 'UCcsoW1li0k6A2MXdmXEpTjA';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const FILE = new URL('../youtube-data.js', import.meta.url);
const MAX_COMMENT = 800;   // コメントの最大の長さ

// ----- いまの youtube-data.js を読む -----
const src = fs.readFileSync(FILE, 'utf8');
let channel, old;
try {
  ({ channel, old } = new Function(src + '\nreturn { channel: youtubeChannel, old: youtubeData };')());
} catch (e) {
  console.error('youtube-data.js を読めません(書き方の間違いかもしれません)。上書きせずに終わります:', e.message);
  process.exit(1);
}

const idOf = (url) => ((url || '').match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/) || [])[1] || '';
const known = new Set(old.map((v) => idOf(v.url)).filter(Boolean));

// ----- YouTube の更新情報を読む -----
let xml;
if (process.env.FEED_FILE) {
  xml = fs.readFileSync(process.env.FEED_FILE, 'utf8');          // 試験用
} else {
  const res = await fetch(FEED_URL, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; kenty-record-updater)' } });
  if (!res.ok) { console.error('YouTube の更新情報を取れませんでした: HTTP ' + res.status); process.exit(1); }
  xml = await res.text();
}

const decode = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
const tag = (x, name) => {
  const m = x.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]).trim() : '';
};
const jstDate = (iso) => {                                         // 日本の日付(yyyy/mm/dd)
  const d = new Date(new Date(iso).getTime() + 9 * 3600 * 1000);
  return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`;
};

const fresh = [];
for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
  const x = m[1];
  const id = tag(x, 'yt:videoId');
  if (!id || known.has(id)) continue;
  let comment = tag(x, 'media:description').replace(/\r\n/g, '\n').trim();
  if (comment.length > MAX_COMMENT) comment = comment.slice(0, MAX_COMMENT) + '…';
  fresh.push({ date: jstDate(tag(x, 'published')), title: tag(x, 'title'), comment, url: `https://www.youtube.com/watch?v=${id}` });
  known.add(id);
}

if (fresh.length === 0) { console.log('新しい動画はありません。'); process.exit(0); }
console.log(`新しい動画: ${fresh.length}本`);
fresh.forEach((v) => console.log(`  ${v.date}  ${v.title}`));

// ----- 新しい順にそろえて書き出す(同じ日付なら、新しく足したものを先に) -----
const all = [...fresh, ...old].sort((a, b) => b.date.localeCompare(a.date));
const header = `// ============================================================
//  YouTube ページの内容(上から順に表示されます)
//  ・新しい動画は、自動で足されます(数時間おきに、YouTubeの更新情報を見ています)
//  ・すでにある動画の title / comment は、手で直してかまいません(自動では上書きされません)
//  ・表示したくない動画は、{ } ごと消してください(新しい動画のうち、更新情報に残っているあいだは
//    また自動で足されることがあります)
//  ・url には、YouTubeの動画ページのURLをそのまま貼る(サムネイルは、ここから自動で取ります)
// ============================================================
`;
const out = header + `const youtubeChannel = ${JSON.stringify(channel)};\n\nconst youtubeData = ${JSON.stringify(all, null, 2)};\n`;
fs.writeFileSync(FILE, out);
