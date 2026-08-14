// Feed do corpus do flori-bot: gera /flori-bot-corpus.json no build.
// Contém apenas o texto principal + metadados das páginas de case aprovadas
// (allowlist), com um digest para o sync detectar mudanças (idempotência).
// NÃO inclui secrets nem conteúdo privado — só o que já é público no site.

const crypto = require("node:crypto");

// Allowlist: todas as páginas em /projetos/<slug>/ (os 8 cases publicados).
const CASE_URL = /^\/projetos\/[^/]+\/$/;
const MAX_CHARS = 16000; // limite de texto por case (respeita limites do índice)

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// "Quantum Vizz · Estudo de caso · Floriano Silva" -> "Quantum Vizz"
// "Repertório em Design Gráfico, Floriano Silva" -> "Repertório em Design Gráfico"
function caseName(title) {
  return String(title || "")
    .split("·")[0]
    .replace(/,\s*Floriano Silva\s*$/i, "")
    .trim();
}

function slugFromUrl(url) {
  const m = url.match(/^\/projetos\/([^/]+)\//);
  return m ? `case-${m[1]}` : url.replace(/[^a-z0-9]+/gi, "-");
}

module.exports = class {
  data() {
    return {
      permalink: "/flori-bot-corpus.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render(data) {
    const baseUrl = (data.metadata && data.metadata.url) || "";
    const pages = (data.collections.all || []).filter((p) => CASE_URL.test(p.url));

    const items = pages
      .map((p) => {
        const text = stripHtml(p.templateContent).slice(0, MAX_CHARS);
        return {
          id: slugFromUrl(p.url),
          type: "case",
          title: caseName(p.data.title),
          sourceUrl: baseUrl + p.url,
          visibility: "public",
          reviewedAt: p.data.lastmod || null,
          keywords: p.data.caseKeywords || [],
          text,
        };
      })
      .filter((it) => it.text.length > 0)
      .sort((a, b) => a.id.localeCompare(b.id));

    const canonical = items.map((it) => `${it.id}|${it.sourceUrl}|${it.text}`).join("\n");
    const digest = crypto.createHash("sha256").update(canonical).digest("hex");

    return JSON.stringify({
      schemaVersion: 1,
      updatedAt: new Date().toISOString().slice(0, 10),
      digest,
      count: items.length,
      items,
    });
  }
};
