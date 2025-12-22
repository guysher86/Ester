(() => {
  const PHONE = (window.__WHATSAPP_PHONE__ || "").trim();

  const $ = (id) => document.getElementById(id);

  const navToggle = $("navToggle");
  const mobileNav = $("mobileNav");
  const fab = $("fab");

  if (navToggle && mobileNav){
    navToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("isOpen");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      mobileNav.setAttribute("aria-hidden", String(!isOpen));
    });

    // Close mobile nav on click
    mobileNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobileNav.classList.remove("isOpen");
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("aria-hidden", "true");
      });
    });
  }

  // Floating button scrolls to form section (so user fills details)
  if (fab){
    fab.addEventListener("click", () => {
      const el = document.querySelector("#contact");
      if (el) el.scrollIntoView({behavior:"smooth", block:"start"});
      setTimeout(() => {
        const first = $("firstName");
        if (first) first.focus();
      }, 350);
    });
  }

  // WhatsApp form submit
  const form = $("whatsForm");
  const errorText = $("errorText");
  const year = $("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const clean = (s) => (s || "").toString().trim().replace(/\s+/g, " ");

  const buildMessage = (firstName, lastName, childName) => {
    return [
      "היי, הגעתי מהאתר ‘מתמטיקה בביטחון’.",
      `שמי: ${firstName} ${lastName}`,
      `שם הילד/ה: ${childName}`,
      "אשמח לשמוע פרטים ולתאם שיעור."
    ].join("\n");
  };

  const openWhatsApp = (text) => {
    if (!PHONE){
      throw new Error("חסר מספר יעד ל‑WhatsApp.");
    }
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${PHONE}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const setError = (msg) => {
    if (!errorText) return;
    errorText.textContent = msg || "";
  };

  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      setError("");

      const firstName = clean($("firstName")?.value);
      const lastName  = clean($("lastName")?.value);
      const childName = clean($("childName")?.value);

      if (!firstName || !lastName || !childName){
        setError("נא למלא שם פרטי, שם משפחה ושם הילד/ה (שדות חובה).");
        return;
      }

      try{
        const msg = buildMessage(firstName, lastName, childName);
        openWhatsApp(msg);
      } catch (err){
        setError(err?.message || "אירעה שגיאה. נסו שוב.");
      }
    });
  }
})();
