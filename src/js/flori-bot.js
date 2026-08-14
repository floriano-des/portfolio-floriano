/* flori-bot — comportamento do painel (carregado sob demanda pelo partial).
   Expõe window.FloriBot = { open, close }.
   - Streaming SSE do Worker, citações via allowlist do servidor.
   - Acessível: role=dialog, foco preso, Esc fecha, retorna foco ao launcher.
   - Turnstile (produção) renderizado no primeiro open; ignorado em localhost. */
(function () {
  "use strict";

  var root = document.querySelector("[data-floribot]");
  if (!root || root.dataset.fbReady) return;
  root.dataset.fbReady = "1";

  var panel = root.querySelector("#fbPanel");
  var launcher = root.querySelector("[data-floribot-open]");
  var form = root.querySelector("[data-floribot-form]");
  var input = root.querySelector("[data-fb-input]");
  var sendBtn = root.querySelector("[data-fb-send]");
  var log = root.querySelector("#fbLog");
  var intro = root.querySelector("[data-fb-intro]");
  var tsBox = root.querySelector("[data-fb-turnstile]");

  var isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var endpoint = (isLocal ? "http://localhost:8787" : root.dataset.endpoint || "").replace(/\/$/, "");
  var siteKey = isLocal ? "" : root.dataset.turnstileSitekey || "";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Telemetria agregada (GTM/dataLayer). NUNCA envia texto de pergunta/resposta.
  function track(event, params) {
    try {
      (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: event }, params || {}));
    } catch (_) { /* ignora */ }
  }

  var history = [];
  var busy = false;
  var opened = false;
  var lastFocus = null;
  var tsId = null;

  /* ---------- Turnstile ---------- */
  function loadTurnstile() {
    if (!siteKey) return;
    if (window.turnstile) { renderTurnstile(); return; }
    if (window.__fbTsLoading) return;
    window.__fbTsLoading = true;
    var s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.defer = true;
    s.onload = renderTurnstile;
    document.head.appendChild(s);
  }
  function renderTurnstile() {
    if (!siteKey || !window.turnstile || tsId !== null) return;
    tsBox.hidden = false;
    try {
      // "interaction-only": invisível para usuários legítimos; só mostra desafio se necessário.
      tsId = window.turnstile.render(tsBox, {
        sitekey: siteKey,
        size: "flexible",
        appearance: "interaction-only",
      });
    } catch (_) { /* ignora */ }
  }
  function turnstileToken() {
    if (siteKey && window.turnstile && tsId !== null) {
      try { return window.turnstile.getResponse(tsId) || ""; } catch (_) { return ""; }
    }
    return "";
  }
  function turnstileReset() {
    if (siteKey && window.turnstile && tsId !== null) {
      try { window.turnstile.reset(tsId); } catch (_) { /* ignora */ }
    }
  }

  /* ---------- Abrir / fechar ---------- */
  function open() {
    if (opened) return;
    opened = true;
    lastFocus = document.activeElement;
    panel.hidden = false;
    root.querySelector(".fb-backdrop").hidden = false;
    // reflow antes de animar
    void panel.offsetWidth;
    root.classList.add("fb-open");
    launcher.setAttribute("aria-expanded", "true");
    document.body.classList.add("fb-lock");
    track("floribot_open");
    loadTurnstile();
    document.addEventListener("keydown", onKeydown, true);
    (input || panel).focus();
  }

  function close() {
    if (!opened) return;
    opened = false;
    root.classList.remove("fb-open");
    launcher.setAttribute("aria-expanded", "false");
    document.body.classList.remove("fb-lock");
    document.removeEventListener("keydown", onKeydown, true);
    var finish = function () {
      panel.hidden = true;
      root.querySelector(".fb-backdrop").hidden = true;
      panel.removeEventListener("transitionend", finish);
    };
    if (reduce) { finish(); } else { panel.addEventListener("transitionend", finish); }
    // Retorna o foco ao launcher (elemento que abriu o diálogo).
    if (launcher && launcher.focus) launcher.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "Tab") trapFocus(e);
  }

  function trapFocus(e) {
    var sel = 'a[href],button:not(:disabled),textarea:not(:disabled),input:not(:disabled),[tabindex]:not([tabindex="-1"])';
    var nodes = Array.prototype.slice.call(panel.querySelectorAll(sel)).filter(function (el) {
      return el.offsetParent !== null;
    });
    if (!nodes.length) return;
    var first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Render ---------- */
  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function format(s) {
    return escapeHtml(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }
  function addMsg(role) {
    var el = document.createElement("div");
    el.className = "fb-msg fb-msg--" + role;
    el.innerHTML = '<div class="fb-msg__body"></div><div class="fb-cites"></div>';
    log.appendChild(el);
    scrollDown();
    return el;
  }
  function scrollDown() {
    log.scrollTo({ top: log.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }
  function setBusy(b) {
    busy = b;
    sendBtn.disabled = b;
    input.disabled = b;
  }

  function addFeedback(botEl) {
    var el = document.createElement("div");
    el.className = "fb-feedback";
    var label = document.createElement("span");
    label.textContent = "Esta resposta foi útil?";
    el.appendChild(label);
    [["up", "👍", "Útil"], ["down", "👎", "Não útil"]].forEach(function (opt) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "fb-fb-btn";
      b.setAttribute("aria-label", opt[2]);
      b.textContent = opt[1];
      b.addEventListener("click", function () {
        track("floribot_feedback", { value: opt[0] });
        el.textContent = "Obrigado pelo retorno!";
      });
      el.appendChild(b);
    });
    botEl.appendChild(el);
    scrollDown();
  }

  /* ---------- Enviar pergunta ---------- */
  function ask(text) {
    var q = (text != null ? text : input.value || "").trim();
    if (!q || busy) return;
    if (intro) intro.hidden = true;
    setBusy(true);
    track("floribot_question_sent", { locale: navigator.language });

    addMsg("user").querySelector(".fb-msg__body").textContent = q;
    history.push({ role: "user", content: q });
    input.value = "";
    autoGrow();

    var bot = addMsg("bot");
    var body = bot.querySelector(".fb-msg__body");
    var cites = bot.querySelector(".fb-cites");
    body.innerHTML = '<span class="fb-typing"><i></i><i></i><i></i></span>';

    var answer = "";
    var payload = { messages: history.slice(-8), locale: navigator.language };
    var token = turnstileToken();
    if (token) payload.turnstileToken = token;

    fetch(endpoint + "/v1/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (!res.ok || !res.body) {
          return res.json().then(
            function (j) { throw new Error((j.error && (j.error.message || j.error.code)) || "HTTP " + res.status); },
            function () { throw new Error("HTTP " + res.status); }
          );
        }
        var reader = res.body.getReader();
        var dec = new TextDecoder();
        var buf = "";
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) return;
            buf += dec.decode(r.value, { stream: true });
            var i;
            while ((i = buf.indexOf("\n\n")) !== -1) {
              var block = buf.slice(0, i);
              buf = buf.slice(i + 2);
              var ev = (block.match(/^event: (.*)$/m) || [])[1];
              var dl = (block.match(/^data: (.*)$/m) || [])[1];
              if (!dl) continue;
              var data;
              try { data = JSON.parse(dl); } catch (_) { continue; }
              if (ev === "delta") {
                answer += data.text;
                body.innerHTML = format(answer);
                scrollDown();
              } else if (ev === "citation") {
                var a = document.createElement("a");
                a.className = "fb-cite";
                a.href = data.url;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.innerHTML = '<span aria-hidden="true">↗</span> ' + escapeHtml(data.title || "Fonte");
                a.addEventListener("click", function (e) {
                  track("floribot_source_click", { url: e.currentTarget.href });
                });
                cites.appendChild(a);
              } else if (ev === "error") {
                if (!answer) body.innerHTML = "";
                body.insertAdjacentHTML("beforeend", '<span class="fb-err">' + escapeHtml(data.message || data.code || "erro") + "</span>");
                track("floribot_error", { code: data.code || "error" });
              }
            }
            return pump();
          });
        }
        return pump();
      })
      .then(function () {
        if (answer) {
          history.push({ role: "assistant", content: answer });
          track("floribot_response_completed", { citations: cites.childElementCount });
          addFeedback(bot);
        } else if (!body.querySelector(".fb-err")) {
          body.innerHTML = '<span class="fb-err">Não consegui responder agora. Tente novamente.</span>';
        }
      })
      .catch(function (err) {
        if (!answer) body.innerHTML = "";
        body.insertAdjacentHTML("beforeend", '<span class="fb-err">' + escapeHtml(err.message || "Falha de conexão") + "</span>");
        track("floribot_error", { code: "fetch_failed" });
      })
      .then(function () {
        setBusy(false);
        turnstileReset();
        scrollDown();
        input.focus();
      });
  }

  function autoGrow() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 140) + "px";
  }

  /* ---------- Ligações ---------- */
  root.querySelectorAll("[data-floribot-close]").forEach(function (el) {
    el.addEventListener("click", close);
  });
  root.querySelectorAll("[data-fb-suggest]").forEach(function (btn) {
    btn.addEventListener("click", function () { ask(btn.textContent); });
  });
  root.querySelectorAll(".fb-direct a").forEach(function (a) {
    a.addEventListener("click", function () {
      track("floribot_contact_click", { channel: /wa\.me/.test(a.href) ? "whatsapp" : "email" });
    });
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(); });
  input.addEventListener("input", autoGrow);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); }
  });

  window.FloriBot = { open: open, close: close };
})();
