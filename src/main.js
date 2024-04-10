import { createApp } from 'vue'
import pinia from './stores'
import router from './router'
import { Lazyload } from 'vant'
import '@/styles/index.less'
import '@/assets/fonts/iconfont.css'
import App from './App.vue'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Lazyload)

app.mount('#app')
