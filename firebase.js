
// Firebase v9 modular SDK — client-side (public) config placeholders:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

let app, auth, provider;
async function initFirebase(){
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js');
  const { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } =
    await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();

  const loginBtn = document.getElementById('login');
  const logoutBtn = document.getElementById('logout');
  const userBox = document.getElementById('user');

  if(loginBtn){
    loginBtn.addEventListener('click', async ()=>{
      try{
        await signInWithPopup(auth, provider);
      }catch(e){ alert('Login failed: '+e.message); }
    });
  }
  if(logoutBtn){
    logoutBtn.addEventListener('click', async ()=>{
      await signOut(auth);
    });
  }
  onAuthStateChanged(auth, (user)=>{
    const gated = document.querySelectorAll('[data-require-auth]');
    if(user){
      [...gated].forEach(el=> el.removeAttribute('disabled'));
      if(userBox){
        userBox.innerHTML = `<img src="${user.photoURL||''}" alt=""> <span>${user.displayName||user.email}</span>`;
        userBox.style.display = 'flex';
      }
      if(loginBtn) loginBtn.style.display = 'none';
      if(logoutBtn) logoutBtn.style.display = 'inline-flex';
    }else{
      [...gated].forEach(el=> el.setAttribute('disabled','true'));
      if(userBox){ userBox.style.display = 'none'; userBox.innerHTML = ''; }
      if(loginBtn) loginBtn.style.display = 'inline-flex';
      if(logoutBtn) logoutBtn.style.display = 'none';
    }
  });
}
window.addEventListener('DOMContentLoaded', initFirebase);
