const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/variables.scss";`,
      },
    },
  },
  publicPath: process.env.NODE_ENV === "production" ? "/Invoice-App/" : "/",
});
