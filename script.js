// Data for portfolio projects
const projects = {
    project1: {
        title: "Modern E-commerce Store",
        image: "https://placehold.co/800x500/E0E7FF/4F46E5?text=E-commerce+Template",
        description: "A comprehensive e-commerce template built with a focus on user experience and modern design principles. Features include a product catalog, shopping cart, user authentication, and a responsive layout for all devices.",
        technologies: "HTML5, CSS3, JavaScript, React.js, Tailwind CSS",
        liveDemo: "https://example.com/ecommerce-demo",
        github: "https://github.com/yourusername/ecommerce-template"
    },
    project2: {
        title: "Creative Agency Landing Page",
        image: "https://placehold.co/800x500/E0E7FF/4F46E5?text=Landing+Page+Template",
        description: "A vibrant and engaging single-page landing page template designed for creative agencies. It features smooth animations, a clear call-to-action, and sections for services, portfolio, and client testimonials.",
        technologies: "HTML5, CSS3, JavaScript, Bootstrap, Animation Libraries",
        liveDemo: "https://example.com/agency-demo",
        github: "https://github.com/yourusername/agency-landing-page"
    },
    project3: {
        title: "Minimalist Blog Layout",
        image: "https://placehold.co/800x500/E0E7FF/4F46E5?text=Blog+Template",
        description: "A clean, minimalist, and highly readable blog template. Optimized for content consumption, it includes features like a responsive article layout, category filtering, and a simple search function.",
        technologies: "HTML5, CSS3, JavaScript, Markdown Integration",
        liveDemo: "https://example.com/blog-demo",
        github: "https://github.com/yourusername/minimal-blog-template"
    },
    project4: {
        title: "Personal Portfolio Showcase",
        image: "https://placehold.co/800x500/E0E7FF/4F46E5?text=Portfolio+Template",
        description: "A modern and responsive personal portfolio template designed to showcase projects, skills, and contact information effectively. It features a clean layout and smooth navigation.",
        technologies: "HTML5, CSS3, JavaScript, Responsive Design",
        liveDemo: "https://example.com/portfolio-demo",
        github: "https://github.com/yourusername/personal-portfolio-template"
    },
    project5: {
        title: "Elegant Restaurant Website",
        image: "https://placehold.co/800x500/E0E7FF/4F46E5?text=Restaurant+Template",
        description: "A sophisticated website template for restaurants, featuring an appealing design, interactive menu, online reservation system integration, and a gallery section to showcase the ambiance.",
        technologies: "HTML5, CSS3, JavaScript, Swiper.js",
        liveDemo: "https://example.com/restaurant-demo",
        github: "https://github.com/yourusername/restaurant-template"
    },
    project6: {
        title: "SaaS Product Landing Page",
        image: "https://placehold.co/800x500/E0E7FF/4F46E5?text=SaaS+Template",
        description: "A high-converting landing page template specifically designed for Software-as-a-Service (SaaS) products. It includes sections for features, pricing, testimonials, and a clear call-to-action.",
        technologies: "HTML5, CSS3, JavaScript, Form Validation",
        liveDemo: "https://example.com/saas-demo",
        github: "https://github.com/yourusername/saas-landing-page"
    }
};

// DOM Elements
const htmlElement = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');
const projectModal = document.getElementById('project-modal');
const closeButton = document.querySelector('.close-button');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');
const modalTechnologies = document.getElementById('modal-technologies');
const modalLiveDemo = document.getElementById('modal-live-demo');
const modalGitHub = document.getElementById('modal-github');

// Theme Toggle Functionality
function applyTheme(theme) {
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
        themeToggleIcon.classList.remove('fa-moon');
        themeToggleIcon.classList.add('fa-sun');
    } else {
        htmlElement.classList.remove('dark');
        themeToggleIcon.classList.remove('fa-sun');
        themeToggleIcon.classList.add('fa-moon');
    }
}

// Load saved theme from localStorage or default to 'light'
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    let currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

// Mobile menu toggle
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
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Contact form submission handling (client-side only)
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    formMessage.textContent = 'Sending message...';
    formMessage.className = 'mt-4 text-center text-sm font-medium text-gray-500';

    // Simulate form submission
    setTimeout(() => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
            formMessage.className = 'mt-4 text-center text-sm font-medium text-green-600';
            contactForm.reset(); // Clear the form
        } else {
            formMessage.textContent = 'Please fill in all fields.';
            formMessage.className = 'mt-4 text-center text-sm font-medium text-red-600';
        }
    }, 1500); // Simulate network delay
});

// Project Modal Logic
document.querySelectorAll('.portfolio-item-image, .card.cursor-pointer').forEach(item => {
    item.addEventListener('click', function() {
        const projectId = this.closest('.card').dataset.project;
        const project = projects[projectId];

        if (project) {
            modalTitle.textContent = project.title;
            modalImage.src = project.image;
            modalImage.alt = project.title;
            modalDescription.textContent = project.description;
            modalTechnologies.textContent = `Technologies: ${project.technologies}`;
            modalLiveDemo.href = project.liveDemo;
            modalGitHub.href = project.github;
            projectModal.style.display = 'flex'; // Use flex to center
        }
    });
});

closeButton.addEventListener('click', () => {
    projectModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == projectModal) {
        projectModal.style.display = 'none';
    }
});
