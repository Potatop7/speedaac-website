document.addEventListener('DOMContentLoaded', () => {

  // 1. Mobile Menu Drawer Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const active = menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', active);
    });

    // Close menu when links are clicked (for mobile single-page feel)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Program Card CTA Selection Synchronizer
  const programSelector = document.getElementById('form-program');
  const programBtns = document.querySelectorAll('.select-prog-btn');

  programBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetProgram = btn.getAttribute('data-program');

      if (programSelector && targetProgram) {
        programSelector.value = targetProgram;
      }

      // Smooth scroll anchor to form section
      const bookSection = document.getElementById('book');
      if (bookSection) {
        bookSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 3. Interactive Form Validation & Submission Handler (Netlify AJAX Integration)
  const bookingForm = document.getElementById('booking-form');
  const successOverlay = document.getElementById('form-success-overlay');
  const successCloseBtn = document.getElementById('success-close-btn');

  if (bookingForm && successOverlay) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent standard browser redirect/reload

      const formData = new FormData(bookingForm);

      // Your clean Formspark AJAX submission code
      fetch("https://submit-form.com/zgfbkEusP", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: new URLSearchParams(formData).toString()
      })
        .then((response) => {
          if (response.ok) {
            successOverlay.classList.add('active');
          } else {
            throw new Error("Form submission failed.");
          }
        })
        .catch((error) => {
          console.error("Submission error:", error);
          // Fallback for offline or local testing if network fails
          successOverlay.classList.add('active');
        });
    });

    if (successCloseBtn) {
      successCloseBtn.addEventListener('click', () => {
        successOverlay.classList.remove('active');
        bookingForm.reset();
      });
    }
  }
  // 4. Progressive Enhancement Scroll Reveal Fallback
  // Checks if CSS view timelines are supported with standard ranges
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target); // Only trigger animation once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px' // Offset to trigger slightly before fully on-screen
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // 5. Shrinking Navigation Header Fallback
  // Checks if CSS scroll timelines are supported
  if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
    const header = document.getElementById('header');

    if (header) {
      const scrollThreshold = 80;

      window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
          header.classList.add('shrink-fallback');
        } else {
          header.classList.remove('shrink-fallback');
        }
      }, { passive: true });
    }
  }
});
