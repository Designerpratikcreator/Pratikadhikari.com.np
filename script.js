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
            body.classList.add('dark-mode');
            themeSwitcher.checked = true;
        }

        themeSwitcher.addEventListener('change', () => {
            if (themeSwitcher.checked) {
                body.classList.add('dark-mode');
                body.classList.remove('light-mode'); // Ensure light-mode is removed if present
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode'); // Add light-mode class for explicit light theme
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
        const typingSpeed = 100; // milliseconds per character
        const deletingSpeed = 60; // milliseconds per character
        const pauseBetweenPhrases = 1500; // milliseconds

        function type() {
            const currentPhrase = phrases[phraseIndex];
            let displayText = '';

            if (isDeleting) {
                displayText = currentPhrase.substring(0, charIndex - 1);
            } else {
                displayText = currentPhrase.substring(0, charIndex + 1);
            }

            typingTextElement.textContent = displayText;

            let typeSpeed = typingSpeed;
            if (isDeleting) {
                typeSpeed = deletingSpeed;
            }

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
    if (canvas && typeof THREE !== 'undefined') { // Ensure THREE is loaded
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true }); // alpha: true for transparent background

        // Set initial size
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Softer ambient light
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        const pointLight1 = new THREE.PointLight(0x00aaff, 1, 100); // Blueish light
        pointLight1.position.set(-10, 5, 10);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff00aa, 1, 100); // Pinkish light
        pointLight2.position.set(10, -5, -10);
        scene.add(pointLight2);

        // Geometries and Materials
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.75, 16, 16), // Reduced segments for performance
            new THREE.ConeGeometry(0.8, 1.5, 16),
            new THREE.TorusGeometry(0.7, 0.3, 10, 30), // Reduced segments
            new THREE.DodecahedronGeometry(0.9) // Simpler dodecahedron
        ];

        const materials = [
            new THREE.MeshStandardMaterial({ color: 0x00CED1, metalness: 0.7, roughness: 0.4 }), // Dark Cyan
            new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.7, roughness: 0.4 }), // Gold
            new THREE.MeshStandardMaterial({ color: 0xBA55D3, metalness: 0.7, roughness: 0.4 }), // Medium Orchid
            new THREE.MeshStandardMaterial({ color: 0x7FFF00, metalness: 0.7, roughness: 0.4 }),  // Chartreuse
            new THREE.MeshStandardMaterial({ color: 0x1E90FF, metalness: 0.7, roughness: 0.4 })   // Dodger Blue
        ];

        const objects = [];
        const numberOfObjects = 40; // Increased number of objects for a richer background

        for (let i = 0; i < numberOfObjects; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            // Spread objects over a larger volume
            mesh.position.x = (Math.random() - 0.5) * 60;
            mesh.position.y = (Math.random() - 0.5) * 60;
            mesh.position.z = (Math.random() - 0.5) * 60;

            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;

            const scale = Math.random() * 0.8 + 0.3; // Random scale between 0.3 and 1.1
            mesh.scale.set(scale, scale, scale);

            scene.add(mesh);
            objects.push(mesh);
        }

        camera.position.z = 25; // Move camera back to view more of the objects

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);

            objects.forEach(obj => {
                obj.rotation.x += 0.002 * (Math.random() * 0.5 + 0.5); // Slower, varied rotation
                obj.rotation.y += 0.002 * (Math.random() * 0.5 + 0.5);
                obj.rotation.z += 0.002 * (Math.random() * 0.5 + 0.5);

                // Subtle floating/drifting motion
                obj.position.x += Math.sin(Date.now() * 0.00003 + obj.uuid.charCodeAt(0)) * 0.01;
                obj.position.y += Math.cos(Date.now() * 0.00003 + obj.uuid.charCodeAt(1)) * 0.01;
                obj.position.z += Math.sin(Date.now() * 0.00003 + obj.uuid.charCodeAt(2)) * 0.01;

                // Simple wrap-around logic for objects that go too far
                const bound = 30; // Half of the 60 unit spread
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
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                });
                // Add active class to the link corresponding to the intersecting section
                const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // --- Interactive and Animated Map Section (Leaflet.js) ---
    const mapContainer = document.getElementById('map');
    const loadingOverlay = document.getElementById('loading-overlay');
    const toggleButton = document.getElementById('toggle-animation');
    let map;
    let animatedMarker;
    let animationId;
    let isAnimating = false;
    let currentPathIndex = 0;
    
    // Define the path for the animated marker
    const path = [
        [27.7172, 85.3240], // Kathmandu
        [27.6749, 85.3197], // Patan Durbar Square
        [27.7088, 85.3175], // Thamel
        [27.7008, 85.3300], // New Baneshwor
        [27.6896, 85.3101], // Lalitpur
        [27.7172, 85.3240]  // Back to Kathmandu
    ];
    
    function initMap() {
        if (map) {
            map.remove();
        }
    
        map = L.map('map').setView(path[0], 13);
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Custom icon for the animated marker
        const animatedIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/2883/2883908.png', // A location pin icon
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            className: 'pulsing-icon'
        });

        // Add the animated marker to the map
        animatedMarker = L.marker(path[0], { icon: animatedIcon }).addTo(map);

        // Add a polyline to show the path
        L.polyline(path, {color: '#B94F9C', weight: 4, opacity: 0.8}).addTo(map);

        // Hide the loading overlay and show the map
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    
        // Animation loop for the marker
        const animateMarker = (timestamp) => {
            if (!isAnimating) return;
    
            const nextIndex = (currentPathIndex + 1) % path.length;
            const startPoint = L.latLng(path[currentPathIndex]);
            const endPoint = L.latLng(path[nextIndex]);
    
            // Calculate distance and duration for animation
            const distance = startPoint.distanceTo(endPoint);
            const duration = distance * 50; // Adjust speed based on distance
    
            // Use GSAP for smooth animation
            gsap.to(animatedMarker.getLatLng(), {
                lat: endPoint.lat,
                lng: endPoint.lng,
                duration: duration / 1000,
                ease: "power1.inOut",
                onUpdate: function() {
                    animatedMarker.setLatLng(this.targets()[0]);
                },
                onComplete: function() {
                    currentPathIndex = nextIndex;
                    if (isAnimating) {
                        animationId = requestAnimationFrame(animateMarker);
                    }
                }
            });
        };
    
        // Event listener for the toggle button
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                isAnimating = !isAnimating;
                if (isAnimating) {
                    toggleButton.textContent = 'Stop Animation';
                    animationId = requestAnimationFrame(animateMarker);
                } else {
                    toggleButton.textContent = 'Start Animation';
                    cancelAnimationFrame(animationId);
                }
            });
        }
    }
    
    // Check for Leaflet before initializing the map
    if (typeof L !== 'undefined') {
        initMap();
    } else {
        console.error("Leaflet.js is not loaded.");
        if (loadingOverlay) {
            loadingOverlay.innerHTML = '<p>Failed to load map library. Please check your internet connection.</p>';
        }
    }
});
