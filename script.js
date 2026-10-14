/* ==========================================================
   NYASATECH1 — SITE SCRIPT
   ----------------------------------------------------------
   CONTACT SETTINGS: fill these in so the social icons and the
   Request Support form send people straight to you.
     whatsapp : number with country code, digits only (e.g. "265999123456")
     email    : e.g. "support@yourdomain.com"
     facebook : full page URL (e.g. "https://facebook.com/yourpage")
   Leave a value empty and that option is simply not offered
   (the Facebook icon is hidden; the others open the request form).
   ========================================================== */
const CONTACT = {
  whatsapp: "265881199024",
  email: "nyasatech1@gmail.com",
  facebook: "https://web.facebook.com/profile.php?id=61593667154674"
};

document.addEventListener("DOMContentLoaded", () => {

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ==========================================
  // 1. LOADER (home page only; inner pages skip it)
  // ==========================================
  const loaderScreen = document.getElementById("loader-screen");
  const mainContent = document.getElementById("main-content");
  const isHomePage = document.body.dataset.page === "home";
  let hasVisitedBefore = false;
  try { hasVisitedBefore = !!sessionStorage.getItem("nyasatech_visited"); } catch (e) { /* storage blocked */ }

  function showContent() {
    if (!mainContent) return;
    mainContent.classList.remove("content-hidden");
    mainContent.classList.add("content-visible");
  }

  function hideLoader() {
    if (!loaderScreen) return;
    loaderScreen.classList.add("fade-out");
    showContent();
    setTimeout(() => { loaderScreen.style.display = "none"; }, 650);
  }

  if (loaderScreen && mainContent) {
    try { sessionStorage.setItem("nyasatech_visited", "true"); } catch (e) { /* storage blocked */ }
    if (isHomePage) {
      setTimeout(hideLoader, hasVisitedBefore ? 600 : 2000);
    } else {
      loaderScreen.style.display = "none";
      showContent();
    }
  } else {
    showContent();
  }


  // ==========================================
  // 2. HEADER BACKGROUND ON SCROLL
  // ==========================================
  const siteHeader = document.getElementById("site-header");
  if (siteHeader) {
    const updateHeader = () => siteHeader.classList.toggle("scrolled", window.scrollY > 50);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }


  // ==========================================
  // 3. IMAGE FALLBACKS (only used if a file is missing)
  // ==========================================
  document.querySelectorAll("[style*='background-image']").forEach((el) => {
    const match = /url\(['"]?([^'")]+)['"]?\)/.exec(el.getAttribute("style") || "");
    if (!match) return;
    const probe = new Image();
    probe.onerror = () => el.classList.add("img-missing");
    probe.src = match[1];
  });

  document.querySelectorAll(".about-img-card img, .proof-card img").forEach((img) => {
    const markMissing = () => {
      const holder = img.parentElement;
      if (holder) holder.classList.add("img-missing-box");
    };
    if (img.complete && img.naturalWidth === 0) markMissing();
    img.addEventListener("error", markMissing);
  });


  // ==========================================
  // 4. HERO CAROUSEL
  // ==========================================
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".carousel-dots .dot");
  let currentSlide = 0;
  let slideTimer = null;
  const slideInterval = 5000;

  function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
    currentSlide = index;
  }

  function startAutoplay() {
    if (reducedMotion || slides.length < 2) return;
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide((currentSlide + 1) % slides.length), slideInterval);
  }

  if (slides.length > 0) {
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        showSlide(parseInt(dot.getAttribute("data-slide"), 10) || 0);
        startAutoplay();
      });
    });
    showSlide(0);
    startAutoplay();
  }


  // ==========================================
  // 4b. ROTATING BADGE TEXT
  // ==========================================
  document.querySelectorAll("[data-rotator]").forEach((box) => {
    const items = box.querySelectorAll(".rotator-item");
    if (items.length < 2) return;
    const delay = parseInt(box.dataset.interval, 10) || 3000;
    let current = 0;
    setInterval(() => {
      items[current].classList.remove("is-active");
      items[current].setAttribute("aria-hidden", "true");
      current = (current + 1) % items.length;
      items[current].classList.add("is-active");
      items[current].removeAttribute("aria-hidden");
    }, delay);
  });


  // ==========================================
  // 5. MOBILE MENU DRAWER
  // ==========================================
  const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");

  function setDrawer(open) {
    if (!mobileMenuBtn || !mobileDrawer) return;
    mobileMenuBtn.classList.toggle("active", open);
    mobileDrawer.classList.toggle("open", open);
    mobileMenuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileMenuBtn.addEventListener("click", () => setDrawer(!mobileDrawer.classList.contains("open")));
    mobileDrawer.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setDrawer(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setDrawer(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 900) setDrawer(false); });
  }


  // ==========================================
  // 6. SERVICE CARDS: LEARN MORE / SHOW LESS
  // ==========================================
  document.querySelectorAll(".expand-card-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".service-card");
      if (!card) return;
      const expanded = card.classList.toggle("expanded");
      btn.setAttribute("aria-expanded", String(expanded));
      btn.innerHTML = expanded ? "Show Less &uarr;" : "Learn More &darr;";
    });
  });


  // ==========================================
  // 7. REQUEST SUPPORT DIALOG
  // ==========================================
  const SERVICES = [
    "Custom Web Application Development",
    "Business IT Support",
    "Computer & Laptop Repair",
    "Software & Operating System Installation",
    "Networking & Internet Troubleshooting",
    "Website Development",
    "Cybersecurity & Data Protection",
    "Phone & Mobile-Device Support",
    "IT Consulting",
    "Basic IT Training & AI Masterclasses",
    "Application Installation",
    "Electronic Gadget Setup & Troubleshooting",
    "Custom Technical Advisory & Support",
    "Something else"
  ];
  const SUPPORT_TYPES = ["Remote Assistance", "On-Site Visit", "Workshop Drop-Off", "General enquiry"];

  const opt = (list) => list.map((v) => `<option value="${v.replace(/"/g, "&quot;")}">${v}</option>`).join("");

  const dialog = document.createElement("dialog");
  dialog.className = "request-dialog";
  dialog.setAttribute("aria-labelledby", "request-title");
  dialog.innerHTML = `
    <div class="dialog-inner">
      <button type="button" class="modal-close" aria-label="Close request form">&times;</button>
      <div id="request-form-view">
        <h2 id="request-title">Request support</h2>
        <p class="dialog-lead">Tell us what you need and send it straight to our team.</p>
        <form id="request-form" novalidate>
          <div class="form-row">
            <div class="form-field">
              <label for="rq-name">Full name</label>
              <input id="rq-name" name="name" type="text" autocomplete="name" required placeholder="Your name">
            </div>
            <div class="form-field">
              <label for="rq-contact">Phone or email</label>
              <input id="rq-contact" name="contact" type="text" autocomplete="email" required placeholder="How can we reach you?">
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label for="rq-type">Support type</label>
              <select id="rq-type" name="type">${opt(SUPPORT_TYPES)}</select>
            </div>
            <div class="form-field">
              <label for="rq-service">Service</label>
              <select id="rq-service" name="service">${opt(SERVICES)}</select>
            </div>
          </div>
          <div class="form-field">
            <label for="rq-message">What do you need help with?</label>
            <textarea id="rq-message" name="message" required placeholder="Describe the problem or project"></textarea>
          </div>
          <p class="form-error" id="rq-error" role="alert" aria-live="polite"></p>
          <div class="form-actions">
            <button type="button" class="btn-secondary" data-cancel>Cancel</button>
            <button type="submit" class="btn-primary" data-channel="email" id="rq-email-btn" hidden>Send by email</button>
            <button type="submit" class="btn-primary" data-channel="main" id="rq-main-btn">Send request</button>
          </div>
        </form>
      </div>
      <div id="request-result-view" hidden>
        <h2>Your request is ready</h2>
        <p class="dialog-lead">Copy this message and send it to us by WhatsApp, email or SMS.</p>
        <textarea class="result-box" id="rq-result" readonly aria-label="Your request message"></textarea>
        <div class="form-actions">
          <button type="button" class="btn-secondary" data-back>Edit request</button>
          <button type="button" class="btn-primary" id="rq-copy">Copy message</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(dialog);

  const form = dialog.querySelector("#request-form");
  const formView = dialog.querySelector("#request-form-view");
  const resultView = dialog.querySelector("#request-result-view");
  const errorBox = dialog.querySelector("#rq-error");
  const mainBtn = dialog.querySelector("#rq-main-btn");
  const emailBtn = dialog.querySelector("#rq-email-btn");
  const resultBox = dialog.querySelector("#rq-result");
  const copyBtn = dialog.querySelector("#rq-copy");
  const typeSelect = dialog.querySelector("#rq-type");
  const serviceSelect = dialog.querySelector("#rq-service");

  const waNumber = (CONTACT.whatsapp || "").replace(/\D/g, "");
  const hasWhatsApp = waNumber.length > 5;
  const hasEmail = /.+@.+\..+/.test(CONTACT.email || "");

  if (hasWhatsApp) {
    mainBtn.textContent = "Send on WhatsApp";
    if (hasEmail) emailBtn.hidden = false;
  } else if (hasEmail) {
    mainBtn.textContent = "Send by email";
  } else {
    mainBtn.textContent = "Prepare request";
  }

  let lastFocus = null;

  function openRequest(opts = {}) {
    lastFocus = document.activeElement;
    formView.hidden = false;
    resultView.hidden = true;
    errorBox.textContent = "";
    if (opts.type && [...typeSelect.options].some((o) => o.value === opts.type)) typeSelect.value = opts.type;
    if (opts.service && [...serviceSelect.options].some((o) => o.value === opts.service)) serviceSelect.value = opts.service;
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    setTimeout(() => dialog.querySelector("#rq-name").focus(), 30);
  }

  function closeRequest() {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  dialog.querySelector(".modal-close").addEventListener("click", closeRequest);
  dialog.querySelector("[data-cancel]").addEventListener("click", closeRequest);
  dialog.querySelector("[data-back]").addEventListener("click", () => {
    resultView.hidden = true;
    formView.hidden = false;
  });
  // Click on the dimmed backdrop closes the dialog
  dialog.addEventListener("click", (e) => { if (e.target === dialog) closeRequest(); });

  function buildMessage(data) {
    return [
      "Hello NyasaTech1, I would like to request support.",
      "",
      `Name: ${data.name}`,
      `Contact: ${data.contact}`,
      `Support type: ${data.type}`,
      `Service: ${data.service}`,
      "",
      data.message
    ].join("\n");
  }

  let submitChannel = "main";
  dialog.querySelectorAll("button[type=submit]").forEach((b) => {
    b.addEventListener("click", () => { submitChannel = b.dataset.channel; });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      name: form.name.value.trim(),
      contact: form.contact.value.trim(),
      type: form.type.value,
      service: form.service.value,
      message: form.message.value.trim()
    };
    if (!data.name || !data.contact || !data.message) {
      errorBox.textContent = "Please fill in your name, how to reach you, and what you need help with.";
      return;
    }
    errorBox.textContent = "";
    const text = buildMessage(data);

    if (submitChannel === "email" || (!hasWhatsApp && hasEmail)) {
      const subject = encodeURIComponent(`Support request: ${data.service}`);
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${encodeURIComponent(text)}`;
      closeRequest();
    } else if (hasWhatsApp) {
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      closeRequest();
    } else {
      resultBox.value = text;
      formView.hidden = true;
      resultView.hidden = false;
      copyBtn.textContent = "Copy message";
    }
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(resultBox.value);
    } catch (err) {
      resultBox.select();
      document.execCommand("copy");
    }
    copyBtn.textContent = "Copied";
  });

  // Anything marked data-request opens the dialog
  document.querySelectorAll("[data-request]").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (!el.hasAttribute("data-request")) return; // given a real destination in section 8
      e.preventDefault();
      const opts = { type: el.dataset.support || "" };
      const card = el.closest(".service-card");
      if (card) {
        const title = card.querySelector("h3");
        if (title) opts.service = title.textContent.trim();
      }
      openRequest(opts);
    });
  });


  // ==========================================
  // 8. SOCIAL ICONS
  // ==========================================
  document.querySelectorAll("[data-social]").forEach((link) => {
    const kind = link.dataset.social;
    if (kind === "whatsapp" && hasWhatsApp) {
      link.href = `https://wa.me/${waNumber}`;
      link.target = "_blank";
      link.rel = "noopener";
      link.removeAttribute("data-request");
    } else if (kind === "email" && hasEmail) {
      link.href = `mailto:${CONTACT.email}`;
      link.removeAttribute("data-request");
    } else if (kind === "facebook") {
      if (/^https?:\/\//.test(CONTACT.facebook || "")) {
        link.href = CONTACT.facebook;
        link.target = "_blank";
        link.rel = "noopener";
        link.removeAttribute("data-request");
      } else {
        link.hidden = true;
      }
    }
  });

});