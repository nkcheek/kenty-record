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
        <div class="thumb"><img src="${item.image || 'image/hero.jpg'}" alt="" loading="lazy"></div>
      `;
      card.querySelector('img').addEventListener('error', e => { e.target.style.visibility = 'hidden'; });
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

  // ===== モーダルを開く処理 =====
  function openModal(item) {
    currentItem = item;

    let linksHtml = '';
    if (item.links && item.links.length > 0) {
      linksHtml = `
        <div class="modal-section">
          <h3>関連リンク</h3>
          <ul>
            ${item.links.map(link => `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.title}</a></li>`).join('')}
          </ul>
        </div>
      `;
    }

    let audioHtml = '';
    if (item.audio) {
      audioHtml = `
        <div class="modal-section">
          <h3>音声</h3>
          <audio controls src="${item.audio}"></audio>
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="modal-header-info">
        <span class="modal-date">${item.date} ${item.episode || ''}</span>
        <h2 class="modal-title">${item.title}</h2>
      </div>
      ${audioHtml}
      ${linksHtml}
      <div class="modal-section">
        <h3>文字起こし</h3>
        <div class="transcript-box">${transcriptHtml(item)}</div>
      </div>
    `;

    // まだ読み込み中だった場合は、読み込み完了後に本文を差し替える
    if (isFilePath(item.transcript) && transcripts[item.id] === undefined) {
      loadAll.then(() => {
        if (currentItem !== item) return;
        const box = modalBody.querySelector('.transcript-box');
        if (box) box.innerHTML = transcriptHtml(item);
      });
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 背景スクロール固定
  }

  // ===== モーダルを閉じる処理 =====
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentItem = null;
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
