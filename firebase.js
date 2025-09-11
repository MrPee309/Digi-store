// firebase.js — Auth (Email/Password + Google) + Firestore + BUY button gating
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};
let app, auth, provider, db;
async function initFirebase(){
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js');
  const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut,
          createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } =
        await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js');
  const { getFirestore, doc, setDoc, serverTimestamp } =
        await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app); db = getFirestore(app); provider = new GoogleAuthProvider();
  const loginBtn=document.getElementById('login'), registerBtn=document.getElementById('register'),
        logoutBtn=document.getElementById('logout'), userBox=document.getElementById('user');
  const modal=document.getElementById('auth-modal'),
        modalOpeners=document.querySelectorAll('#login,#register,[data-open-auth]'),
        modalClose=document.querySelectorAll('[data-close-auth]'),
        formRegister=document.getElementById('form-register'),
        formLogin=document.getElementById('form-login'),
        googleBtns=document.querySelectorAll('[data-google-auth]');
  function openModal(){ if(modal) modal.classList.add('open'); }
  function closeModal(){ if(modal) modal.classList.remove('open'); }
  modalOpeners.forEach(b=>b&&b.addEventListener('click',e=>{e.preventDefault();openModal();}));
  modalClose.forEach(b=>b&&b.addEventListener('click',closeModal));
  if(formRegister){ formRegister.addEventListener('submit', async e=>{
    e.preventDefault();
    const name=formRegister.querySelector('input[name="name"]').value.trim();
    const email=formRegister.querySelector('input[name="email"]').value.trim();
    const pass=formRegister.querySelector('input[name="password"]').value;
    try{ const {user}=await createUserWithEmailAndPassword(auth,email,pass);
      if(name){ await updateProfile(user,{displayName:name}); }
      await saveUserProfile(user,{name,provider:'password'}); closeModal();
    }catch(err){ alert('Register error: '+err.message); }
  });}
  if(formLogin){ formLogin.addEventListener('submit', async e=>{
    e.preventDefault();
    const email=formLogin.querySelector('input[name="email"]').value.trim();
    const pass=formLogin.querySelector('input[name="password"]').value;
    try{ await signInWithEmailAndPassword(auth,email,pass); closeModal(); }
    catch(err){ alert('Login error: '+err.message); }
  });}
  googleBtns.forEach(btn=>btn&&btn.addEventListener('click', async ()=>{
    try{ const res=await signInWithPopup(auth,provider);
      await saveUserProfile(res.user,{provider:'google'}); closeModal();
    }catch(err){ alert('Google auth error: '+err.message); }
  }));
  if(logoutBtn){ logoutBtn.addEventListener('click', async ()=>{ await signOut(auth); }); }
  onAuthStateChanged(auth, user=>{
    const gated=document.querySelectorAll('[data-require-auth]');
    if(user){
      gated.forEach(el=>{ el.classList.remove('is-disabled'); el.removeAttribute('aria-disabled');
        if(el.__gateHandler){ el.removeEventListener('click', el.__gateHandler, true); el.__gateHandler=null; } });
      if(userBox){ userBox.innerHTML=`<img src="${user.photoURL||''}" alt=""> <span>${user.displayName||user.email}</span>`; userBox.style.display='flex'; }
      if(loginBtn) loginBtn.style.display='none'; if(registerBtn) registerBtn.style.display='none'; if(logoutBtn) logoutBtn.style.display='inline-flex';
    }else{
      gated.forEach(el=>{ el.classList.add('is-disabled'); el.setAttribute('aria-disabled','true');
        const handler=e=>{ e.preventDefault(); e.stopPropagation(); alert('Please sign in to continue.'); };
        el.__gateHandler=handler; el.addEventListener('click', handler, true); });
      if(userBox){ userBox.style.display='none'; userBox.innerHTML=''; }
      if(loginBtn) loginBtn.style.display='inline-flex'; if(registerBtn) registerBtn.style.display='inline-flex'; if(logoutBtn) logoutBtn.style.display='none';
    }
  });
  async function saveUserProfile(user, extra){
    const profile={ uid:user.uid, name:user.displayName||(extra&&extra.name)||'', email:user.email||'',
      photoURL:user.photoURL||'', provider:(extra&&extra.provider)||(user.providerData&&user.providerData[0]&&user.providerData[0].providerId)||'password',
      createdAt:serverTimestamp(), updatedAt:serverTimestamp() };
    await setDoc(doc(db,'users',user.uid), profile, {merge:true});
  }
}
window.addEventListener('DOMContentLoaded', initFirebase);
