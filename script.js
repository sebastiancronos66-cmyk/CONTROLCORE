/* ============================================
   CONTROL CORE – ENHANCED ANIMATIONS v2
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================
     SMOOTH SCROLL
  ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ============================================
     SCROLL FADE-IN ANIMATIONS
  ============================================ */
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.benefit-card, .pillar-card, .method-step, .credential-card, .image-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
  });

  const style = document.createElement('style');
  style.textContent = `.is-visible { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  document.querySelectorAll('.benefits-grid .benefit-card').forEach((el, i) => { el.style.transitionDelay = `${i * 0.1}s`; });
  document.querySelectorAll('.pillars-grid .pillar-card').forEach((el, i) => { el.style.transitionDelay = `${i * 0.15}s`; });
  document.querySelectorAll('.credentials-grid .credential-card').forEach((el, i) => { el.style.transitionDelay = `${i * 0.1}s`; });
  document.querySelectorAll('.method-steps .method-step').forEach((el, i) => { el.style.transitionDelay = `${i * 0.15}s`; });

  /* ============================================
     TESTIMONIAL VIDEO AUTOPLAY ON VIEW
  ============================================ */
  const testimonialVideo = document.querySelector('.testimonial-video');
  if (testimonialVideo) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          testimonialVideo.play().catch(() => {});
        } else {
          if (testimonialVideo.muted) testimonialVideo.pause();
        }
      });
    }, { threshold: 0.6 });
    videoObserver.observe(testimonialVideo);
  }

  /* ============================================
     BIDIRECTIONAL VIDEO SOUND CONTROL
  ============================================ */
  const heroWrapper = document.querySelector('.hero-video-wrapper');
  const testimonialWrapper = document.querySelector('.testimonial-video-wrapper');

  function setupVideoControl(wrapper, otherWrapper) {
    if (!wrapper) return;
    const video = wrapper.querySelector('video');
    const button = wrapper.querySelector('.video-sound-toggle');
    const icon = wrapper.querySelector('.sound-icon');
    if (!video || !button || !icon) return;
    button.addEventListener('click', function () {
      if (video.muted) {
        video.muted = false; video.volume = 1; video.play().catch(() => {}); icon.textContent = '🔊';
        if (otherWrapper) {
          const ov = otherWrapper.querySelector('video'); const oi = otherWrapper.querySelector('.sound-icon');
          if (ov) ov.muted = true; if (oi) oi.textContent = '🔇';
        }
      } else { video.muted = true; icon.textContent = '🔇'; }
    });
  }
  setupVideoControl(heroWrapper, testimonialWrapper);
  setupVideoControl(testimonialWrapper, heroWrapper);


  /* ============================================
     CANVAS PARTICLE SYSTEM — FINAL CTA
  ============================================ */
  function createParticleCanvas(section, config) {
    const canvas = document.createElement('canvas');
    canvas.classList.add('particle-canvas');
    canvas.style.cssText = `
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 1;
    `;
    section.style.position = 'relative';
    section.insertBefore(canvas, section.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.size = Math.random() * config.maxSize + config.minSize;
        this.speedY = -(Math.random() * config.speedRange + config.minSpeed);
        this.speedX = (Math.random() - 0.5) * config.drift;
        this.opacity = 0;
        this.targetOpacity = Math.random() * config.maxOpacity + 0.05;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 150;
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = (Math.random() - 0.5) * 0.04;
        this.shape = config.shapes ? config.shapes[Math.floor(Math.random() * config.shapes.length)] : 'circle';
      }
      update() {
        this.life++;
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.5;
        this.y += this.speedY;
        if (this.life < 40) this.opacity = (this.life / 40) * this.targetOpacity;
        else if (this.life > this.maxLife - 40) this.opacity = ((this.maxLife - this.life) / 40) * this.targetOpacity;
        else this.opacity = this.targetOpacity;
        if (this.life >= this.maxLife || this.y < -20) this.reset();
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.wobble);
        if (this.shape === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.lineTo(this.size, 0);
          ctx.lineTo(0, this.size);
          ctx.lineTo(-this.size, 0);
          ctx.closePath();
          ctx.fill();
        } else if (this.shape === 'line') {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = this.size * 0.4;
          ctx.beginPath();
          ctx.moveTo(-this.size, 0);
          ctx.lineTo(this.size, 0);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < config.count; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    let isVisible = false;
    const sectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) animate(); else cancelAnimationFrame(animId);
    }, { threshold: 0.1 });
    sectionObserver.observe(section);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      if (isVisible) animId = requestAnimationFrame(animate);
    }
  }

// Final CTA — doradas intensas (fondo oscuro)
const finalCta = document.querySelector('.final-cta-section');
if (finalCta) {
  createParticleCanvas(finalCta, {
    count: 55, minSize: 1, maxSize: 3,
    minSpeed: 0.3, speedRange: 0.6, drift: 0.6, maxOpacity: 0.55,
    colors: ['hsla(42,70%,80%,1)','hsla(40,55%,65%,1)','hsla(348,35%,70%,1)','hsla(42,90%,90%,1)'],
    shapes: ['circle','diamond','circle','circle']
  });
}

// Hero — partículas crema muy sutiles
const heroSection = document.querySelector('.hero-with-image')?.closest('div') || document.querySelector('main > div');
if (heroSection) {
  createParticleCanvas(heroSection, {
    count: 25, minSize: 0.5, maxSize: 1.8,
    minSpeed: 0.2, speedRange: 0.4, drift: 0.4, maxOpacity: 0.15,
    colors: ['hsla(348,35%,42%,1)','hsla(40,55%,48%,1)','hsla(18,35%,15%,1)'],
    shapes: ['circle','diamond']
  });
}

// What Is (pilares) — sutiles rose/gold
const whatIsCard = document.querySelector('.what-is-card');
if (whatIsCard) {
  createParticleCanvas(whatIsCard, {
    count: 20, minSize: 0.5, maxSize: 1.5,
    minSpeed: 0.15, speedRange: 0.3, drift: 0.3, maxOpacity: 0.12,
    colors: ['hsla(348,35%,42%,1)','hsla(40,55%,48%,1)'],
    shapes: ['circle']
  });
}

// Pricing — partículas doradas sutiles
const pricingSection = document.querySelector('.pricing-section');
if (pricingSection) {
  createParticleCanvas(pricingSection, {
    count: 22, minSize: 0.6, maxSize: 2,
    minSpeed: 0.2, speedRange: 0.35, drift: 0.4, maxOpacity: 0.18,
    colors: ['hsla(40,55%,48%,1)','hsla(348,35%,42%,1)','hsla(42,70%,65%,1)'],
    shapes: ['circle','diamond']
  });
}

// Match Lips — muy sutiles
const matchLips = document.querySelector('.match-lips-section');
if (matchLips) {
  createParticleCanvas(matchLips, {
    count: 18, minSize: 0.5, maxSize: 1.5,
    minSpeed: 0.15, speedRange: 0.25, drift: 0.3, maxOpacity: 0.1,
    colors: ['hsla(348,35%,42%,1)','hsla(40,55%,48%,1)'],
    shapes: ['circle']
  });
}

// Story Section — sutiles cálidas
const storySection = document.querySelector('.story-section');
if (storySection) {
  createParticleCanvas(storySection, {
    count: 30, minSize: 0.8, maxSize: 2,
    minSpeed: 0.2, speedRange: 0.4, drift: 0.5, maxOpacity: 0.25,
    colors: ['hsla(348,35%,42%,1)','hsla(40,55%,48%,1)','hsla(18,35%,15%,1)'],
    shapes: ['circle','diamond']
  });
}

// Benefits — rose/gold mínimas
const benefitsSection = document.querySelector('.benefits-section');
if (benefitsSection) {
  createParticleCanvas(benefitsSection, {
    count: 20, minSize: 0.6, maxSize: 1.8,
    minSpeed: 0.15, speedRange: 0.3, drift: 0.4, maxOpacity: 0.18,
    colors: ['hsla(348,35%,42%,1)','hsla(40,55%,48%,1)'],
    shapes: ['circle']
  });
}

// Instructor — mínimas elegantes
const instructorSection = document.querySelector('.instructor-section');
if (instructorSection) {
  createParticleCanvas(instructorSection, {
    count: 18, minSize: 0.5, maxSize: 1.5,
    minSpeed: 0.15, speedRange: 0.25, drift: 0.3, maxOpacity: 0.1,
    colors: ['hsla(40,55%,48%,1)','hsla(348,35%,42%,1)'],
    shapes: ['circle']
  });
}

// Testimonial — sutiles
const testimonialSection = document.querySelector('.testimonial-video-section');
if (testimonialSection) {
  createParticleCanvas(testimonialSection, {
    count: 15, minSize: 0.5, maxSize: 1.4,
    minSpeed: 0.15, speedRange: 0.25, drift: 0.3, maxOpacity: 0.12,
    colors: ['hsla(348,35%,42%,1)','hsla(40,55%,48%,1)'],
    shapes: ['circle']
  });
}


  /* ============================================
     MAGNETIC BUTTONS
  ============================================ */
  document.querySelectorAll('.btn-cta, .btn-elegant').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const pull = 0.3;
      this.style.transform = `translate(${x * pull}px, ${y * pull}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });


  /* ============================================
     SECTION TITLE SPLIT-TEXT REVEAL
  ============================================ */
  function splitAndReveal(el) {
    const text = el.innerHTML;
    if (el.dataset.split) return;
    el.dataset.split = 'true';

    // Solo revela el primer texto directo (no spans con clase)
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach(textNode => {
      if (textNode.textContent.trim() === '') return;
      const words = textNode.textContent.split(' ');
      const frag = document.createDocumentFragment();
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'word-reveal';
        span.textContent = word;
        span.style.cssText = `
          display: inline-block;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          transition-delay: ${i * 0.07}s;
        `;
        frag.appendChild(span);
        if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        splitAndReveal(entry.target);
        setTimeout(() => {
          entry.target.querySelectorAll('.word-reveal').forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
        }, 50);
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.section-title, .final-cta-title').forEach(el => {
    titleObserver.observe(el);
  });


  /* ============================================
     STORY CARD — PARALLAX TILT
  ============================================ */
  const storyCard = document.querySelector('.story-card');
  if (storyCard && window.matchMedia('(hover: hover)').matches) {
    storyCard.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateZ(8px)`;
      this.style.boxShadow = `${-x * 20}px ${-y * 15}px 60px -20px hsla(18, 35%, 15%, 0.2)`;
    });
    storyCard.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  }


  /* ============================================
     PRICING CARD — TILT + SPARKLE
  ============================================ */
  const pricingCard = document.querySelector('.pricing-card');
  if (pricingCard && window.matchMedia('(hover: hover)').matches) {
    pricingCard.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.style.transform = `perspective(1200px) rotateY(${x * 5}deg) rotateX(${-y * 3}deg) translateZ(5px)`;
    });
    pricingCard.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });

    // Sparkle en click
    pricingCard.addEventListener('click', function (e) {
      for (let i = 0; i < 8; i++) spawnSparkle(e.clientX, e.clientY, i);
    });
  }

  function spawnSparkle(x, y, index) {
    const spark = document.createElement('div');
    const angle = (index / 8) * Math.PI * 2;
    const dist = 40 + Math.random() * 30;
    spark.style.cssText = `
      position: fixed; left: ${x}px; top: ${y}px;
      width: 6px; height: 6px; border-radius: 50%;
      background: hsl(40, 80%, 65%);
      pointer-events: none; z-index: 9999;
      transform: translate(-50%, -50%);
      animation: sparkFly 0.7s ease-out forwards;
      --dx: ${Math.cos(angle) * dist}px;
      --dy: ${Math.sin(angle) * dist}px;
    `;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
  }

  const sparkStyle = document.createElement('style');
  sparkStyle.textContent = `
    @keyframes sparkFly {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0); opacity: 0; }
    }
  `;
  document.head.appendChild(sparkStyle);


  /* ============================================
     GLOWING CURSOR TRAIL (solo desktop)
  ============================================ */
  if (window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) {
    const trail = [];
    const TRAIL_LENGTH = 8;

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9998;
        border-radius: 50%; background: hsla(40, 55%, 48%, ${0.6 - i * 0.06});
        width: ${6 - i * 0.5}px; height: ${6 - i * 0.5}px;
        transform: translate(-50%, -50%);
        transition: transform 0.05s ease;
        mix-blend-mode: multiply;
      `;
      document.body.appendChild(dot);
      trail.push({ el: dot, x: 0, y: 0 });
    }

    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function animTrail() {
      let px = mx, py = my;
      trail.forEach((t, i) => {
        const delay = i === 0 ? 0.4 : 0.6;
        t.x += (px - t.x) * delay;
        t.y += (py - t.y) * delay;
        t.el.style.left = t.x + 'px';
        t.el.style.top = t.y + 'px';
        px = t.x; py = t.y;
      });
      requestAnimationFrame(animTrail);
    }
    animTrail();

    // Ocultar trail cuando el cursor sale de la ventana
    document.addEventListener('mouseleave', () => trail.forEach(t => { t.el.style.opacity = '0'; }));
    document.addEventListener('mouseenter', () => trail.forEach(t => { t.el.style.opacity = '1'; }));
  }


  /* ============================================
     COUNTER ANIMATION — PRECIO
  ============================================ */
  const priceEl = document.querySelector('.price-amount');
  if (priceEl) {
    const target = parseInt(priceEl.textContent.replace(/\D/g, ''));
    let started = false;
    const priceObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        let current = 0;
        const duration = 1200;
        const step = target / (duration / 16);
        const interval = setInterval(() => {
          current = Math.min(current + step, target);
          priceEl.textContent = '$' + Math.floor(current);
          if (current >= target) {
            priceEl.textContent = '$' + target;
            clearInterval(interval);
          }
        }, 16);
        priceObserver.unobserve(entry.target);
      }
    }, { threshold: 0.5 });
    priceObserver.observe(priceEl);
  }


  /* ============================================
     BENEFIT CARDS — HOVER SPOTLIGHT
  ============================================ */
  document.querySelectorAll('.benefit-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.style.background = `radial-gradient(circle 120px at ${x}px ${y}px, hsla(32, 28%, 90%, 0.9), var(--background) 70%)`;
    });
    card.addEventListener('mouseleave', function () {
      this.style.background = '';
    });
  });


  /* ============================================
     PILLAR CARDS — SHIMMER ON HOVER
  ============================================ */
  document.querySelectorAll('.pillar-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      this.style.background = `radial-gradient(circle 80px at ${x}% ${y}%, rgba(255,255,255,0.95), rgba(255,255,255,0.6) 60%)`;
    });
    card.addEventListener('mouseleave', function () {
      this.style.background = '';
    });
  });


  /* ============================================
     SCROLL PROGRESS INDICATOR
  ============================================ */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(to right, var(--rose), var(--gold));
    z-index: 9999; pointer-events: none;
    transition: width 0.1s linear;
    box-shadow: 0 0 8px hsla(40, 55%, 48%, 0.6);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = (window.scrollY / max * 100) + '%';
  });


  /* ============================================
     SECTION ENTRANCE — SLIDE + FADE
  ============================================ */
  const sectionEls = document.querySelectorAll('.story-section, .pricing-section, .final-cta-section, .testimonial-video-section, .instructor-section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-entered');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  const sectionAnimStyle = document.createElement('style');
  sectionAnimStyle.textContent = `
    .story-section, .pricing-section, .final-cta-section,
    .testimonial-video-section, .instructor-section {
      opacity: 0;
      transform: translateY(40px);
      transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .section-entered {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(sectionAnimStyle);
  sectionEls.forEach(el => sectionObserver.observe(el));


  /* ============================================
     QUOTE MARK PARALLAX
  ============================================ */
  const quoteMark = document.querySelector('.story-quote-mark');
  if (quoteMark) {
    window.addEventListener('scroll', () => {
      const section = document.querySelector('.story-section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = -rect.top / window.innerHeight;
      quoteMark.style.transform = `translateX(-50%) translateY(${progress * 40}px)`;
    }, { passive: true });
  }


  /* ============================================
     INCLUDE ITEMS — STAGGERED CHECK REVEAL
  ============================================ */
  const includeItems = document.querySelectorAll('.include-item');
  includeItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-15px)';
    item.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
  });

  const includesObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      includeItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      });
      includesObserver.disconnect();
    }
  }, { threshold: 0.3 });

  const pricingContent = document.querySelector('.pricing-includes');
  if (pricingContent) includesObserver.observe(pricingContent);

  /* ============================================
   HERO IMAGE — JS EFFECTS
   Pega este bloque DENTRO de tu DOMContentLoaded
   al final, antes del último });
   ============================================ */

// ── HERO IMAGE EFFECTS ──────────────────────

(function () {

  const wrapper = document.querySelector('.hero-image-wrapper');
  if (!wrapper) return;

  // ── 1. RINGS ORBITALES ──────────────────
  const ring1 = document.createElement('div');
  ring1.className = 'hero-orbit-ring';
  const ring2 = document.createElement('div');
  ring2.className = 'hero-orbit-ring-2';
  wrapper.appendChild(ring1);
  wrapper.appendChild(ring2);

  // Dot en ring 1
  const dot1 = document.createElement('div');
  dot1.className = 'hero-orbit-dot';
  dot1.style.cssText = `
    position: absolute;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: hsla(40, 65%, 65%, 1);
    box-shadow: 0 0 10px 3px hsla(40, 55%, 48%, 0.7);
    pointer-events: none; z-index: 12;
    top: 0; left: 50%;
    transform-origin: 0 50%;
    animation: orbit1 18s linear infinite;
  `;
  ring1.appendChild(dot1);

  // Dot en ring 2
  const dot2 = document.createElement('div');
  dot2.style.cssText = `
    position: absolute;
    width: 5px; height: 5px;
    border-radius: 50%;
    background: hsla(348, 45%, 60%, 1);
    box-shadow: 0 0 8px 2px hsla(348, 35%, 42%, 0.6);
    pointer-events: none; z-index: 12;
    top: 50%; left: 100%;
    transform-origin: 0 0;
    animation: orbit2 28s linear infinite reverse;
  `;
  ring2.appendChild(dot2);

  // Keyframes dots
  const orbitStyle = document.createElement('style');
  orbitStyle.textContent = `
    @keyframes orbit1 {
      from { transform: translateX(-50%) rotate(0deg) translateX(calc(var(--ring-r, 50%) + 6px)) rotate(0deg); }
      to   { transform: translateX(-50%) rotate(360deg) translateX(calc(var(--ring-r, 50%) + 6px)) rotate(-360deg); }
    }
    @keyframes orbit2 {
      from { transform: rotate(0deg) translateX(50%) rotate(0deg); }
      to   { transform: rotate(-360deg) translateX(50%) rotate(360deg); }
    }
  `;
  document.head.appendChild(orbitStyle);

  // ── 2. GLOWS LATERALES ──────────────────
  const glowL = document.createElement('div');
  glowL.className = 'hero-side-glow-l';
  const glowR = document.createElement('div');
  glowR.className = 'hero-side-glow-r';
  wrapper.appendChild(glowL);
  wrapper.appendChild(glowR);

  // ── 3. PARTÍCULAS FLOTANTES ──────────────
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-particle-canvas';
  canvas.style.cssText = `
    position: absolute;
    top: -15%; left: -15%;
    width: 130%; height: 130%;
    pointer-events: none;
    z-index: 10;
  `;
  wrapper.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function sizeCanvas() {
    canvas.width  = wrapper.offsetWidth  * 1.3;
    canvas.height = wrapper.offsetHeight * 1.3;
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  // Colores mezclados dorado/rosa
  const COLORS = [
    'hsla(42,70%,75%,1)',
    'hsla(40,55%,55%,1)',
    'hsla(348,40%,60%,1)',
    'hsla(42,80%,85%,1)',
    'hsla(32,50%,65%,1)',
  ];

  class HeroParticle {
    constructor() { this.init(); }
    init() {
      // Nacer en los bordes de la imagen
      const edge = Math.floor(Math.random() * 4);
      const w = canvas.width, h = canvas.height;
      if (edge === 0) { this.x = Math.random() * w; this.y = h; }
      else if (edge === 1) { this.x = 0; this.y = Math.random() * h; }
      else if (edge === 2) { this.x = w; this.y = Math.random() * h; }
      else { this.x = Math.random() * w; this.y = 0; }

      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = -(Math.random() * 0.8 + 0.3);
      this.size = Math.random() * 3 + 1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 0;
      this.maxLife = Math.random() * 180 + 100;
      this.opacity = 0;
      this.targetOpacity = Math.random() * 0.7 + 0.3;
      this.isDiamond = Math.random() > 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = (Math.random() - 0.5) * 0.05;
    }
    update() {
      this.life++;
      this.x += this.vx + Math.sin(this.angle) * 0.4;
      this.y += this.vy;
      this.angle += this.angleSpeed;
      const fade = 30;
      if (this.life < fade) this.opacity = (this.life / fade) * this.targetOpacity;
      else if (this.life > this.maxLife - fade) this.opacity = ((this.maxLife - this.life) / fade) * this.targetOpacity;
      else this.opacity = this.targetOpacity;
      if (this.life >= this.maxLife) this.init();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.size * 3;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      if (this.isDiamond) {
        const s = this.size * 1.4;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s, 0);
        ctx.lineTo(0, s);
        ctx.lineTo(-s, 0);
        ctx.closePath();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: 60 }, () => {
    const p = new HeroParticle();
    p.life = Math.random() * p.maxLife;
    p.opacity = p.targetOpacity * (p.life / p.maxLife);
    return p;
  });

  let animating = true;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    if (animating) requestAnimationFrame(loop);
  }
  loop();

  // ── 4. SPARKLES TIPO ESTRELLA ─────────────
  const sparklePositions = [
    { top: '8%',  left: '12%',  size: 12, dur: '3.2s', delay: '0s'   },
    { top: '15%', right: '10%', size: 9,  dur: '2.8s', delay: '0.8s' },
    { top: '45%', left: '5%',   size: 7,  dur: '4s',   delay: '1.4s' },
    { top: '70%', right: '8%',  size: 10, dur: '3.5s', delay: '0.4s' },
    { top: '85%', left: '18%',  size: 8,  dur: '2.5s', delay: '2s'   },
    { top: '30%', right: '4%',  size: 6,  dur: '3.8s', delay: '1.8s' },
    { top: '55%', left: '2%',   size: 11, dur: '3s',   delay: '0.6s' },
  ];

  sparklePositions.forEach(pos => {
    const el = document.createElement('div');
    el.style.cssText = `
      position: absolute;
      top: ${pos.top || 'auto'};
      bottom: ${pos.bottom || 'auto'};
      left: ${pos.left || 'auto'};
      right: ${pos.right || 'auto'};
      width: ${pos.size}px;
      height: ${pos.size}px;
      pointer-events: none;
      z-index: 13;
      animation: sparkleAppear ${pos.dur} ease-in-out infinite ${pos.delay};
    `;
    // Cruz de 4 puntas
    el.innerHTML = `<svg width="${pos.size * 2}" height="${pos.size * 2}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">
      <path d="M10 1 C10 5, 10 5, 10 10 C10 5, 10 5, 10 1Z" stroke="hsla(42,70%,75%,0.9)" stroke-width="1.5" fill="hsla(42,70%,75%,0.6)"/>
      <path d="M1 10 C5 10, 5 10, 10 10 C5 10, 5 10, 1 10Z" stroke="hsla(42,70%,75%,0.9)" stroke-width="1.5" fill="hsla(42,70%,75%,0.6)"/>
      <path d="M10 10 C10 15, 10 15, 10 19Z" stroke="hsla(42,70%,75%,0.9)" stroke-width="1.5" fill="hsla(42,70%,75%,0.6)"/>
      <path d="M10 10 C15 10, 15 10, 19 10Z" stroke="hsla(42,70%,75%,0.9)" stroke-width="1.5" fill="hsla(42,70%,75%,0.6)"/>
      <circle cx="10" cy="10" r="2" fill="hsla(42,80%,85%,1)"/>
    </svg>`;
    wrapper.appendChild(el);
  });

  const sparkleStyle = document.createElement('style');
  sparkleStyle.textContent = `
    @keyframes sparkleAppear {
      0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
      25%       { opacity: 1; transform: scale(1) rotate(45deg); }
      75%       { opacity: 0.8; transform: scale(0.7) rotate(90deg); }
    }
  `;
  document.head.appendChild(sparkleStyle);

})();

/* ============================================
     MATCH LIPS CAROUSEL
  ============================================ */
  (function () {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const dotsContainer = document.querySelector('.carousel-dots');
    const total = slides.length / 2; // reales (sin duplicados)
    let current = 0;
    let autoTimer;
    let isTransitioning = false;

    // Crear dots
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }

    function updateDots() {
      dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function updateSlides() {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      if (isTransitioning) return;
      isTransitioning = true;
      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
      updateSlides();
      setTimeout(() => { isTransitioning = false; }, 750);
    }

    function next() {
      const nextIndex = (current + 1) % total;
      goTo(nextIndex);
    }

    // Autoplay
    function startAuto() {
      autoTimer = setInterval(next, 3200);
    }
    function stopAuto() {
      clearInterval(autoTimer);
    }

    // Pausar en hover
    const card = document.querySelector('.visual-card.image-card');
    if (card) {
      card.addEventListener('mouseenter', stopAuto);
      card.addEventListener('mouseleave', startAuto);
    }

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });

    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? next() : goTo((current - 1 + total) % total);
      }
      startAuto();
    }, { passive: true });

    // Init
    updateSlides();
    startAuto();

  })();

});