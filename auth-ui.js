
/* auth-ui.js — opens/closes the auth modal even if Firebase hasn't loaded */
(function(){
  function ready(fn){ if(document.readyState!='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var modal = document.getElementById('auth-modal');
    if(!modal){ console.warn('[auth-ui] No #auth-modal found'); return; }
    var openers = document.querySelectorAll('#login,#register,[data-open-auth]');
    var closers = document.querySelectorAll('[data-close-auth]');
    openers.forEach(function(b){ b.addEventListener('click', function(e){ e.preventDefault(); modal.classList.add('open'); }); });
    closers.forEach(function(b){ b.addEventListener('click', function(){ modal.classList.remove('open'); }); });
    // close on backdrop click
    modal.addEventListener('click', function(e){ if(e.target===modal) modal.classList.remove('open'); });
    console.log('[auth-ui] wired');
  });
})();
