import axios from 'axios'
import { showToast } from 'vant'
import { useUserStore } from '@/stores'
import router from '@/router'

const userStore = useUserStore()
const baseURL = 'http://localhost:3007'
const instance = axios.create({
  baseURL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
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
    if (response.data.status >= 200 && response.data.status < 300) {
      return response.data
    } else {
      showToast({
        message: `!!!${response.data.message || '服务异常'}`,
        position: 'bottom'
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
      position: 'bottom'
    })
    return Promise.reject(error)
  }
)

export default instance
export { baseURL }
