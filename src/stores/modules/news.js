import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeNames from '@/stores/storeNames'
import { getNews, getArticle as getArticleRequest } from '@/api'

export const useNewsStore = defineStore(
  storeNames.NEWS,
  () => {
    const newsList = ref({})
    const article = ref({})

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
    const getArticle = async (articleId) => {
      const response = await getArticleRequest({ article_id: articleId })
      article.value = response.data
    }

    return {
      newsList,
      article,
      fetchNewsList,
      getArticle,
    }
  },
  {
    persist: {
      paths: ['newsList'],
    },
  }
)
