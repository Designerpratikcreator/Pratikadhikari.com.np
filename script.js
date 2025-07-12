 <script>
        // JavaScript for Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;
        const lightIcon = document.querySelector('.light-icon');
        const darkIcon = document.querySelector('.dark-icon');

        // Function to set theme based on localStorage or system preference
        function setTheme(theme) {
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                htmlElement.classList.add('dark');
                htmlElement.classList.remove('light');
                lightIcon.classList.add('hidden');
                darkIcon.classList.remove('hidden');
                localStorage.setItem('theme', 'dark');
            } else {
                htmlElement.classList.remove('dark');
                htmlElement.classList.add('light');
                darkIcon.classList.add('hidden');
                lightIcon.classList.remove('hidden');
                localStorage.setItem('theme', 'light');
            }
        }

        // Initial theme setup
        setTheme(localStorage.getItem('theme'));

        // Toggle theme on button click
        themeToggle.addEventListener('click', () => {
            if (htmlElement.classList.contains('light')) {
                setTheme('dark');
            } else {
                setTheme('light');
            }
        });

        // JavaScript for Mobile Menu Toggle
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

        // Function to show a message box
        function showMessageBox(message, type) {
            const messageBox = document.getElementById('message-box-container');
            messageBox.textContent = message;
            messageBox.className = `message-box show ${type}`; // Reset classes and add new ones
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, 3000); // Hide after 3 seconds
        }

        // Handle Application Form Submission
        const applicationForm = document.getElementById('application-form');
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(applicationForm);
            const data = Object.fromEntries(formData.entries());

            // IMPORTANT: Direct client-side SMTP is not possible due to browser security restrictions.
            // In a real application, you would send this data to a server-side script
            // (e.g., Node.js, PHP, Python backend) that handles email sending securely.
            // This simulation logs data to console and shows a success message.

            console.log('Application Form Data:', data);

            // Simulate API call
            try {
                // Uncomment and replace with your actual backend endpoint for sending emails
                // const response = await fetch('YOUR_BACKEND_APPLICATION_ENDPOINT', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(data),
                // });

                // if (response.ok) { // Check if the simulated backend call was successful
                    showMessageBox('Application submitted successfully! I will get back to you soon.', 'success');
                    applicationForm.reset(); // Clear the form
                // } else {
                //     showMessageBox('Failed to submit application. Please try again later.', 'error');
                // }
            } catch (error) {
                console.error('Application form submission error:', error);
                showMessageBox('An error occurred during application submission. Please try again.', 'error');
            }
        });

        // Handle Message Form Submission
        const messageForm = document.getElementById('message-form');
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const formData = new FormData(messageForm);
            const data = Object.fromEntries(formData.entries());

            // IMPORTANT: Direct client-side SMTP is not possible due to browser security restrictions.
            // In a real application, you would send this data to a server-side script
            // (e.js., Node.js, PHP, Python backend) that handles email sending securely.
            // This simulation logs data to console and shows a success message.

            console.log('Message Form Data:', data);

            // Simulate API call
            try {
                // Uncomment and replace with your actual backend endpoint for sending emails
                // const response = await fetch('YOUR_BACKEND_MESSAGE_ENDPOINT', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(data),
                // });

                // if (response.ok) { // Check if the simulated backend call was successful
                    showMessageBox('Message sent successfully! Thank you for reaching out.', 'success');
                    messageForm.reset(); // Clear the form
                // } else {
                //     showMessageBox('Failed to send message. Please try again later.', 'error');
                // }
            } catch (error) {
                console.error('Message form submission error:', error);
                showMessageBox('An error occurred during message submission. Please try again.', 'error');
            }
        });
    </script>
