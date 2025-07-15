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

    // Auto-advance gallery every 5 seconds (optional, enable/disable as needed)
    // setInterval(nextGalleryItem, 5000); // Removed for now to avoid conflict with screensaver concept
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

    // --- Screensaver Logic (Three.js Integration) ---
    const screensaverContainer = document.getElementById('screensaver-container');
    const IDLE_TIME_LIMIT = 15000; // 15 seconds of inactivity
    let idleTimer;
    let screensaverActive = false;
    let scene, camera, renderer, sphere, ambientLight, directionalLight;

    // Function to initialize and animate the Three.js scene
    function initScreensaver() {
        if (screensaverActive || typeof THREE === 'undefined') {
            return; // Don't re-initialize or if Three.js isn't loaded yet
        }

        screensaverActive = true;
        screensaverContainer.classList.add('screensaver-active');
        document.body.classList.add('screensaver-active');

        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); // Black background for the screensaver

        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        screensaverContainer.appendChild(renderer.domElement);

        // Geometry (a simple sphere for demonstration)
        const geometry = new THREE.SphereGeometry(1.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0x40E0D0, emissive: 0x111111, specular: 0x050505, shininess: 100 }); // Cyan material
        sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Lights
        ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
        scene.add(ambientLight);

        directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 1).normalize();
        scene.add(directionalLight);

        // Animation Loop
        function animate() {
            if (!screensaverActive) return; // Stop animation if screensaver is inactive

            requestAnimationFrame(animate);

            sphere.rotation.x += 0.005;
            sphere.rotation.y += 0.005;

            renderer.render(scene, camera);
        }
        animate();

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        if (!screensaverActive) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Function to hide the screensaver
    function hideScreensaver() {
        screensaverActive = false;
        screensaverContainer.classList.remove('screensaver-active');
        document.body.classList.remove('screensaver-active');

        // Clean up Three.js resources if needed (optional for this simple example)
        if (renderer) {
            renderer.dispose();
            if (renderer.domElement.parentNode === screensaverContainer) {
                screensaverContainer.removeChild(renderer.domElement);
            }
        }
        scene = null;
        camera = null;
        renderer = null;
        sphere = null;
        ambientLight = null;
        directionalLight = null;

        window.removeEventListener('resize', onWindowResize, false);
    }

    // Reset idle timer and hide screensaver on user activity
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        if (screensaverActive) {
            hideScreensaver();
        }
        idleTimer = setTimeout(initScreensaver, IDLE_TIME_LIMIT);
    }

    // Listen for user activity
    ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetIdleTimer, false);
    });

    // Initial call to start the idle timer
    resetIdleTimer();
});
