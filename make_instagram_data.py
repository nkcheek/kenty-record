#!/usr/bin/env python3
"""images/story・images/feed・images/reel のファイルを見て、instagram-data.js を自動で作る。

ファイル名のきまり(半角):
  story : 20261009-1.jpg / 20261009-2.mp4 ...   (日付-番号.拡張子。同じ日は番号順に並ぶ)
  feed  : 20261005.jpg                           (同じ日に複数あるときは 20261005-2.jpg)
  reel  : 20261006.mp4                           (同じ日に複数あるときは 20261006-2.mp4)
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'instagram-data.js')
IMAGES = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
VIDEOS = {'.mp4', '.mov', '.webm', '.m4v'}
PATTERN = re.compile(r'^(\d{4})(\d{2})(\d{2})(?:-(\d+))?\.([A-Za-z0-9]+)$')


def scan(folder):
    items = []
    base = os.path.join(ROOT, 'images', folder)
    if not os.path.isdir(base):
        return items
    for name in sorted(os.listdir(base)):
        if name.startswith('.'):
            continue
        ext = os.path.splitext(name)[1].lower()
        m = PATTERN.match(name)
        if not m or ext not in IMAGES | VIDEOS or not (1 <= int(m.group(2)) <= 12 and 1 <= int(m.group(3)) <= 31):
            print(f'警告: ファイル名の形が合わないので使いません: images/{folder}/{name}')
            continue
        y, mo, d, n, _ = m.groups()
        items.append({
            'date': f'{y}/{mo}/{d}',
            'n': int(n or 0),
            'type': 'video' if ext in VIDEOS else 'image',
            'src': f'images/{folder}/{name}',
        })
    return items


old = open(OUT, encoding='utf-8').read() if os.path.exists(OUT) else ''
m = re.search(r'const instagramAccount = "([^"]*)";', old)
account = m.group(1) if m else 'https://www.instagram.com/'
urls = dict(re.findall(r'"src":\s*"([^"]+)",\s*"url":\s*"([^"]*)"', old))   # 手で入れた投稿のURLは残す

# Storys: 日付ごとにまとめる
days = {}
for it in scan('story'):
    days.setdefault(it['date'], []).append(it)
stories = [
    {'date': d, 'media': [{'type': x['type'], 'src': x['src']} for x in sorted(v, key=lambda x: (x['n'], x['src']))]}
    for d, v in sorted(days.items(), reverse=True)
]


def flat(folder):
    return [{'date': x['date'], 'type': x['type'], 'src': x['src'], 'url': urls.get(x['src'], '')}
            for x in sorted(scan(folder), key=lambda x: (x['date'], x['n']), reverse=True)]


data = {'stories': stories, 'feeds': flat('feed'), 'reels': flat('reel')}
header = '''// ============================================================
//  このファイルは自動で作られます(images/story・feed・reel のファイルから)。
//  ・画像や動画を、決まった名前でフォルダに入れるだけで、ここに反映されます
//  ・手で直しても、次の自動更新で上書きされます
//    (直してよいのは、下の instagramAccount のURLと、feeds / reels の url だけ)
// ============================================================
'''
with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
    f.write(header)
    f.write(f'const instagramAccount = "{account}";   // ← InstagramアカウントのURL\n\n')
    f.write('const instagramData = ' + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')
print(f'story {sum(len(s["media"]) for s in stories)}件 / feed {len(data["feeds"])}件 / reel {len(data["reels"])}件 を書き出しました')
