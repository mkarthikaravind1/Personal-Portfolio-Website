document.addEventListener('DOMContentLoaded', () => {

  // 1. Custom Cursor Tracking
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursor && cursorRing) {
    document.addEventListener('mousemove', (e) => {
      // Using requestAnimationFrame prevents layout thrashing
      requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        cursorRing.style.left = `${e.clientX}px`;
        cursorRing.style.top = `${e.clientY}px`;
      });
    });
  }

  // 2. Typewriter Effect
  const words = ['AI & Full-Stack Developer', 'Innovation Engineer Trainee @ Forge', 'LangGraph & RAG Engineer'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterText = document.getElementById('typewriter-text');

  function type() {
    if (!typewriterText) return;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }
  type();

  // 3. ProtoSem Tab Switcher
  const protoTabs = document.querySelectorAll('.proto-tab');
  const protoPanels = document.querySelectorAll('.proto-panel');

  protoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      protoTabs.forEach(t => t.classList.remove('active'));
      protoPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  // 4. Combined Scroll Handlers (Navbar, Scroll-To-Top, Progress, & Active Nav Highlight)
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scroll-top');
  const progressBar = document.getElementById('scroll-progress');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const navToggle = document.getElementById('navToggle');
  const navLinksEl = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll(); // wrap your existing scroll logic in this named function
        ticking = false;
      });
      ticking = true;
    }
  });

    // Toggle navbar style
    if (scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Toggle Scroll-to-Top button visibility
    if (scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }

    // Scroll progress bar
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (progressBar && scrollHeight > 0) {
      const scrollPercent = (scrollY / scrollHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }

    // Active Navigation Highlight on Scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  navToggle?.addEventListener('click', () => {
    navLinksEl?.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => navLinksEl?.classList.remove('open'));
  });

  // 5. Smooth Scroll for Nav Links
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;

      e.preventDefault();

      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const sectionPosition = targetSection.offsetTop - navbarHeight - 20;

      window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
      });
    });
  });

  // 6. Scroll Intersection Observer (Fade-In & Skill Fill Animation)
  const observerOptions = { threshold: 0.15 };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // 7. Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formStatus) {
        formStatus.textContent = 'Thank you for your message! I will get back to you soon.';
      }
      contactForm.reset();
    });
  }
});