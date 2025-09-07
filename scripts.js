
let STRINGS = {};
let LANG = localStorage.getItem('lang') || 'en';

async function loadI18n(){
  const r = await fetch('i18n.json'); STRINGS = await r.json();
  applyLang();
  document.getElementById('lang').value = LANG;
  document.getElementById('lang').addEventListener('change', (e)=>{
    LANG = e.target.value;
    localStorage.setItem('lang', LANG);
    applyLang();
  });
}
function t(key){ return (STRINGS[LANG] && STRINGS[LANG][key]) || key; }
function applyLang(){
  const map = {
    '.instant': 'instant','.hero_badge':'hero_badge','.hero_title':'hero_title','.hero_p':'hero_p',
    '.how-title':'how', '#menu-store':'menu_store', '#menu-services':'menu_services', '#menu-contact':'menu_contact',
    '#search::ph':'search_ph', '#refund-link':'refund', '#how-link':'how_to_pay',
    '#login':'login', '#logout':'logout', '.footer-a':'footer_a', '.legal-title':'legal', '.help-title':'help'
  };
  for(const [sel,key] of Object.entries(map)){
    if(sel.endsWith('::ph')){
      const s = sel.replace('::ph',''); const el = document.querySelector(s);
      if(el) el.placeholder = t(key);
    }else{
      document.querySelectorAll(sel).forEach(el=> el.innerHTML = t(key));
    }
  }
  // Buttons inside cards
  document.querySelectorAll('[data-i18n="buy"]').forEach(el=> el.textContent = t('buy'));
  document.querySelectorAll('[data-i18n="more"]').forEach(el=> el.textContent = t('more'));
}

async function loadProducts(){
  const res = await fetch('products.json');
  const items = await res.json();
  const grid = document.querySelector('.grid');
  const filter = document.getElementById('search');
  render(items, '');
  filter.addEventListener('input', ()=> render(items, filter.value.toLowerCase()));
  function render(list, term){
    grid.innerHTML = '';
    list.filter(p => !term || p.title.toLowerCase().includes(term) || p.tags.join(' ').toLowerCase().includes(term))
        .forEach(p => grid.appendChild(card(p)));
  }
  function card(p){
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.title}" style="width:100%;height:150px;object-fit:cover;border-radius:10px">
      <h3>${p.title}</h3>
      <div class="price">
        <span class="new">$${p.price.toFixed(2)}</span>
        ${p.old_price ? `<span class="old">$${p.old_price.toFixed(2)}</span>`:''}
      </div>
      <div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <p class="desc">${p.description}</p>
      <div class="actions">
        <a class="btn primary buy" data-require-auth href="${p.buy_url}" target="_blank" rel="noopener" data-i18n="buy">Buy now</a>
        <button class="btn" data-id="${p.id}" data-i18n="more">More info</button>
      </div>
    `;
    div.querySelector('button').addEventListener('click', ()=> openModal(p));
    return div;
  }
}

function openModal(p){
  const modal = document.querySelector('.modal'); modal.classList.add('open');
  modal.querySelector('.modal-title').textContent = p.title;
  modal.querySelector('.modal-body').innerHTML = `
    <p>${p.description}</p>
    <ul>
      <li>Delivery: <b>automatic by email</b> after payment (Gumroad/Payhip).</li>
      <li>Format: code/zip/pdf depending on the product.</li>
    </ul>`;
  modal.querySelector('.modal-buy').href = p.buy_url;
}
function closeModal(){ document.querySelector('.modal').classList.remove('open'); }

window.addEventListener('DOMContentLoaded', ()=>{ loadI18n(); loadProducts(); });
