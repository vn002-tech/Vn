// 0. Preloader Fade Out
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 600);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle (Dark / Light Mode)
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark-mode');
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // 2. Sticky Header, Underline Highlight & Hero Parallax
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const heroBg = document.querySelector('.hero-bg');

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Hero Parallax (only on desktop screens > 768px)
    if (heroBg && window.innerWidth > 768) {
      heroBg.style.transform = `translate3d(0, ${scrolled * 0.35}px, 0) scale(1.02) rotate(0.01deg)`;
    }

    // Sticky Header Toggle
    if (scrolled > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Section Tracker
    let currentActiveSectionId = '';
    const scrollPos = scrolled + 100; // Offset for trigger

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentActiveSectionId = id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Mobile Nav Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  // Close menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const headerHeight = window.innerWidth <= 768 ? 56 : 64;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (menuToggle && navMenu) {
          menuToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
      }
    });
  });

  // 4. Scroll Reveal system via IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -20px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // Reveal only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // 5. Contact Form Submission & Toast Handler
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (contactForm && toast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Anti-Spam Honeypot check
      const honeypot = document.getElementById('form-honeypot');
      if (honeypot && honeypot.value) {
        console.log('Spam bot detected!');
        return;
      }

      // Input Validation
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const messageInput = document.getElementById('form-message');

      if (!nameInput.value.trim()) {
        alert('Name cannot be empty.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        alert('Invalid email format. Please enter a valid email.');
        return;
      }

      if (!messageInput.value.trim()) {
        alert('Message cannot be empty.');
        return;
      }

      contactForm.reset();
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    });
  }

  window.closeToast = () => {
    if (toast) {
      toast.classList.remove('show');
    }
  };

  // 6. Certificates Accordion Toggle
  const toggleCertsBtn = document.getElementById('toggle-certificates');
  const moreCertsContainer = document.getElementById('more-certs-container');

  if (toggleCertsBtn && moreCertsContainer) {
    toggleCertsBtn.addEventListener('click', function() {
      moreCertsContainer.classList.toggle('expanded');
      const isExpanded = moreCertsContainer.classList.contains('expanded');
      this.textContent = isExpanded 
        ? 'Hide certificates ↑' 
        : 'View all certificates →';
    });
  }

  // 7. Skills Layout Toggle
  const layoutBtns = document.querySelectorAll('.btn-layout-toggle');
  const skillsContainer = document.querySelector('.skills-display-container');

  if (layoutBtns.length > 0 && skillsContainer) {
    layoutBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const layout = this.getAttribute('data-layout');
        
        // Remove active class from all buttons
        layoutBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        // Fade out
        skillsContainer.style.opacity = '0';
        
        setTimeout(() => {
          // Switch layout class
          if (layout === 'bento') {
            skillsContainer.classList.remove('layout-compact');
            skillsContainer.classList.add('layout-bento');
          } else {
            skillsContainer.classList.remove('layout-bento');
            skillsContainer.classList.add('layout-compact');
          }
          // Fade in
          skillsContainer.style.opacity = '1';
        }, 150);
      });
    });
  }

  // 8. Count-Up Animation for Stats
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  
  if (statNumbers.length > 0) {
    const countUpObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetEl = entry.target;
          const targetVal = parseFloat(targetEl.getAttribute('data-target'));
          const decimals = parseInt(targetEl.getAttribute('data-decimals') || '0', 10);
          const duration = 1600; // 1.6 seconds
          const startTime = performance.now();
          
          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function: easeOutQuad
            const easeProgress = progress * (2 - progress);
            
            const currentVal = easeProgress * targetVal;
            targetEl.textContent = currentVal.toFixed(decimals);
            
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              targetEl.textContent = targetVal.toFixed(decimals);
            }
          }
          
          requestAnimationFrame(updateCount);
          obs.unobserve(targetEl); // Run animation only once
        }
      });
    }, { threshold: 0.15 });
    
    statNumbers.forEach(num => {
      countUpObserver.observe(num);
    });
  }

  // 9. Projects Category Filtering
  const filterBtns = document.querySelectorAll('.btn-filter');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterBtns.length > 0 && projectItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        // Remove active class from all filter buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        // Hide / Show items with fade transition
        projectItems.forEach(item => {
          const category = item.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
            // Force reflow
            void item.offsetWidth;
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              if (item.style.opacity === '0') {
                item.classList.add('hidden');
              }
            }, 300);
          }
        });
      });
    });
  }
});
