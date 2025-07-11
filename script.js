// script.js

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;
  const navLinks = document.querySelectorAll(".nav-links a");

  // --- Theme Toggle Logic ---
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    const isDark = body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // --- Smooth Scroll for Internal Links and Active Nav State ---
  navLinks.forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        // Remove 'active' class from all links
        navLinks.forEach(link => link.classList.remove("active"));
        // Add 'active' class to the clicked link
        this.classList.add("active");

        target.scrollIntoView({ behavior: "smooth" });

        // Optional: Close mobile nav if applicable (add logic for mobile nav later)
      }
    });
  });

  // --- Intersection Observer for Animations (Interactive Methodology) ---
  const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  };

  const options = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.1 // Trigger when 10% of the item is visible
  };

  const observer = new IntersectionObserver(animateOnScroll, options);

  // Observe elements you want to animate
  document.querySelectorAll(".fade-in-up, .fade-in").forEach(element => {
    observer.observe(element);
  });

  // --- Basic Form Submission (Methodology Placeholder) ---
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Prevent default form submission

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        // This is a placeholder for a real API endpoint
        // You would replace 'YOUR_FORM_SUBMISSION_ENDPOINT' with your actual backend URL
        const response = await fetch('YOUR_FORM_SUBMISSION_ENDPOINT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          alert('Message sent successfully! Thank you for reaching out.');
          contactForm.reset(); // Clear the form
        } else {
          // Attempt to read error message from response
          const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
          alert(`Failed to send message: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was a problem sending your message. Please try again later.');
      }
    });
  }

  // --- Highlight active navigation link on scroll ---
  const sections = document.querySelectorAll("section");
  const updateActiveNavLink = () => {
    let currentActive = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Adjusted scroll position to trigger earlier
      if (scrollY >= sectionTop - sectionHeight / 3) {
        currentActive = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(currentActive)) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", updateActiveNavLink);
  // Call on load to set initial active state
  updateActiveNavLink();
});
