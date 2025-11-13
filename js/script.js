// Smooth scroll polyfill for older browsers
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Don't prevent default for non-ID links
    if (href === "#" || !href.includes("#")) return;

    e.preventDefault();
    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Update focus for accessibility
      target.setAttribute("tabindex", "-1");
      target.focus();

      // Close mobile nav if open
      if (window.innerWidth < 1024) {
        document.getElementById("mobileNav")?.classList.add("hidden");
        document
          .getElementById("navToggle")
          ?.setAttribute("aria-expanded", "false");
      }
    }
  });
});

// Mobile navigation toggle with accessibility
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

if (navToggle && mobileNav) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";

    mobileNav.classList.toggle("hidden");
    mobileNav.classList.toggle("flex");
    navToggle.setAttribute("aria-expanded", !isExpanded);
  });

  // Close nav when clicking outside
  document.addEventListener("click", (e) => {
    if (!navToggle.contains(e.target) && !mobileNav.contains(e.target)) {
      mobileNav.classList.add("hidden");
      mobileNav.classList.remove("flex");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Close nav on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !mobileNav.classList.contains("hidden")) {
      mobileNav.classList.add("hidden");
      mobileNav.classList.remove("flex");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.focus();
    }
  });
}

// Year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Enhanced form validation with better UX
const quoteForm = document.getElementById("quoteForm");
const formSuccess = document.getElementById("formSuccess");

if (quoteForm && formSuccess) {
  // Real-time validation feedback
  const inputs = quoteForm.querySelectorAll(
    "input[required], textarea[required]"
  );

  inputs.forEach((input) => {
    // Remove error styling on input
    input.addEventListener("input", () => {
      input.classList.remove("input-error");

      // Clear error message if all required fields are valid
      const allValid = Array.from(inputs).every(
        (inp) => inp.value.trim() !== ""
      );
      if (allValid && formSuccess.style.color === "rgb(220, 38, 38)") {
        formSuccess.textContent = "";
      }
    });

    // Validate on blur
    input.addEventListener("blur", () => {
      if (input.hasAttribute("required") && input.value.trim() === "") {
        input.classList.add("input-error");
      }
    });
  });

  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form fields
    const name = quoteForm.querySelector("#name");
    const phone = quoteForm.querySelector("#phone");
    const message = quoteForm.querySelector("#message");
    const captcha = quoteForm.querySelector("#captcha");

    // Validation
    let valid = true;
    const requiredFields = [name, phone, message, captcha];

    requiredFields.forEach((field) => {
      field.classList.remove("input-error");

      if (!field.value.trim()) {
        field.classList.add("input-error");
        valid = false;
      }
    });

    // Validate captcha
    if (captcha.value.trim() !== "17") {
      captcha.classList.add("input-error");
      valid = false;

      formSuccess.textContent =
        "Please solve the math question correctly (4 + 13 = 17).";
      formSuccess.style.color = "#dc2626";

      // Focus on captcha field for accessibility
      captcha.focus();
      return;
    }

    // Validate phone format (basic)
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (phone.value.trim() && !phoneRegex.test(phone.value)) {
      phone.classList.add("input-error");
      valid = false;
      formSuccess.textContent = "Please enter a valid phone number.";
      formSuccess.style.color = "#dc2626";
      phone.focus();
      return;
    }

    // Validate email if provided
    const email = quoteForm.querySelector("#email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() && !emailRegex.test(email.value)) {
      email.classList.add("input-error");
      valid = false;
      formSuccess.textContent = "Please enter a valid email address.";
      formSuccess.style.color = "#dc2626";
      email.focus();
      return;
    }

    if (!valid) {
      formSuccess.textContent =
        "Please fill out all required fields correctly.";
      formSuccess.style.color = "#dc2626";

      // Focus on first error field
      const firstError = quoteForm.querySelector(".input-error");
      if (firstError) firstError.focus();

      return;
    }

    // Success - This is where you'd integrate your form backend
    formSuccess.textContent =
      "Thank you! We've received your request and will contact you shortly.";
    formSuccess.style.color = "#16a34a";

    // Reset form
    quoteForm.reset();

    // Remove any lingering error classes
    requiredFields.forEach((field) => field.classList.remove("input-error"));

    // Scroll to success message
    formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

// Add loading state to form submit button (optional enhancement)
if (quoteForm) {
  const submitButton = quoteForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  quoteForm.addEventListener("submit", () => {
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    // Re-enable after "submission" (in real app, this would be in the API callback)
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }, 1500);
  });
}

// Animate elements on scroll (optional - lightweight intersection observer)
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe service cards and review cards for subtle fade-in effect
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".bg-white.rounded-2xl");

  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });
});

// Performance: Lazy load images more efficiently
if ("loading" in HTMLImageElement.prototype) {
  // Browser supports native lazy loading
  console.log("Native lazy loading supported");
} else {
  // Fallback for older browsers
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}
