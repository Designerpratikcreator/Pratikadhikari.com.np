document.addEventListener('DOMContentLoaded', () => {
    // --- Common Elements ---
    const body = document.body;

    // --- Hamburger Menu and Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }

    // --- Theme Switcher (Light/Dark Mode) ---
    const themeSwitcher = document.getElementById('theme-switcher');

    if (themeSwitcher) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.add(savedTheme);
            if (savedTheme === 'dark-mode') themeSwitcher.checked = true;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.classList.add('dark-mode');
            themeSwitcher.checked = true;
        }

        themeSwitcher.addEventListener('change', () => {
            if (themeSwitcher.checked) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light-mode');
            }
            updateSkillBarColors();
        });
    }

    // --- Hero Section Typing Effect ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const phrases = ["Searches.", "Cases.", "Privacy.", "Supports."];
        let phraseIndex = 0, charIndex = 0, isDeleting = false;
        const typingSpeed = 100, deletingSpeed = 60, pauseBetweenPhrases = 1500;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            typingTextElement.textContent = isDeleting
                ? currentPhrase.substring(0, charIndex - 1)
                : currentPhrase.substring(0, charIndex + 1);
            charIndex += isDeleting ? -1 : 1;

            let speed = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIndex === currentPhrase.length) {
                speed = pauseBetweenPhrases;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
            setTimeout(type, speed);
        }
        type();
    }

    // --- Set current year in footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    // --- Navbar Active State on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-links li a');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));

    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            navLinksList.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav-links li a[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }
    });

    // --- Skill Level Indicators ---
    const skillListItems = document.querySelectorAll('.skill-category ul li');
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = parseInt(entry.target.dataset.level, 10);
                const skillBar = entry.target.querySelector('.skill-level-bar');
                if (skillBar) {
                    skillBar.style.width = `${skillLevel}%`;
                    updateSkillBarColor(skillBar, skillLevel);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    skillListItems.forEach(item => skillsObserver.observe(item));

    function updateSkillBarColor(skillBar, skillLevel) {
        let colorVar;
        if (skillLevel < 40) colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-low' : '--skill-level-low';
        else if (skillLevel < 70) colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-medium' : '--skill-level-medium';
        else if (skillLevel < 90) colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-high' : '--skill-level-high';
        else colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-expert' : '--skill-level-expert';

        skillBar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(colorVar);
    }

    function updateSkillBarColors() {
        skillListItems.forEach(item => {
            const skillLevel = parseInt(item.dataset.level, 10);
            const skillBar = item.querySelector('.skill-level-bar');
            if (skillBar) updateSkillBarColor(skillBar, skillLevel);
        });
    }

    // --- Slideshow ---
    const slides = document.querySelectorAll('.slideshow img');
    let current = 0;

    function showNextSlide() {
        if (slides.length === 0) return;
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }

    if (slides.length > 0) setInterval(showNextSlide, 5000);

    // --- Chatbot ---
    const messages = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    function addMessage(text, sender = 'user') {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + (sender === 'user' ? 'user-msg' : 'ai-msg');
        bubble.textContent = text;
        messages.appendChild(bubble);
        messages.scrollTop = messages.scrollHeight;
    }

    function fakeAIResponse(userMsg) {
        return `You asked about: "${userMsg}". Learn more at visitnepal2025.com!`;
    }

    if (sendBtn && input && messages) {
        sendBtn.onclick = () => {
            const userMsg = input.value.trim();
            if (!userMsg) return;

            addMessage(userMsg, 'user');
            input.value = '';

            setTimeout(() => {
                addMessage(fakeAIResponse(userMsg), 'ai');
            }, 500);
        };

        // Send with Enter key
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendBtn.click();
            }
        });
    }
});
