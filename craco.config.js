const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      if (env !== "development") {
        const htmlWebpackPluginInstance = webpackConfig.plugins.find(
          (webpackPlugin) => webpackPlugin instanceof HtmlWebpackPlugin
        );
        if (htmlWebpackPluginInstance) {
          htmlWebpackPluginInstance.options.inject = false;
        }
      }

      const mcep = webpackConfig.plugins.find((p) => {
        return p.constructor.name === "MiniCssExtractPlugin";
      });
      if (mcep) {
        mcep.options.filename = "static/css/[name].css";
      }

      return {
        ...webpackConfig,
        entry: {
          main: "./src/index.tsx",
          content: "./src/content.ts",
          tooltips: "./src/tooltips.tsx",
        },
        output: {
          ...webpackConfig.output,
          filename: "static/js/[name].js",
        },
        optimization: {
          splitChunks: {
            chunks() {
              return false;
            },
          },
          runtimeChunk: false,
        },
      };
    },
  },
};
