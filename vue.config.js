module.exports = {
  css: {
    extract: false,
  },
  devServer: {
    proxy: {
      "/api": {
        "target": 'https://tvv.fra1.digitaloceanspaces.com',
        "pathRewrite": {
          '^/api': ''
        },
        "changeOrigin": true,
        "secure": false
      }
    },
    https: true,
  },
};