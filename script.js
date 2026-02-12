/* ============================================
   CONTROL CORE - LANDING PAGE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Intersection Observer for fade-in animations on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add scroll animation classes
  document.querySelectorAll('.benefit-card, .pillar-card, .method-step, .credential-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Handle visibility
  const style = document.createElement('style');
  style.textContent = `
    .is-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // Add stagger delay to grid items
  document.querySelectorAll('.benefits-grid .benefit-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  document.querySelectorAll('.pillars-grid .pillar-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
  });

  document.querySelectorAll('.credentials-grid .credential-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
  });

   document.querySelectorAll('.method-steps .method-step').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
  });

  /* ============================================
     HERO VIDEO SOUND TOGGLE
     ============================================ */

  const video = document.querySelector('.hero-video');
  const soundButton = document.querySelector('.video-sound-toggle');
  const soundIcon = document.querySelector('.sound-icon');

  if (video && soundButton && soundIcon) {
    soundButton.addEventListener('click', function () {
      if (video.muted) {
        video.muted = false;
        video.play();
        soundIcon.textContent = '🔊';
      } else {
        video.muted = true;
        soundIcon.textContent = '🔇';
      }
    });
  }

});
