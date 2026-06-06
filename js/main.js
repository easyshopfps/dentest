/* ════════════════════════════════
   main.js — App entry point
   Boots everything in order
   ════════════════════════════════ */

async function init() {
  try {
    /* 1. Config (theme/font) first */
    await loadConfig();

    /* 2. WA number + banner + announcement + categories in parallel */
    const [,,,cats] = await Promise.all([
      loadWaNumber(),
      loadBanners(),
      loadAnnouncement(),
      loadCategories()
    ]);

    /* 3. Products (โหลดก่อน render cat เพื่อนับจำนวน) */
    products = await loadProducts();

    /* 4. Render category row — นับจำนวน product ต่อหมวดได้เลย */
    if (cats && cats.length) {
      const row = document.getElementById('catRow');
      if (row) {
        row.innerHTML = cats.map(c => {
          const count = products.filter(p => p.game === c.name).length;
          const countLabel = `ມີ ID ${count} ອັນ`;
          const imgHtml = c.img_url
            ? `<img src="${c.img_url}" alt="${c.name}" loading="lazy" onerror="this.style.display='none'"/>`
            : `<div class="cat-img-fallback">${c.name}</div>`;
          return `
          <div class="cat-item" onclick="openCatPage('${c.name.replace(/'/g,"\\'")}')">
            <div class="cat-img">${imgHtml}</div>
            <div class="cat-info">
              <span class="cat-info-name">${c.name}</span>
              <span class="cat-info-count">${countLabel}</span>
            </div>
          </div>`;
        }).join('');
      }
    }

    /* 5. Render grid */
    renderGrid(products);
    updateStats();

    /* 6. Route */
    handleInitialRoute();

    /* 7. Ads popup — after everything loads (non-blocking) */
    loadAdsPopup();

  } catch (err) {
    console.error('[main] init failed:', err);
  } finally {
    const loader = document.getElementById('pageLoader');
    if (loader) {
      loader.classList.add('hide');
      setTimeout(() => loader.style.display = 'none', 500);
    }
  }
}

/* Boot when DOM is ready */
document.addEventListener('DOMContentLoaded', init);
