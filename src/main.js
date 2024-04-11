import { createApp } from 'vue'
import pinia from './stores'
import router from './router'
import { Lazyload } from 'vant'
import { showToast } from 'vant'
import '@/styles/index.less'
import '@/assets/fonts/iconfont.css'
import { useUserStore } from '@/stores'
import App from './App.vue'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Lazyload)

const userStore = useUserStore()
app.directive('login', {
  beforeMount(el, binding) {
    el.addEventListener('click', () => {
      if (!userStore.token) {
        showToast('请登录后进行操作')
      } else {
        binding.value()
      }
    })
  },
})

app.mount('#app')
