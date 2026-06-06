/* ===================== THEME ===================== */
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  document.body.classList.add('light-theme');
  themeBtn.textContent = '☀️';
}
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeBtn.textContent = isLight ? '☀️' : '🌙';
});

/* ===================== PAGE LOAD PROGRESS BAR ===================== */
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
document.body.prepend(progressBar);
let prog = 0;
const progInterval = setInterval(() => {
  prog += Math.random() * 18;
  if (prog >= 90) { clearInterval(progInterval); prog = 90; }
  progressBar.style.width = prog + '%';
}, 120);
window.addEventListener('load', () => {
  clearInterval(progInterval);
  progressBar.style.width = '100%';
  setTimeout(() => { progressBar.style.opacity = '0'; }, 400);
  setTimeout(() => { progressBar.remove(); }, 700);
});

/* ===================== CUSTOM CURSOR ===================== */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  const updateCursor = () => {
    cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
    requestAnimationFrame(updateCursor);
  };
  updateCursor();
  document.querySelectorAll('a, button, .service-item, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
  document.querySelectorAll('a').forEach(a => a.style.cursor = 'none');
}

/* ===================== NAV ===================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

const mobileMenuClose = document.getElementById('mobileMenuClose');
if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close on backdrop click (tap outside links)
mobileMenu.addEventListener('click', e => {
  if (e.target === mobileMenu) closeMobileMenu();
});
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===================== HERO NAME — LETTER SPLIT ===================== */
document.querySelectorAll('.hero-name .line').forEach((line, lineIdx) => {
  const text = line.textContent;
  line.textContent = '';
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = (0.3 + lineIdx * 0.18 + i * 0.045) + 's';
    line.appendChild(span);
  });
});

/* ===================== HERO TAG — TYPING EFFECT ===================== */
const heroTag = document.querySelector('.hero-tag');
if (heroTag) {
  const original = heroTag.textContent.trim();
  heroTag.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  heroTag.appendChild(cursor);
  let i = 0;
  setTimeout(() => {
    const type = () => {
      if (i < original.length) {
        heroTag.insertBefore(document.createTextNode(original[i]), cursor);
        i++;
        setTimeout(type, 45 + Math.random() * 30);
      }
    };
    type();
  }, 600);
}

/* ===================== RIPPLE ON BUTTONS ===================== */
document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta, .form-submit').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.className = 'btn-ripple';
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    this.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
});

/* ===================== MAGNETIC BUTTONS ===================== */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * 0.25;
      const dy = (e.clientY - rect.top  - rect.height / 2) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ===================== STAT COUNTER ===================== */
const statNums = document.querySelectorAll('.stat-num');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.textContent);
    if (isNaN(target)) return;
    const suffix = el.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const step = Math.ceil(target / 30);
    el.classList.add('counting');
    const tick = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(tick); }
      el.textContent = current + suffix;
    }, 40);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
statNums.forEach(n => statObserver.observe(n));

/* ===================== REVEAL ON SCROLL ===================== */
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    const bar = e.target.querySelector('.skill-bar');
    if (bar) {
      const w = parseFloat(bar.style.getPropertyValue('--w')) || 0.8;
      bar.style.transform = `scaleX(${w})`;
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => revealObserver.observe(r));

/* ===================== SKILL BARS ===================== */
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach((e, idx) => {
    if (!e.isIntersecting) return;
    const bar = e.target.querySelector('.skill-bar');
    if (bar) {
      const w = bar.style.cssText.match(/--w:([\d.]+)/)?.[1] || 0.8;
      setTimeout(() => { bar.style.transform = `scaleX(${w})`; }, 100 + idx * 80);
    }
    e.target.classList.add('visible');
    skillObserver.unobserve(e.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach((c, i) => {
  c.style.transitionDelay = (i * 0.06) + 's';
  skillObserver.observe(c);
});

/* ===================== SECTION TITLE GLOW ===================== */
const titleObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible-glow');
      titleObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.section-title').forEach(t => titleObserver.observe(t));

/* ===================== SECTION NUMBER WIPE ===================== */
const numObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      numObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.section-num').forEach(n => numObserver.observe(n));

/* ===================== SERVICE ITEMS STAGGER ===================== */
const serviceObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const items = document.querySelectorAll('.service-item');
      items.forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity   = '1';
          item.style.transform = 'translateX(0)';
        }, i * 90);
      });
      serviceObserver.disconnect();
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.service-item').forEach(item => {
  item.style.opacity   = '0';
  item.style.transform = 'translateX(-30px)';
  item.style.transition = 'opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1), padding 0.3s';
});
const firstService = document.querySelector('.services-list');
if (firstService) serviceObserver.observe(firstService);

/* ===================== TIMELINE ITEMS STAGGER ===================== */
const timelineObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const items = e.target.querySelectorAll('.timeline-item');
      items.forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity   = '1';
          item.style.transform = 'translateX(0)';
        }, i * 120);
      });
      timelineObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.timeline').forEach(tl => {
  tl.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity   = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)';
  });
  timelineObserver.observe(tl);
});

/* ===================== CONTACT ITEMS STAGGER ===================== */
const contactObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.contact-item').forEach((item, i) => {
        setTimeout(() => {
          item.style.opacity   = '1';
          item.style.transform = 'translateY(0)';
        }, i * 100);
      });
      contactObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.contact-items').forEach(ci => {
  ci.querySelectorAll('.contact-item').forEach(item => {
    item.style.opacity   = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.2s, background 0.2s';
  });
  contactObserver.observe(ci);
});

/* ===================== 3D PHOTO TILT ===================== */
const photoCards = document.querySelectorAll('.photo-card');
const lbSrcs = Array.from(photoCards).map(c => c.dataset.src);

photoCards.forEach(card => {
  const inner = card.querySelector('.photo-card-inner');
  const img   = card.querySelector('img');

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    inner.style.transform = `rotateX(${-dy * 10}deg) rotateY(${dx * 14}deg) scale3d(1.04,1.04,1.04)`;
    img.style.transform   = `scale(1.06) translate(${dx * 6}px, ${dy * 4}px)`;
  });
  card.addEventListener('mouseenter', () => {
    inner.style.transition = 'transform 0.15s ease, box-shadow 0.4s';
    img.style.transition   = 'transform 0.15s ease, filter 0.5s';
  });
  card.addEventListener('mouseleave', () => {
    inner.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s';
    img.style.transition   = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.5s';
    inner.style.transform  = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    img.style.transform    = 'scale(1) translate(0,0)';
  });
  card.addEventListener('click', () => openLb(parseInt(card.dataset.idx)));
});

/* ===================== LIGHTBOX ===================== */
const lb        = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCounter = document.getElementById('lbCounter');
let lbCurrent   = 0;
lbImg.style.transition = 'opacity 0.18s';

function openLb(idx) {
  lbCurrent = idx;
  lbImg.src = lbSrcs[idx];
  lbCounter.textContent = (idx + 1) + ' / ' + lbSrcs.length;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lb.classList.remove('active');
  document.body.style.overflow = '';
  lbImg.src = '';
}
function lbNav(dir) {
  lbCurrent = (lbCurrent + dir + lbSrcs.length) % lbSrcs.length;
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src = lbSrcs[lbCurrent];
    lbCounter.textContent = (lbCurrent + 1) + ' / ' + lbSrcs.length;
    lbImg.style.opacity = '1';
  }, 180);
}
document.getElementById('lbClose').addEventListener('click', closeLb);
document.getElementById('lbPrev').addEventListener('click', () => lbNav(-1));
document.getElementById('lbNext').addEventListener('click', () => lbNav(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLb();
  if (e.key === 'ArrowLeft')   lbNav(-1);
  if (e.key === 'ArrowRight')  lbNav(1);
});

/* ===================== CONTACT FORM ===================== */
emailjs.init("RoiQZ_9AAYh13TSLW");

document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  emailjs.send("service_aq6wpmf", "template_zopnuk5", {
    from_name:  document.getElementById('fname').value,
    from_email: document.getElementById('femail').value,
    subject:    document.getElementById('fsubject').value,
    message:    document.getElementById('fmessage').value
  })
  .then(() => {
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    document.getElementById('formSuccess').style.display = 'block';
    this.reset();
    setTimeout(() => document.getElementById('formSuccess').style.display = 'none', 4000);
  })
  .catch(err => {
    console.error('EmailJS Error:', err);
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    alert('Failed to send. Please try again.');
  });
});
