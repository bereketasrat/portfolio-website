/**
 * PORTFOLIO - MAIN JAVASCRIPT
 * Handles: navbar, scroll animations, skill bars, form validation
 */

/* ============================================================
   1. NAVBAR — sticky shadow + mobile toggle + active link
   ============================================================ */
const navbar    = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

// Add shadow on scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile hamburger toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle?.classList.remove('open');
    navLinks?.classList.remove('open');
  });
});

// Highlight active nav link based on current page
(function setActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ============================================================
   2. SCROLL ANIMATIONS — fade-up on elements entering viewport
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // animate once
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => observer.observe(el));

/* ============================================================
   3. SKILL BARS — animate width when section scrolls into view
   ============================================================ */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      fill.style.width = fill.dataset.width; // data-width="85%"
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ============================================================
   4. CONTACT FORM VALIDATION
   ============================================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');
    let valid = true;

    // --- Validate name ---
    if (name.value.trim().length < 2) {
      showError(name, 'nameError', 'Please enter your full name (at least 2 characters).');
      valid = false;
    }

    // --- Validate email ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showError(email, 'emailError', 'Please enter a valid email address.');
      valid = false;
    }

    // --- Validate message ---
    if (message.value.trim().length < 10) {
      showError(message, 'messageError', 'Message must be at least 10 characters.');
      valid = false;
    }

    if (!valid) return;

    // --- Submit via fetch to PHP backend ---
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('php/submit_form.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      const msgEl  = document.getElementById('formMessage');

      if (result.success) {
        msgEl.textContent = result.message;
        msgEl.className   = 'form-message success';
        contactForm.reset();
      } else {
        msgEl.textContent = result.message;
        msgEl.className   = 'form-message error';
      }
    } catch (err) {
      const msgEl = document.getElementById('formMessage');
      msgEl.textContent = 'Something went wrong. Please try again later.';
      msgEl.className   = 'form-message error';
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

/** Show an error on a field */
function showError(field, errorId, message) {
  field.classList.add('error');
  const errEl = document.getElementById(errorId);
  if (errEl) {
    errEl.textContent = message;
    errEl.classList.add('show');
  }
}

/** Clear all field errors */
function clearErrors() {
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(f => {
    f.classList.remove('error');
  });
  document.querySelectorAll('.field-error').forEach(e => {
    e.classList.remove('show');
    e.textContent = '';
  });
  const msgEl = document.getElementById('formMessage');
  if (msgEl) msgEl.className = 'form-message';
}

/* ============================================================
   5. SMOOTH SCROLL for anchor links (same-page)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
