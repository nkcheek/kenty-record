document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cardContainer');
  const searchInput = document.getElementById('searchInput');
  const modal = document.getElementById('detailModal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('closeBtn');

  // data.js が読み込めていない（書き方の間違いなど）場合は、画面にお知らせを出す
  if (typeof radioData === 'undefined' || !Array.isArray(radioData)) {
    container.innerHTML =
      '<p class="no-result">データ（data.js）を読み込めませんでした。' +
      'data.js の書き方（カンマ「,」・引用符「"」・かっこ「{ } [ ]」）を確認してください。</p>';
    return;
  }

  // ===== 文字起こしの読み込み =====
  // item.transcript が「〜.txt」のとき、そのファイルを読み込む
  // （従来どおり data.js に直接書いた文章も、そのまま表示できる）
  const transcripts = {}; // id -> 本文（読み込み失敗は null）
  let currentItem = null;

  function isFilePath(value) {
    return typeof value === 'string' && /\.txt$/i.test(value.trim()) && !/\n/.test(value);
  }

  const loadAll = Promise.allSettled(
    radioData.map(async (item) => {
      if (!isFilePath(item.transcript)) return;
      try {
        const res = await fetch(item.transcript.trim());
        if (!res.ok) throw new Error('HTTP ' + res.status);
        transcripts[item.id] = await res.text();
      } catch (e) {
        transcripts[item.id] = null;
      }
    })
  );

  // 検索や表示で使う本文を返す（まだ読み込み中なら undefined、失敗なら null）
  function getTranscriptText(item) {
    if (!item.transcript) return '';
    if (isFilePath(item.transcript)) return transcripts[item.id];
    return item.transcript;
  }

  // ===== 文字起こしを表示用に整える =====
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // 空行で区切った段落ごとに <i> と </i> の数をそろえる（閉じ忘れ・開き忘れの対策）
  function balanceItalic(block) {
    const opens = (block.match(/<i>/g) || []).length;
    const closes = (block.match(/<\/i>/g) || []).length;
    if (opens > closes) return block + '</i>'.repeat(opens - closes);
    if (closes > opens) return '<i>'.repeat(closes - opens) + block;
    return block;
  }

  function formatTranscript(text) {
    const cleaned = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
    // <i> と </i> だけは斜体として使えるようにして、それ以外の < > は文字として表示する
    const html = escapeHtml(cleaned)
      .replace(/&lt;i&gt;/g, '<i>')
      .replace(/&lt;\/i&gt;/g, '</i>');
    return html
      .split(/\n[ \t]*\n/)
      .map(balanceItalic)
      .join('\n\n')
      .replace(/\n/g, '<br>');
  }

  function transcriptHtml(item) {
    if (!item.transcript) return '文字起こしデータはありません。';
    const text = getTranscriptText(item);
    if (text === undefined) return '文字起こしを読み込み中です…';
    if (text === null) {
      if (location.protocol === 'file:') {
        return 'パソコン上の index.html を直接開いているため、文字起こしを読み込めません。' +
               'GitHub Pages のページか、ローカルサーバー経由で開いてください。';
      }
      return '文字起こしファイル（' + escapeHtml(item.transcript) + '）を読み込めませんでした。' +
             'ファイル名と置き場所を確認してください。';
    }
    return formatTranscript(text);
  }

  // ===== 一覧のレンダリング(1ページ9枠・新しい順) =====
  // パソコン(広い画面)は6マス、スマホは9マス
  const mq = window.matchMedia('(min-width: 768px)');
  const perPage = () => (mq.matches ? 6 : 9);
  const pager = document.getElementById('pager');
  const sortedData = [...radioData].sort((x, y) => y.date.localeCompare(x.date));
  let currentList = sortedData;
  let page = 1;
  let selectedId = null;

  const shortDate = (d) => d.split('/').map(n => String(parseInt(n, 10))).join('/'); // 2026/10/03 → 2026/10/3
  const epTitle = (item) => {
    const m = (item.episode || '').match(/\d+/);
    return m ? 'episode ' + m[0] : item.title;
  };

  // ===== 画像・テキストのよみこみ(放送日・回の数字から自動で探す) =====
  const ymd = (item) => item.date.split('/').map(n => n.padStart(2, '0')).join('');   // 20261003
  const epNum = (item) => ((item.episode || '').match(/\d+/) || [''])[0];
  const imageList = (item) => [item.image, `images/${ymd(item)}.jpg`, `images/${ymd(item)}.png`, 'images/hero.jpg'].filter(Boolean);
  function setImage(img, list) {
    let i = 0;
    img.addEventListener('error', () => {
      i++;
      if (i < list.length) img.src = list[i]; else img.style.visibility = 'hidden';
    });
    img.src = list[0];
  }
  const xCache = {};
  async function loadXText(item) {
    if (item.id in xCache) return xCache[item.id];
    const n = epNum(item);
    for (const u of [item.xtext, `txt/episode${n}.txt`, `txt/${n}.txt`].filter(Boolean)) {
      try {
        const res = await fetch(u);
        if (res.ok) { xCache[item.id] = await res.text(); return xCache[item.id]; }
      } catch (e) { /* 次の候補へ */ }
    }
    xCache[item.id] = null;
    return null;
  }

  function renderList(items) {
    currentList = items;
    page = 1;
    draw();
  }

  function draw() {
    container.innerHTML = '';
    pager.innerHTML = '';

    if (currentList.length === 0) {
      container.innerHTML = '<p class="no-result">該当するデータが見つかりませんでした。</p>';
      return;
    }

    const pages = Math.ceil(currentList.length / perPage());
    currentList.slice((page - 1) * perPage(), page * perPage()).forEach(item => {
      const card = document.createElement('div');
      card.className = 'summary-card' + (item.id === selectedId ? ' selected' : '');
      card.innerHTML = `
        <span class="card-date">${shortDate(item.date)}</span>
        <h2 class="card-title">${epTitle(item)}</h2>
        <div class="thumb"><img alt="" loading="lazy"></div>
      `;
      setImage(card.querySelector('img'), imageList(item));
      card.addEventListener('click', () => {
        selectedId = item.id;
        container.querySelectorAll('.summary-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        openModal(item);
      });
      container.appendChild(card);
    });

    if (pages > 1) {
      const add = (label, target, opts = {}) => {
        const b = document.createElement('button');
        b.textContent = label;
        b.disabled = !!opts.disabled;
        if (opts.current) b.className = 'current';
        b.addEventListener('click', () => { page = target; draw(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
        pager.appendChild(b);
      };
      add('‹', page - 1, { disabled: page === 1 });
      for (let i = 1; i <= pages; i++) add(String(i), i, { current: i === page });
      add('›', page + 1, { disabled: page === pages });
    }
  }

  // ===== 詳細(音声・公式X・文字起こし) =====
  let audio = null;
  const fmt = (t) => isFinite(t) ? Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0') : '0:00';
  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
  // 再生位置の目印になる、白いドラゴン(オリジナルのイラスト)
  const DRAGON = '<svg class="pl-dragon" viewBox="0 0 72 52" aria-hidden="true"><g fill="#fff" stroke="#1c2b48" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M30 30C22 22 14 14 8 4c8 1 13 4 17 9 1-5 4-9 8-12 1 6 3 11 6 15z"/><path d="M24 40C14 46 5 41 6 33c3 4 9 5 17 1z"/><path d="M44 36c3-8 2-15 5-20"/><ellipse cx="37" cy="37" rx="14" ry="9"/><path d="M31 44v6h6M44 44v6h6"/><path d="M45 20c0-8 7-12 13-9l8 4c3 2 2 6-1 7l-7 1c-3 5-10 6-13 1z"/><path d="M50 12l-2-8 6 5zM57 11l1-7 4 6z"/></g><circle cx="57" cy="17" r="2.2" fill="#78aee0"/></svg>';
  const SPEEDS = [1, 1.25, 1.5, 2, 0.75];

  function setupPlayer(item) {
    const btn = modalBody.querySelector('.pl-btn');
    if (!btn) return;
    audio = new Audio(item.audio);
    const bar = modalBody.querySelector('.pl-inner');
    const fill = modalBody.querySelector('.pl-fill');
    const dragon = modalBody.querySelector('.pl-dragon');
    const time = modalBody.querySelector('.pl-time');
    const speedBtn = modalBody.querySelector('.pl-speed');
    let si = 0;
    btn.addEventListener('click', () => { audio.paused ? audio.play() : audio.pause(); });
    speedBtn.addEventListener('click', () => {
      si = (si + 1) % SPEEDS.length;
      audio.playbackRate = SPEEDS[si];
      speedBtn.textContent = SPEEDS[si] + 'x';
    });
    audio.addEventListener('play', () => { btn.innerHTML = ICON_PAUSE; });
    audio.addEventListener('pause', () => { btn.innerHTML = ICON_PLAY; });
    audio.addEventListener('timeupdate', () => {
      const p = audio.duration ? audio.currentTime / audio.duration * 100 : 0;
      fill.style.width = p + '%';
      dragon.style.left = p + '%';
      time.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
    });
    audio.addEventListener('loadedmetadata', () => { time.textContent = '0:00 / ' + fmt(audio.duration); });
    bar.parentElement.addEventListener('click', (e) => {
      const r = bar.getBoundingClientRect();
      if (audio.duration) audio.currentTime = audio.duration * Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    });
  }

  // 画像をクリックすると原寸で表示。もう一度クリックすると元にもどる
  function openLightbox(src) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    const im = document.createElement('img');
    im.src = src;
    lb.appendChild(im);
    lb.addEventListener('click', () => lb.remove());
    document.body.appendChild(lb);
  }

  function openModal(item) {
    currentItem = item;
    const post = item.links && item.links[0] ? item.links[0].url : '';

    modalBody.innerHTML = `
      <div class="modal-top">
        <span>${shortDate(item.date).replace(/\//g, '.')}</span><span>episode${epNum(item)}</span>
      </div>
      ${item.audio ? `<div class="player"><button class="pl-btn" aria-label="再生・一時停止">${ICON_PLAY}</button>
        <div class="pl-bar"><div class="pl-inner"><div class="pl-track"><div class="pl-fill"></div></div>${DRAGON}</div></div>
        <span class="pl-time">0:00 / 0:00</span>
        <button class="pl-speed" aria-label="再生速度">1x</button></div>` : ''}
      <div class="x-box">
        <div class="x-img"><img alt=""></div>
        <div class="x-col">
          <div class="x-body"></div>
          <div class="x-actions">
            <button class="x-more" aria-label="全文を読む・閉じる" hidden>…</button>
            ${post ? `<a class="x-link" href="${post}" target="_blank" rel="noopener noreferrer">X ↗</a>` : ''}
          </div>
        </div>
      </div>
      <div class="tr-box transcript-box">${transcriptHtml(item)}</div>
    `;

    const xImg = modalBody.querySelector('.x-img img');
    setImage(xImg, imageList(item));
    xImg.addEventListener('click', () => { if (xImg.currentSrc) openLightbox(xImg.currentSrc); });

    const xBox = modalBody.querySelector('.x-box');
    const xBody = modalBody.querySelector('.x-body');
    const more = modalBody.querySelector('.x-more');
    more.addEventListener('click', () => { xBox.classList.toggle('open'); });
    loadXText(item).then(text => {
      if (currentItem !== item || !xBody.isConnected) return;
      if (text === null) { xBody.remove(); return; }
      xBody.innerHTML = escapeHtml(text.replace(/^\uFEFF/, '').trim()).replace(/\r?\n/g, '<br>');
      requestAnimationFrame(() => { more.hidden = !(xBody.scrollHeight > xBody.clientHeight + 1); });
    });
    if (item.audio) setupPlayer(item);

    // まだ読み込み中だった場合は、読み込み完了後に本文を差し替える
    if (isFilePath(item.transcript) && transcripts[item.id] === undefined) {
      loadAll.then(() => {
        if (currentItem !== item) return;
        const box = modalBody.querySelector('.transcript-box');
        if (box) box.innerHTML = transcriptHtml(item);
      });
    }

    modal.style.display = 'block';
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden'; // 背景スクロール固定
  }

  // ===== モーダルを閉じる処理 =====
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentItem = null;
    if (audio) { audio.pause(); audio = null; }
    document.querySelectorAll('.lightbox').forEach(el => el.remove());
    // 選択中だけ色を付ける: 閉じたら元の色に戻す
    selectedId = null;
    container.querySelectorAll('.summary-card').forEach(c => c.classList.remove('selected'));
  }

  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ===== 検索処理 =====
  function applySearch() {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = sortedData.filter(item => {
      const text = (getTranscriptText(item) || '').replace(/<\/?i>/g, '').toLowerCase();
      return item.title.toLowerCase().includes(query) ||
             item.date.includes(query) ||
             (item.episode && item.episode.includes(query)) ||
             text.includes(query);
    });
    renderList(filtered);
  }

  searchInput.addEventListener('input', applySearch);
  mq.addEventListener('change', () => { page = 1; draw(); });

  // 初期表示（文字起こしの読み込みが終わったら、検索中の場合だけ結果を更新する）
  renderList(sortedData);
  loadAll.then(() => {
    if (searchInput.value.trim() !== '') applySearch();
  });
});
