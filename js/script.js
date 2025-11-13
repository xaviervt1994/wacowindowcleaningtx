// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });

  // Close nav when clicking a link on mobile
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "a") {
      document.body.classList.remove("nav-open");
    }
  });
}

// Year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Simple front-end "captcha" + success message for the mockup form
const quoteForm = document.getElementById("quoteForm");
const formSuccess = document.getElementById("formSuccess");

if (quoteForm) {
  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = quoteForm.querySelector("#name");
    const phone = quoteForm.querySelector("#phone");
    const message = quoteForm.querySelector("#message");
    const captcha = quoteForm.querySelector("#captcha");

    let valid = true;
    [name, phone, message, captcha].forEach((field) => {
      if (!field.value.trim()) {
        field.classList.add("error");
        valid = false;
      } else {
        field.classList.remove("error");
      }
    });

    if (captcha.value.trim() !== "17") {
      captcha.classList.add("error");
      valid = false;
    }

    if (!valid) {
      if (formSuccess) {
        formSuccess.textContent =
          "Please fill out all required fields and solve the simple math question.";
      }
      formSuccess.style.color = "#dc2626";
      return;
    }

    // This is just a mockup success. Replace with real submit logic later.
    if (formSuccess) {
      formSuccess.textContent =
        "Thank you! We’ve received your request and will contact you shortly.";
      formSuccess.style.color = "#16a34a";
    }

    quoteForm.reset();
  });
}
