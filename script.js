document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Close nav when a link is clicked (for smooth scroll)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('nav-active');
            burger.classList.remove('toggle');
            navLinks.forEach(item => item.style.animation = ''); // Reset animation
        });
    });

    // 2. Dynamic Year in Footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // 3. Smooth Scrolling for Navigation Links (if not handled by CSS scroll-behavior)
    // This is optional if you have `scroll-behavior: smooth;` in your CSS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });


    // 4. Simple Contact Form Submission (Client-side validation & message)
    // For a real-world scenario, you'll need a backend to handle form submissions.
    // This example just shows a success/error message without sending data.
    const contactForm = document.getElementById('contact-form');
    const formMessages = document.getElementById('form-messages');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            formMessages.textContent = ''; // Clear previous messages
            formMessages.classList.remove('success', 'error');

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === '' || email === '' || message === '') {
                formMessages.classList.add('error');
                formMessages.textContent = 'Please fill in all required fields.';
                return;
            }

            // Basic email format validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                formMessages.classList.add('error');
                formMessages.textContent = 'Please enter a valid email address.';
                return;
            }

            // Simulate form submission
            setTimeout(() => {
                formMessages.classList.add('success');
                formMessages.textContent = 'Thank you for your message! I will get back to you soon.';
                contactForm.reset(); // Clear the form
            }, 1000); // Simulate network delay
            // In a real application, you would send this data to a backend server:
            /*
            fetch('/api/contact', { // Replace with your actual API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formMessages.classList.add('success');
                    formMessages.textContent = data.message;
                    contactForm.reset();
                } else {
                    formMessages.classList.add('error');
                    formMessages.textContent = data.message || 'Something went wrong. Please try again.';
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                formMessages.classList.add('error');
                formMessages.textContent = 'Network error. Please try again later.';
            });
            */
        });
    }

});
