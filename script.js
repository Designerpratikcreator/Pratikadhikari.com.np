// Ensure Three.js is loaded before trying to use it
// The script is loaded asynchronously in index.html, so we should put Three.js related code inside a listener or wait
// This assumes Three.js is globally available as 'THREE' after loading the CDN script.

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    // --- Hamburger Menu Toggle ---
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile nav when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Theme Switcher (Light/Dark Mode) ---
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (savedTheme === 'dark-mode') {
            themeSwitcher.checked = true;
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // System preference is dark
        body.classList.add('dark-mode');
        themeSwitcher.checked = true;
    }

    themeSwitcher.addEventListener('change', () => {
        if (themeSwitcher.checked) {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // --- Gallery Carousel ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.querySelector('.carousel-nav .prev-btn');
    const nextBtn = document.querySelector('.carousel-nav .next-btn');
    let currentGalleryIndex = 0;

    function showGalleryItem(index) {
        galleryItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    }

    function nextGalleryItem() {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
        showGalleryItem(currentGalleryIndex);
    }

    function prevGalleryItem() {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
        showGalleryItem(currentGalleryIndex);
    }

    // Initial display
    if (galleryItems.length > 0) {
        showGalleryItem(currentGalleryIndex);
    }

    // Auto-advance gallery every 5 seconds
    setInterval(nextGalleryItem, 5000);
    prevBtn.addEventListener('click', prevGalleryItem);
    nextBtn.addEventListener('click', nextGalleryItem);


    // --- Form Submission (Client-Side to Backend) ---
    const applicationForm = document.getElementById('application-form');
    const messageForm = document.getElementById('message-form');

    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(applicationForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // *** REPLACE THIS URL with your deployed backend URL ***
                const response = await fetch('https://pratikadhikari-com-np.vercel.app/submit-application', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Application submitted successfully!');
                    applicationForm.reset(); // Clear the form
                } else {
                    const errorData = await response.json(); // Try to parse error message from backend
                    alert(`Failed to submit application: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Error submitting application:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    if (messageForm) {
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(messageForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // *** REPLACE THIS URL with your deployed backend URL ***
                const response = await fetch('https://pratikadhikari-com-np.vercel.app/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Message sent successfully!');
                    messageForm.reset(); // Clear the form
                } else {
                    const errorData = await response.json(); // Try to parse error message from backend
                    alert(`Failed to send message: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }

    // --- Butterfly-like Particle Screensaver Logic (Three.js Integration) ---
    const screensaverContainer = document.getElementById('screensaver-container');
    let scene, camera, renderer, particles, particleCount, positions, colors, sizes, velocity, particleSystem;
    let width = screensaverContainer.clientWidth;
    let height = screensaverContainer.clientHeight;

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error("Three.js is not loaded. Please ensure the Three.js script tag is correct and loaded.");
        return; // Exit if Three.js is not available
    }

    function initScreensaver() {
        // Scene
        scene = new THREE.Scene();
        scene.background = null; // Make background transparent to show hero section gradient

        // Camera
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 100; // Adjust camera position for the particle field

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable alpha for transparency
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        screensaverContainer.appendChild(renderer.domElement);

        // Particles
        particleCount = 1000; // Number of "butterflies" (particles)
        particles = new THREE.BufferGeometry();
        positions = new Float32Array(particleCount * 3);
        colors = new Float32Array(particleCount * 3);
        sizes = new Float32Array(particleCount);
        velocity = new Float32Array(particleCount * 3); // For particle movement

        const color = new THREE.Color();

        for (let i = 0; i < particleCount; i++) {
            // Position particles randomly within a box
            positions[i * 3 + 0] = (Math.random() * 2 - 1) * 300; // X
            positions[i * 3 + 1] = (Math.random() * 2 - 1) * 200; // Y
            positions[i * 3 + 2] = (Math.random() * 2 - 1) * 300; // Z

            // Assign random initial velocity
            velocity[i * 3 + 0] = (Math.random() - 0.5) * 0.5;
            velocity[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
            velocity[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

            // Random colors (e.g., subtle blues, pinks, purples for butterfly wings)
            color.setHSL(Math.random() * 0.3 + 0.6, 0.7, 0.7); // HSL for varied pastel-like colors
            colors[i * 3 + 0] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Random sizes for variation
            sizes[i] = Math.random() * 5 + 2;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // ShaderMaterial for particles (to use size attribute)
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: new THREE.TextureLoader().load('/Assets/images/sparkle.png') } // Optional: A subtle sparkle texture
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                    // Add a falloff effect for softer edges
                    float circularity = 1.0 - length(gl_PointCoord - vec2(0.5));
                    gl_FragColor.a *= circularity;
                    if (gl_FragColor.a < 0.0001) discard; // Remove fully transparent pixels
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true // Enable vertex colors
        });


        particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        // Animation Loop
        function animateParticles() {
            requestAnimationFrame(animateParticles);

            const positions = particleSystem.geometry.attributes.position.array;
            const sizes = particleSystem.geometry.attributes.size.array;
            const time = Date.now() * 0.00005; // For subtle time-based movement variation

            for (let i = 0; i < particleCount; i++) {
                // Update position based on velocity
                positions[i * 3 + 0] += velocity[i * 3 + 0];
                positions[i * 3 + 1] += velocity[i * 3 + 1];
                positions[i * 3 + 2] += velocity[i * 3 + 2];

                // Simple boundaries: "wrap" particles around if they go too far
                if (positions[i * 3 + 0] > 300) positions[i * 3 + 0] = -300;
                if (positions[i * 3 + 0] < -300) positions[i * 3 + 0] = 300;
                if (positions[i * 3 + 1] > 200) positions[i * 3 + 1] = -200;
                if (positions[i * 3 + 1] < -200) positions[i * 3 + 1] = 200;
                if (positions[i * 3 + 2] > 300) positions[i * 3 + 2] = -300;
                if (positions[i * 3 + 2] < -300) positions[i * 3 + 2] = 300;

                // Add subtle "fluttering" motion using sine waves
                positions[i * 3 + 0] += Math.sin(time * i * 0.1) * 0.1;
                positions[i * 3 + 1] += Math.cos(time * i * 0.05) * 0.1;

                // Adjust size subtly for a breathing/fluttering effect
                sizes[i] = (Math.sin(time * i * 0.2) * 1) + 5; // Base size + pulsating effect
            }

            particleSystem.geometry.attributes.position.needsUpdate = true;
            particleSystem.geometry.attributes.size.needsUpdate = true;


            renderer.render(scene, camera);
        }
        animateParticles();

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        width = screensaverContainer.clientWidth;
        height = screensaverContainer.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // Initialize the screensaver immediately when the DOM content is loaded
    initScreensaver();
});
