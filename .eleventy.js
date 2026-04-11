module.exports = function (eleventyConfig) {
  // Pass static assets through unchanged
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");

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
