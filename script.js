

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
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Optional: Highlight Home when at top of page or scrolling fast
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) { // If near top, activate home
            navLinksList.forEach(link => link.classList.remove('active'));
            document.querySelector('.nav-links li a[href="#home"]').classList.add('active');
        }
    });

    // --- Skill Level Indicators ---
    const skillListItems = document.querySelectorAll('.skill-category ul li');

    const skillsObserverOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger when 100px from bottom of viewport
        threshold: 0.2 // Trigger when 20% of the item is visible
    };

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = parseInt(entry.target.dataset.level, 10);
                const skillBar = entry.target.querySelector('.skill-level-bar');

                if (skillBar) {
                    // Set width
                    skillBar.style.width = `${skillLevel}%`;

                    // Set color based on level
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
// Function to toggle the navigation menu on small screens
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            // Store theme preference in localStorage
            if (document.body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });

        // Apply saved theme on page load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            // Default to dark theme if no preference or 'dark' saved
            document.body.classList.remove('light-theme');
        }
    }
});


<script>
    // **IMPORTANT: The API key is set by the environment.**
    // **DO NOT** replace this with your own key.
    const apiKey = "";
    let map, motorbikeMarker, polyline, animationId;
    let isAnimating = false;
    let currentIndex = 0;
    let progress = 0;
    const animationSpeed = 0.005; // Adjust this value for speed (0.001 to 0.01)

    // The SVG icon for the motorbike as a Data URI
    // This keeps the entire solution in a single file
    const motorbikeIcon = {
        url: 'data:image/svg+xml;utf-8,' +
            '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M20,5 Q20,0 25,5 T30,10 T25,15 T20,20 T15,15 T10,10 T15,5 T20,5 Z" ' +
            'fill="#FF0000" stroke="#FFFFFF" stroke-width="2"/>' +
            '<path d="M20,20 C15,25 15,35 20,35 S25,30 25,25" ' +
            'fill="none" stroke="#FF0000" stroke-width="2" stroke-linecap="round"/>' +
            '<circle cx="15" cy="25" r="5" fill="#FFFFFF" stroke="#FF0000" stroke-width="2"/>' +
            '<circle cx="25" cy="25" r="5" fill="#FFFFFF" stroke="#FF0000" stroke-width="2"/>' +
            '</svg>',
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
    };

    // Pre-defined path coordinates for the motorbike to follow
    // These points trace a winding path in Lalitpur, Nepal (Gwarko area).
    const pathCoordinates = [
        { lat: 27.68725, lng: 85.33758 },
        { lat: 27.68750, lng: 85.33950 },
        { lat: 27.68800, lng: 85.34000 },
        { lat: 27.68900, lng: 85.34050 },
        { lat: 27.69000, lng: 85.34100 },
        { lat: 27.69100, lng: 85.34050 },
        { lat: 27.69200, lng: 85.33900 },
        { lat: 27.69150, lng: 85.33700 },
        { lat: 27.69100, lng: 85.33600 },
        { lat: 27.69000, lng: 85.33500 },
        { lat: 27.68900, lng: 85.33550 },
        { lat: 27.68800, lng: 85.33650 },
        { lat: 27.68725, lng: 85.33758 }
    ];

    /**
     * Helper function to get an intermediate point between two coordinates.
     * @param {Object} start - The starting LatLng object.
     * @param {Object} end - The ending LatLng object.
     * @param {number} t - The progress (0.0 to 1.0).
     * @returns {Object} The interpolated LatLng object.
     */
    function interpolate(start, end, t) {
        return {
            lat: start.lat + (end.lat - start.lat) * t,
            lng: start.lng + (end.lng - start.lng) * t
        };
    }

    /**
     * Animates the motorbike marker along the predefined path.
     */
    function animateMotorbike() {
        progress += animationSpeed;

        if (progress >= 1) {
            progress = 0;
            currentIndex = (currentIndex + 1) % pathCoordinates.length;
        }

        const nextIndex = (currentIndex + 1) % pathCoordinates.length;
        const newPosition = interpolate(pathCoordinates[currentIndex], pathCoordinates[nextIndex], progress);

        motorbikeMarker.setPosition(newPosition);
        animationId = requestAnimationFrame(animateMotorbike);
    }

    /**
     * Initializes the Google Map and all its components.
     */
    function initMap() {
        const mapCenter = pathCoordinates[0];

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 17,
            center: mapCenter,
            mapId: "YOUR_MAP_ID", // Optional: use your own map style ID
        });

        // Create the path on the map
        polyline = new google.maps.Polyline({
            path: pathCoordinates,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: map,
        });

        // Create the motorbike marker at the start of the path
        motorbikeMarker = new google.maps.Marker({
            position: mapCenter,
            icon: motorbikeIcon,
            map: map,
            title: "Motorbike",
        });

        // Hide the loading overlay once the map is ready
        document.getElementById("loading-overlay").style.display = 'none';

        // Event listener for the toggle button
        document.getElementById("toggle-animation").addEventListener('click', () => {
            if (isAnimating) {
                cancelAnimationFrame(animationId);
                document.getElementById("toggle-animation").textContent = "Start Animation";
            } else {
                animateMotorbike();
                document.getElementById("toggle-animation").textContent = "Stop Animation";
            }
            isAnimating = !isAnimating;
        });

        // Initial animation start
        animateMotorbike();
        isAnimating = true;
    }

    /**
     * Dynamically loads the Google Maps JavaScript API script.
     */
    function loadScript() {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
        script.async = true;
        document.head.appendChild(script);

        // Fallback if the script doesn't load
        script.onerror = () => {
            document.getElementById("loading-overlay").innerHTML = '<p class="text-red-500">Failed to load Google Maps. Please check your network connection.</p>';
        };
    }

    // Start the whole process when the window loads
    window.onload = loadScript;
</script>
