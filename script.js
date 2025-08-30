

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

  // --- Canvas 2D Graphics Animation JavaScript ---
        const canvas = document.getElementById('graphicsCanvas');
        const ctx = canvas.getContext('2d');

        let animationFrameId; // To store the requestAnimationFrame ID

        // Function to resize canvas
        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        // Particle class for general animated elements
        class Particle {
            constructor(x, y, size, color, speedX, speedY) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.color = color;
                this.speedX = speedX;
                this.speedY = speedY;
                this.opacity = 1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                // Fade out as it moves
                this.opacity -= 0.005;
                if (this.opacity < 0) this.opacity = 0;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Glitter particle specific
        class Glitter extends Particle {
            constructor(x, y) {
                super(x, y, Math.random() * 2 + 0.5, `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5);
                this.brightness = Math.random() * 0.5 + 0.5;
                this.phase = Math.random() * Math.PI * 2;
            }

            update() {
                super.update();
                this.phase += 0.1;
                this.opacity = (Math.sin(this.phase) * 0.5 + 0.5) * this.brightness;
                if (this.opacity < 0.1) this.opacity = 0.1; // Ensure it doesn't fully disappear
            }
        }

        // Blinking Light particle specific
        class BlinkingLight extends Particle {
            constructor(x, y) {
                super(x, y, Math.random() * 5 + 2, `hsl(${Math.random() * 360}, 100%, 50%)`, 0, 0); // Static position
                this.blinkSpeed = Math.random() * 0.05 + 0.02;
                this.phase = Math.random() * Math.PI * 2;
            }

            update() {
                this.phase += this.blinkSpeed;
                this.opacity = Math.sin(this.phase) * 0.8 + 0.2; // Blinking effect
            }
        }

        // Shooting Star particle specific
        class ShootingStar extends Particle {
            constructor() {
                const startX = Math.random() * canvas.width;
                const startY = Math.random() * canvas.height * 0.2; // Start from top 20%
                const speed = Math.random() * 5 + 3;
                const angle = Math.PI / 4 + (Math.random() * Math.PI / 8 - Math.PI / 16); // Down-right angle
                super(startX, startY, 1.5, 'white', speed * Math.cos(angle), speed * Math.sin(angle));
                this.tailLength = Math.random() * 50 + 30;
                this.history = [];
            }

            update() {
                super.update();
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > this.tailLength) {
                    this.history.shift();
                }
                // Reset if out of bounds
                if (this.x > canvas.width + this.tailLength || this.y > canvas.height + this.tailLength) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.size;
                ctx.lineCap = 'round';

                ctx.beginPath();
                if (this.history.length > 1) {
                    ctx.moveTo(this.history[0].x, this.history[0].y);
                    for (let i = 1; i < this.history.length; i++) {
                        ctx.lineTo(this.history[i].x, this.history[i].y);
                    }
                }
                ctx.stroke();
                ctx.restore();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height * 0.2;
                this.speedX = (Math.random() * 5 + 3) * Math.cos(Math.PI / 4 + (Math.random() * Math.PI / 8 - Math.PI / 16));
                this.speedY = (Math.random() * 5 + 3) * Math.sin(Math.PI / 4 + (Math.random() * Math.PI / 8 - Math.PI / 16));
                this.opacity = 1;
                this.history = [];
            }
        }

        // Snowfall particle specific
        class Snowflake extends Particle {
            constructor() {
                super(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 1, 'white', 0, Math.random() * 1 + 0.5);
                this.drift = (Math.random() - 0.5) * 0.5; // Horizontal drift
            }

            update() {
                this.x += this.drift;
                this.y += this.speedY;
                if (this.y > canvas.height) {
                    this.y = -this.size; // Reset to top
                    this.x = Math.random() * canvas.width; // New random x
                }
            }
        }

        const glitters = [];
        const blinkingLights = [];
        const shootingStars = [];
        const snowflakes = [];

        // Initialize particles
        function initParticles() {
            for (let i = 0; i < 100; i++) glitters.push(new Glitter(Math.random() * canvas.width, Math.random() * canvas.height));
            for (let i = 0; i < 50; i++) blinkingLights.push(new BlinkingLight(Math.random() * canvas.width, Math.random() * canvas.height));
            for (let i = 0; i < 3; i++) shootingStars.push(new ShootingStar());
            for (let i = 0; i < 200; i++) snowflakes.push(new Snowflake());
        }

        // Moving text
        const textContent = "PRATIK Graphics Studio"; // Updated text to include "PRATIK"
        let textX = -200; // Start off-screen left
        const textSpeed = 2; // Pixels per frame
        let textOpacity = 0;
        const fadeInDuration = 100; // Frames for fade in
        const fadeOutDuration = 100; // Frames for fade out
        const displayDuration = 300; // Frames for display
        let frameCount = 0;

        function drawMovingText() {
            frameCount++;

            // Calculate opacity based on phase
            if (frameCount < fadeInDuration) {
                textOpacity = frameCount / fadeInDuration;
            } else if (frameCount > fadeInDuration + displayDuration) {
                textOpacity = 1 - ((frameCount - (fadeInDuration + displayDuration)) / fadeOutDuration);
            } else {
                textOpacity = 1;
            }

            // Reset animation cycle
            if (frameCount > fadeInDuration + displayDuration + fadeOutDuration) {
                frameCount = 0;
                textX = -ctx.measureText(textContent).width - 50; // Reset text off-screen
            }

            // Update position
            textX += textSpeed;

            // Draw text
            ctx.save();
            ctx.globalAlpha = textOpacity;
            ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // White color for text
            ctx.font = '50px "Inter"';
            ctx.fillText(textContent, textX, canvas.height / 2);
            ctx.restore();
        }


        // Main animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

            // Update and draw glitters
            glitters.forEach((g, index) => {
                g.update();
                g.draw();
                if (g.opacity <= 0.1) { // Re-spawn glitters that fade out
                    glitters[index] = new Glitter(Math.random() * canvas.width, Math.random() * canvas.height);
                }
            });

            // Update and draw blinking lights
            blinkingLights.forEach(bl => {
                bl.update();
                bl.draw();
            });

            // Update and draw shooting stars
            shootingStars.forEach(ss => {
                ss.update();
                ss.draw();
            });

            // Update and draw snowflakes
            snowflakes.forEach(sf => {
                sf.update();
                sf.draw();
            });

            // Draw moving text
            drawMovingText();

            animationFrameId = requestAnimationFrame(animate);
        }

        // Event listeners for responsiveness
        window.addEventListener('resize', resizeCanvas);

        // Initial setup
        window.onload = function() {
            resizeCanvas(); // Set initial canvas size
            initParticles(); // Initialize particles
            animate(); // Start the animation loop
        };

        // Stop animation when leaving the section (optional, for performance)
        const homeSection = document.getElementById('home');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animationFrameId) {
                        animate(); // Start animation if entering and not already running
                    }
                } else {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId); // Stop animation if leaving
                        animationFrameId = null;
                    }
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the section is visible

        observer.observe(homeSection);

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

