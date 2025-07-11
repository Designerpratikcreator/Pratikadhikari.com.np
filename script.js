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
  // Example: pages/contact.js or components/ContactForm.js

// ... (imports)

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1. Validate the form data
    // ...

    // 2. Send the data to your API endpoint
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }),
    });

    if (response.ok) {
      // Success handling (e.g., show success message, clear form)
      alert("Message sent successfully!");
    } else {
      // Error handling on the frontend
      const errorData = await response.json();
      console.error('API response error:', errorData);
      // This is the code that likely generates the "Failed to send message" alert shown in your screenshot.
      alert(`Failed to send message: ${errorData.message || 'Unknown error'}`); 
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert("Failed to send message: Network error.");
  }
};
  // Example: pages/api/send-email.js

import { Resend } from 'resend';

// NOTE: This is the critical part. Ensure your environment variable is correctly loaded.
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Basic input validation
  if (!email || !message) {
    return res.status(400).json({ message: 'Email and message are required.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Portfolio <onboarding@your-domain.com>', // Ensure this 'from' domain is verified in your Resend account
      to: 'your.email@gmail.com', // Replace with the recipient's email address
      subject: `Portfolio Inquiry: ${subject}`,
      html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
    });

    if (error) {
      // This is the error coming from the email service (e.g., Resend)
      console.error('Resend API Error:', error);
      // Return a 500 status if the email service fails
      return res.status(500).json({ message: 'Failed to send email via service.', details: error.message });
    }

    // Success response
    res.status(200).json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error('Server error during email sending:', error);
    // General server error
    res.status(500).json({ message: 'Internal server error.' });
  }
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
