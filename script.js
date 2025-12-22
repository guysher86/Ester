(function () {
  const PHONE = (window.__WHATSAPP_PHONE__ || "").trim();

  const form = document.getElementById("whatsappForm");
  const note = document.getElementById("formNote");
  const stickyBtn = document.getElementById("stickyWhatsApp");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

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
})();