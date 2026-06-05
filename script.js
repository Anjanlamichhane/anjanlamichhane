
    // ── Custom cursor
	const themeBtn = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme');

if(savedTheme === 'light'){
    document.body.classList.add('light-theme');
    themeBtn.textContent = '☀️';
}

themeBtn.addEventListener('click', () => {

    document.body.classList.toggle('light-theme');

    if(document.body.classList.contains('light-theme')){
        localStorage.setItem('theme','light');
        themeBtn.textContent = '☀️';
    } else {
        localStorage.setItem('theme','dark');
        themeBtn.textContent = '🌙';
    }

});
	
  
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
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
    // ── Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ── Reveal on scroll
	
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // Trigger skill bars
          const bar = e.target.querySelector('.skill-bar');
          if (bar) {
            const w = parseFloat(getComputedStyle(e.target).getPropertyValue('--w') || bar.parentElement.parentElement.style.getPropertyValue('--w')) || 0.8;
            bar.style.transform = `scaleX(${w})`;
          }
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => observer.observe(r));

    // Skill bar widths
    document.querySelectorAll('.skill-card').forEach(card => {
      const bar = card.querySelector('.skill-bar');
      const w = bar.style.getPropertyValue('--w') || '0.8';
      bar.dataset.w = w;
    });

    // Re-trigger skill bars when card visible
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bar = e.target.querySelector('.skill-bar');
          if (bar) {
            setTimeout(() => {
              bar.style.transform = `scaleX(${bar.style.cssText.match(/--w:([\d.]+)/)?.[1] || 0.8})`;
            }, 200);
          }
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-card').forEach(c => skillObserver.observe(c));

    // ── Contact form (EmailJS or just simulate)
    document.getElementById('contactForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.disabled = false;
        document.getElementById('formSuccess').style.display = 'block';
        this.reset();
        setTimeout(() => document.getElementById('formSuccess').style.display = 'none', 4000);
      }, 1500);
    });

    // ── Smooth cursor on all links
    document.querySelectorAll('a').forEach(a => a.style.cursor = 'none');

    // ── 3D Photo Tilt
    const photoCards = document.querySelectorAll('.photo-card');
    const lbSrcs = Array.from(photoCards).map(c => c.dataset.src);

    photoCards.forEach(card => {
      const inner = card.querySelector('.photo-card-inner');
      const img = card.querySelector('img');

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotY = dx * 14;
        const rotX = -dy * 10;
        inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`;
        img.style.transform = `scale(1.06) translate(${dx * 6}px, ${dy * 4}px)`;
      });

      card.addEventListener('mouseleave', () => {
        inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        img.style.transform = 'scale(1) translate(0,0)';
        inner.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s';
        img.style.transition = 'transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.5s';
      });

      card.addEventListener('mouseenter', () => {
        inner.style.transition = 'transform 0.15s ease, box-shadow 0.4s';
        img.style.transition = 'transform 0.15s ease, filter 0.5s';
      });

      // Click → open lightbox
      card.addEventListener('click', () => openLb(parseInt(card.dataset.idx)));
    });

    // ── Lightbox
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbCounter = document.getElementById('lbCounter');
    let lbCurrent = 0;

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
    lbImg.style.transition = 'opacity 0.18s';
    document.getElementById('lbClose').addEventListener('click', closeLb);
    document.getElementById('lbPrev').addEventListener('click', () => lbNav(-1));
    document.getElementById('lbNext').addEventListener('click', () => lbNav(1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') lbNav(-1);
      if (e.key === 'ArrowRight') lbNav(1);
    });

emailjs.init("RoiQZ_9AAYh13TSLW");

document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.send("service_aq6wpmf", "template_zopnuk5", {
        from_name: document.getElementById("fname").value,
        from_email: document.getElementById("femail").value,
        subject: document.getElementById("fsubject").value,
        message: document.getElementById("fmessage").value
    })
    .then(() => {
        document.getElementById("formSuccess").style.display = "block";
        this.reset();
    })
    .catch((error) => {
        console.error("EmailJS Error:", error);
        alert("Failed to send message. Please try again.");
    });
});
