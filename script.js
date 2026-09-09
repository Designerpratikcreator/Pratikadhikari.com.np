document.addEventListener('DOMContentLoaded', () => {
    // Nav / Hamburger Menu
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
    }

    // Theme Switcher
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark-mode') {
            document.body.classList.add('dark-mode');
            themeSwitcher.checked = true;
        }

        themeSwitcher.addEventListener('change', () => {
            if (themeSwitcher.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }

    // Typing Effect
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const text = "EVERY CLASS TO ANY NUMBER";
        let idx = 0;
        function type() {
            if (idx < text.length) {
                typingText.textContent += text.charAt(idx);
                idx++;
                setTimeout(type, 100);
            }
        }
        type();
    }

    // Set Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 3D Three.js Visualizer
    const canvas = document.getElementById('hero-background-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0x5b86e5, wireframe: true });
        const torus = new THREE.Mesh(geometry, material);
        scene.add(torus);

        camera.position.z = 30;

        function animate() {
            requestAnimationFrame(animate);
            torus.rotation.x += 0.01;
            torus.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        animate();
    }

    // PAYMENT GATEWAY UX/UI TAB SYSTEM
    const payTabs = document.querySelectorAll('.pay-tab');
    const payForms = document.querySelectorAll('.payment-form, .payment-tab-content');

    payTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            payTabs.forEach(t => t.classList.remove('active'));
            payForms.forEach(f => f.classList.remove('active'));

            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            const targetEl = document.getElementById(target) || document.getElementById(target + '-form');
            if (targetEl) targetEl.classList.add('active');
        });
    });

    // CARD FORMATTING & VALIDATION
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value;
            
            // Icon Auto Switch Validation
            const icon = document.querySelector('.input-brand-icon');
            if (value.startsWith('4')) icon.className = 'fab fa-cc-visa input-brand-icon';
            else if (value.startsWith('5')) icon.className = 'fab fa-cc-mastercard input-brand-icon';
            else if (value.startsWith('3')) icon.className = 'fab fa-cc-amex input-brand-icon';
            else icon.className = 'fas fa-credit-card input-brand-icon';
        });
    }

    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
            e.target.value = value;
        });
    }

    const cardPayForm = document.getElementById('card-pay-form');
    if (cardPayForm) {
        cardPayForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Payment authorization initiated successfully via secure gateway.');
        });
    }
});

// Preloader & Scroll Progress
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.display = 'none';
});

window.addEventListener('scroll', () => {
    const progress = document.getElementById('scroll-progress');
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (progress) progress.style.width = (window.scrollY / totalHeight) * 100 + '%';
});
