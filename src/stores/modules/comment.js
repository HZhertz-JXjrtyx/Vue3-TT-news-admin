import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeNames from '@/stores/storeNames'
import { getComment as getCommentRequest } from '@/api'

export const useCommentStore = defineStore(storeNames.COMMENT, () => {
  const comment = ref([])
  const getComment = async (type, id, page, pageSize) => {
    const response = await getCommentRequest({ type, id, page, pageSize })
    console.log(response)

    if (response.status === 200) {
      comment.value = comment.value.concat(response.data)
      return true
    } else {
      return false
    }
  }
  return {
    comment,
    getComment,
  }
})
