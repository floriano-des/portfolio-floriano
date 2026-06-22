(function () {
  "use strict";

  var clock = document.querySelector("[data-local-time]");
  if (!clock || !window.Intl || !window.Intl.DateTimeFormat) return;

  var formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  function update() {
    clock.textContent = formatter.format(new Date());
    clock.setAttribute("datetime", new Date().toISOString());
  }

  update();
  window.setInterval(update, 30000);
}());

