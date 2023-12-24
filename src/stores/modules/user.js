import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeNames from '@/stores/storeNames'
import { getLocal, setLocal, removeLocal } from '@/utils/storage'
import { getUserInfo } from '@/api'

export const useUserStore = defineStore(storeNames.USER, () => {
  const TOKEN_KEY = 'TTNEWS_USER'
  const token = ref(getLocal(TOKEN_KEY))
  const userInfo = ref({})
  const setToken = (newToken) => {
    token.value = newToken
    setLocal(TOKEN_KEY, newToken)
  }
  const removeToken = () => {
    token.value = ''
    removeLocal(TOKEN_KEY)
  }
  const fetchUserInfo = async () => {
    const response = await getUserInfo()
    console.log(response)
    userInfo.value = response.data
  }
  return {
    token,
    setToken,
    removeToken,
    userInfo,
    fetchUserInfo
  }
})
