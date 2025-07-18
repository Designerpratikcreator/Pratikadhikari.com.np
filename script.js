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
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script> <script src="hero-butterfly-animation.js"></script>
      // --- 3D Geometric Motion Graphics for Hero Section ---
   const canvas = document.getElementById('hero-background-canvas');
    if (!canvas || typeof THREE === 'undefined') {
        console.warn("Canvas or Three.js not found. Hero background animation will not be displayed.");
        return;
    } 

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true }); // Antialias for smoother edges

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 30; // Move camera back to view the scene

    // --- Resizing ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft ambient light
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x00ffff, 0.7); // Cyan light from one direction
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xff00ff, 0.7); // Magenta light from another direction
    directionalLight2.position.set(-10, -10, -10);
    scene.add(directionalLight2);

    // --- Global Animation Variables ---
    const clock = new THREE.Clock();
    const butterflies = [];
    const numberOfButterflies = 30; // Adjust as needed for performance vs. density
    const maxBound = 40; // Half of the scene's effective "world" size for wrap-around logic

    // --- Textures (for wings and particles) ---
    const textureLoader = new THREE.TextureLoader();
    const wingTextures = [
        textureLoader.load('https://threejs.org/examples/textures/crate.gif'), // Placeholder: Replace with your actual wing textures
        textureLoader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg'), // Placeholder
        // Add more paths to your custom wing texture images here!
        // E.g., textureLoader.load('/assets/butterfly-wing-pattern-1.png'),
        // textureLoader.load('/assets/butterfly-wing-pattern-2.jpg'),
    ];

    // Placeholder for a soft glow particle texture (create a small white circle with blurred edges)
    // You might need to create an image like this:
    // https://i.imgur.com/example_soft_circle.png (replace with your own hosted image)
    const particleTexture = textureLoader.load('https://threejs.org/examples/textures/sprites/spark1.png'); // Example particle texture

    // --- Butterfly Wing Shape Definition ---
    function createWingShapeGeometry(width, height, isFrontWing = true) {
        const shape = new THREE.Shape();

        if (isFrontWing) {
            // More elaborate front wing shape
            shape.moveTo(0, 0); // Base of the wing
            shape.bezierCurveTo(width * 0.2, height * 0.9, width * 0.8, height * 1.1, width, height * 0.7); // Top curve
            shape.bezierCurveTo(width * 0.9, height * 0.3, width * 0.4, height * 0.1, 0, 0); // Bottom curve back to start
        } else {
            // Simpler, more rounded back wing shape
            shape.moveTo(0, 0);
            shape.bezierCurveTo(width * 0.2, height * 0.8, width * 0.6, height * 0.9, width, height * 0.5);
            shape.bezierCurveTo(width * 0.8, height * 0.1, width * 0.3, height * 0.05, 0, 0);
        }

        const extrudeSettings = {
            steps: 1,
            depth: 0.01, // Small thickness for 3D illusion
            bevelEnabled: false
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    // --- Butterfly Creation Function ---
    function createButterfly() {
        const bodyGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8); // Simple body
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2; // Orient body horizontally

        const wingWidth = 1.5;
        const wingHeight = 1.0;

        // Randomly select a wing texture
        const randomTexture = wingTextures[Math.floor(Math.random() * wingTextures.length)];
        randomTexture.wrapS = THREE.RepeatWrapping; // Essential for tiling or repeating patterns
        randomTexture.wrapT = THREE.RepeatWrapping;
        randomTexture.repeat.set(1, 1); // Adjust if your texture should repeat more times on the wing

        const wingColor = new THREE.Color(Math.random() * 0xffffff); // Base color to tint the texture
        const wingMaterial = new THREE.MeshStandardMaterial({
            map: randomTexture,
            color: wingColor,
            side: THREE.DoubleSide,
            metalness: 0.5,
            roughness: 0.5,
            transparent: true,
            alphaTest: 0.01, // Adjust as needed for texture transparency
        });

        // --- Wings ---
        const frontLeftWingGeometry = createWingShapeGeometry(wingWidth, wingHeight, true);
        const frontRightWingGeometry = createWingShapeGeometry(wingWidth, wingHeight, true);
        const backLeftWingGeometry = createWingShapeGeometry(wingWidth * 0.8, wingHeight * 0.8, false);
        const backRightWingGeometry = createWingShapeGeometry(wingWidth * 0.8, wingHeight * 0.8, false);

        const frontLeftWing = new THREE.Mesh(frontLeftWingGeometry, wingMaterial);
        const frontRightWing = new THREE.Mesh(frontRightWingGeometry, wingMaterial);
        const backLeftWing = new THREE.Mesh(backLeftWingGeometry, wingMaterial);
        const backRightWing = new THREE.Mesh(backRightWingGeometry, wingMaterial);

        // --- Wing Pivots (for flapping) ---
        const frontLeftWingPivot = new THREE.Object3D();
        frontLeftWingPivot.position.set(0, 0.2, 0); // Attachment point on body
        frontLeftWingPivot.add(frontLeftWing);
        frontLeftWing.position.x = -wingWidth / 2; // Offset wing so pivot is on the edge

        const frontRightWingPivot = new THREE.Object3D();
        frontRightWingPivot.position.set(0, 0.2, 0);
        frontRightWingPivot.add(frontRightWing);
        frontRightWing.position.x = wingWidth / 2;
        frontRightWing.scale.x = -1; // Flip horizontally for the right wing

        const backLeftWingPivot = new THREE.Object3D();
        backLeftWingPivot.position.set(0, -0.2, 0);
        backLeftWingPivot.add(backLeftWing);
        backLeftWing.position.x = -wingWidth * 0.8 / 2;

        const backRightWingPivot = new THREE.Object3D();
        backRightWingPivot.position.set(0, -0.2, 0);
        backRightWingPivot.add(backRightWing);
        backRightWing.position.x = wingWidth * 0.8 / 2;
        backRightWing.scale.x = -1; // Flip horizontally for the right wing

        const butterflyGroup = new THREE.Group();
        butterflyGroup.add(body);
        butterflyGroup.add(frontLeftWingPivot);
        butterflyGroup.add(frontRightWingPivot);
        butterflyGroup.add(backLeftWingPivot);
        butterflyGroup.add(backRightWingPivot);

        // --- Particle Trail ---
        const particleCount = 15; // Number of particles in the trail
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const particleLifeData = []; // Store life and initial properties per particle

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 0.2;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
            positions[i * 3 + 2] = -0.5 + (Math.random() * 0.2); // Start behind the butterfly

            // Particle color derived from butterfly wing color, possibly brighter
            colors[i * 3 + 0] = wingColor.r * (Math.random() * 0.5 + 0.5);
            colors[i * 3 + 1] = wingColor.g * (Math.random() * 0.5 + 0.5);
            colors[i * 3 + 2] = wingColor.b * (Math.random() * 0.5 + 0.5);

            sizes[i] = Math.random() * 0.05 + 0.02;

            particleLifeData.push({
                life: Math.random() * 2 + 1, // Life from 1 to 3 seconds
                velocity: new THREE.Vector3((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01),
                initialPosition: new THREE.Vector3(positions[i * 3 + 0], positions[i * 3 + 1], positions[i * 3 + 2]),
                initialSize: sizes[i]
            });
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMaterial = new THREE.PointsMaterial({
            vertexColors: true,
            size: 0.1, // Base size, scaled by 'size' attribute
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending, // For glowing effect
            depthWrite: false, // Prevents depth sorting issues with transparent particles
            map: particleTexture // The glowing particle texture
        });

        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        butterflyGroup.add(particleSystem); // Add particle system to butterfly's group

        // --- Initial Placement and Scale ---
        butterflyGroup.position.x = (Math.random() - 0.5) * maxBound * 2;
        butterflyGroup.position.y = (Math.random() - 0.5) * maxBound * 2;
        butterflyGroup.position.z = (Math.random() - 0.5) * maxBound * 2;

        butterflyGroup.rotation.x = Math.random() * Math.PI * 2;
        butterflyGroup.rotation.y = Math.random() * Math.PI * 2;
        butterflyGroup.rotation.z = Math.random() * Math.PI * 2;

        const scale = Math.random() * 0.7 + 0.3; // between 0.3 and 1.0
        butterflyGroup.scale.set(scale, scale, scale);
        const initialScale = scale; // Store for interaction scaling

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
            rotationSpeedZ: (Math.random() - 0.5) * 0.001,
            particles: {
                system: particleSystem,
                data: particleLifeData
            },
            initialScale: initialScale, // Store initial scale for resetting
            isHovered: false // Track hover state
        };
    }

    // Populate the scene with butterflies
    for (let i = 0; i < numberOfButterflies; i++) {
        butterflies.push(createButterfly());
    }

    // --- Mouse Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let targetButterfly = null; // The butterfly currently being influenced by the mouse

    window.addEventListener('mousemove', (event) => {
        // Normalize mouse coordinates (-1 to 1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // --- Animation Loop ---
    const animate = () => {
        requestAnimationFrame(animate);

        const delta = clock.getDelta(); // Time elapsed since last frame
        const elapsedTime = clock.getElapsedTime(); // Total elapsed time

        // --- Mouse Interaction Logic (Raycasting) ---
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(butterflies.map(b => b.group), true);

        let newTarget = null;
        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            // Find which butterfly group this intersected object belongs to
            newTarget = butterflies.find(b => b.group.children.includes(intersectedObject) || b.group === intersectedObject.parent); // Covers direct mesh or group parent
        }

        // Update hover state and reset previous target if necessary
        if (newTarget !== targetButterfly) {
            if (targetButterfly) {
                targetButterfly.isHovered = false;
                // Smoothly revert scale of the previous hovered butterfly
                gsap.to(targetButterfly.group.scale, {
                    x: targetButterfly.initialScale,
                    y: targetButterfly.initialScale,
                    z: targetButterfly.initialScale,
                    duration: 0.3
                });
            }
            targetButterfly = newTarget;
            if (targetButterfly) {
                targetButterfly.isHovered = true;
                // Smoothly enlarge the new hovered butterfly
                gsap.to(targetButterfly.group.scale, {
                    x: targetButterfly.initialScale * 1.2,
                    y: targetButterfly.initialScale * 1.2,
                    z: targetButterfly.initialScale * 1.2,
                    duration: 0.3
                });
            }
        }

        // --- Update Butterflies ---
        butterflies.forEach(b => {
            // Flapping animation
            const flapAngle = Math.sin(elapsedTime * b.flapSpeed * 10) * Math.PI / 8;
            b.frontLeftWingPivot.rotation.y = flapAngle;
            b.frontRightWingPivot.rotation.y = -flapAngle;
            b.backLeftWingPivot.rotation.y = flapAngle * 0.8;
            b.backRightWingPivot.rotation.y = -flapAngle * 0.8;

            // Drifting motion
            b.group.position.x += b.driftSpeedX * Math.sin(elapsedTime * 0.5 + b.group.uuid.charCodeAt(0));
            b.group.position.y += b.driftSpeedY * Math.cos(elapsedTime * 0.5 + b.group.uuid.charCodeAt(1));
            b.group.position.z += b.driftSpeedZ * Math.sin(elapsedTime * 0.5 + b.group.uuid.charCodeAt(2));

            // Subtle rotation
            b.group.rotation.x += b.rotationSpeedX;
            b.group.rotation.y += b.rotationSpeedY;
            b.group.rotation.z += b.rotationSpeedZ;

            // --- Mouse Influence (Attraction/Repulsion) ---
            if (targetButterfly) {
                 // Convert normalized mouse coordinates to a 3D point in front of the camera
                const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5); // 0.5 is depth, adjust as needed
                vector.unproject(camera); // Unproject to get world coordinates

                const dir = vector.sub(camera.position).normalize();
                const distance = -camera.position.z / dir.z; // Point on the Z=0 plane relative to camera
                const mouse3D = camera.position.clone().add(dir.multiplyScalar(distance));

                const forceDirection = new THREE.Vector3().subVectors(mouse3D, b.group.position);
                const distanceToMouse = forceDirection.length();

                // Apply a gentle force if within a certain range
                const influenceRadius = 15; // How far the mouse can influence butterflies
                const maxForce = 0.02; // Max strength of the force

                if (distanceToMouse < influenceRadius) {
                    const strength = (influenceRadius - distanceToMouse) / influenceRadius; // Stronger closer to mouse
                    forceDirection.normalize().multiplyScalar(strength * maxForce);

                    // Add this force to the butterfly's position
                    // You might want to apply this to a separate velocity vector for smoother physics
                    b.group.position.add(forceDirection);

                    // Optional: Make butterflies slightly orient towards the mouse
                    // b.group.lookAt(mouse3D);
                }
            }


            // --- Particle Trail Update ---
            const positionsArray = b.particles.system.geometry.attributes.position.array;
            const colorsArray = b.particles.system.geometry.attributes.color.array;
            const sizesArray = b.particles.system.geometry.attributes.size.array;

            b.particles.data.forEach((pData, i) => {
                pData.life -= delta; // Decrease particle life

                if (pData.life < 0) {
                    // Reset particle if it died
                    pData.life = Math.random() * 2 + 1; // Reset life
                    pData.velocity.set((Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01, (Math.random() - 0.5) * 0.01);
                    positionsArray[i * 3 + 0] = pData.initialPosition.x;
                    positionsArray[i * 3 + 1] = pData.initialPosition.y;
                    positionsArray[i * 3 + 2] = pData.initialPosition.z;
                    sizesArray[i] = pData.initialSize; // Reset size
                    // Optionally reset color or opacity here too
                } else {
                    // Move particle
                    positionsArray[i * 3 + 0] += pData.velocity.x;
                    positionsArray[i * 3 + 1] += pData.velocity.y;
                    positionsArray[i * 3 + 2] += pData.velocity.z;

                    // Fade and shrink particle
                    const normalizedLife = pData.life / (pData.initialLife || (Math.random() * 2 + 1)); // Normalize based on initial life
                    sizesArray[i] = pData.initialSize * normalizedLife; // Shrink as it dies

                    // Update particle opacity (though PointsMaterial opacity applies to all)
                    // Individual particle opacity generally requires custom shaders or re-rendering with new material opacity
                }
            });

            // Mark attributes for update
            b.particles.system.geometry.attributes.position.needsUpdate = true;
            b.particles.system.geometry.attributes.color.needsUpdate = true; // If you dynamically change colors
            b.particles.system.geometry.attributes.size.needsUpdate = true;

            // --- Wrap-around logic for continuous movement ---
            if (b.group.position.x > maxBound) b.group.position.x = -maxBound;
            if (b.group.position.x < -maxBound) b.group.position.x = maxBound;
            if (b.group.position.y > maxBound) b.group.position.y = -maxBound;
            if (b.group.position.y < -maxBound) b.group.position.y = maxBound;
            if (b.group.position.z > maxBound) b.group.position.z = -maxBound;
            if (b.group.position.z < -maxBound) b.group.position.z = maxBound;
        });

        renderer.render(scene, camera);
    };

    // Start the animation loop
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
