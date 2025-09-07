
let STRINGS = {};
let LANG = localStorage.getItem('lang') || 'en';

async function loadI18n(){
  const r = await fetch('i18n.json'); STRINGS = await r.json();
  applyLang();
  const sel = document.getElementById('lang');
  if(sel){ sel.value = LANG; sel.addEventListener('change', (e)=>{
    LANG = e.target.value; localStorage.setItem('lang', LANG); applyLang();
  });}
}
function t(key){ return (STRINGS[LANG] && STRINGS[LANG][key]) || key; }
function applyLang(){
  const map = { '.instant':'instant', '#menu-store':'menu_store', '#menu-services':'menu_services', '#menu-contact':'menu_contact' };
  for(const [sel,key] of Object.entries(map)){
    document.querySelectorAll(sel).forEach(el=> el.innerHTML = t(key));
  }
  const ph = document.getElementById('search'); if(ph) ph.placeholder = (STRINGS[LANG] && STRINGS[LANG]['search_ph']) || 'Search…';
  // Button texts inside cards
  document.querySelectorAll('[data-i18n="buy"]').forEach(el=> el.textContent = t('buy'));
  document.querySelectorAll('[data-i18n="more"]').forEach(el=> el.textContent = t('more'));
  // Auth labels in dropdown
  const login = document.getElementById('login'); if(login) login.textContent = t('login');
  const reg = document.getElementById('register'); if(reg) reg.textContent = t('register');
  const logout = document.getElementById('logout'); if(logout) logout.textContent = t('logout');
  document.querySelectorAll('.hero_badge').forEach(el=> el.innerHTML = t('hero_badge'));
  document.querySelectorAll('.hero_title').forEach(el=> el.innerHTML = t('hero_title'));
  document.querySelectorAll('.hero_p').forEach(el=> el.innerHTML = t('hero_p'));
  document.querySelectorAll('.how-title').forEach(el=> el.innerHTML = t('how'));
  document.querySelectorAll('.how_1').forEach(el=> el.innerHTML = t('how_1'));
  document.querySelectorAll('.how_2').forEach(el=> el.innerHTML = t('how_2'));
  document.querySelectorAll('.how_3').forEach(el=> el.innerHTML = t('how_3'));
  const hl = document.getElementById('how-link'); if(hl) hl.textContent = t('how_to_pay');
  const rl = document.getElementById('refund-link'); if(rl) rl.textContent = t('refund');
  document.querySelectorAll('.footer-a').forEach(el=> el.innerHTML = t('footer_a'));
  document.querySelectorAll('.legal-title').forEach(el=> el.innerHTML = t('legal'));
  document.querySelectorAll('.help-title').forEach(el=> el.innerHTML = t('help'));
}

async function loadProducts(){
  const res = await fetch('products.json');
  const items = await res.json();
  const grid = document.querySelector('.grid');
  const filter = document.getElementById('search');
  render(items, '');
  if(filter) filter.addEventListener('input', ()=> render(items, filter.value.toLowerCase()));
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
        <a class="btn primary" href="${p.buy_url}" target="_blank" rel="noopener" data-i18n="buy" data-require-auth>Buy now</a>
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

// Dropdown behavior
function setupDropdown(){
  const btn = document.getElementById('menu-toggle');
  const dd = document.getElementById('menu-dropdown');
  if(!btn || !dd) return;
  function close(){ dd.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
  btn.addEventListener('click', (e)=>{ e.stopPropagation(); dd.classList.toggle('open'); btn.setAttribute('aria-expanded', dd.classList.contains('open')?'true':'false'); });
  document.addEventListener('click', (e)=>{ if(!dd.contains(e.target) && e.target!==btn){ close(); } });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
}

window.addEventListener('DOMContentLoaded', ()=>{ loadI18n(); loadProducts(); setupDropdown(); });
