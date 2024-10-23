import { defineConfig } from 'umi';

const dev = process.env.NODE_ENV === 'development';

export default defineConfig({
  publicPath: dev ? './' : '/lesoon-integration-web/',
  nodeModulesTransform: {
    type: 'none',
  },

  styles: [
    `html,body{height:100%}
     #uc-integration{height:100%;width:100%;position: relative;background:var(--bg-color,#f9fafb)}`,
  ],

  hash: true,
  ignoreMomentLocale: true,
  crossorigin: true,

  mountElementId: 'uc-integration',

  theme: {
    'root-entry-name': 'variable',
  },

  antd: {
    mobile: false,
  },

  title: 'template',
  fastRefresh: {},

  qiankun: { slave: {} },
  proxy: {
    '/petrel/': {
      // target: 'https://ocp.lesoon.cloud',
      target: 'https://dev-wms.lesoon.net.cn',
      changeOrigin: true,
    },
    '/login': {
      target: 'https://dev-wms.lesoon.net.cn',
      // target: 'https://ocp.lesoon.cloud',
      changeOrigin: true,
    },
    '/portal/': {
      target: 'https://dev-wms.lesoon.net.cn',
      // target: 'https://ocp.lesoon.cloud',
      changeOrigin: true,
    },
  },
  routes: [
    {
      path: '/',
      component: '@/pages/template',
      title: '模板生成',
    }, // 模板
    {
      path: '/newModule',
      component: '@/pages/newModule',
      title: '3214', // 312
    },
    {
      path: '/newModule',
      component: '@/pages/newModule',
      title: '3214', // 312
    },

    { component: '@/components/404' },
  ],
  locale: {
    baseNavigator: false,
    default: 'zh-CN',
    antd: true,
    useLocalStorage: true,
  },
  alias: {
    lodash: 'lodash-es',
  },
  chunks: ['vendors', 'common', 'ui', 'ls', 'umi'],
  chainWebpack(config) {
    config.optimization.splitChunks({
      chunks: 'all', //async异步代码分割 initial同步代码分割 all同步异步分割都开启
      automaticNameDelimiter: '.',
      name: true,
      minSize: 30000, //字节 引入的文件大于30kb才进行分割
      minChunks: 1, //模块至少使用次数
      cacheGroups: {
        ui: {
          name: 'ui',
          test: /[\\/]node_modules[\\/](antd|rc-([a-z-]{3,20}))[\\/]/,
          priority: -10,
          enforce: true,
        },
        ls: {
          name: 'ls',
          test: /[\\/]node_modules[\\/](ls-pro-([a-z-]{3,20}))[\\/]/,
          priority: -10,
          enforce: true,
        },
        common: {
          name: 'common',
          test: /[\\/]node_modules[\\/](lodash-es|@ant-design|moment|refractor|react-syntax-highlighter|react-markdown)[\\/]/,
          priority: -10,
          enforce: true,
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -11,
          enforce: true,
        },
      },
    });
  },
});
