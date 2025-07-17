document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    // --- Hamburger Menu Toggle ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times'); // Change icon to 'X'
        });

        // Close mobile nav when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
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
            // Default to dark mode if OS prefers it and no theme is saved
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

    // --- Typing Effect for Hero Section ---
    const typedTextElement = document.querySelector('.typed-text');
    if (typedTextElement) {
        const words = ["Web Developer", "Web Designer", "Frontend Developer", "Backend Developer", "Full-Stack Enthusiast"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 150;
        const deletingSpeed = 100;
        const delayBeforeNextWord = 1500;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typedTextElement.textContent = currentWord.substring(0, charIndex--);
            } else {
                typedTextElement.textContent = currentWord.substring(0, charIndex++);
            }

            let typeSpeed = typingSpeed;
            if (isDeleting) {
                typeSpeed = deletingSpeed;
            }

            if (!isDeleting && charIndex === currentWord.length + 1) {
                typeSpeed = delayBeforeNextWord;
                isDeleting = true;
            } else if (isDeleting && charIndex === -1) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                charIndex = 0;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- Three.js Background Animation (Simple Particles) ---
    const heroBackground = document.getElementById('hero-background');
    if (heroBackground && typeof THREE !== 'undefined') {
        let scene, camera, renderer, particles;
        const particleCount = 1000;
        const particleSize = 1;
        const particleColor = 0xffffff; // White particles
        const connections = []; // To store lines for connections

        function initThreeJS() {
            // Scene
            scene = new THREE.Scene();

            // Camera
            camera = new THREE.PerspectiveCamera(75, heroBackground.clientWidth / heroBackground.clientHeight, 0.1, 1000);
            camera.position.z = 100;

            // Renderer
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(heroBackground.clientWidth, heroBackground.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            heroBackground.appendChild(renderer.domElement);

            // Particles
            const geometry = new THREE.BufferGeometry();
            const positions = [];
            const colors = []; // For gradient color later if needed
            const material = new THREE.PointsMaterial({
                color: particleColor,
                size: particleSize,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * 2000 - 1000;
                const y = Math.random() * 2000 - 1000;
                const z = Math.random() * 2000 - 1000;
                positions.push(x, y, z);
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            // Lines for connections
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x0000FF, // Blue lines
                transparent: true,
                opacity: 0.1,
                blending: THREE.AdditiveBlending
            });
            const maxDistance = 100; // Max distance for lines to form

            function createConnections() {
                // Clear existing connections
                connections.forEach(line => scene.remove(line));
                connections.length = 0;

                const positionsArray = geometry.attributes.position.array;
                const tempParticles = [];
                for (let i = 0; i < positionsArray.length; i += 3) {
                    tempParticles.push(new THREE.Vector3(positionsArray[i], positionsArray[i + 1], positionsArray[i + 2]));
                }

                for (let i = 0; i < particleCount; i++) {
                    for (let j = i + 1; j < particleCount; j++) {
                        const dist = tempParticles[i].distanceTo(tempParticles[j]);
                        if (dist < maxDistance) {
                            const lineGeometry = new THREE.BufferGeometry();
                            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute([
                                tempParticles[i].x, tempParticles[i].y, tempParticles[i].z,
                                tempParticles[j].x, tempParticles[j].y, tempParticles[j].z
                            ], 3));
                            const line = new THREE.Line(lineGeometry, lineMaterial);
                            connections.push(line);
                            scene.add(line);
                        }
                    }
                }
            }

            // createConnections(); // Only create if really necessary, very performance heavy

            // Animation loop
            function animate() {
                requestAnimationFrame(animate);

                // Animate particles
                particles.rotation.x += 0.0005;
                particles.rotation.y += 0.0008;

                renderer.render(scene, camera);
            }
            animate();

            // Handle window resize
            window.addEventListener('resize', onWindowResize);
        }

        function onWindowResize() {
            camera.aspect = heroBackground.clientWidth / heroBackground.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(heroBackground.clientWidth, heroBackground.clientHeight);
        }

        initThreeJS();
    }


    // --- Set Current Year in Footer ---
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- Smooth Scrolling for Navigation Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Loading Overlay ---
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        window.addEventListener('load', () => {
            loadingOverlay.classList.add('hidden');
        });
        // Fallback for fast loads or if 'load' event doesn't fire as expected
        setTimeout(() => {
            if (!loadingOverlay.classList.contains('hidden')) {
                loadingOverlay.classList.add('hidden');
            }
        }, 3000); // Hide after 3 seconds even if load event is slow
    }


    // --- Skill Bar Animation on Scroll (Intersection Observer) ---
    const skillListItems = document.querySelectorAll('.skill-category ul li');
    const skillsObserverOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the item is visible
    };

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = parseInt(entry.target.dataset.level, 10);
                const skillBar = entry.target.querySelector('.skill-level-bar');
                if (skillBar) {
                    skillBar.style.width = skillLevel + '%';
                    let colorVar;
                    // Determine color based on skill level and current theme
                    if (skillLevel < 40) {
                        colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-low' : '--skill-level-low';
                    } else if (skillLevel < 70) {
                        colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-medium' : '--skill-level-medium';
                    } else if (skillLevel < 90) {
                        colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-high' : '--skill-level-high';
                    } else {
                        colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-expert' : '--skill-level-expert';
                    }
                    skillBar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(colorVar);
                }
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, skillsObserverOptions);

    skillListItems.forEach(item => {
        skillsObserver.observe(item);
    });

    // Re-apply skill colors on theme change
    themeSwitcher.addEventListener('change', () => {
        skillListItems.forEach(item => {
            const skillLevel = parseInt(item.dataset.level, 10);
            const skillBar = item.querySelector('.skill-level-bar');
            if (skillBar) {
                let colorVar;
                if (skillLevel < 40) {
                    colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-low' : '--skill-level-low';
                } else if (skillLevel < 70) {
                    colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-medium' : '--skill-level-medium';
                } else if (skillLevel < 90) {
                    colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-high' : '--skill-level-high';
                } else {
                    colorVar = body.classList.contains('dark-mode') ? '--dark-skill-level-expert' : '--skill-level-expert';
                }
                skillBar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(colorVar);
            }
        });
    });

});
