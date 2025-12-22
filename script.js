(function () {
  const PHONE = (window.__WHATSAPP_PHONE__ || "").trim();

  const form = document.getElementById("whatsappForm");
  const note = document.getElementById("formNote");
  const stickyBtn = document.getElementById("stickyWhatsApp");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function buildMessage(data) {
    const lines = [
      "היי, אשמח לשיעורי מתמטיקה בחיפה.",
      "",
      `שם ההורה: ${data.parentName}`,
      `תלמיד/ה + כיתה: ${data.student}`,
      `נושא כרגע: ${data.topic}`,
      `טלפון לחזרה: ${data.phone}`,
    ];
    return lines.join("\n");
  }

  function openWhatsApp(message) {
    if (!PHONE) {
      if (note) note.textContent = "צריך לעדכן את מספר ה‑WhatsApp בקוד (window.__WHATSAPP_PHONE__).";
      return;
    }
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function getFormData() {
    const fd = new FormData(form);
    return {
      parentName: String(fd.get("parentName") || "").trim(),
      student: String(fd.get("student") || "").trim(),
      topic: String(fd.get("topic") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
    };
  }

  function validate(data) {
    return data.parentName && data.student && data.topic && data.phone;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (note) note.textContent = "";

      const data = getFormData();

      if (!validate(data)) {
        if (note) note.textContent = "כדי לפתוח שיחה, מלאו את כל השדות.";
        return;
      }

      openWhatsApp(buildMessage(data));
    });
  }

  if (stickyBtn) {
    stickyBtn.addEventListener("click", function () {
      let message = "היי, אשמח לשיעורי מתמטיקה בחיפה. אפשר לדבר?";
      if (form) {
        const data = getFormData();
        if (validate(data)) message = buildMessage(data);
      }
      openWhatsApp(message);

      const lead = document.getElementById("lead");
      if (lead) lead.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Apple-ish scroll reveal
  function initReveal() {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;

    // If reduced motion, show everything
    if (reduceMotion) {
      els.forEach(el => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px",
    });

    els.forEach(el => io.observe(el));
  }

  // Minimal parallax for media blocks (very subtle)
  function initParallax() {
    if (reduceMotion) return;

    const els = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!els.length) return;

    let ticking = false;

    function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

    function update() {
      ticking = false;
      const vh = window.innerHeight || 800;

      for (const el of els) {
        const r = el.getBoundingClientRect();
        // progress: -0.5..0.5 around viewport center
        const center = r.top + r.height / 2;
        const p = (center - vh / 2) / vh;
        const offset = clamp(p * 14, -10, 10); // px, subtle
        el.style.transform = `translateY(${offset}px)`;
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

  initReveal();
  initParallax();
})();