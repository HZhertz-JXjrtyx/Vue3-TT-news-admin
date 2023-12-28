import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeNames from '@/stores/storeNames'
import { getNews } from '@/api'

export const useNewsStore = defineStore(
  storeNames.NEWS,
  () => {
    const newsList = ref({})
    const fetchNewsList = async (channel_id, channel_name, page, pageSize) => {
      const response = await getNews({ channel_id, page, pageSize })
      console.log(response)
      if (response.status === 200) {
        if (!newsList.value[channel_name]) {
          newsList.value[channel_name] = []
        }
        newsList.value[channel_name] = newsList.value[channel_name].concat(response.data)
        return true
      } else {
        return false
      }
    }
    return {
      newsList,
      fetchNewsList
    }
  },
  {
    persist: true
  }
)
