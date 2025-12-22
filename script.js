(() => {
  const PHONE = (window.__WHATSAPP_PHONE__ || "").trim();
  const $ = (id) => document.getElementById(id);

  // Mobile nav
  const navToggle = $("navToggle");
  const mobileNav = $("mobileNav");
  if (navToggle && mobileNav){
    navToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("isOpen");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      mobileNav.setAttribute("aria-hidden", String(!isOpen));
    });
    mobileNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobileNav.classList.remove("isOpen");
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("aria-hidden", "true");
      });
    });
  }

  // Reveal
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced){
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries){
        if (e.isIntersecting){
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.14, rootMargin: "0px 0px -10% 0px" });
    els.forEach(el => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("in-view"));
  }

  // FAB -> contact
  const waFab = document.getElementById("waFab");
  if (waFab){
    waFab.addEventListener("click", () => {
      document.querySelector("#contact")?.scrollIntoView({behavior:"smooth", block:"start"});
      setTimeout(() => $("firstName")?.focus(), 300);
    });
  }

  // Year
  const yearEl = $("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // WhatsApp form
  const form = $("whatsForm");
  const errorText = $("errorText");
  const clean = (s) => (s || "").toString().trim().replace(/\s+/g, " ");
  const setError = (msg) => { if (errorText) errorText.textContent = msg || ""; };

  const buildMessage = (firstName, lastName, childName) => [
    "היי, הגעתי מהאתר ‘מתמטיקה בביטחון’.",
    `שמי: ${firstName} ${lastName}`,
    `שם הילד/ה: ${childName}`,
    "אפשר לתאם שיעור?"
  ].join("\n");

  const openWhatsApp = (text) => {
    if (!PHONE) throw new Error("חסר מספר יעד ל‑WhatsApp.");
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      setError("");

      const firstName = clean($("firstName")?.value);
      const lastName  = clean($("lastName")?.value);
      const childName = clean($("childName")?.value);

      if (!firstName || !lastName || !childName){
        setError("נא למלא 3 שדות.");
        return;
      }

      try{
        openWhatsApp(buildMessage(firstName, lastName, childName));
      } catch (err){
        setError(err?.message || "אירעה שגיאה.");
      }
    });
  }
})();