const fs = require("node:fs");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter("dateToIso", (value) => {
    if (!value) return "";

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString();
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

  // Cache busting por build para CSS/JS em producao.
  eleventyConfig.addGlobalData("buildTime", () => Date.now());

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
