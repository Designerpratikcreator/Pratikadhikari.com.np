document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // --- Preloader & Scroll Progress ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.style.display = 'none', 500);
        }
    });

    window.addEventListener('scroll', () => {
        const progress = document.getElementById('scroll-progress');
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (progress) progress.style.width = `${scrolled}%`;

        const backToTop = document.getElementById('backToTop');
        if (backToTop) backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    document.getElementById('backToTop')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', (e) => {
        if (cursor) {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        }
    });

    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
    });

    // --- Theme Switcher ---
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        if (localStorage.getItem('theme') === 'dark-mode') {
            body.classList.add('dark-mode');
            themeSwitcher.checked = true;
        }
        themeSwitcher.addEventListener('change', () => {
            if (themeSwitcher.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }

    // --- Dynamic Text Animation ---
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const phrases = ["High-Impact Ads.", "Strategic Branding.", "Creative Excellence."];
        let i = 0, j = 0, isDeleting = false;
        function type() {
            const current = phrases[i];
            typingText.textContent = isDeleting ? current.substring(0, j--) : current.substring(0, j++);
            if (!isDeleting && j === current.length + 1) { isDeleting = true; setTimeout(type, 1500); return; }
            if (isDeleting && j === 0) { isDeleting = false; i = (i + 1) % phrases.length; }
            setTimeout(type, isDeleting ? 50 : 100);
        }
        type();
    }

    // --- Skill Bars Observer ---
    const skillBars = document.querySelectorAll('.skill-level-bar');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.parentElement.getAttribute('data-level');
                entry.target.style.width = `${level}%`;
            }
        });
    }, { threshold: 0.5 });
    skillBars.forEach(bar => observer.observe(bar));

    // --- Payment Gateway UX Logic ---
    const paymentCards = document.querySelectorAll('.payment-card');
    const fieldGroups = {
        card: document.getElementById('card-details-fields'),
        paypal: document.getElementById('paypal-details-fields'),
        crypto: document.getElementById('crypto-details-fields')
    };

    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            paymentCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const selectedMethod = card.querySelector('input').value;
            
            Object.keys(fieldGroups).forEach(key => {
                if (fieldGroups[key]) {
                    if (key === selectedMethod) {
                        fieldGroups[key].classList.remove('hidden');
                    } else {
                        fieldGroups[key].classList.add('hidden');
                    }
                }
            });
        });
    });

    // Credit Card Masking
    const cardInput = document.getElementById('cardNumber');
    cardInput?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    });

    const cardExpiry = document.getElementById('cardExpiry');
    cardExpiry?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{2})/g, '$1/').trim().replace(/\/$/, '');
    });

    // Checkout Submit
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Order submitted successfully! We will get in touch regarding your asset files.');
        checkoutForm.reset();
    });

    // Year update
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- Three.js Hero Canvas Animation ---
    const canvas = document.getElementById('hero-background-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const geometry = new THREE.IcosahedronGeometry(10, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        camera.position.z = 25;

        function animate() {
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.003;
            sphere.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
});
