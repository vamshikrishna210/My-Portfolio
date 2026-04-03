// ============================================================
//  sshank.js — Animations & Interactivity for Shashank Resume
// ============================================================
(function () {

    // ========== PRELOADER INTRO ANIMATION ==========
    const preloader = document.getElementById('preloader');
    const preloaderParticles = document.getElementById('preloaderParticles');

    // Spawn floating sparkle dots
    const isMobile = window.innerWidth <= 880;
    const preloaderDotCount = isMobile ? 10 : 25;
    if (preloaderParticles) {
        for (let i = 0; i < preloaderDotCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'preloader-dot';
            dot.style.left = Math.random() * 100 + '%';
            dot.style.top = Math.random() * 100 + '%';
            dot.style.setProperty('--dx', (Math.random() - 0.5) * 150 + 'px');
            dot.style.setProperty('--dy', (Math.random() - 0.5) * 150 + 'px');
            dot.style.setProperty('--dur', (1.5 + Math.random() * 2) + 's');
            dot.style.setProperty('--delay', (Math.random() * 1.5) + 's');
            const size = (2 + Math.random() * 3) + 'px';
            dot.style.width = size;
            dot.style.height = size;
            dot.style.background = ['#3dd3ff', '#6c63ff', '#ff6bca', '#fff'][Math.floor(Math.random() * 4)];
            preloaderParticles.appendChild(dot);
        }
    }

    // Dismiss preloader quickly and safely
    let preloaderDismissed = false;
    function dismissPreloader() {
        if (preloaderDismissed) return;
        preloaderDismissed = true;
        if (!preloader) return;
        preloader.classList.add('exit');
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 160);
        setTimeout(() => {
            preloader.classList.add('done');
        }, 700);
    }

    // Start exit early so total intro stays below 2 seconds.
    setTimeout(dismissPreloader, 900);

    // Failsafe: always reveal page content even if animations are interrupted.
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        if (preloader) preloader.classList.add('done');
    }, 1900);

    // ========== SMOOTH SCROLL FOR NAV LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navH = document.querySelector('.nav').offsetHeight;
                const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========== SCROLL PROGRESS BAR ==========
    const progressBar = document.getElementById('scroll-progress');
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = percent + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });

    // ========== NAV SCROLL EFFECTS ==========
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    function updateNav() {
        const scrollY = window.scrollY;

        // Nav background on scroll
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active section highlighting
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateNav, { passive: true });

    // ========== SCROLL TO TOP BUTTON ==========
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== FLOATING PARTICLES ==========
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];
    const PARTICLE_COUNT = isMobile ? 15 : 60;

    function resizeCanvas() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * H;
        }
        reset() {
            this.x = Math.random() * W;
            this.y = H + 10;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 0.4 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.35 + 0.1;
            this.pulse = Math.random() * Math.PI * 2;
        }
        update() {
            this.y -= this.speedY;
            this.x += this.speedX + Math.sin(this.pulse) * 0.15;
            this.pulse += 0.01;
            if (this.y < -10) this.reset();
        }
        draw() {
            const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(61, 211, 255, ${alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(61,211,255,${0.05 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        if (!isMobile) drawLines();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ========== GLASS CURSOR ==========
    const cursor = document.getElementById('cursor');
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos = { x: mouse.x, y: mouse.y };

    function lerp(a, b, t) { return a + (b - a) * t; }

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        cursor.style.display = 'block';
    });

    const interactive = Array.from(document.querySelectorAll('a, .btn, button, .project, .skill, .contact-link'));
    interactive.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('big'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
    });

    window.addEventListener('mousedown', () => {
        cursor.classList.add('press');
        setTimeout(() => cursor.classList.remove('press'), 150);
    });

    function renderCursor() {
        pos.x = lerp(pos.x, mouse.x, 0.1);
        pos.y = lerp(pos.y, mouse.y, 0.1);
        cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // ========== TYPING EFFECT ==========
    const roleEl = document.querySelector('.hero-role');
    if (roleEl) {
        const fullText = roleEl.textContent.trim();
        roleEl.innerHTML = '<span class="typing-cursor"></span>';
        let charIndex = 0;
        function typeChar() {
            if (charIndex < fullText.length) {
                const cursorSpan = roleEl.querySelector('.typing-cursor');
                roleEl.insertBefore(document.createTextNode(fullText[charIndex]), cursorSpan);
                charIndex++;
                setTimeout(typeChar, 45 + Math.random() * 35);
            }
        }
        setTimeout(typeChar, 600);
    }

    // ========== SCROLL-REVEAL (IntersectionObserver) ==========
    const revealEls = document.querySelectorAll('.section, .quote-section, .contact-grid, .hero-cta');
    revealEls.forEach(el => {
        if (!el.classList.contains('reveal') && !el.classList.contains('reveal-scale') && !el.classList.contains('reveal-left')) {
            el.classList.add('reveal');
        }
    });

    const revObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revObs.observe(el));

    // ========== STAGGERED SKILL POP-IN ==========
    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skills = entry.target.querySelectorAll('.skill');
                skills.forEach((sk, i) => {
                    setTimeout(() => sk.classList.add('pop-in'), i * 80);
                });
                skillObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    const skillsContainer = document.querySelector('.skills-grid');
    if (skillsContainer) skillObs.observe(skillsContainer);
    document.querySelectorAll('.skills-grid').forEach(grid => skillObs.observe(grid));

    // ========== CERTIFICATE PDF PREVIEWS ==========
    document.querySelectorAll('.cert-card[href$=".pdf"]').forEach(card => {
        const pdfHref = card.getAttribute('href');
        if (!pdfHref) return;

        const preview = document.createElement('object');
        preview.className = 'cert-preview';
        preview.type = 'application/pdf';
        preview.data = `${pdfHref}#page=1&zoom=page-width&pagemode=none&toolbar=0&navpanes=0`;
        preview.setAttribute('aria-label', 'Certificate preview');

        card.insertBefore(preview, card.firstChild);
    });

    // ========== SECTION TITLE UNDERLINE ANIMATE ==========
    const titleObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('line-animate');
                titleObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.section-title').forEach(t => titleObs.observe(t));

    // ========== PROJECT CARD MOUSE GLOW ==========
    document.querySelectorAll('.project').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;
            card.style.setProperty('--mx', x + '%');
            card.style.setProperty('--my', y + '%');
        });
    });

    // ========== STAGGERED PROJECT ENTRANCE ==========
    const projObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const projects = entry.target.querySelectorAll('.project');
                projects.forEach((proj, i) => {
                    proj.style.opacity = '0';
                    proj.style.transform = 'translateY(30px)';
                    proj.style.transition = 'opacity 0.6s cubic-bezier(.16,1,.3,1), transform 0.6s cubic-bezier(.16,1,.3,1)';
                    setTimeout(() => {
                        proj.style.opacity = '1';
                        proj.style.transform = 'translateY(0)';
                    }, i * 120 + 100);
                });
                projObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    const projGrid = document.querySelector('.projects-grid');
    if (projGrid) projObs.observe(projGrid);

    // ========== BUTTON RIPPLE EFFECT ==========
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const r = this.getBoundingClientRect();
            const size = Math.max(r.width, r.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ========== PHOTO PARALLAX TILT ==========
    const photo = document.querySelector('.photo');
    if (photo) {
        photo.addEventListener('mousemove', e => {
            const r = photo.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
            const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
            photo.style.transform = `translate3d(${dx * 10}px, ${dy * 10}px, 0) rotate3d(${-dy}, ${dx}, 0, ${Math.sqrt(dx * dx + dy * dy) * 14}deg) scale(1.04)`;
        });
        photo.addEventListener('mouseleave', () => {
            photo.style.transform = '';
        });
    }

    // ========== CONTACT LINKS STAGGER ==========
    const contactObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.contact-link');
                items.forEach((item, i) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, i * 120 + 200);
                });
                contactObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });
    const contactLinks = document.querySelector('.contact-links');
    if (contactLinks) contactObs.observe(contactLinks);

    // ========== HERO CONTACT ITEMS STAGGER ==========
    const heroContactItems = document.querySelectorAll('.hero-contact-item');
    heroContactItems.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, i * 100 + 800);
    });

    // ========== PARALLAX ON SCROLL (hero — desktop only) ==========
    if (!isMobile) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                if (scrolled < window.innerHeight) {
                    heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
                    heroSection.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
                }
            }, { passive: true });
        }
    }

    // ========== COUNTER ANIMATION (for future stats) ==========
    window.animateCounter = function (el, target, duration = 2000) {
        let start = 0;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            el.textContent = Math.floor(progress * target);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    // ========== MAGNETIC BUTTONS ==========
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.4s cubic-bezier(.16,1,.3,1)';
            setTimeout(() => { btn.style.transition = ''; }, 400);
        });
    });

    // ========== TAGLINE GRADIENT GLOW DATA ATTRIBUTE ==========
    const gradientText = document.querySelector('.hero-tagline .gradient-text');
    if (gradientText) {
        gradientText.setAttribute('data-text', gradientText.textContent);
    }

    // ========== EDUCATION CARDS STAGGER ==========
    const eduObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.edu-card');
                cards.forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateX(-40px) scale(0.95)';
                    card.style.transition = 'opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateX(0) scale(1)';
                    }, i * 150 + 100);
                });
                eduObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    const eduTimeline = document.querySelector('.education-timeline');
    if (eduTimeline) eduObs.observe(eduTimeline);

    // ========== CERTIFICATE CARDS FLIP-IN ==========
    const certObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const certs = entry.target.querySelectorAll('.cert-card');
                certs.forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'rotateY(90deg) scale(0.8)';
                    card.style.transition = 'opacity 0.6s ease, transform 0.7s cubic-bezier(.16,1,.3,1)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'rotateY(0) scale(1)';
                    }, i * 130 + 100);
                });
                certObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    const certGrid = document.querySelector('.cert-grid');
    if (certGrid) certObs.observe(certGrid);

    // ========== ACHIEVEMENT ITEMS SLIDE-IN ==========
    const achObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.achievement-item');
                items.forEach((item, i) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(50px)';
                    item.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(.16,1,.3,1)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, i * 150 + 200);
                });
                achObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    const achList = document.querySelector('.achievements-list');
    if (achList) achObs.observe(achList);

    // ========== TRAINING CARD EXPAND ==========
    const trainObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.style.opacity = '0';
                card.style.transform = 'scaleY(0.6) translateY(20px)';
                card.style.transformOrigin = 'top center';
                card.style.transition = 'opacity 0.7s ease, transform 0.8s cubic-bezier(.16,1,.3,1)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scaleY(1) translateY(0)';
                }, 150);
                trainObs.unobserve(card);
            }
        });
    }, { threshold: 0.2 });
    const trainCard = document.querySelector('.training-card');
    if (trainCard) trainObs.observe(trainCard);

    // ========== TILT 3D ON HOVER — ALL INTERACTIVE CARDS ==========
    document.querySelectorAll('.edu-card, .cert-card, .achievement-item, .training-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
            const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
            card.style.transform = `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
            setTimeout(() => { card.style.transition = ''; }, 500);
        });
    });

    // ========== MOUSE TRAIL SPARKLES (desktop only) ==========
    if (!isMobile) {
        let sparkleThrottle = 0;
        document.addEventListener('mousemove', e => {
            const now = Date.now();
            if (now - sparkleThrottle < 60) return;
            sparkleThrottle = now;
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = e.clientX + 'px';
            sparkle.style.top = e.clientY + 'px';
            sparkle.style.setProperty('--dx', (Math.random() - 0.5) * 40 + 'px');
            sparkle.style.setProperty('--dy', (Math.random() - 0.5) * 40 + 'px');
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 800);
        });
    }

    // ========== NAV BRAND BOUNCE ON CLICK ==========
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
        navBrand.addEventListener('click', () => {
            navBrand.style.animation = 'none';
            void navBrand.offsetWidth; // reflow
            navBrand.style.animation = 'brandBounce 0.6s cubic-bezier(.68,-.55,.265,1.55)';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== SECTION LABEL GLOW PULSE ==========
    const labelObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('glow-pulse');
                labelObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.section-label').forEach(l => labelObs.observe(l));

    // ========== SKILL BAR SHIMMER ON HOVER ==========
    document.querySelectorAll('.skill').forEach(skill => {
        skill.addEventListener('mouseenter', () => {
            skill.classList.add('shimmer-active');
        });
        skill.addEventListener('animationend', () => {
            skill.classList.remove('shimmer-active');
        });
    });

    // ========== SCROLL-TRIGGERED COUNTER FOR EDUCATION SCORES ==========
    const scoreObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const scores = entry.target.querySelectorAll('.edu-score');
                scores.forEach(score => {
                    const text = score.textContent;
                    const match = text.match(/([\d.]+)/);
                    if (match) {
                        const target = parseFloat(match[1]);
                        const prefix = text.slice(0, text.indexOf(match[1]));
                        const suffix = text.slice(text.indexOf(match[1]) + match[1].length);
                        const isFloat = text.includes('.');
                        let startTime = null;
                        function animate(ts) {
                            if (!startTime) startTime = ts;
                            const progress = Math.min((ts - startTime) / 1500, 1);
                            const eased = 1 - Math.pow(1 - progress, 3);
                            const val = eased * target;
                            score.textContent = prefix + (isFloat ? val.toFixed(2) : Math.floor(val)) + suffix;
                            if (progress < 1) requestAnimationFrame(animate);
                        }
                        requestAnimationFrame(animate);
                    }
                });
                scoreObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    const eduSection = document.querySelector('#education');
    if (eduSection) scoreObs.observe(eduSection);

    // ========== QUOTE TYPEWRITER ==========
    const quoteText = document.querySelector('.quote-text');
    if (quoteText) {
        const quoteObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const text = quoteText.textContent;
                    quoteText.textContent = '';
                    quoteText.style.visibility = 'visible';
                    let i = 0;
                    function typeQuote() {
                        if (i < text.length) {
                            quoteText.textContent += text[i];
                            i++;
                            setTimeout(typeQuote, 30 + Math.random() * 20);
                        }
                    }
                    typeQuote();
                    quoteObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        quoteObs.observe(quoteText);
    }

    // ========== SMOOTH PARALLAX FOR SECTIONS (desktop only) ==========
    if (!isMobile) {
        const parallaxSections = document.querySelectorAll('.section');
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            parallaxSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const depth = (rect.top / window.innerHeight) * 15;
                    const label = section.querySelector('.section-label');
                    const title = section.querySelector('.section-title');
                    if (label) label.style.transform = `translateY(${depth}px)`;
                    if (title) title.style.transform = `translateY(${depth * 0.5}px)`;
                }
            });
        }, { passive: true });
    }

    // ========== MOUSE REPEL PARTICLES ==========
    let mousePos = { x: -1000, y: -1000 };
    document.addEventListener('mousemove', e => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });
    // Enhance particle update to repel from mouse
    const origUpdate = Particle.prototype.update;
    Particle.prototype.update = function () {
        origUpdate.call(this);
        const dx = this.x - mousePos.x;
        const dy = this.y - (mousePos.y + window.scrollY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120 * 1.5;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
        }
    };

    // ========== AURORA GRADIENT BLOB BEHIND HERO ==========
    const auroraBlob = document.createElement('div');
    auroraBlob.className = 'aurora-blob';
    const heroEl = document.querySelector('.hero');
    if (heroEl) heroEl.appendChild(auroraBlob);

    // ========== NAV LINK HOVER SOUND WAVE ==========
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.classList.add('nav-wave');
        });
        link.addEventListener('animationend', () => {
            link.classList.remove('nav-wave');
        });
    });

    // ========== SCROLL VELOCITY GLOW ==========
    let lastScroll = 0;
    let scrollVelocity = 0;
    const progressGlow = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        scrollVelocity = Math.abs(window.scrollY - lastScroll);
        lastScroll = window.scrollY;
        const glow = Math.min(scrollVelocity * 0.8, 30);
        if (progressGlow) {
            progressGlow.style.boxShadow = `0 0 ${glow + 10}px rgba(61,211,255,${0.4 + glow * 0.02}), 0 0 ${glow + 40}px rgba(108,99,255,0.15)`;
            progressGlow.style.height = Math.min(3 + scrollVelocity * 0.1, 6) + 'px';
        }
    }, { passive: true });

    // ========== FLOATING EMOJI BURST ON ACHIEVEMENT HOVER ==========
    document.querySelectorAll('.achievement-item, .cert-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            for (let i = 0; i < 5; i++) {
                const emoji = document.createElement('span');
                emoji.className = 'float-emoji';
                emoji.textContent = ['✨', '🎯', '🚀', '⭐', '💡', '🔥'][Math.floor(Math.random() * 6)];
                emoji.style.left = (Math.random() * 80 + 10) + '%';
                emoji.style.animationDuration = (0.8 + Math.random() * 0.6) + 's';
                emoji.style.animationDelay = (i * 0.06) + 's';
                el.style.position = 'relative';
                el.appendChild(emoji);
                setTimeout(() => emoji.remove(), 1500);
            }
        });
    });

    // ========== GLITCH TEXT ON HERO NAME HOVER ==========
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        heroName.addEventListener('mouseenter', () => {
            heroName.classList.add('glitch-active');
        });
        heroName.addEventListener('mouseleave', () => {
            heroName.classList.remove('glitch-active');
        });
    }

    // ========== LIGHT STREAK ON SCROLL ==========
    const lightStreak = document.createElement('div');
    lightStreak.className = 'light-streak';
    document.body.appendChild(lightStreak);
    let streakTimeout;
    window.addEventListener('scroll', () => {
        lightStreak.classList.add('active');
        clearTimeout(streakTimeout);
        streakTimeout = setTimeout(() => lightStreak.classList.remove('active'), 300);
    }, { passive: true });

    // ========== SECTION DIVIDER ANIMATED DOTS ==========
    document.querySelectorAll('.section + .section').forEach(section => {
        const dots = document.createElement('div');
        dots.className = 'section-dots';
        dots.innerHTML = '<span></span><span></span><span></span>';
        section.prepend(dots);
    });

    // ========== SMOOTH MORPH ON STATUS BADGE ==========
    const badge = document.querySelector('.status-badge');
    if (badge) {
        const texts = ['Open to Internships', 'Available for Work', 'Ready to Collaborate'];
        let badgeIndex = 0;
        setInterval(() => {
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(-8px)';
            setTimeout(() => {
                badgeIndex = (badgeIndex + 1) % texts.length;
                // Keep the dot span
                badge.innerHTML = '<span class="status-dot"></span>' + texts[badgeIndex];
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0)';
            }, 300);
        }, 3500);
    }

    // ========== SKILL ICON COLOR CYCLE ==========
    document.querySelectorAll('.skill').forEach((skill, i) => {
        const icon = skill.querySelector('.skill-icon');
        if (icon) {
            const hue = (i * 30) % 360;
            icon.style.background = `hsl(${hue}, 80%, 60%)`;
            icon.style.boxShadow = `0 0 6px hsla(${hue}, 80%, 60%, 0.4)`;
        }
    });

    // ========== TILT WHOLE PAGE ON DEVICE ORIENTATION (disabled — causes mobile jank) ==========

})();
