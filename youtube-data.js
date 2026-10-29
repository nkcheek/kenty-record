// ============================================================
//  YouTube ページの内容(上から順に表示されます)
//  ・新しい動画は、自動で足されます(数時間おきに、YouTubeの更新情報を見ています)
//  ・すでにある動画の title / comment は、手で直してかまいません(自動では上書きされません)
//  ・表示したくない動画は、{ } ごと消してください(新しい動画のうち、更新情報に残っているあいだは
//    また自動で足されることがあります)
//  ・url には、YouTubeの動画ページのURLをそのまま貼る(サムネイルは、ここから自動で取ります)
// ============================================================
const youtubeChannel = "https://www.youtube.com/@n_kento_official/videos";

const youtubeData = [
  {
    "date": "2026/10/29",
    "title": "耳を澄ましてソウルの脈動を聞いてみた",
    "comment": "撮影協力：韓国観光公社\nhttps://japanese.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=654&vcontsId=1591332\n\n\n台北、バンコク、そしてソウルへ。\nアジアツアーの最終日。\n\nU:nity のみんな、本当にありがとう\n\n------------------------------------\n\n■4thシングル「超☆HENSHIN」\n発売日：2026年12月1日(水)\nhttps://kentonakajima.lnk.to/CHO_HENSHIN_PKG\n\n■中島健人 Live Blu-ray & DVD\n『\"IDOL1ST 中島健人\" LIVE TOUR 2026 』\n発売日：2027年1月20日(水)\nhttps://kentonakajima.lnk.to/IDOL1ST_KentoNakajima_LIVETOUR2026_PKG\n\n------------------------------------\n\n【中島健人公式HP】\nhttps://www.nakajimakento.com/\n【中島健人公式Instagram】https://www.instagram.com/kento.nakajima_313\n【中島健人公式X】https://x.com/KENTO_Team_N\n【中島健人 Official YouTube】　https://www.youtube.com/@n_kento_official\n【中島健人公式TikTok】　https://www.tiktok.com/@kento_nakajima313",
    "url": "https://www.youtube.com/watch?v=ahnzkY-aYsk"
  },
  {
    "date": "2026/10/27",
    "title": "#中島健人 4th Single「超☆HENSHIN」2026.12.16 (Wed) Release!! #超HENSHIN",
    "comment": "",
    "url": "https://www.youtube.com/watch?v=QxfMPqkPIH0"
  },
  {
    "date": "2026/10/26",
    "title": "「最初はキュン！」KENTO with SB19 🌟#SB19 #SUMMERSONIC #中島健人 #最初はキュン",
    "comment": "",
    "url": "https://www.youtube.com/watch?v=Zp8n6oNTz-I"
  },
  {
    "date": "2026/10/14",
    "title": "【#中島健人】📢 ASIA TOURソウル公演 見逃し配信は10/16(金)まで‼️ 初披露した #Frequency を一部お届け🖤",
    "comment": "ASIA密着ドキュメントも絶賛配信中🎥\nhttps://hulu.jp/static/idol1st-kenty-asia-tour-2026/streaming/index.html\n\n#中島健人\n#KentoNakajima",
    "url": "https://www.youtube.com/watch?v=xXl3Wp7GKBw"
  },
  {
    "date": "2026/10/12",
    "title": "Kento Nakajima – Seoul Recap | IDOL1ST Asia Tour 2026 #KentoNakajima #中島健人 #Kenty",
    "comment": "",
    "url": "https://www.youtube.com/watch?v=sAVN3z-5NNE"
  },
  {
    "date": "2026/10/11",
    "title": "中島健人「Frequency」Dance Practice Video",
    "comment": "中島健人アジアツアー「\"\"IDOL1ST KENTY\"\" ASIA TOUR 2026」で初披露した「Frequency」のDance Practiceをソウルで撮影！\n\n「\"\"IDOL1ST KENTY\"\" ASIA TOUR 2026」の見逃しは10/16(金)までHuluにて配信！\nドキュメント番組も配信中！\nhttps://www.hulu.jp/static/idol1st-kenty-asia-tour-2026/streaming/index.html\n\n■中島健人 2nd アルバム『IDOL1ST』\nNO1アイドルとしてのプライドとともに人生を歩んできた中島健人が、\nアイドルを様々な視点から解釈した最上級の楽曲集を届けます。\n中島健人が送る至高のアイドルエンタテインメント作品、ぜひお楽しみに！\nhttps://kentonakajima.lnk.to/IDOL1STSpecialEdition\n\n■3rdシングル「鬼事 / Fiction Love」\nソロ初の両A面シングルとなる3rdシングル「鬼事 / Fiction Love」をリリース。 \n「鬼事」はTVアニメ「逃げ上手の若君」第二期オープニングテーマソング、\n「Fiction Love」は中島健人主演映画「ラブ≠コメディ」の主題歌となっています！\nぜひお楽しみください！\nhttps://kentonakajima.lnk.to/ONIGOTO_FictionLove_SE\n\n【中島健人公式HP】\nhttps://www.nakajimakento.com/\n【中島健人公式Instagram】https://www.instagram.com/kento.nakajima_313\n【中島健人公式X】https://x.com/KENTO_Team_N\n【中島健人 Official YouTube】　ht…",
    "url": "https://www.youtube.com/watch?v=KKvFlZ1PGEw"
  },
  {
    "date": "2026/10/10",
    "title": "「#Frequency」from 2nd Album『IDOL1ST』in Seoul🔊✧˚₊‧#中島健人 #KentoNakajima #Kenty",
    "comment": "",
    "url": "https://www.youtube.com/watch?v=VqZzHmpv4IE"
  },
  {
    "date": "2026/10/10",
    "title": "【#中島健人】ASIA TOURソウル公演が本日よりHuluにて配信スタート🎥 3000年前の魂を受け継ぎし #IDOL1ST の召喚を見逃すな🔥",
    "comment": "ASIA密着ドキュメントも、エピソード2話まで配信中☀\nhttps://hulu.jp/static/idol1st-kenty-asia-tour-2026/streaming/index.html\n\n#中島健人\n#KentoNakajima",
    "url": "https://www.youtube.com/watch?v=FtwhjxB4wpU"
  },
  {
    "date": "2026/10/09",
    "title": "#中島健人 #最初はキュン in Taipei🏮 #KentoNakajima #Kenty",
    "comment": "",
    "url": "https://www.youtube.com/watch?v=dyC6Ti5lW9k"
  },
  {
    "date": "2026/10/07",
    "title": "【#中島健人】ASIATOUR ソウル公演が10/10(土)よりHuluにて見逃し配信決定!!📢 #本音と建前 #KentoNakajima",
    "comment": "大歓声を浴びた新衣装でのパフォーマンスを一部お届け！\nASIAドキュメント番組も配信中🎥\n\nhttps://www.hulu.jp/static/idol1st-kenty-asia-tour-2026/streaming/index.html",
    "url": "https://www.youtube.com/watch?v=ThdPQcvVaOU"
  },
  {
    "date": "2026/10/07",
    "title": "【爆食】アジアツアー台北の夜",
    "comment": "U:nityとの出会いも美味しいご飯との巡り合わせも良い思い出。\n\nありがとうU:nity Taipei",
    "url": "https://youtu.be/B0a4H1DuHLs?si=rANybXcyerMmQWJX"
  },
  {
    "date": "2026/10/06",
    "title": "#中島健人 初のアジアツアーが無事終了しました✨ これからも世界へ #Kenty の音楽ををお届けしていきます🎁! #KentoNakajima #IDOL1ST #最初はキュン",
    "comment": "",
    "url": "https://www.youtube.com/watch?v=xrmUCuQgK1A"
  },
  {
    "date": "2026/10/04",
    "title": "#中島健人「#鬼事」Music Videoが1000万回再生を突破👹༺ˎˊ-",
    "comment": "Memory Photos を公開💐\n\nみなさんたくさんご視聴いただきありがとうございます‼\n引き続きお楽しみください！\n\n#KentoNakajima\n#逃げ上手の若君",
    "url": "https://www.youtube.com/watch?v=NvLXBXad-Gs"
  },
  {
    "date": "2026/09/15",
    "title": "【襲来⁉︎】漢江バスキング",
    "comment": "ソウル・漢江に集まってくれたU:nityと過ごした時間\n\nU:nity Seoul ありがとう。\n\n10月3. 4日オリンピックホールで",
    "url": "https://youtu.be/0sXtQ5iq-CM?si=W4eqr4fV_NrEnZTw"
  },
  {
    "date": "2026/09/13",
    "title": "Kento Nakajima – Bangkok Recap | IDOL1ST Asia Tour 2026",
    "comment": "",
    "url": "https://www.youtube.com/watch?v=rN_vYnSNYg4"
  },
  {
    "date": "2026/09/12",
    "title": "#中島健人 #鬼事 in Bangkok🐘🌟#ONIGOTO #KentoNakajima",
    "comment": "",
    "url": "https://www.youtube.com/watch?v=7gV7Rs18JKo"
  },
  {
    "date": "2026/09/10",
    "title": "ケンティーの魔法🪄#中島健人 #KentoNakajima #Kenty",
    "comment": "",
    "url": "https://www.youtube.com/watch?v=7eu_PE-tN8w"
  },
  {
    "date": "2026/09/09",
    "title": "「#Frequency」from 2nd Album『IDOL1ST』in Bangkok🔊✧˚₊‧#中島健人 #KentoNakajima #Kenty",
    "comment": "",
    "url": "https://www.youtube.com/watch?v=e9nDvKBFQg4"
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
    "comment": "アジアツアーのプロモーションでバンコクに行きました。\n仕事の合間の短い時間でも楽しかった。\n素敵です。\n\n古い友人にお土産も買いました。\n新しい友人にも出会いました。\nバンコク　ありがとう",
    "url": "https://youtu.be/5OJ8bxqGyYA?si=umAHdvly_rEFuq38"
  }
];
