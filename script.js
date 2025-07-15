document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    // --- Hamburger Menu Toggle ---
    if (hamburger && navLinks) {
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
    }

    // --- Theme Switcher (Light/Dark Mode) ---
    if (themeSwitcher) {
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
                body.classList.remove('light-mode'); // Ensure light-mode is removed if present
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode'); // Add light-mode class
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }

    // --- Gallery Carousel ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.querySelector('.carousel-nav .prev-btn');
    const nextBtn = document.querySelector('.carousel-nav .next-btn');
    let currentGalleryIndex = 0;

    if (galleryItems.length > 0 && prevBtn && nextBtn) {
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
        showGalleryItem(currentGalleryIndex);

        prevBtn.addEventListener('click', prevGalleryItem);
        nextBtn.addEventListener('click', nextGalleryItem);

        // Auto-advance gallery every 5 seconds (optional)
        setInterval(nextGalleryItem, 5000);
    }

    // --- Form Submission (Client-Side to Backend) ---
    const applicationForm = document.getElementById('application-form');
    const messageForm = document.getElementById('message-form');

    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(applicationForm);
            const data = Object.fromEntries(formData.entries());

            // --- IMPORTANT: REPLACE WITH YOUR DEPLOYED BACKEND URL FOR APPLICATION SUBMISSIONS ---
            const APPLICATION_BACKEND_URL = 'YOUR_APPLICATION_FORM_BACKEND_ENDPOINT_HERE'; // e.g., 'https://api.yourdomain.com/submit-application'

            if (APPLICATION_BACKEND_URL === 'YOUR_APPLICATION_FORM_BACKEND_ENDPOINT_HERE') {
                alert('Application form is not configured. Please set the APPLICATION_BACKEND_URL in script.js to enable submission.');
                return;
            }

            try {
                const response = await fetch(APPLICATION_BACKEND_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Application submitted successfully! We will get back to you soon.');
                    applicationForm.reset(); // Clear the form
                } else {
                    const errorData = await response.json(); // Try to parse error message from backend
                    alert(`Failed to submit application: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Error submitting application:', error);
                alert('An error occurred while submitting your application. Please check your internet connection or try again later.');
            }
        });
    }

    if (messageForm) {
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(messageForm);
            const data = Object.fromEntries(formData.entries());

            // --- IMPORTANT: REPLACE WITH YOUR DEPLOYED BACKEND URL FOR MESSAGE SUBMISSIONS ---
            const MESSAGE_BACKEND_URL = 'YOUR_MESSAGE_FORM_BACKEND_ENDPOINT_HERE'; // e.g., 'https://api.yourdomain.com/send-message'

            if (MESSAGE_BACKEND_URL === 'YOUR_MESSAGE_FORM_BACKEND_ENDPOINT_HERE') {
                alert('Message form is not configured. Please set the MESSAGE_BACKEND_URL in script.js to enable submission.');
                return;
            }

            try {
                const response = await fetch(MESSAGE_BACKEND_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Message sent successfully! Thank you for reaching out.');
                    messageForm.reset(); // Clear the form
                } else {
                    const errorData = await response.json(); // Try to parse error message from backend
                    alert(`Failed to send message: ${errorData.message || response.statusText}`);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert('An error occurred while sending your message. Please check your internet connection or try again later.');
            }
        });
    }

    // --- 3D Geometric Motion Graphics for Hero Section ---
    const canvas = document.getElementById('hero-background-canvas');
    if (canvas) {
        const scene = new THREE.Scene();
        // Using parentElement.clientWidth for width and clientHeight for height for better responsiveness
        const camera = new THREE.PerspectiveCamera(75, canvas.parentElement.clientWidth / canvas.parentElement.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true }); // alpha: true for transparent background
        renderer.setSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // Improve rendering quality on high-DPI screens

        // Adjust camera aspect ratio and renderer size on window resize
        window.addEventListener('resize', () => {
            camera.aspect = canvas.parentElement.clientWidth / canvas.parentElement.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
        });

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light, increased intensity
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // Geometries and Materials
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.75, 32, 32),
            new THREE.ConeGeometry(0.8, 1.5, 32),
            new THREE.TorusGeometry(0.7, 0.3, 16, 100)
        ];

        const materials = [
            new THREE.MeshStandardMaterial({ color: 0x00CED1, metalness: 0.5, roughness: 0.4 }), // Dark Cyan
            new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.5, roughness: 0.4 }), // Gold
            new THREE.MeshStandardMaterial({ color: 0xBA55D3, metalness: 0.5, roughness: 0.4 }), // Medium Orchid
            new THREE.MeshStandardMaterial({ color: 0x7FFF00, metalness: 0.5, roughness: 0.4 })  // Chartreuse
        ];

        const objects = [];
        const numberOfObjects = 20;

        for (let i = 0; i < numberOfObjects; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.x = (Math.random() - 0.5) * 20;
            mesh.position.y = (Math.random() - 0.5) * 20;
            mesh.position.z = (Math.random() - 0.5) * 20;

            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;

            const scale = Math.random() * 0.5 + 0.5; // Random scale between 0.5 and 1.0
            mesh.scale.set(scale, scale, scale);

            scene.add(mesh);
            objects.push(mesh);
        }

        camera.position.z = 5;

        // Animation Loop
        const animate = () => {
            requestAnimationFrame(animate);

            objects.forEach(obj => {
                obj.rotation.x += 0.005;
                obj.rotation.y += 0.005;
                // Optional: add subtle movement
                obj.position.x += Math.sin(Date.now() * 0.0001 + obj.uuid.charCodeAt(0)) * 0.001;
                obj.position.y += Math.cos(Date.now() * 0.0001 + obj.uuid.charCodeAt(1)) * 0.001;
            });

            renderer.render(scene, camera);
        };
        animate();
    }

    // --- Set current year in footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
