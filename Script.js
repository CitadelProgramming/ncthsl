// ----------------------
// (Start of your original Script.js — preserved as-is)
// ----------------------

const navlinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
  document.body.classList.toggle("show-mobile-menu");
});

menuCloseButton.addEventListener("click", () => menuOpenButton.click());

navlinks.forEach(link => {
  link.addEventListener("click", () => menuOpenButton.click());
});

// Swiper initialization
const swiper = new Swiper('.slider-wrapper', {
  loop: true,
  grabCursor: true,
  spaceBetween: 25,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 }
  }
});

// Newsletter form AJAX
const form = document.querySelector('.newsletter-form');
const messageBox = document.querySelector('#subscription-message');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const response = await fetch('subscribe.php', { method: 'POST', body: formData });
      const text = await response.text();
      messageBox.textContent = text;
      messageBox.style.color = text.includes("Thank") ? "lightgreen" : "orange";
      form.reset();
    } catch (error) {
      messageBox.textContent = "Something went wrong. Please try again.";
      messageBox.style.color = "red";
    }
  });
}

// ----------------------
// End of preserved original content region
// ----------------------


/* ===== ADDED: Submenu popup logic (enhanced with back-to-mini-menu feature) ===== */
(function () {
  let lastMiniPopup = null; // Track which mini-popup opened the submenu

  function showOverlay() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'block';
      requestAnimationFrame(() => overlay.classList.add('active'));
    }
    document.body.classList.add('blurred');
  }

  function hideOverlay() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.style.display = 'none', 200);
    }
    document.body.classList.remove('blurred');
  }

  function closeAllPopups() {
    document.querySelectorAll('.mini-popup, .content-popup').forEach(el => el.classList.remove('active'));
    hideOverlay();
  }

  function openMiniPopup(id) {
    closeAllPopups();
    const p = document.getElementById(id);
    if (p) {
      showOverlay();
      p.classList.add('active');
    }
  }

  function openContentPopup(popupId, sectionSelector) {
    closeAllPopups();
    const popup = document.getElementById(popupId);
    const section = document.querySelector(sectionSelector);
    if (!popup || !section) return;

    const wasHidden = section.classList.contains('hidden-section');
    if (wasHidden) section.classList.remove('hidden-section');
    showOverlay();

    setTimeout(() => {
      const container = popup.querySelector('.popup-content');
      if (container) {
        const clone = section.cloneNode(true);
        clone.removeAttribute('id');
        container.innerHTML = '';
        container.appendChild(clone);
      }
      popup.classList.add('active');
      if (wasHidden) section.classList.add('hidden-section');
    }, 50);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // About / Menu triggers
    document.querySelectorAll('[data-mini]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        const id = el.getAttribute('data-mini');
        if (id) {
          openMiniPopup(id);
          lastMiniPopup = id; // Remember the last opened mini menu
        }
        document.body.classList.remove('show-mobile-menu');
      });
    });

    // Mini-popup close
    document.querySelectorAll('.mini-close-btn').forEach(btn =>
      btn.addEventListener('click', closeAllPopups)
    );

    // Overlay click closes everything
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', closeAllPopups);

    // Submenu links open content popups
    document.querySelectorAll('.mini-link').forEach(btn => {
      btn.addEventListener('click', e => {
        const targetPopup = btn.getAttribute('data-open');
        const sectionSel = btn.getAttribute('data-section');
        if (targetPopup && sectionSel) {
          const miniParent = btn.closest('.mini-popup');
          if (miniParent) lastMiniPopup = miniParent.id; // Track parent mini-popup
          openContentPopup(targetPopup, sectionSel);
        }
      });
    });

    // Content popup close buttons — return to mini menu
    document.querySelectorAll('.content-popup .close-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        closeAllPopups();
        if (lastMiniPopup) {
          // Reopen the mini menu that launched this popup
          setTimeout(() => openMiniPopup(lastMiniPopup), 200);
        }
      })
    );

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === "Escape") {
        const anyContentPopupOpen = document.querySelector('.content-popup.active');
        closeAllPopups();
        if (anyContentPopupOpen && lastMiniPopup) {
          // Return to mini menu if submenu was open
          setTimeout(() => openMiniPopup(lastMiniPopup), 200);
        }
      }
    });
  });
})();
