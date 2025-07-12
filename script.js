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

    prevBtn.addEventListener('click', prevGalleryItem);
    nextBtn.addEventListener('click', nextGalleryItem);

    // Auto-advance gallery every 5 seconds (optional)
    setInterval(nextGalleryItem, 5000);

    // --- Form Submission (Client-Side Only) ---
    // Note: These forms are for demonstration of front-end structure only.
    // A server-side solution is required to actually send emails.

    const applicationForm = document.getElementById('application-form');
    const messageForm = document.getElementById('message-form');

    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            alert('Application form submitted! (Note: This is a front-end demonstration only. No email will be sent without a backend.)');
            // In a real application, you would send this data to a server using fetch() or XMLHttpRequest
            // Example:
            // const formData = new FormData(applicationForm);
            // fetch('/submit-application', {
            //     method: 'POST',
            //     body: formData
            // }).then(response => response.json())
            //   .then(data => console.log(data))
            //   .catch(error => console.error('Error:', error));
            applicationForm.reset(); // Clear the form
        });
    }

    if (messageForm) {
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            alert('Message sent! (Note: This is a front-end demonstration only. No email will be sent without a backend.)');
            // In a real application, you would send this data to a server using fetch() or XMLHttpRequest
            messageForm.reset(); // Clear the form
        });
    }
});
