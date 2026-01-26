/* ============================================
   Muhammad Muzammil Khan - Portfolio
   Premium JavaScript with Advanced Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============ Loader ============
    const loader = document.querySelector('.loader-wrapper');
    const loaderPercent = document.querySelector('.loader-percent');
    let percent = 0;
    
    const loadingInterval = setInterval(() => {
        percent += Math.floor(Math.random() * 10) + 1;
        if (percent >= 100) {
            percent = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
                initAnimations();
            }, 500);
        }
        loaderPercent.textContent = percent + '%';
    }, 80);

    // ============ Custom Cursor ============
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
    });
    
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });
    
    function animateCursor() {
        const easing = 0.15;
        
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        followerX += (mouseX - followerX) * 0.25;
        followerY += (mouseY - followerY) * 0.25;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .skill-card, .project-card, .cert-card, .interest-card, .lab-item, .edu-card, .contact-card, .tool-tag, .os-item');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
    });

    // ============ Magnetic Buttons ============
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            
            const children = btn.querySelectorAll('.btn-text, .btn-icon, i');
            children.forEach(child => {
                child.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            
            const children = btn.querySelectorAll('.btn-text, .btn-icon, i');
            children.forEach(child => {
                child.style.transform = 'translate(0, 0)';
            });
        });
    });

    // ============ Typewriter Effect ============
    const roles = [
        'Penetration Tester',
        'Security Researcher',
        'Ethical Hacker',
        'CTF Player',
        'Bug Hunter',
        'OWASP Expert'
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    const typewriterElement = document.getElementById('typewriter');
    
    function typeWriter() {
        const currentRole = roles[roleIndex];
        
        if (isPaused) {
            setTimeout(typeWriter, 2000);
            isPaused = false;
            isDeleting = true;
            return;
        }
        
        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentRole.length) {
                isPaused = true;
            }
        }
        
        const typingSpeed = isDeleting ? 40 : 80;
        setTimeout(typeWriter, typingSpeed);
    }
    
    setTimeout(typeWriter, 3500);

    // ============ Navbar ============
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function setActiveNavLink() {
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', setActiveNavLink);

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });

    // ============ Reveal Animations ============
    function initAnimations() {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ============ Counter Animation ============
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return;
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            function updateCounter() {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            }
            
            updateCounter();
        });
        
        countersAnimated = true;
    }

    // ============ Skill Bars Animation ============
    const skillBars = document.querySelectorAll('.skill-progress');
    let skillsAnimated = false;
    
    function animateSkillBars() {
        if (skillsAnimated) return;
        
        skillBars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress');
            setTimeout(() => {
                bar.style.width = progress + '%';
            }, index * 150);
        });
        
        skillsAnimated = true;
    }

    // ============ Timeline Progress ============
    const timelineProgress = document.querySelector('.timeline-progress');
    let timelineAnimated = false;
    
    function animateTimeline() {
        if (timelineAnimated) return;
        timelineProgress.style.height = '100%';
        timelineAnimated = true;
    }

    // ============ Intersection Observers ============
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    // About section observer
    const aboutSection = document.getElementById('about');
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, observerOptions);
    
    if (aboutSection) aboutObserver.observe(aboutSection);
    
    // Skills section observer
    const skillsSection = document.getElementById('skills');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
            }
        });
    }, observerOptions);
    
    if (skillsSection) skillsObserver.observe(skillsSection);
    
    // Experience section observer
    const experienceSection = document.getElementById('experience');
    const experienceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateTimeline();
            }
        });
    }, observerOptions);
    
    if (experienceSection) experienceObserver.observe(experienceSection);

    // ============ Tilt Effect ============
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Move glow effect
            const glow = el.querySelector('.card-glow');
            if (glow) {
                glow.style.left = x + 'px';
                glow.style.top = y + 'px';
            }
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // ============ Back to Top ============
    const backToTop = document.getElementById('backToTop');
    const progressCircle = document.querySelector('.progress-ring-circle');
    const circumference = 2 * Math.PI * 22;
    
    if (progressCircle) {
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = circumference;
    }
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        
        if (scrollTop > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
        
        if (progressCircle) {
            const offset = circumference - (scrollPercent * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============ Contact Form ============
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent successfully! I will get back to you soon.', 'success');
                contactForm.reset();
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    function showNotification(message, type) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();
        
        const notification = document.createElement('div');
        notification.className = 'notification ' + type;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? '#ffffff' : '#333333'};
            color: ${type === 'success' ? '#000000' : '#ffffff'};
            padding: 20px 50px 20px 25px;
            display: flex;
            align-items: center;
            gap: 15px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            z-index: 9999;
            animation: slideInNotification 0.5s ease;
            border: 1px solid ${type === 'success' ? '#ffffff' : '#555555'};
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInNotification {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            .notification-close {
                position: absolute;
                top: 50%;
                right: 15px;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            .notification-close:hover { opacity: 1; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideInNotification 0.5s ease reverse';
            setTimeout(() => notification.remove(), 500);
        });
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInNotification 0.5s ease reverse';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);
    }

    // ============ Parallax Effect ============
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Hero parallax
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
        
        if (heroVisual && scrolled < window.innerHeight) {
            heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
        
        // Background text parallax
        const bgTexts = document.querySelectorAll('.section-bg-text');
        bgTexts.forEach(text => {
            const section = text.parentElement;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
                const progress = (scrolled - sectionTop + window.innerHeight) / (sectionHeight + window.innerHeight);
                text.style.transform = `translateY(-50%) rotate(-90deg) translateX(${progress * 50}px)`;
            }
        });
    });

    // ============ Smooth Scroll for All Links ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============ Form Input Animation ============
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // ============ Text Scramble Effect ============
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += char;
                } else {
                    output += from;
                }
            }
            
            this.el.innerText = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    // Apply scramble to section titles on hover
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        const originalText = title.innerText;
        const scramble = new TextScramble(title);
        
        title.addEventListener('mouseenter', () => {
            scramble.setText(originalText);
        });
    });

    // ============ Floating Elements Animation ============
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((el, index) => {
        el.addEventListener('mouseenter', () => {
            el.style.animation = 'none';
            el.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.animation = '';
            el.style.transform = '';
        });
    });

    // ============ Easter Egg ============
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join('') === konamiPattern.join('')) {
            document.body.style.animation = 'rainbow 2s linear';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
        }
    });

    // ============ Console Message ============
    console.log('%c ⚡ Muhammad Muzammil Khan ⚡', 'color: #ffffff; background: #000000; font-size: 24px; padding: 15px 25px; font-family: "Orbitron", monospace; font-weight: bold;');
    console.log('%c Penetration Tester | Security Researcher', 'color: #888888; font-size: 14px; padding: 5px 0;');
    console.log('%c Looking for vulnerabilities in your web application?', 'color: #666666; font-size: 12px;');
    console.log('%c 📧 Email: muzammil.khan92@hotmail.com', 'color: #444444; font-size: 11px;');
    console.log('%c 🔗 LinkedIn: linkedin.com/in/muhammadmuzammilkhan92', 'color: #444444; font-size: 11px;');

    // ============ Performance Optimization ============
    // Debounce scroll events
    let scrollTimeout;
    const debouncedScroll = () => {
        if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
        scrollTimeout = requestAnimationFrame(() => {
            // Scroll-based animations already handled
        });
    };
    
    window.addEventListener('scroll', debouncedScroll, { passive: true });

    // ============ Preload Images ============
    const imagesToPreload = [];
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // ============ Service Worker Registration (Optional) ============
    // if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('/sw.js');
    // }

});

// ============ Page Visibility API ============
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '👋 Come Back! | MMK Portfolio';
    } else {
        document.title = 'Muhammad Muzammil Khan | Penetration Tester';
    }
});

// ============ Prevent Right Click (Optional) ============
// document.addEventListener('contextmenu', (e) => e.preventDefault());

// ============ Disable Developer Tools Detection (Optional) ============
// Uncomment if needed for security
/*
(function() {
    const devtools = { open: false };
    setInterval(() => {
        const before = new Date();
        debugger;
        const after = new Date();
        if (after - before > 100) {
            devtools.open = true;
            document.body.innerHTML = '<h1>Developer Tools Detected</h1>';
        }
    }, 1000);
})();
*/
