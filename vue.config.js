// 引入defineConfig函数
const { defineConfig } = require('@vue/cli-service')
// 导出配置
module.exports = defineConfig({
  // 转译依赖
  transpileDependencies: true
})
