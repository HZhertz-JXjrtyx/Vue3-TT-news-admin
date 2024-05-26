import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import pxtovw from 'postcss-px-to-viewport'

const loder_pxtovw = pxtovw({
  viewportWidth: 750,
  viewportUnit: 'vw',
  exclude: [/node_modules\/vant/, /node_modules\/quill/],
})

const vant_pxtovw = pxtovw({
  viewportWidth: 375,
  viewportUnit: 'vw',
  exclude: [/^(?!.*node_modules\/vant).*/],
})
const quill_pxtovw = pxtovw({
  viewportWidth: 375,
  viewportUnit: 'vw',
  exclude: [/^(?!.*node_modules\/quill).*/],
})

export default defineConfig({
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://127.0.0.1:3007',
        changeOrigin: true,
        ws: true, // 启用WebSocket代理
      },
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'lord-icon',
        },
      },
    }),

    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  css: {
    postcss: {
      plugins: [loder_pxtovw, vant_pxtovw, quill_pxtovw],
    },
  },
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
})
