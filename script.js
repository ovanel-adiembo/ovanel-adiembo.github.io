/* ═══════════════════════════════════════════════════
   PORTFOLIO OVANEL ADIEMBO — SCRIPT.JS
   BTS SIO SISR · Session 2026
═══════════════════════════════════════════════════ */

'use strict';

// ── Typewriter effect ───────────────────────────────
const phrases = [
  'Étudiant BTS SIO SISR',
  'Administrateur Systèmes & Réseaux',
  'Passionné de Cybersécurité',
  'Déployeur SIEM Wazuh',
  'Configurateur FreeRADIUS'
];
let pIdx = 0, cIdx = 0, deleting = false;
function typeWriter() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const phrase = phrases[pIdx];
  if (!deleting) {
    el.textContent = phrase.substring(0, ++cIdx);
    if (cIdx === phrase.length) { deleting = true; setTimeout(typeWriter, 2000); return; }
  } else {
    el.textContent = phrase.substring(0, --cIdx);
    if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  }
  setTimeout(typeWriter, deleting ? 50 : 80);
}
typeWriter();

// ── Navbar scroll ───────────────────────────────────
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  // Navbar
  navbar.classList.toggle('scrolled', y > 50);
  // Back to top
  backToTop.classList.toggle('visible', y > 400);
  // Active nav link
  let current = '';
  sections.forEach(s => { if (y >= s.offsetTop - 80) current = s.id; });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ── Back to top ─────────────────────────────────────
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Mobile menu ─────────────────────────────────────
const toggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const bars = toggle.querySelectorAll('span');
  bars[0].style.transform = navMenu.classList.contains('open') ? 'rotate(45deg) translate(5px, 6px)' : '';
  bars[1].style.opacity = navMenu.classList.contains('open') ? '0' : '1';
  bars[2].style.transform = navMenu.classList.contains('open') ? 'rotate(-45deg) translate(5px, -6px)' : '';
});
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => { navMenu.classList.remove('open'); });
});

// ── Reveal on scroll ────────────────────────────────
const revealEls = document.querySelectorAll(
  '.section-header, .about-grid, .skill-category, .project-card, .stage-card, .timeline-item, .source-card, .cert-card, .skill-bar-item'
);
revealEls.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => observer.observe(el));

// ── Skill bars animation ─────────────────────────────
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.bar-fill');
      bars.forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const skillSection = document.querySelector('.skill-bars');
if (skillSection) barObserver.observe(skillSection);

// ── Photo modal ──────────────────────────────────────
const modal = document.createElement('div');
modal.className = 'photo-modal';
modal.innerHTML = '<img src="" alt="Photo agrandie"><button class="modal-close" aria-label="Fermer">×</button>';
document.body.appendChild(modal);

const modalImg = modal.querySelector('img');
const modalClose = modal.querySelector('.modal-close');

document.querySelectorAll('.photo-item').forEach(item => {
  item.addEventListener('click', () => {
    modalImg.src = item.querySelector('img').src;
    modalImg.alt = item.querySelector('img').alt;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});
const closeModal = () => { modal.classList.remove('open'); document.body.style.overflow = ''; };
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Particles ────────────────────────────────────────
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 10 + 8;
    p.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      background:rgba(167,139,250,${Math.random() * 0.4 + 0.1});
      border-radius:50%;
      left:${x}%;
      bottom:-10px;
      animation:particleFloat ${duration}s ${delay}s ease-in-out infinite;
    `;
    container.appendChild(p);
  }
  if (!document.getElementById('particleStyle')) {
    const style = document.createElement('style');
    style.id = 'particleStyle';
    style.textContent = `
      @keyframes particleFloat {
        0%{transform:translateY(0) scale(1);opacity:0}
        10%{opacity:1}
        90%{opacity:0.5}
        100%{transform:translateY(-100vh) scale(0);opacity:0}
      }
    `;
    document.head.appendChild(style);
  }
}
createParticles();

// ── Contact form validation & anti-spam ─────────────
const form = document.getElementById('contactForm');
if (form) {
  const msgArea = document.getElementById('message');
  const charCount = document.getElementById('charCount');

  msgArea.addEventListener('input', () => {
    const len = msgArea.value.length;
    charCount.textContent = `${len} / 1000`;
    charCount.style.color = len > 900 ? 'var(--danger)' : 'var(--text-muted)';
  });

  function validate(id, errorId, check, msg) {
    const el = document.getElementById(id);
    const err = document.getElementById(errorId);
    const isValid = check(el.value.trim());
    el.classList.toggle('error', !isValid);
    err.textContent = isValid ? '' : msg;
    return isValid;
  }

  function sanitize(str) {
    return str.replace(/[<>]/g, '').trim().substring(0, 500);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot anti-spam
    if (form.querySelector('[name="website"]').value !== '') return;

    const v1 = validate('name', 'nameError', v => v.length >= 2 && v.length <= 100, 'Nom requis (2-100 caractères)');
    const v2 = validate('email', 'emailError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Email invalide');
    const v3 = validate('subject', 'subjectError', v => v.length >= 3, 'Sujet requis (min. 3 caractères)');
    const v4 = validate('message', 'messageError', v => v.length >= 10 && v.length <= 1000, 'Message requis (10-1000 caractères)');

    if (!v1 || !v2 || !v3 || !v4) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Envoi...';

    // Simulation envoi (à remplacer par un service comme Formspree)
    setTimeout(() => {
      form.reset();
      charCount.textContent = '0 / 1000';
      const success = document.getElementById('formSuccess');
      success.classList.add('show');
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Envoyer';
      setTimeout(() => success.classList.remove('show'), 6000);
    }, 1200);
  });

  // Validation à la saisie
  ['name','email','subject','message'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('blur', () => el.classList.remove('error'));
  });
}

// ── Smooth anchor ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

console.log('%cPortfolio ADIEMBO Ovanel — BTS SIO SISR 2026', 'color:#a78bfa;font-size:14px;font-weight:bold');
console.log('%cN° candidat : 02051912515 | ovaneladiembo@gmail.com', 'color:#9d95b8;font-size:12px');
