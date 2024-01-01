import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeNames from '@/stores/storeNames'
import { getUserChannels, updateUserChannels as updateUserChannelsRequest } from '@/api'

export const useChannelStore = defineStore(
  storeNames.CHANNEL,
  () => {
    const userChannel = ref([])
    const fetchUserChannels = async () => {
      const response = await getUserChannels()
      console.log(response)
      userChannel.value = response.data
    }
    const updateUserChannels = async (newUserChannel) => {
      const response = await updateUserChannelsRequest(newUserChannel)
      console.log(response)
    }
    return {
      userChannel,
      fetchUserChannels,
      updateUserChannels
    }
  },
  {
    persist: true
  }
)
