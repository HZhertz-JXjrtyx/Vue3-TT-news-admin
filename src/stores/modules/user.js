import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeNames from '../storeNames'
import { getUserInfo } from '@/api'

export const useUserStore = defineStore(
  storeNames.USER,
  () => {
    const token = ref('')
    const userInfo = ref({})
    const userFollowActiveTab = ref(0)

    const fetchUserInfo = async () => {
      const response = await getUserInfo()
      console.log(response)
      userInfo.value = response.data
    }
    return {
      token,
      userInfo,
      userFollowActiveTab,
      fetchUserInfo,
    }
  },
  {
    persist: true,
  }
)
