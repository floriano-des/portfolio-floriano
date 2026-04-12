module.exports = function (eleventyConfig) {
  // Limita um array aos primeiros N itens (uso: array | limit(3))
  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  // Cache busting: timestamp único por build — invalida CSS/JS em produção
  eleventyConfig.addGlobalData("buildTime", () => Date.now());

  // Pass static assets through unchanged
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy(".htaccess");

  // Watch CSS/JS/assets for changes in dev mode
  eleventyConfig.addWatchTarget("css/");
  eleventyConfig.addWatchTarget("js/");
  eleventyConfig.addWatchTarget("assets/");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
