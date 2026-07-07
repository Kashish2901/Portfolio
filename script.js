/* ═══════════════════════════════════════════════════════
   KASHISH PORTFOLIO — Main Script
   Flow: Loading (0→100%) → Choose Your Experience → About
═══════════════════════════════════════════════════════ */

(function () {

  /* ── Page refs ── */
  const loadingScreen = document.getElementById('loading-screen');
  const choosePage    = document.getElementById('choose-page');
  const aboutPage     = document.getElementById('about-page');

  /* ── Loader refs ── */
  const fill       = document.getElementById('progress-fill');
  const dot        = document.getElementById('progress-dot');
  const percentTxt = document.getElementById('percent-text');

  /* ══════════════════════════════════════════
     LOADING ANIMATION  0 → 100%  (~4 seconds)
  ══════════════════════════════════════════ */
  const DURATION_MS = 4000;
  const STEP_MS     = 30;
  let elapsed = 0;

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  const timer = setInterval(() => {
    elapsed += STEP_MS;
    const raw   = Math.min(elapsed / DURATION_MS, 1);
    const eased = easeInOut(raw);
    const pct   = Math.min(Math.round(eased * 100), 100);

    fill.style.width = pct + '%';
    dot.style.left   = pct + '%';
    percentTxt.textContent = pct + '%';
    document.querySelector('.progress-track').setAttribute('aria-valuenow', pct);

    if (pct >= 100) {
      clearInterval(timer);
      setTimeout(showChoosePage, 650); // brief pause at 100%
    }
  }, STEP_MS);

  /* ══════════════════════════════════════════
     TRANSITION: Loading → Choose Your Experience
  ══════════════════════════════════════════ */
  function showChoosePage() {
    // Fade out loader
    loadingScreen.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    loadingScreen.style.opacity    = '0';
    loadingScreen.style.transform  = 'scale(1.03)';

    setTimeout(() => {
      loadingScreen.style.display = 'none';

      // Reveal choose page
      choosePage.classList.remove('page-hidden');
      choosePage.classList.add('page-visible');

      // Trigger CSS transition on next paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          choosePage.classList.add('page-animate');
        });
      });

    }, 700);
  }

  /* ══════════════════════════════════════════
     TRANSITION: Choose → About
     Called by card onclick="goToAbout('analyst')" etc.
  ══════════════════════════════════════════ */
  window.goToAbout = function (persona) {
    // Store chosen persona (for future use)
    sessionStorage.setItem('persona', persona);

    // Animate choose page out
    choosePage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    choosePage.style.opacity    = '0';
    choosePage.style.transform  = 'scale(1.03)';

    setTimeout(() => {
      choosePage.style.display = 'none';
      document.body.style.overflow = 'auto';

      // Reveal about page
      aboutPage.classList.remove('page-hidden');
      aboutPage.classList.add('page-visible');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          aboutPage.classList.add('page-animate');
        });
      });
    }, 600);
  };

  /* ══════════════════════════════════════════
     VIDEO SOUND HANDLING
     Browsers block autoplay with sound, so we start muted
     and unmute after the user's first interaction.
  ══════════════════════════════════════════ */
  const heroVideo = document.querySelector('.hero-video-bg');
  if (heroVideo) {
    // Ensure autoplay works by starting muted
    heroVideo.muted = true;
    heroVideo.play().catch(() => {});

    // Unmute on first user interaction anywhere on the page
    function unmuteVideo() {
      if (heroVideo) {
        heroVideo.muted = false;
      }
      document.removeEventListener('click', unmuteVideo);
      document.removeEventListener('touchstart', unmuteVideo);
    }
    document.addEventListener('click', unmuteVideo);
    document.addEventListener('touchstart', unmuteVideo);
  }

})();
