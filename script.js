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
  const connectPage   = document.getElementById('connect-page');

  const pages = {
    analyst: analystPage,
    creator: creatorPage,
    human: humanPage,
    connect: connectPage,
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
  const creatorVideo = document.getElementById('creator-hero-video');
  const analystVideo = document.getElementById('analyst-video');
  const humanVideo = document.getElementById('human-bg-video');

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
    if (persona !== 'connect') {
      sessionStorage.setItem('persona', persona);
    }

    // Pause and mute video when navigating AWAY from human page
    if (currentPageId === 'human' && humanVideo) {
      humanVideo.pause();
      humanVideo.muted = true;
    }
    if (currentPageId === 'human' && heroVideo) {
      heroVideo.pause();
      heroVideo.muted = true;
    }

    // Pause and mute video when navigating AWAY from creator page
    if (currentPageId === 'creator' && creatorVideo) {
      creatorVideo.pause();
      creatorVideo.muted = true;
    }

    // Pause and mute video when navigating AWAY from analyst page
    if (currentPageId === 'analyst' && analystVideo) {
      analystVideo.pause();
      analystVideo.muted = true;
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

      // Play background video WITH MUSIC when navigating TO human page
      if (persona === 'human' && humanVideo) {
        if (!humanVideo.getAttribute('src')) {
          humanVideo.setAttribute('src', 'human-bg.mp4');
        }
        humanVideo.currentTime = 0;
        humanVideo.muted = false;
        humanVideo.volume = 0.85;
        const humanSoundBtn = document.getElementById('human-sound-btn');
        if (humanSoundBtn) humanSoundBtn.innerHTML = '<span>🔊 MUSIC ON</span>';
        humanVideo.play().catch(() => {});
      }

      // Play video ONLY when navigating TO creator page
      if (persona === 'creator' && creatorVideo) {
        if (!creatorVideo.getAttribute('src')) {
          creatorVideo.setAttribute('src', 'creator-bg.mp4');
        }
        creatorVideo.currentTime = 0;
        creatorVideo.play().catch(() => {});
      }

      // Play background video WITH MUSIC when navigating TO analyst page
      if (persona === 'analyst' && analystVideo) {
        if (!analystVideo.getAttribute('src')) {
          analystVideo.setAttribute('src', 'analyst-bg.mp4');
        }
        analystVideo.currentTime = 0;
        analystVideo.muted = false;
        analystVideo.volume = 0.85;
        const soundBtn = document.getElementById('analyst-sound-btn');
        if (soundBtn) soundBtn.innerHTML = '<span>🔊 MUSIC ON</span>';
        analystVideo.play().catch(() => {});
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
  // Pause and mute videos initially, they will be played when their respective page is opened
  if (heroVideo) {
    heroVideo.pause();
    heroVideo.muted = true;
  }
  if (creatorVideo) {
    creatorVideo.pause();
    creatorVideo.muted = true;
  }
  if (analystVideo) {
    analystVideo.pause();
    analystVideo.muted = true;
  }

  window.toggleAnalystAudio = function() {
    const video = document.getElementById('analyst-video');
    const btn = document.getElementById('analyst-sound-btn');
    if (!video || !btn) return;
    if (video.muted) {
      video.muted = false;
      video.volume = 0.85;
      btn.innerHTML = '<span>🔊 MUSIC ON</span>';
    } else {
      video.muted = true;
      btn.innerHTML = '<span>🔇 MUSIC OFF</span>';
    }
  };

  window.toggleHumanSound = function() {
    const video = document.getElementById('human-bg-video');
    const btn = document.getElementById('human-sound-btn');
    if (!video || !btn) return;
    if (video.muted) {
      video.muted = false;
      video.volume = 0.85;
      btn.innerHTML = '<span>🔊 MUSIC ON</span>';
    } else {
      video.muted = true;
      btn.innerHTML = '<span>🔇 MUSIC OFF</span>';
    }
  };

  /* ══════════════════════════════════════════
     RESUME MODAL PREVIEW LOGIC
  ══════════════════════════════════════════ */
  window.openResumeModal = function() {
    const modal = document.getElementById('resume-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeResumeModal = function() {
    const modal = document.getElementById('resume-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  // Close modal when clicking on dark backdrop overlay
  document.addEventListener('click', function(event) {
    const modal = document.getElementById('resume-modal');
    if (modal && event.target === modal) {
      window.closeResumeModal();
    }
  });

  // Close modal on Escape key press
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      window.closeResumeModal();
    }
  });

})();
