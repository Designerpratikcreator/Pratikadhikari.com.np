document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    // --- Hamburger Menu Toggle ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close mobile nav when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- Theme Switcher (Light/Dark Mode) ---
    if (themeSwitcher) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            body.classList.add(savedTheme);
            if (savedTheme === 'dark-mode') {
                themeSwitcher.checked = true;
            }
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
        });
    }
     // --- Hero Section Typing Effect ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const phrases = [
            "Searches.",
            "Cases.",
            "Privacy.",
            "Supports.",
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100;
        const deletingSpeed = 60;
        const pauseBetweenPhrases = 1500;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            const displayChar = isDeleting ? charIndex : charIndex + 1;
            typingTextElement.textContent = currentPhrase.substring(0, displayChar);

            let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = pauseBetweenPhrases;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }

            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            setTimeout(type, typeSpeed);
        }

        type(); // Start the typing effect
    } 


// --- 3D Geometric Motion Graphics for Hero Section ---
    const canvas = document.getElementById('hero-background-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        const pointLight1 = new THREE.PointLight(0x00aaff, 1, 100);
        pointLight1.position.set(-10, 5, 10);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff00aa, 1, 100);
        pointLight2.position.set(10, -5, -10);
        scene.add(pointLight2);

        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.75, 16, 16),
            new THREE.ConeGeometry(0.8, 1.5, 16),
            new THREE.TorusGeometry(0.7, 0.3, 10, 30),
            new THREE.DodecahedronGeometry(0.9)
        ];

        const materials = [
            new THREE.MeshStandardMaterial({ color: 0x00CED1, metalness: 0.7, roughness: 0.4 }),
            new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.7, roughness: 0.4 }),
            new THREE.MeshStandardMaterial({ color: 0xBA55D3, metalness: 0.7, roughness: 0.4 }),
            new THREE.MeshStandardMaterial({ color: 0x7FFF00, metalness: 0.7, roughness: 0.4 }),
            new THREE.MeshStandardMaterial({ color: 0x1E90FF, metalness: 0.7, roughness: 0.4 })
        ];

        const objects = [];
        const numberOfObjects = 40;

        for (let i = 0; i < numberOfObjects; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.x = (Math.random() - 0.5) * 60;
            mesh.position.y = (Math.random() - 0.5) * 60;
            mesh.position.z = (Math.random() - 0.5) * 60;

            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;

            const scale = Math.random() * 0.8 + 0.3;
            mesh.scale.set(scale, scale, scale);

            scene.add(mesh);
            objects.push(mesh);
        }

        camera.position.z = 25;

        const animate = () => {
            requestAnimationFrame(animate);

            objects.forEach(obj => {
                obj.rotation.x += 0.002 * (Math.random() * 0.5 + 0.5);
                obj.rotation.y += 0.002 * (Math.random() * 0.5 + 0.5);
                obj.rotation.z += 0.002 * (Math.random() * 0.5 + 0.5);

                obj.position.x += Math.sin(Date.now() * 0.00003 + obj.uuid.charCodeAt(0)) * 0.01;
                obj.position.y += Math.cos(Date.now() * 0.00003 + obj.uuid.charCodeAt(1)) * 0.01;
                obj.position.z += Math.sin(Date.now() * 0.00003 + obj.uuid.charCodeAt(2)) * 0.01;
                
                const bound = 30;
                if (obj.position.x > bound) obj.position.x = -bound;
                if (obj.position.x < -bound) obj.position.x = bound;
                if (obj.position.y > bound) obj.position.y = -bound;
                if (obj.position.y < -bound) obj.position.y = bound;
                if (obj.position.z > bound) obj.position.z = -bound;
                if (obj.position.z < -bound) obj.position.z = bound;
            });

            renderer.render(scene, camera);
        };
        animate();
    } else if (canvas) {
        console.warn("Three.js not loaded. Hero background animation will not be displayed.");
    }

    // --- Set current year in footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Navbar Active State on Scroll ---
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-links li a');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Adjust threshold as needed
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' class from all links
                navLinksList.forEach(link => link.classList.remove('active'));
                // Add 'active' class to the corresponding link
                const currentSectionId = entry.target.id;
                const correspondingLink = document.querySelector(`.nav-links a[href="#${currentSectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Smooth Scrolling for all internal links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Add a comment to guide the user on the form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // This form requires a backend to handle submission.
            // Example: fetch('/api/contact', { method: 'POST', body: new FormData(e.target) });
            console.log('Form submitted. A backend service is needed to process this data.');
            alert('Your message has been logged to the console. Please note that a backend is required for actual submission.');
        });
    }

});
