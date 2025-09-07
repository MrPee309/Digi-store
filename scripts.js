
async function loadProducts(){
  const res = await fetch('products.json');
  const items = await res.json();
  const grid = document.querySelector('.grid');
  const q = (new URLSearchParams(location.search)).get('q')?.toLowerCase() || '';
  const filter = document.getElementById('search');
  if(filter){ filter.value = q; filter.addEventListener('input', ()=>{
      const v = filter.value.trim();
      const url = new URL(location);
      if(v) url.searchParams.set('q', v); else url.searchParams.delete('q');
      history.replaceState(null,'', url.toString());
      render(items, v.toLowerCase());
  })}
  render(items, q);
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
        <a class="btn primary" href="${p.buy_url}" target="_blank" rel="noopener">Achte kounya</a>
        <button class="btn" data-id="${p.id}">Plis detay</button>
      </div>
    `;
    div.querySelector('button').addEventListener('click', ()=> openModal(p));
    return div;
  }
}
function openModal(p){
  const modal = document.querySelector('.modal');
  modal.classList.add('open');
  modal.querySelector('.modal-title').textContent = p.title;
  modal.querySelector('.modal-body').innerHTML = `
    <p>${p.description}</p>
    <ul>
      <li>Livrezon: <b>otomatik pa imel</b> apre peman (Gumroad/Payhip).</li>
      <li>Fòma: kòd/zip/pdf selon pwodwi.</li>
    </ul>
  `;
  modal.querySelector('.modal-buy').href = p.buy_url;
}
function closeModal(){ document.querySelector('.modal').classList.remove('open'); }
window.addEventListener('DOMContentLoaded', loadProducts);
