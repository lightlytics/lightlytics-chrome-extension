// const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // if (env !== 'development') {
      //   const htmlWebpackPluginInstance = webpackConfig.plugins.find(
      //     webpackPlugin => webpackPlugin instanceof HtmlWebpackPlugin,
      //   )
      //   if (htmlWebpackPluginInstance) {
      //     htmlWebpackPluginInstance.options.inject = false
      //   }
      // }

      const mcep = webpackConfig.plugins.find(p => {
        return p.constructor.name === 'MiniCssExtractPlugin'
      })
      if (mcep) {
        mcep.options.filename = 'static/css/[name].css'
      }

      return {
        ...webpackConfig,
        entry: {
          main: './src/index.tsx',
          aws_cs: './src/content_scripts/aws.ts',
          lightlytics_cs: './src/content_scripts/lightlytics.tsx',
          tooltips_cs: './src/content_scripts/tooltips.tsx',
        },
        output: {
          ...webpackConfig.output,
          filename: 'static/js/[name].js',
        },
        optimization: {
          splitChunks: {
            chunks() {
              return false
            },
          },
          runtimeChunk: false,
        },
      }
    },
  },
}
