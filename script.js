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

  // Reveal on scroll (subtle)
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

  // Floating button -> contact
  const waFab = document.getElementById("waFab");
  if (waFab){
    waFab.addEventListener("click", () => {
      document.querySelector("#contact")?.scrollIntoView({behavior:"smooth", block:"start"});
      setTimeout(() => $("firstName")?.focus(), 250);
    });
  }

  // Year
  const y = $("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Tabs (closer look)
  const poster = document.getElementById("poster");
  const title = document.getElementById("closerTitle");
  const text = document.getElementById("closerText");
  const list = document.getElementById("closerList");

  const MODES = {
    gaps: {
      title: "פערים.",
      text: "מוצאים את החוליה החסרה — ומחזקים אותה מהר.",
      list: ["מיפוי קצר", "בניית בסיס", "תנועה קדימה"],
      bg: [
        "radial-gradient(880px 520px at 22% 24%, rgba(0,113,227,0.18), transparent 58%)",
        "radial-gradient(900px 560px at 84% 35%, rgba(255,135,180,0.14), transparent 60%)",
        "linear-gradient(180deg, #ffffff 0%, #f4f6ff 100%)"
      ]
    },
    method: {
      title: "שיטה.",
      text: "כלים פשוטים שחוזרים על עצמם — עד שזה הופך להרגל.",
      list: ["איך ניגשים", "איך בודקים", "איך מתקנים"],
      bg: [
        "radial-gradient(880px 520px at 18% 22%, rgba(10,132,255,0.18), transparent 58%)",
        "radial-gradient(900px 560px at 80% 40%, rgba(255,205,90,0.14), transparent 60%)",
        "linear-gradient(180deg, #ffffff 0%, #f6fff9 100%)"
      ]
    },
    confidence: {
      title: "ביטחון.",
      text: "הצלחות קטנות, עקביות — שמייצרות מסוגלות אמיתית.",
      list: ["מטרות קטנות", "חיזוק מיידי", "רצף שמחזיק"],
      bg: [
        "radial-gradient(880px 520px at 22% 26%, rgba(255,135,180,0.16), transparent 58%)",
        "radial-gradient(900px 560px at 82% 36%, rgba(0,113,227,0.14), transparent 60%)",
        "linear-gradient(180deg, #ffffff 0%, #fff6fb 100%)"
      ]
    }
  };

  const setMode = (key) => {
    const m = MODES[key] || MODES.gaps;
    if (title) title.textContent = m.title;
    if (text) text.textContent = m.text;
    if (list){
      list.innerHTML = "";
      m.list.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
    }
    if (poster){
      poster.style.background = m.bg.join(",");
    }
  };

  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b => {
        b.classList.toggle("isActive", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      setMode(btn.dataset.mode);
    });
  });

  // Scroll-driven subtle motion on hero screen (Apple-like restraint)
  const screen = document.getElementById("screen");
  const onScroll = () => {
    if (!screen) return;
    const t = window.scrollY || 0;
    const y = Math.min(18, t / 24);
    const s = 1 - Math.min(0.02, t / 8000);
    screen.style.transform = `translateY(${y}px) scale(${s})`;
  };
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

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

  setMode("gaps");
})();