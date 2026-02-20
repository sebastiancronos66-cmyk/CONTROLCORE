/* ============================================
   CONTROL CORE - LANDING PAGE SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  /* ============================================
     SMOOTH SCROLL
     ============================================ */

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


  /* ============================================
     SCROLL FADE-IN ANIMATIONS
     ============================================ */

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

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
  style.textContent = `
    .is-visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

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
   TESTIMONIAL VIDEO AUTOPLAY ON VIEW
   (SMART SOUND-AWARE VERSION)
   ============================================ */

const testimonialVideo = document.querySelector('.testimonial-video');

if (testimonialVideo) {

  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {

        if (entry.isIntersecting) {

          testimonialVideo.play().catch(() => {});

        } else {

          // Solo pausamos si está mute
          if (testimonialVideo.muted) {
            testimonialVideo.pause();
          }

        }

      });
    },
    {
      threshold: 0.6
    }
  );

  videoObserver.observe(testimonialVideo);
}

  /* ============================================
   BIDIRECTIONAL VIDEO SOUND CONTROL (FIXED)
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

    const isMuted = video.muted;

    if (isMuted) {

      // Activar sonido en este
      video.muted = false;
      video.volume = 1;
      video.play().catch(() => {});
      icon.textContent = '🔊';

      // Silenciar el otro
      if (otherWrapper) {
        const otherVideo = otherWrapper.querySelector('video');
        const otherIcon = otherWrapper.querySelector('.sound-icon');

        if (otherVideo) otherVideo.muted = true;
        if (otherIcon) otherIcon.textContent = '🔇';
      }

    } else {

      video.muted = true;
      icon.textContent = '🔇';

    }

  });
}

// Inicializar controles
setupVideoControl(heroWrapper, testimonialWrapper);
setupVideoControl(testimonialWrapper, heroWrapper);

});