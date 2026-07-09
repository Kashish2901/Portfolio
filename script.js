/* ═══════════════════════════════════════════════════════
   KASHISH PORTFOLIO — Main Script
   Flow: Loading (0→100%) → Choose Your Experience → Persona
═══════════════════════════════════════════════════════ */

(function () {

  /* ── Page refs ── */
  const loadingScreen = document.getElementById('loading-screen');
  const choosePage    = document.getElementById('choose-page');
  const analystPage   = document.getElementById('analyst-page');
  const creatorPage   = document.getElementById('creator-page');
  const humanPage     = document.getElementById('human-page');

  const pages = {
    analyst: analystPage,
    creator: creatorPage,
    human: humanPage,
    choose: choosePage
  };

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
     TRANSITION: Page Switching (Netflix style)
  ══════════════════════════════════════════ */
  
  let currentPageId = 'choose';
  const heroVideo = document.getElementById('hero-video');

  window.goToPage = function (persona) {
    switchProfile(persona);
  };

  window.switchProfile = function(persona) {
    // Hide dropdown if open
    document.querySelectorAll('.profile-dropdown').forEach(d => d.classList.remove('open'));
    
    if (currentPageId === persona) return; // Already on this page
    
    const oldPage = pages[currentPageId];
    const newPage = pages[persona];

    // Store chosen persona (for future use)
    sessionStorage.setItem('persona', persona);

    // Pause and mute video when navigating AWAY from human page
    if (currentPageId === 'human' && heroVideo) {
      heroVideo.pause();
      heroVideo.muted = true;
    }

    // Animate old page out
    oldPage.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    oldPage.style.opacity    = '0';
    oldPage.style.transform  = 'scale(1.03)';

    setTimeout(() => {
      oldPage.style.display = 'none';
      oldPage.classList.remove('page-visible', 'page-animate');
      
      // Reset transform/opacity for next time it's shown
      oldPage.style.transform = '';
      oldPage.style.opacity = '';

      if (persona !== 'choose') {
        document.body.style.overflow = 'auto';
      } else {
        document.body.style.overflow = 'hidden';
      }

      // Play video with sound ONLY when navigating TO human page
      if (persona === 'human' && heroVideo) {
        if (!heroVideo.getAttribute('src')) {
          heroVideo.setAttribute('src', 'background-video.mp4');
        }
        heroVideo.currentTime = 0;
        heroVideo.muted = false;
        heroVideo.play().catch(() => {});
      }

      // Reveal new page
      newPage.style.display = '';
      newPage.classList.remove('page-hidden');
      newPage.classList.add('page-visible');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          newPage.classList.add('page-animate');
        });
      });
      
      currentPageId = persona;
    }, 600);
  };

  /* ══════════════════════════════════════════
     DROPDOWN LOGIC
  ══════════════════════════════════════════ */
  window.toggleDropdown = function(imgElement) {
    const dropdown = imgElement.nextElementSibling;
    dropdown.classList.toggle('open');
  };

  // Close dropdown if clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.profile-dropdown-wrap')) {
      document.querySelectorAll('.profile-dropdown').forEach(d => d.classList.remove('open'));
    }
  });

  /* ══════════════════════════════════════════
     VIDEO INITIALIZATION
  ══════════════════════════════════════════ */
  // Pause and mute it initially, it will be played when Human page is opened
  if (heroVideo) {
    heroVideo.pause();
    heroVideo.muted = true;
  }

})();
