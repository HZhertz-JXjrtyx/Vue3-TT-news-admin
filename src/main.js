import { createApp } from 'vue'
import pinia from './stores'
import App from './App.vue'
import router from './router'
import '@/styles/style.less'
import '@/assets/fonts/iconfont.css'
// import { useUserStore } from '@/stores'
// import { showToast } from 'vant'
// import 'vant/es/toast/style'

const app = createApp(App)

// app.directive('check-login', {
//   beforeMount: (el) => {
//     el.addEventListener('click', (event) => {
//       const userStore = useUserStore()
//       if (!userStore.token) {
//         console.log(event)
//         event.preventDefault()
//         // event.stopImmediatePropagation()
//         showToast({
//           message: '登录后查看更多',
//           position: 'bottom'
//         })
//       }
//     })
//   }
// })

app.use(pinia)
app.use(router)

app.mount('#app')
