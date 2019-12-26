// const path = require('path')

module.exports = {
  publicPath: './',

  productionSourceMap: false,

  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "@/sass/_variables.scss";
          @import "@/sass/_breakpoint.scss";
          @import "@/sass/_elements.scss";
          @import "@/sass/_base.scss";
        `
      }
    }
  },

  // lintOnSave: false
}
