document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cardContainer');
  const searchInput = document.getElementById('searchInput');
  const modal = document.getElementById('detailModal');
  const modalBody = document.getElementById('modalBody');
  const closeBtn = document.getElementById('closeBtn');

  // 一覧のレンダリング
  function renderList(items) {
    container.innerHTML = '';
    
    if (items.length === 0) {
      container.innerHTML = '<p class="no-result">該当するデータが見つかりませんでした。</p>';
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'summary-card';
      card.innerHTML = `
        <div class="card-meta">
          <span class="card-date">${item.date}</span>
          <span class="card-episode">${item.episode || ''}</span>
        </div>
        <h2 class="card-title">${item.title}</h2>
      `;
      
      // カードクリックでモーダルを開く
      card.addEventListener('click', () => openModal(item));
      container.appendChild(card);
    });
  }

  // モーダルを開く処理
  function openModal(item) {
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
        <div class="transcript-box">${item.transcript ? item.transcript.replace(/\n/g, '<br>') : '文字起こしデータはありません。'}</div>
      </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // 背景スクロール固定
  }

  // モーダルを閉じる処理
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // 検索処理
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = radioData.filter(item => {
      return item.title.toLowerCase().includes(query) ||
             item.date.includes(query) ||
             (item.episode && item.episode.includes(query)) ||
             (item.transcript && item.transcript.toLowerCase().includes(query));
    });
    renderList(filtered);
  });

  // 初期表示
  renderList(radioData);
});