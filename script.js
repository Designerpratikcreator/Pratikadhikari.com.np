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
            "creative websites.",
            "dynamic web applications.",
            "intuitive user interfaces.",
            "seamless user experiences."
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


    // --- Form Submission (Formspree is handled directly by HTML action) ---
    // The previous JavaScript logic for form submission has been removed
    // as Formspree handles the POST request directly from the HTML form's action attribute.
    // No JS is explicitly needed here for the Formspree submission itself.


 // Ensure Three.js is loaded before running this script
// <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hero-background-canvas');
    if (!canvas || typeof THREE === 'undefined') {
        console.warn("Canvas or Three.js not found. Hero background animation will not be displayed.");
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true }); // Antialias for smoother edges

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x00ffff, 0.7); // Cyan light
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xff00ff, 0.7); // Magenta light
    directionalLight2.position.set(-10, -10, -10);
    scene.add(directionalLight2);

    camera.position.z = 30; // Move camera back to view the scene

    const butterflies = [];
    const numberOfButterflies = 30; // Adjust as needed for performance vs. density

    // Butterfly creation function
    function createButterfly() {
        const bodyGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8); // Simple body
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2; // Orient body horizontally

        const wingWidth = 1.5;
        const wingHeight = 1.0;

        // Generate a random vibrant color for the butterfly
        const color = new THREE.Color(Math.random() * 0xffffff);
        const wingMaterial = new THREE.MeshStandardMaterial({ color: color, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.5 });

        // Front Left Wing
        const frontLeftWingGeometry = new THREE.PlaneGeometry(wingWidth, wingHeight);
        const frontLeftWing = new THREE.Mesh(frontLeftWingGeometry, wingMaterial);
        frontLeftWing.position.set(-0.1, 0.0, 0.0); // Slightly offset from body
        frontLeftWing.rotation.y = Math.PI / 4; // Initial flap angle

        // Pivot for the wing, allowing it to rotate around its 'attachment' point
        const frontLeftWingPivot = new THREE.Object3D();
        frontLeftWingPivot.position.set(0, 0.2, 0); // Attach point on body
        frontLeftWingPivot.add(frontLeftWing);
        frontLeftWing.position.x = -wingWidth / 2; // Offset wing so pivot is on the edge

        // Front Right Wing
        const frontRightWingGeometry = new THREE.PlaneGeometry(wingWidth, wingHeight);
        const frontRightWing = new THREE.Mesh(frontRightWingGeometry, wingMaterial);
        frontRightWing.position.set(0.1, 0.0, 0.0);
        frontRightWing.rotation.y = -Math.PI / 4; // Initial flap angle

        const frontRightWingPivot = new THREE.Object3D();
        frontRightWingPivot.position.set(0, 0.2, 0);
        frontRightWingPivot.add(frontRightWing);
        frontRightWing.position.x = wingWidth / 2;

        // Back Left Wing (slightly smaller/different)
        const backLeftWingGeometry = new THREE.PlaneGeometry(wingWidth * 0.8, wingHeight * 0.8);
        const backLeftWing = new THREE.Mesh(backLeftWingGeometry, wingMaterial);
        backLeftWing.position.set(-0.1, 0.0, 0.0);
        backLeftWing.rotation.y = Math.PI / 4;

        const backLeftWingPivot = new THREE.Object3D();
        backLeftWingPivot.position.set(0, -0.2, 0);
        backLeftWingPivot.add(backLeftWing);
        backLeftWing.position.x = -wingWidth * 0.8 / 2;

        // Back Right Wing
        const backRightWingGeometry = new THREE.PlaneGeometry(wingWidth * 0.8, wingHeight * 0.8);
        const backRightWing = new THREE.Mesh(backRightWingGeometry, wingMaterial);
        backRightWing.position.set(0.1, 0.0, 0.0);
        backRightWing.rotation.y = -Math.PI / 4;

        const backRightWingPivot = new THREE.Object3D();
        backRightWingPivot.position.set(0, -0.2, 0);
        backRightWingPivot.add(backRightWing);
        backRightWing.position.x = wingWidth * 0.8 / 2;

        const butterflyGroup = new THREE.Group();
        butterflyGroup.add(body);
        butterflyGroup.add(frontLeftWingPivot);
        butterflyGroup.add(frontRightWingPivot);
        butterflyGroup.add(backLeftWingPivot);
        butterflyGroup.add(backRightWingPivot);

        // Random initial position
        butterflyGroup.position.x = (Math.random() - 0.5) * 80;
        butterflyGroup.position.y = (Math.random() - 0.5) * 80;
        butterflyGroup.position.z = (Math.random() - 0.5) * 80;

        // Random initial rotation
        butterflyGroup.rotation.x = Math.random() * Math.PI * 2;
        butterflyGroup.rotation.y = Math.random() * Math.PI * 2;
        butterflyGroup.rotation.z = Math.random() * Math.PI * 2;

        // Random scale
        const scale = Math.random() * 0.7 + 0.3; // between 0.3 and 1.0
        butterflyGroup.scale.set(scale, scale, scale);

        scene.add(butterflyGroup);

        return {
            group: butterflyGroup,
            frontLeftWingPivot,
            frontRightWingPivot,
            backLeftWingPivot,
            backRightWingPivot,
            flapSpeed: Math.random() * 0.1 + 0.05, // Varied flap speed
            driftSpeedX: (Math.random() - 0.5) * 0.05,
            driftSpeedY: (Math.random() - 0.5) * 0.05,
            driftSpeedZ: (Math.random() - 0.5) * 0.05,
            rotationSpeedX: (Math.random() - 0.5) * 0.001,
            rotationSpeedY: (Math.random() - 0.5) * 0.001,
            rotationSpeedZ: (Math.random() - 0.5) * 0.001
        };
    }

    for (let i = 0; i < numberOfButterflies; i++) {
        butterflies.push(createButterfly());
    }

    const clock = new THREE.Clock();

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        butterflies.forEach(b => {
            // Flapping animation
            const flapAngle = Math.sin(elapsedTime * b.flapSpeed * 10) * Math.PI / 8; // Adjust flap magnitude
            b.frontLeftWingPivot.rotation.y = flapAngle;
            b.frontRightWingPivot.rotation.y = -flapAngle; // Opposing flap for right wing
            b.backLeftWingPivot.rotation.y = flapAngle * 0.8; // Slightly less flap for back wings
            b.backRightWingPivot.rotation.y = -flapAngle * 0.8;

            // Drifting motion
            b.group.position.x += b.driftSpeedX * Math.sin(elapsedTime * 0.5 + b.group.uuid.charCodeAt(0));
            b.group.position.y += b.driftSpeedY * Math.cos(elapsedTime * 0.5 + b.group.uuid.charCodeAt(1));
            b.group.position.z += b.driftSpeedZ * Math.sin(elapsedTime * 0.5 + b.group.uuid.charCodeAt(2));

            // Subtle rotation
            b.group.rotation.x += b.rotationSpeedX;
            b.group.rotation.y += b.rotationSpeedY;
            b.group.rotation.z += b.rotationSpeedZ;

            // Wrap-around logic for continuous movement
            const bound = 40; // Half of the spread (e.g., 80 unit spread)
            if (b.group.position.x > bound) b.group.position.x = -bound;
            if (b.group.position.x < -bound) b.group.position.x = bound;
            if (b.group.position.y > bound) b.group.position.y = -bound;
            if (b.group.position.y < -bound) b.group.position.y = bound;
            if (b.group.position.z > bound) b.group.position.z = -bound;
            if (b.group.position.z < -bound) b.group.position.z = bound;
        });

        renderer.render(scene, camera);
    };
    animate();
});
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


// Function to initialize the Google Map
function initializeMap() {
    var mapIframe = document.getElementById("map-iframe");

    // **IMPORTANT: Replace 'YOUR_ACTUAL_Maps_API_KEY_HERE' with your real API Key.**
    // You MUST get this from the Google Cloud Console.
    const apiKey = "YOUR_ACTUAL_Maps_API_KEY_HERE";

    // **Define the place ID for your location.**
    // The Place ID 'ChIJg2a6uWlY7zARg3PzL7G1lJk' is for Kathmandu Durbar Square.
    // If you want a different location (e.g., your university, home, etc.),
    // find its Place ID using the Google Maps Place ID Finder:
    // https://developers.google.com/maps/documentation/embed/get-started#place-id
    const placeId = "ChIJg2a6uWlY7zARg3PzL7G1lJk"; // Example: Kathmandu Durbar Square, Nepal

    // Construct the correct Google Maps Embed API URL
    // The 'place' mode is used here to show a specific point of interest identified by its place ID.
    const embedApiUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${placeId}`;

    mapIframe.src = embedApiUrl;
}

// Use Intersection Observer to load the map only when the contact section becomes visible
// This optimizes page load performance.
const contactSection = document.getElementById("contact");
if (contactSection) {
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: "0px",
        threshold: 0.1, // Trigger when 10% of the section is visible
    };

    const contactObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                initializeMap();
                observer.unobserve(entry.target); // Stop observing once the map is loaded
            }
        });
    }, observerOptions);

    contactObserver.observe(contactSection);
}
