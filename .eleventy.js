const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  const assetVersionCache = new Map();
  const markdown = markdownIt({ html: true, breaks: false, linkify: false });

  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("json", (value) => {
    return JSON.stringify(removeUndefined(value))
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");
  });
  eleventyConfig.addFilter("breadcrumbs", (url, currentTitle = "") => {
    return buildBreadcrumbs(url, currentTitle);
  });
  eleventyConfig.addFilter("dateToIso", (value) => {
    if (!value) return "";

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString();
  });
  eleventyConfig.addFilter("assetVersion", (assetPath) => {
    if (!assetPath || typeof assetPath !== "string") return "";

    const normalizedPath = assetPath.replace(/^\/+/, "").replace(/\//g, path.sep);
    const absolutePath = path.resolve("src", normalizedPath);

    if (assetVersionCache.has(absolutePath)) {
      return assetVersionCache.get(absolutePath);
    }

    try {
      const content = fs.readFileSync(absolutePath);
      const version = crypto.createHash("md5").update(content).digest("hex").slice(0, 10);
      assetVersionCache.set(absolutePath, version);
      return version;
    } catch (_) {
      return "";
    }
  });

  eleventyConfig.addPairedShortcode("caseSection", (content, kicker, title, sectionClass = "section", theme = "light") => {
    const kickerClass = theme === "dark" ? "cs-kicker-dark" : "cs-kicker-light";
    const renderedContent = markdown.render(String(content || "").replace(/^\s+(<)/gm, "$1"));

    return `<section class="${escapeAttribute(sectionClass)}">
<div class="cs-container">
<p class="${kickerClass}">${kicker}</p>
<h2 class="section-title" data-animate>${title}</h2>
<div class="cs-md-content">
${renderedContent}
</div>
</div>
</section>`;
  });

  eleventyConfig.addShortcode("caseFigure", (src, alt = "", caption = "", theme = "light", maxWidth = "", frameClass = "") => {
    const figureStyle = maxWidth ? ` style="margin: var(--space-12) auto 0; max-width: ${escapeAttribute(maxWidth)};"` : "";
    const figureClass = frameClass ? ` class="${escapeAttribute(frameClass)}"` : "";
    const imageClass = theme === "dark" ? " class=\"cs-img-dark\"" : "";
    const figcaption = caption ? `<figcaption class="cs-figcaption">${caption}</figcaption>` : "";

    return `<figure${figureClass}${figureStyle} data-animate>
<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}"${imageClass} loading="lazy">
${figcaption}
</figure>`;
  });

  eleventyConfig.addShortcode("dataStats", (stats = []) => {
    if (!Array.isArray(stats) || !stats.length) return "";

    return `<div class="cs-data-grid">
${stats.map((stat, index) => `<div class="cs-data-stat" data-animate${index ? ` data-delay="${index}"` : ""}>
<p class="cs-data-stat__value">${stat.value || ""}</p>
<p class="cs-data-stat__label">${stat.label || ""}</p>
</div>`).join("")}
</div>`;
  });

  eleventyConfig.addShortcode("objectiveBlock", (question = "", items = []) => {
    if (!Array.isArray(items)) return "";

    return `<section class="cs-context section">
<div class="cs-container">
<p class="cs-kicker-dark">Objetivo</p>
<p class="cs-context__question" data-animate>${question}</p>
<div class="cs-gargalos">
<h2 class="cs-gargalos__title section-title">${items.length} gargalos identificados</h2>
<ul class="cs-gargalos__list" role="list">
${items.map((item, index) => `<li class="cs-gargalos__item">
<span class="cs-gargalos__num" aria-hidden="true">${index + 1}</span>
<p class="cs-gargalos__text">${item}</p>
</li>`).join("")}
</ul>
</div>
</div>
</section>`;
  });

  eleventyConfig.addShortcode("comparisonList", (items = []) => {
    if (!Array.isArray(items) || !items.length) return "";

    return `<div class="cs-comparison-list">
${items.map((item) => `<div class="cs-comparison" data-animate>
<div>
<p class="cs-comparison__label">${item.label || ""}</p>
<h3 class="cs-comparison__title">${item.title || ""}</h3>
<p class="cs-comparison__note">${item.note || ""}</p>
</div>
<div class="cs-comparison__images">
<div class="cs-comparison__side">
<span class="cs-comparison__badge cs-comparison__badge--before">Antes</span>
<img src="${escapeAttribute(item.before && item.before.src)}" alt="${escapeAttribute(item.before && item.before.alt)}" class="cs-comparison__img" loading="lazy">
</div>
<div class="cs-comparison__side">
<span class="cs-comparison__badge cs-comparison__badge--after">Depois</span>
<img src="${escapeAttribute(item.after && item.after.src)}" alt="${escapeAttribute(item.after && item.after.alt)}" class="cs-comparison__img" loading="lazy">
</div>
</div>
</div>`).join("")}
</div>`;
  });

  eleventyConfig.addShortcode("caseMetrics", (items = []) => {
    if (!Array.isArray(items) || !items.length) return "";

    return `<div class="cs-metrics" style="margin-top: var(--space-10);">
${items.map((item, index) => `<div class="cs-metric${item.modifier ? ` ${escapeAttribute(item.modifier)}` : ""}" data-animate${index ? ` data-delay="${index}"` : ""}>
<span class="cs-metric__value">${item.value || ""}</span>
<span class="cs-metric__label">${item.label || ""}</span>
</div>`).join("")}
</div>`;
  });

  eleventyConfig.addShortcode("conversionFormula", (formula = {}) => {
    if (!formula.value) return "";

    return `<div class="cs-conversion-formula" data-animate data-delay="3">
<p class="cs-conversion-formula__label">${formula.label || ""}</p>
<p class="cs-conversion-formula__intro">${formula.intro || ""}</p>
<p class="cs-conversion-formula__value">${formula.value || ""}</p>
<p class="cs-conversion-formula__note">${formula.note || ""}</p>
</div>`;
  });

  eleventyConfig.addCollection("sitemapPages", (collectionApi) => {
    const excludedUrls = new Set([
      "/404.html",
      "/sitemap.xml",
      "/sitemap_index.xml",
      "/page-sitemap.xml",
      "/post-sitemap.xml",
      "/contato/",
    ]);

    return collectionApi
      .getAll()
      .filter((item) => {
        if (!item.url || !item.outputPath) return false;
        if (excludedUrls.has(item.url)) return false;
        if (item.data.eleventyExcludeFromSitemap) return false;

        return item.outputPath.endsWith(".html");
      })
      .map((item) => {
        if (item.data.lastmod || !item.inputPath) return item;

        try {
          const stats = fs.statSync(item.inputPath);
          item.data.lastmod = stats.mtime;
        } catch (_) {
          // Mantem o fallback padrao caso nao seja possivel ler o arquivo.
        }

        return item;
      });
  });

  // Copia arquivos estaticos a partir de src/ mantendo a URL publica.
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/.htaccess": ".htaccess" });

  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");
  eleventyConfig.addWatchTarget("src/assets/");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
      layouts: "_includes/layouts",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};

function removeUndefined(value) {
  if (Array.isArray(value)) return value.map(removeUndefined);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => item !== undefined && item !== "")
      .map(([key, item]) => [key, removeUndefined(item)])
  );
}

function buildBreadcrumbs(url, currentTitle = "") {
  const siteUrl = "https://floriano.des.br";
  const cleanUrl = String(url || "/").split("?")[0];

  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Início",
      item: `${siteUrl}/`,
    },
  ];

  if (cleanUrl === "/") return items;

  const knownNames = {
    projetos: "Projetos",
    reflexoes: "Reflexões",
    sobre: "Sobre",
    "politica-de-privacidade": "Política de Privacidade",
  };
  const segments = cleanUrl.split("/").filter(Boolean);

  segments.forEach((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}/`;
    const isCurrent = index === segments.length - 1;
    const title = isCurrent
      ? String(currentTitle || knownNames[segment] || segmentToTitle(segment)).split("|")[0].split("·")[0].trim()
      : knownNames[segment] || segmentToTitle(segment);

    items.push({
      "@type": "ListItem",
      position: index + 2,
      name: title,
      item: `${siteUrl}${path}`,
    });
  });

  return items;
}

function segmentToTitle(segment) {
  return String(segment || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeAttribute(value = "") {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
