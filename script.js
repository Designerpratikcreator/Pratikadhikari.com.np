 <script>
        // JavaScript for Theme Toggle, Mobile Menu, and Form Submission

        document.addEventListener('DOMContentLoaded', () => {
            const themeToggleBtn = document.getElementById('theme-toggle');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            const contactForm = document.getElementById('contact-form');
            const formMessage = document.getElementById('form-message');

            // --- Theme Toggle Logic ---
            // Check for saved theme preference in localStorage
            const currentTheme = localStorage.getItem('theme');
            if (currentTheme) {
                document.body.classList.add(currentTheme);
            } else {
                // Default to light theme if no preference is found
                document.body.classList.add('light');
            }

            themeToggleBtn.addEventListener('click', () => {
                if (document.body.classList.contains('light')) {
                    document.body.classList.remove('light');
                    document.body.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.remove('dark');
                    document.body.classList.add('light');
                    localStorage.setItem('theme', 'light');
                }
            });

            // --- Mobile Menu Toggle Logic ---
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            // Close mobile menu when a link is clicked
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            });

            // --- Form Submission Logic ---
            contactForm.addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent default form submission

                // Basic client-side validation
                const name = document.getElementById('name').value.trim();
                const email = document.getElementById('email').value.trim();
                const interest = document.getElementById('interest').value;
                const message = document.getElementById('message').value.trim();

                if (!name || !email || !interest || !message) {
                    formMessage.textContent = 'Please fill in all required fields.';
                    formMessage.className = 'mt-6 p-4 rounded-md text-center bg-red-100 text-red-700';
                    formMessage.classList.remove('hidden');
                    return;
                }

                // Simulate form submission (e.g., to a backend or just log)
                console.log('Form Submitted:', {
                    name,
                    email,
                    interest,
                    message
                });

                // Display success message
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'mt-6 p-4 rounded-md text-center bg-green-100 text-green-700';
                formMessage.classList.remove('hidden');

                // Clear the form
                contactForm.reset();

                // Hide message after a few seconds
                setTimeout(() => {
                    formMessage.classList.add('hidden');
                }, 5000);
            });
        });
    </script>
