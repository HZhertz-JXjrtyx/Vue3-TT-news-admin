import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeNames from '@/stores/storeNames'
import { getUserChannels } from '@/api'

export const useChannelStore = defineStore(
  storeNames.CHANNEL,
  () => {
    const userChannel = ref([])
    const fetchUserChannels = async () => {
      const response = await getUserChannels()
      console.log(response)
      userChannel.value = response.data
    }
    return {
      userChannel,
      fetchUserChannels
    }
  },
  {
    persist: true
  }
)
