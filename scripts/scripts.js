/* ─── CURSOR ─── */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
(function animRing(){
  rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('button,a,.color-swatch,.icon-item,.demo-card,.stat-card-demo,.do-dont,.dd-card').forEach(el => {
  el.addEventListener('mouseenter',()=>ring.classList.add('expand'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('expand'));
});

/* ─── HAMBURGER / SIDEBAR TOGGLE ─── */
const hamburgerBtn   = document.getElementById('hamburgerBtn');
const sidebar        = document.querySelector('.sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('visible');
  hamburgerBtn.classList.add('open');
  hamburgerBtn.setAttribute('aria-expanded','true');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('visible');
  hamburgerBtn.classList.remove('open');
  hamburgerBtn.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}
hamburgerBtn.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
sidebarOverlay.addEventListener('click', closeSidebar);

/* ─── SCROLL SPY ─── */
const sections = document.querySelectorAll('section[id]');
const sbLinks  = document.querySelectorAll('.sb-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      sbLinks.forEach(l => l.classList.remove('active'));
      const match = document.querySelector(`.sb-link[data-target="${e.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { rootMargin:'-20% 0px -60% 0px' });
sections.forEach(s => observer.observe(s));

/* ─── SCROLL TO ─── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior:'smooth', block:'start' });
    // close sidebar on mobile after navigation
    if (window.innerWidth <= 1024) closeSidebar();
  }
}

/* ─── COPY COLOR ─── */
function copyColor(val, varName, el) {
  navigator.clipboard.writeText(`var(${varName})`).catch(() => {});
  el.classList.add('copied');
  showToast(`Copied: var(${varName}) → ${val}`, 'ri-palette-line');
  setTimeout(() => el.classList.remove('copied'), 2000);
}

/* ─── COPY CODE ─── */
function copyCode(btn, preId) {
  const pre = document.getElementById(preId);
  const text = pre.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.innerHTML = '<i class="ri-check-line"></i> Copied!';
    btn.style.color = 'var(--green)';
    setTimeout(() => {
      btn.innerHTML = '<i class="ri-file-copy-line"></i> Copy';
      btn.style.color = '';
    }, 2000);
  });
  showToast('Code copied to clipboard', 'ri-file-copy-line');
}

/* ─── COPY ALL VARS ─── */
function copyAllVars() {
  const pre = document.getElementById('vars-code');
  navigator.clipboard.writeText(pre.innerText);
  showToast('All CSS variables copied!', 'ri-check-circle-line');
}

/* ─── TOAST ─── */
function showToast(msg, icon='ri-info-line') {
  const w = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = 'toast-msg';
  t.innerHTML = `<i class="${icon}"></i>${msg}`;
  w.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(12px)'; t.style.transition='all 0.25s'; setTimeout(()=>t.remove(),300); }, 2600);
}

/* ─── PAGE SWITCHING ─── */
function switchPage(page) {
  // hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // show target
  document.getElementById('page-' + page).classList.add('active');
  // scroll to top
  window.scrollTo(0, 0);
  // update top nav tabs
  document.querySelectorAll('.tn-link[data-page]').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  // update mobile tab bar
  document.querySelectorAll('.mob-tab[data-page]').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  // show/hide hamburger & sidebar overlay only on components page
  const isComponents = page === 'components';
  document.getElementById('hamburgerBtn').style.display = isComponents ? '' : 'none';
  if (!isComponents) closeSidebar();
}

/* ─── NAV TAB SWITCH ─── */
document.querySelectorAll('.tn-link[data-page]').forEach(btn => {
  btn.addEventListener('click', function() {
    switchPage(this.dataset.page);
  });
});