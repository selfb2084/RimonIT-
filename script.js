const WHATSAPP_NUMBER = "8801731467867";

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  themeToggle.textContent = isLight ? "☾" : "☀";

  try {
    localStorage.setItem("rimon-theme", isLight ? "light" : "dark");
  } catch (error) {
    console.warn("Theme preference could not be saved.");
  }
});

try {
  const savedTheme = localStorage.getItem("rimon-theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "☾";
  }
} catch (error) {
  console.warn("Theme preference could not be loaded.");
}

// Bengali and English language switch
const languageToggle = document.getElementById("languageToggle");
let currentLanguage = "en";

languageToggle.addEventListener("click", () => {
  currentLanguage = currentLanguage === "en" ? "bn" : "en";
  document.documentElement.lang = currentLanguage;
  document.body.classList.toggle("bn", currentLanguage === "bn");
  languageToggle.textContent = currentLanguage === "en" ? "বাংলা" : "English";

  document.querySelectorAll("[data-en][data-bn]").forEach(element => {
    element.innerHTML = element.dataset[currentLanguage];
  });
});

// Profile photo preview
const photoInput = document.getElementById("photoInput");
const profileImage = document.getElementById("profileImage");
const profileCard = document.querySelector(".profile-card");

profileImage.addEventListener("error", () => {
  profileCard.classList.add("image-missing");
});

profileImage.addEventListener("load", () => {
  profileCard.classList.remove("image-missing");
});

photoInput.addEventListener("change", event => {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    profileImage.src = reader.result;
    profileCard.classList.remove("image-missing");
  };

  reader.readAsDataURL(file);
});

// Individual service order links
document.querySelectorAll(".order-link").forEach(link => {
  const service = link.dataset.service;
  const message = `Hello Rimon, I am interested in your ${service} service. Please share the details.`;
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  link.target = "_blank";
  link.rel = "noopener";
});

// Project order form: opens WhatsApp with project details
const projectForm = document.getElementById("projectForm");

projectForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("clientName").value.trim();
  const email = document.getElementById("clientEmail").value.trim();
  const service = document.getElementById("projectService").value;
  const budget = document.getElementById("projectBudget").value.trim();
  const details = document.getElementById("projectDetails").value.trim();

  if (!name || !service || !details) {
    alert("Please fill in your name, service and project details.");
    return;
  }

  const message = [
    "NEW PROJECT REQUEST",
    "",
    `Name: ${name}`,
    `Email: ${email || "Not provided"}`,
    `Service: ${service}`,
    `Budget: ${budget || "Not specified"}`,
    `Project Details: ${details}`
  ].join("\n");

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener"
  );
});

// Review system - saved in this browser only
const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");

function getReviews() {
  try {
    return JSON.parse(localStorage.getItem("rimon-reviews") || "[]");
  } catch (error) {
    return [];
  }
}

function renderReviews() {
  const reviews = getReviews();
  reviewList.replaceChildren();

  reviews.forEach(review => {
    const card = document.createElement("article");
    card.className = "review-item";

    const name = document.createElement("b");
    name.textContent = review.name;

    const stars = document.createElement("div");
    stars.className = "stars";
    stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

    const message = document.createElement("p");
    message.textContent = review.message;

    card.append(name, stars, message);
    reviewList.appendChild(card);
  });
}

reviewForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("reviewName").value.trim();
  const rating = Number(document.getElementById("reviewRating").value);
  const message = document.getElementById("reviewMessage").value.trim();

  if (!name || !message) return;

  const reviews = getReviews();
  reviews.unshift({ name, rating, message });

  try {
    localStorage.setItem("rimon-reviews", JSON.stringify(reviews.slice(0, 20)));
    renderReviews();
    reviewForm.reset();
    alert("Thank you! Your review has been saved in this browser.");
  } catch (error) {
    alert("Your browser could not save this review.");
  }
});

renderReviews();

// Footer year
document.getElementById("currentYear").textContent = new Date().getFullYear();
