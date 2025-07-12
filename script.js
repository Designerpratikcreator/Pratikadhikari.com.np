// Light/Dark Mode Toggle
document.getElementById("modeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Mobile Hamburger Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// EmailJS Integration - Application Form
document.getElementById("applicationForm").addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs.send("your_service_id", "your_template_id", {
    name: this.name.value,
    email: this.email.value,
    service: this.service.value,
    message: this.message.value,
  }, "your_public_key")
  .then(() => {
    alert("✅ Application sent successfully!");
    this.reset();
  })
  .catch((error) => {
    alert("❌ Failed to send application. Check configuration.");
    console.error(error);
  });
});

// EmailJS Integration - Message Form
document.getElementById("messageForm").addEventListener("submit", function (e) {
  e.preventDefault();

  emailjs.send("your_service_id", "your_template_id", {
    name: this.name.value,
    email: this.email.value,
    message: this.message.value,
  }, "your_public_key")
  .then(() => {
    alert("✅
