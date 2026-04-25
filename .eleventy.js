const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

module.exports = function (eleventyConfig) {
  const assetVersionCache = new Map();

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

  eleventyConfig.addCollection("sitemapPages", (collectionApi) => {
    const excludedUrls = new Set([
      "/404.html",
      "/sitemap.xml",
      "/sitemap_index.xml",
      "/page-sitemap.xml",
      "/post-sitemap.xml",
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
    templateFormats: ["njk", "html"],
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
