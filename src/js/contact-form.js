(function () {
  "use strict";

  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    if (!form.checkValidity()) return;

    event.preventDefault();

    const fields = new FormData(form);
    const name = String(fields.get("nome") || "").trim();
    const email = String(fields.get("email") || "").trim();
    const company = String(fields.get("empresa") || "").trim();
    const need = String(fields.get("necessidade") || "").trim();
    const message = String(fields.get("mensagem") || "").trim();
    const channel = String(fields.get("canal") || "whatsapp").trim();
    const lines = [
      "Olá, Floriano. Vim pelo seu site e quero conversar sobre um projeto.",
      "",
      `Nome: ${name}`,
      `Email: ${email}`,
      company ? `Empresa ou projeto: ${company}` : "",
      `Necessidade: ${need}`,
      "",
      message,
    ].filter(Boolean);

    const body = lines.join("\n");
    const url =
      channel === "email"
        ? `mailto:contato@floriano.des.br?subject=${encodeURIComponent("Contato pelo site")}&body=${encodeURIComponent(body)}`
        : `https://wa.me/5518996773264?text=${encodeURIComponent(body)}`;

    window.location.assign(url);
  });
})();
