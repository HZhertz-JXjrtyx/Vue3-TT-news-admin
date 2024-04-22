import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeNames from '../storeNames'
import { getUserChannelsApi, updateUserChannelsApi } from '@/api'

export const useChannelStore = defineStore(
  storeNames.CHANNEL,
  () => {
    const userChannel = ref({ selected: [], unselected: [] })
    const fetchUserChannels = async () => {
      const response = await getUserChannelsApi()
      console.log(response)
      userChannel.value = response.data
    }
    const updateUserChannels = async (newUserChannel) => {
      const response = await updateUserChannelsApi(newUserChannel)
      console.log(response)
    }
    return {
      userChannel,
      fetchUserChannels,
      updateUserChannels,
    }
  },
  {
    persist: true,
  }
)
