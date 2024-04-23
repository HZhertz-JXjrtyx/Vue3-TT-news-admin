import axios from 'axios'
import { showToast } from 'vant'
import 'vant/es/toast/style'
import { useUserStore } from '@/stores'
import router from '@/router'
import { removeLocal } from '@/utils'

const baseURL = 'http://localhost:3007'
const instance = axios.create({
  baseURL,
  timeout: 10000,
})

instance.interceptors.request.use(
  (config) => {
    //const userStore = useUserStore()不能写在外面
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    const userStore = useUserStore()
    if (response.data.status >= 200 && response.data.status < 300) {
      return response.data
    } else if (response.data.status === 409) {
      return Promise.reject(response.data)
    } else if (response.data.status === 405) {
      removeLocal('USER')
      userStore.token = ''
      userStore.userInfo = {}
      router.push('home')
    } else {
      console.log(response)
      showToast({
        message: `!!!${response.data.message || '服务异常'}`,
        position: 'bottom',
      })
      return Promise.reject(response.data)
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      router.push('login')
    }
    showToast({
      message: `!!!${error.response.data.message || '服务异常'}`,
      position: 'bottom',
    })
    return Promise.reject(error)
  }
)

export default instance
export { baseURL }
