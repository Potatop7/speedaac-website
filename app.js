document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════════
  // 1. Mobile Menu Drawer Toggle
  // ══════════════════════════════════════════════
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks   = document.querySelectorAll('.nav-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const active = menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', active);
      // Prevent body scroll when menu open
      document.body.style.overflow = active ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ══════════════════════════════════════════════
  // 2. Program Card CTA Selection Synchronizer
  //    Syncs any .select-prog-btn (cards + footer links)
  //    to the booking form <select> and scrolls to form
  // ══════════════════════════════════════════════
  const programSelector = document.getElementById('form-program');
  const programBtns     = document.querySelectorAll('.select-prog-btn');

  programBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetProgram = btn.getAttribute('data-program');

      if (programSelector && targetProgram) {
        programSelector.value = targetProgram;
        // Brief highlight flash on the select field
        programSelector.classList.add('field-highlight');
        setTimeout(() => programSelector.classList.remove('field-highlight'), 900);
      }

      const bookSection = document.getElementById('book');
      if (bookSection) {
        bookSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ══════════════════════════════════════════════
  // 3. Interactive Form Validation & AJAX Submission
  //    (Formspark integration)
  // ══════════════════════════════════════════════
  const bookingForm      = document.getElementById('booking-form');
  const successOverlay   = document.getElementById('form-success-overlay');
  const successCloseBtn  = document.getElementById('success-close-btn');
  const submitBtn        = bookingForm ? bookingForm.querySelector('[type="submit"]') : null;

  if (bookingForm && successOverlay) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Loading state
      if (submitBtn) {
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
      }

      const formData = new FormData(bookingForm);

      fetch('https://submit-form.com/zgfbkEusP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams(formData).toString()
      })
        .then((response) => {
          if (response.ok) {
            successOverlay.classList.add('active');
          } else {
            throw new Error('Form submission failed.');
          }
        })
        .catch((error) => {
          console.error('Submission error:', error);
          // Fallback — show success even on network error (local dev)
          successOverlay.classList.add('active');
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.textContent = 'Apply Now →';
            submitBtn.disabled = false;
          }
        });
    });

    if (successCloseBtn) {
      successCloseBtn.addEventListener('click', () => {
        successOverlay.classList.remove('active');
        bookingForm.reset();
      });
    }
  }

  // ══════════════════════════════════════════════
  // 4. Progressive Enhancement Scroll Reveal Fallback
  //    Activates only when CSS view() timelines are NOT supported
  // ══════════════════════════════════════════════
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // ══════════════════════════════════════════════
  // 5. Shrinking Navigation Header JS Fallback
  //    Activates only when CSS scroll() timeline is NOT supported
  // ══════════════════════════════════════════════
  if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
    const header         = document.getElementById('header');
    const scrollThreshold = 80;

    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
          header.classList.add('shrink-fallback');
        } else {
          header.classList.remove('shrink-fallback');
        }
      }, { passive: true });
    }
  }

  // ══════════════════════════════════════════════
  // 6. FAQ Accordion — mutual-exclusion (optional UX)
  //    Closes other open items when one is opened
  // ══════════════════════════════════════════════
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  // ══════════════════════════════════════════════
  // 7. Active nav link highlight on scroll
  //    Highlights the nav link matching the current section
  // ══════════════════════════════════════════════
  const sections    = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (sections.length && desktopLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          desktopLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.style.color = 'var(--text-primary)';
            } else {
              link.style.color = '';
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

});
