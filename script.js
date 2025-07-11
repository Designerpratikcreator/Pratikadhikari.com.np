 <!-- JavaScript -->
    <script>
        // Theme Toggle
        const themeToggleBtn = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const html = document.documentElement;

        // Check local storage for theme preference
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            html.classList.add('dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            html.classList.remove('dark');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }

        themeToggleBtn.addEventListener('click', () => {
            html.classList.toggle('dark');
            if (html.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });

        // Mobile Menu Toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Calculate offset for fixed header
                    const headerOffset = document.querySelector('header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });

        // Form Submission Handling (Client Application Form)
        const applicationForm = document.getElementById('client-application-form');
        const applicationFormMessage = document.getElementById('form-message');

        applicationForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(applicationForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                if (key === 'communication') {
                    if (!data[key]) {
                        data[key] = [];
                    }
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            }

            console.log('Client Application Form Data:', data);

            // Simulate form submission success/failure
            applicationFormMessage.classList.remove('hidden');
            applicationFormMessage.classList.remove('bg-red-100', 'text-red-800', 'bg-green-100', 'text-green-800');

            // In a real application, you would send this data to a server.
            // For this example, we'll just show a success message.
            setTimeout(() => {
                applicationFormMessage.classList.add('bg-green-100', 'text-green-800');
                applicationFormMessage.textContent = 'Application submitted successfully! I will get back to you soon.';
                applicationForm.reset(); // Clear the form
            }, 500);

            // You could also show an error:
            // applicationFormMessage.classList.add('bg-red-100', 'text-red-800');
            // applicationFormMessage.textContent = 'There was an error submitting your application. Please try again.';
        });

        // Form Submission Handling (Contact Form)
        const contactForm = document.getElementById('contact-form');
        const contactFormMessage = document.getElementById('contact-form-message');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(contactForm);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            console.log('Contact Form Data:', data);

            // Simulate form submission success/failure
            contactFormMessage.classList.remove('hidden');
            contactFormMessage.classList.remove('bg-red-100', 'text-red-800', 'bg-green-100', 'text-green-800');

            setTimeout(() => {
                contactFormMessage.classList.add('bg-green-100', 'text-green-800');
                contactFormMessage.textContent = 'Message sent successfully! I will get back to you soon.';
                contactForm.reset(); // Clear the form
            }, 500);
        });
    </script>
