// const path = require('path')

module.exports = {
  publicPath: './',

  productionSourceMap: false,

  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/sass/_variables.sass"
          @import "@/sass/_breakpoint.sass"
          @import "@/sass/_elements.sass"
          @import "@/sass/_base.sass"
        `
      }
    }
  },

  // pluginOptions: {
  //   'style-resources-loader': {
  //     preProcessor: 'sass',
  //     patterns: [
  //       path.resolve(__dirname, 'src/sass/*.sass'),
  //     ]
  //   }
  // }
}
