/* ============================================================
   KAZET – Usługi Spawalnicze | script.js
   ============================================================ */

'use strict';

/* ----------------------------------------------------------------
   1. NAV – scroll shadow + hamburger
---------------------------------------------------------------- */
const header    = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

// Close menu when a nav link is clicked
navMenu.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

/* ----------------------------------------------------------------
   2. SCROLL REVEAL – Intersection Observer
---------------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Staggered delay for sibling grid items
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(idx * 0.08, 0.4)}s`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ----------------------------------------------------------------
   3. COUNTER ANIMATION
---------------------------------------------------------------- */
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = +el.dataset.target;
    const dur    = 1800;
    const start  = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / dur, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };

    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

/* ----------------------------------------------------------------
   4. CANVAS SPARKS – hero particle effect
---------------------------------------------------------------- */
const sparksContainer = document.getElementById('sparks');

(function initSparks() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  sparksContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = sparksContainer.offsetWidth;
    H = canvas.height = sparksContainer.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Spark {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = H + 10;
      this.vx = (Math.random() - .5) * 1.2;
      this.vy = -(Math.random() * 2.5 + 1);
      this.alpha = Math.random() * .7 + .2;
      this.r     = Math.random() * 2 + .5;
      this.life  = 0;
      this.maxLife = Math.random() * 120 + 60;
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.vy   *= .995;
      this.vx   += (Math.random() - .5) * .12;
      this.life++;
      this.alpha = (1 - this.life / this.maxLife) * .6;
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = Math.random() > .6 ? '#ff8c00' : '#ff6b00';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create sparse particles
  for (let i = 0; i < 55; i++) {
    const p = new Spark();
    p.life = Math.floor(Math.random() * p.maxLife); // stagger initial positions
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ----------------------------------------------------------------
   5. PORTFOLIO FILTER
---------------------------------------------------------------- */
const filterBtns    = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.style.transition = 'opacity .3s, transform .3s';

      if (match) {
        item.classList.remove('hidden');
        item.style.opacity = '0';
        item.style.transform = 'scale(.95)';
        // Trigger reflow
        void item.offsetHeight;
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(.95)';
        setTimeout(() => item.classList.add('hidden'), 300);
      }
    });
  });
});

/* ----------------------------------------------------------------
   6. CONTACT FORM – validation & mock submit
---------------------------------------------------------------- */
const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = contactForm.name.value.trim();
  const phone   = contactForm.phone.value.trim();
  const message = contactForm.message.value.trim();
  const rodo    = contactForm.rodo.checked;

  if (!name || !phone || !message) {
    setStatus('Proszę wypełnić wszystkie wymagane pola (*).', 'error');
    return;
  }
  if (!rodo) {
    setStatus('Wymagana jest zgoda na przetwarzanie danych osobowych.', 'error');
    return;
  }

  // Simulate async submit
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Wyślij zapytanie';
    setStatus('✅ Dziękujemy! Skontaktujemy się z Tobą w ciągu 24 godzin.', 'success');
    contactForm.reset();
  }, 1500);
});

function setStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className   = `form-status ${type}`;
  setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 5000);
}

/* ----------------------------------------------------------------
   7. BACK TO TOP
---------------------------------------------------------------- */
const backToTop = document.getElementById('backToTop');

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ----------------------------------------------------------------
   8. SMOOTH ANCHOR SCROLL (account for sticky header)
---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ----------------------------------------------------------------
   9. ACTIVE NAV LINK on scroll
---------------------------------------------------------------- */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active-link',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
