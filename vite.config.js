import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import pxtovw from 'postcss-px-to-viewport'

const loder_pxtovw = pxtovw({
  viewportWidth: 750,
  viewportUnit: 'vw',
  exclude: [/node_modules\/vant/],
})

const vant_pxtovw = pxtovw({
  viewportWidth: 375,
  viewportUnit: 'vw',
  exclude: [/^(?!.*node_modules\/vant).*/],
})

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'lord-icon',
        },
      },
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  css: {
    postcss: {
      plugins: [loder_pxtovw, vant_pxtovw],
    },
  },
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
