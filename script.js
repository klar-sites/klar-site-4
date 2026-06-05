(function () {
  const root = document.documentElement;
  const body = document.body;
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const themeButtons = document.querySelectorAll('[aria-label="Toggle theme"]');
  const contactForm = document.querySelector("#contact-form");

  function setTheme(isDark) {
    root.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch (error) {
      return;
    }
  }

  function initTheme() {
    let storedTheme = null;

    try {
      storedTheme = localStorage.getItem("theme");
    } catch (error) {
      storedTheme = null;
    }

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(storedTheme ? storedTheme === "dark" : prefersDark);
  }

  function closeMenu() {
    if (!mobileToggle || !navMenu) return;
    mobileToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
    body.classList.remove("no-scroll");
  }

  function initMobileNavigation() {
    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener("click", function () {
      const isOpen = mobileToggle.getAttribute("aria-expanded") === "true";
      mobileToggle.setAttribute("aria-expanded", String(!isOpen));
      navMenu.classList.toggle("is-open", !isOpen);
      body.classList.toggle("no-scroll", !isOpen);
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1024) closeMenu();
    });
  }

  function initThemeToggle() {
    themeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setTheme(!root.classList.contains("dark"));
      });
    });
  }

  function initRevealAnimations() {
    const revealItems = document.querySelectorAll(".reveal");

    if (!revealItems.length) return;

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setFieldError(field, message) {
    const errorElement = document.querySelector("#" + field.id + "-error");

    field.setAttribute("aria-invalid", message ? "true" : "false");

    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateContactForm() {
    if (!contactForm) return true;

    const name = contactForm.querySelector("#name");
    const email = contactForm.querySelector("#email");
    const message = contactForm.querySelector("#message");
    let isValid = true;

    if (name) {
      if (!name.value.trim()) {
        setFieldError(name, "Ange ditt namn.");
        isValid = false;
      } else if (name.value.trim().length < 2) {
        setFieldError(name, "Namnet behöver innehålla minst två tecken.");
        isValid = false;
      } else {
        setFieldError(name, "");
      }
    }

    if (email) {
      if (!email.value.trim()) {
        setFieldError(email, "Ange din e-postadress.");
        isValid = false;
      } else if (!validateEmail(email.value.trim())) {
        setFieldError(email, "Ange en giltig e-postadress.");
        isValid = false;
      } else {
        setFieldError(email, "");
      }
    }

    if (message) {
      if (!message.value.trim()) {
        setFieldError(message, "Skriv ett meddelande.");
        isValid = false;
      } else if (message.value.trim().length < 20) {
        setFieldError(message, "Meddelandet behöver innehålla minst 20 tecken.");
        isValid = false;
      } else {
        setFieldError(message, "");
      }
    }

    return isValid;
  }

  function initContactForm() {
    if (!contactForm) return;

    const status = contactForm.querySelector("#form-status");
    const fields = contactForm.querySelectorAll("input, textarea, select");

    fields.forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.id === "name" || field.id === "email" || field.id === "message") {
          validateContactForm();
        }
      });
    });

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const isValid = validateContactForm();

      if (!isValid) {
        const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
        if (status) {
          status.textContent = "Kontrollera fälten och försök igen.";
          status.classList.add("is-visible");
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (status) {
        status.textContent = "Tack! Din förfrågan är mottagen. Vi återkommer normalt inom en arbetsdag.";
        status.classList.add("is-visible");
      }

      contactForm.reset();

      fields.forEach(function (field) {
        if (field.id === "name" || field.id === "email" || field.id === "message") {
          setFieldError(field, "");
        }
      });
    });
  }

  initTheme();
  initMobileNavigation();
  initThemeToggle();
  initRevealAnimations();
  initContactForm();
})();
