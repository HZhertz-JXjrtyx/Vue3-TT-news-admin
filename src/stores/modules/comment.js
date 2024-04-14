import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeNames from '@/stores/storeNames'

export const useCommentStore = defineStore(storeNames.COMMENT, () => {
  const commentCount = ref(0)

  const isShowTextarea = ref(false)
  const textareaPlaceholder = ref('请输入评论')
  const typeParam = ref(1)
  const sourceidParam = ref('')
  const replyUseridParam = ref(0)

  return {
    commentCount,
    isShowTextarea,
    textareaPlaceholder,
    typeParam,
    sourceidParam,
    replyUseridParam,
  }
})
