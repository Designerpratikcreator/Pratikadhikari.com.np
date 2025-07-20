// attendance-manager.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements for Student Management ---
    const studentManagementForm = document.getElementById('student-management-form');
    const newStudentNameInput = document.getElementById('newStudentName');
    const newStudentClassInput = document.getElementById('newStudentClass');
    const savedStudentsList = document.getElementById('savedStudentsList');
    const clearAllStudentsBtn = document.getElementById('clearAllStudentsBtn');

    // --- DOM Elements for Attendance Recording ---
    const attendanceRecordingForm = document.getElementById('attendance-recording-form');
    const attendanceDateInput = document.getElementById('attendanceDate');
    const attendanceClassNameInput = document.getElementById('attendanceClassName');
    const attendanceInstructorNameInput = document.getElementById('attendanceInstructorName');
    const studentListForAttendance = document.getElementById('studentListForAttendance');
    const attendanceNotesInput = document.getElementById('attendanceNotes');
    const savedAttendanceList = document.getElementById('savedAttendanceList');

    // --- Local Storage Keys ---
    const STUDENTS_KEY = 'webDesignStudents';
    const ATTENDANCE_KEY = 'webDesignAttendance';

    // --- Helper Functions for Local Storage ---
    function getFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error(`Error parsing data from localStorage for key "${key}":`, e);
            return []; // Return empty array on error
        }
    }

    function saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving data to localStorage for key "${key}":`, e);
        }
    }

    // --- Student Management Functions ---

    function renderStudents() {
        const students = getFromLocalStorage(STUDENTS_KEY);
        savedStudentsList.innerHTML = ''; // Clear current list

        if (students.length === 0) {
            savedStudentsList.innerHTML = '<li>No students added yet.</li>';
            studentListForAttendance.innerHTML = '<p>Please add students in the "Student Roster Management" section above.</p>';
            return;
        }

        students.forEach((student, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${student.name} (<small>${student.class}</small>)</span>
                <button type="button" class="btn btn-danger btn-sm" data-index="${index}"><i class="fas fa-trash-alt"></i> Delete</button>
            `;
            savedStudentsList.appendChild(listItem);
        });

        // Attach event listeners for delete buttons
        savedStudentsList.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToDelete = parseInt(e.currentTarget.dataset.index);
                deleteStudent(indexToDelete);
            });
        });

        // Also update the attendance section student list
        renderStudentsForAttendance();
    }

    function addStudent(name, className) {
        const students = getFromLocalStorage(STUDENTS_KEY);
        // Simple unique ID for each student based on timestamp
        students.push({ id: Date.now(), name: name, class: className });
        saveToLocalStorage(STUDENTS_KEY, students);
        renderStudents(); // Re-render both student management and attendance lists
        newStudentNameInput.value = '';
        newStudentClassInput.value = '';
        alert('Student added successfully!');
    }

    function deleteStudent(index) {
        if (!confirm('Are you sure you want to delete this student?')) {
            return;
        }
        let students = getFromLocalStorage(STUDENTS_KEY);
        if (index >= 0 && index < students.length) {
            students.splice(index, 1);
            saveToLocalStorage(STUDENTS_KEY, students);
            renderStudents();
            alert('Student deleted.');
        }
    }

    function clearAllStudents() {
        if (confirm('Are you sure you want to delete ALL students? This cannot be undone.')) {
            localStorage.removeItem(STUDENTS_KEY);
            renderStudents();
            alert('All students cleared.');
        }
    }

    // --- Attendance Recording Functions ---

    function renderStudentsForAttendance() {
        const students = getFromLocalStorage(STUDENTS_KEY);
        studentListForAttendance.innerHTML = ''; // Clear current list

        if (students.length === 0) {
            studentListForAttendance.innerHTML = '<p>Please add students in the "Student Roster Management" section above.</p>';
            return;
        }

        students.forEach(student => {
            const studentItem = document.createElement('div');
            studentItem.classList.add('student-item-for-attendance'); // Use a specific class
            studentItem.innerHTML = `
                <label>${student.name} (<small>${student.class}</small>)</label>
                <select name="attendanceStatus_${student.id}" data-student-id="${student.id}" class="attendance-select" required>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused Absence</option>
                </select>
            `;
            studentListForAttendance.appendChild(studentItem);
        });
    }

    function renderAttendanceHistory() {
        const attendanceRecords = getFromLocalStorage(ATTENDANCE_KEY);
        savedAttendanceList.innerHTML = ''; // Clear current list

        if (attendanceRecords.length === 0) {
            savedAttendanceList.innerHTML = '<li>No attendance recorded yet.</li>';
            return;
        }

        // Sort by timestamp, newest first
        attendanceRecords.sort((a, b) => b.timestamp - a.timestamp);

        attendanceRecords.forEach((record, index) => {
            const listItem = document.createElement('li');
            const studentDetails = record.students.map(s => ` ${s.name}: ${s.status}`).join(', '); // Prepend space for readability
            listItem.innerHTML = `
                <div>
                    <span><strong>Date:</strong> ${record.date}</span><br>
                    <span><strong>Class:</strong> ${record.className}</span><br>
                    <span><strong>Instructor:</strong> ${record.instructorName}</span><br>
                    <span><strong>Students:</strong> ${studentDetails}</span>
                    ${record.notes ? `<p><em>Notes: ${record.notes}</em></p>` : ''}
                </div>
                <button type="button" class="btn btn-danger btn-sm" data-index="${index}"><i class="fas fa-trash-alt"></i> Delete</button>
            `;
            savedAttendanceList.appendChild(listItem);
        });

        // Attach event listeners for delete buttons on attendance records
        savedAttendanceList.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => {
                const indexToDelete = parseInt(e.currentTarget.dataset.index);
                deleteAttendanceRecord(indexToDelete);
            });
        });
    }

    function deleteAttendanceRecord(index) {
        if (!confirm('Are you sure you want to delete this attendance record?')) {
            return;
        }
        let attendanceRecords = getFromLocalStorage(ATTENDANCE_KEY);
        if (index >= 0 && index < attendanceRecords.length) {
            // Because we sort for display, we need to delete from the original unsorted array or re-fetch and re-sort
            // Safest way is to remove by timestamp if indices change due to sorting/deletion
            const recordToDelete = attendanceRecords[index]; // This is the record at the *displayed* index
            // Find its actual index in the unsorted stored array
            let storedRecords = getFromLocalStorage(ATTENDANCE_KEY);
            const actualIndex = storedRecords.findIndex(r => r.timestamp === recordToDelete.timestamp);

            if (actualIndex > -1) {
                storedRecords.splice(actualIndex, 1);
                saveToLocalStorage(ATTENDANCE_KEY, storedRecords);
                renderAttendanceHistory(); // Re-render from the updated stored data
                alert('Attendance record deleted.');
            }
        }
    }


    // --- Event Listeners ---

    // Student Form Submission
    studentManagementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = newStudentNameInput.value.trim();
        const className = newStudentClassInput.value.trim();

        if (name && className) {
            addStudent(name, className);
        } else {
            alert('Please enter both student name and assigned class.');
        }
    });

    // Clear All Students Button
    clearAllStudentsBtn.addEventListener('click', clearAllStudents);

    // Attendance Form Submission
    attendanceRecordingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const date = attendanceDateInput.value;
        const className = attendanceClassNameInput.value.trim();
        const instructorName = attendanceInstructorNameInput.value.trim();
        const notes = attendanceNotesInput.value.trim();

        if (!date || !className || !instructorName) {
            alert('Please fill in Date, Class Name/Topic, and Instructor Name.');
            return;
        }

        const studentAttendance = [];
        const studentSelects = studentListForAttendance.querySelectorAll('.attendance-select'); // Select based on the new class
        const allStudents = getFromLocalStorage(STUDENTS_KEY); // Get full student details for name

        if (studentSelects.length === 0) {
             alert('No students to record attendance for. Please add students in the "Student Roster Management" section first.');
             return;
        }

        studentSelects.forEach(select => {
            const studentId = parseInt(select.dataset.studentId);
            const status = select.value;
            const student = allStudents.find(s => s.id === studentId); // Find student by ID to get their name

            if (student) {
                studentAttendance.push({
                    id: student.id,
                    name: student.name,
                    status: status
                });
            }
        });

        const attendanceRecord = {
            date,
            className,
            instructorName,
            students: studentAttendance,
            notes,
            timestamp: Date.now() // Unique ID and for sorting
        };

        const attendanceRecords = getFromLocalStorage(ATTENDANCE_KEY);
        attendanceRecords.push(attendanceRecord);
        saveToLocalStorage(ATTENDANCE_KEY, attendanceRecords);

        alert('Attendance saved successfully!');
        attendanceRecordingForm.reset(); // Clear the form
        attendanceDateInput.valueAsDate = new Date(); // Reset date to today
        renderAttendanceHistory(); // Update attendance history
        renderStudentsForAttendance(); // Ensure dropdowns are reset/reloaded if needed
    });


    // --- Initial Render on Page Load ---
    renderStudents(); // Populate student list on load
    renderAttendanceHistory(); // Populate attendance history on load
    // Set today's date as default for convenience
    attendanceDateInput.valueAsDate = new Date();
});

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

