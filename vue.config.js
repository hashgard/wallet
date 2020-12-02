module.exports = {
  publicPath: "./",
  lintOnSave: false,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/styles/_var.scss";'
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://172.16.6.82:1317',
        target:'http://42.192.137.128:1317/',
        pathRewrite: {
          ['^/api']: ''
        }
      }
    },
    port: 8083 // 端口
  }
};