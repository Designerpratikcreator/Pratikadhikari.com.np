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

    // --- Form Submission (Client-Side to Backend) ---
    const applicationForm = document.getElementById('application-form');
    const messageForm = document.getElementById('message-form');

    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(applicationForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Adjust the URL if your backend is running on a different port or domain
                const response = await fetch('/submit-application', { 
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
                    alert('Failed to submit application. Please try again.');
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
                // Adjust the URL if your backend is running on a different port or domain
                const response = await fetch('/send-message', { 
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
                    alert('Failed to send message. Please try again.');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    }
});
