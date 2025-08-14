module.exports = function imageOptimizationPlugin(context, options) {
  return {
    name: "image-optimization-plugin",
    configureWebpack(config, isServer, utils) {
      return {
        module: {
          rules: [
            {
              test: /\.(png|jpe?g|gif|webp)$/i,
              use: [
                {
                  loader: "file-loader",
                  options: {
                    name: "[name].[hash:8].[ext]",
                    outputPath: "assets/images",
                    publicPath: context.siteConfig.baseUrl + "assets/images/",
                  },
                },
              ],
            },
          ],
        },
        performance: {
          hints: "warning",
          maxAssetSize: 250000, // 250kb
          maxEntrypointSize: 400000, // 400kb
          assetFilter: function (assetFilename) {
            // Only provide hints for images
            return /\.(png|jpe?g|gif|webp)$/i.test(assetFilename);
          },
        },
      };
    },
    async contentLoaded({ content, actions }) {
      // Add preconnect hints for faster image loading
      actions.setGlobalData({
        preconnectHints: [
          { rel: "preconnect", href: "https://cdn.jsdelivr.net" },
          { rel: "dns-prefetch", href: "https://cdn.jsdelivr.net" },
        ],
      });
    },
    injectHtmlTags() {
      return {
        headTags: [
          // Add resource hints for better performance
          {
            tagName: "link",
            attributes: {
              rel: "preconnect",
              href: "https://fonts.googleapis.com",
            },
          },
          {
            tagName: "link",
            attributes: {
              rel: "dns-prefetch",
              href: "https://fonts.gstatic.com",
            },
          },
          // Add meta tag for viewport optimization
          {
            tagName: "meta",
            attributes: {
              name: "viewport",
              content:
                "width=device-width, initial-scale=1.0, maximum-scale=5.0",
            },
          },
        ],
      };
    },
  };
};
