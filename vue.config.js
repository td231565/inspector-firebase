const path = require('path')

module.exports = {
  publicPath: './',

  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/sass/_variables.sass"
        `
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: [
        path.resolve(__dirname, 'src/sass/*.sass'),
      ]
    }
  }
}
