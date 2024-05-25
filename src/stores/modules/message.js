import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import storeNames from '../storeNames'
import { getNotifyListApi, getChatListApi, getTotalUnreadCountApi } from '@/api'

export const useMessageStore = defineStore(storeNames.MESSAGE, () => {
  // 用户通知列表
  const notifyList = ref(null)
  const commentNotify = computed(() => {
    if (notifyList.value) {
      return (
        notifyList.value.comment.last_message?.sender.user_nickname +
        notifyList.value.comment.last_message?.content
      )
    } else {
      return ''
    }
  })
  const likeNotify = computed(() => {
    if (notifyList.value) {
      return (
        notifyList.value.like.last_message?.sender.user_nickname + notifyList.value.like.last_message?.content
      )
    } else {
      return ''
    }
  })
  const followNotify = computed(() => {
    if (notifyList.value) {
      return (
        notifyList.value.follow.last_message?.sender.user_nickname +
        notifyList.value.follow.last_message?.content
      )
    } else {
      return ''
    }
  })

  // 用户对话列表
  const chatList = ref([])
  // 未读消息总数
  const unreadCountTotal = ref(-1)
  const temporaryChatInfo = ref(null)

  // 获取用户通知列表
  const getNotifyList = async () => {
    const res = await getNotifyListApi()
    console.log(res)
    notifyList.value = res.data
  }

  // 获取用户对话列表
  const getChatList = async (pre, size) => {
    const res = await getChatListApi(pre, size)
    console.log(res)
    chatList.value = chatList.value.concat(res.data)
    return res.data.length < size
  }
  // 获取未读消息总数
  const getTotalUnreadCount = async () => {
    const res = await getTotalUnreadCountApi()
    console.log(res)
    unreadCountTotal.value = res.unreadTotalCount
  }
  // 清除对话未读
  const clearChatUnread = (conversationId) => {
    const index = chatList.value.findIndex((chat) => chat._id === conversationId)
    console.log(index)
    if (index !== -1) {
      unreadCountTotal.value -= chatList.value[index].unread_count
      chatList.value[index].unread_count = 0
    }
  }

  const initialize = () => {
    notifyList.value = null

    chatList.value = []
    unreadCountTotal.value = -1
  }

  return {
    notifyList,
    commentNotify,
    likeNotify,
    followNotify,
    chatList,
    unreadCountTotal,
    temporaryChatInfo,
    getNotifyList,
    getChatList,
    getTotalUnreadCount,
    clearChatUnread,
    initialize,
  }
})
