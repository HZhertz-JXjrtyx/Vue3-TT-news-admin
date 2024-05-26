import { ref, onMounted, onUnmounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import { useUserStore, useMessageStore } from '@/stores'

export default () => {
  const pushMessageToList = ref(null)
  provide('pushMessageToList', pushMessageToList)

  const route = useRoute()
  const userStore = useUserStore()
  const messageStore = useMessageStore()
  const socket = ref(null)

  onMounted(() => {
    // 连接到服务器
    socket.value = io('/', {
      query: {
        userId: userStore.userInfo._id,
      },
    })

    // 连接成功
    socket.value.on('connect', () => {
      console.log('socket connect success')
    })
    // 连接错误
    socket.value.on('connect_error', (error) => {
      console.log('socket connect error', error)
    })
    // 连接超时
    socket.value.on('connect_timeout', (timeout) => {
      console.log('socket connect timeout', timeout)
    })
    // 断开连接(被动)
    socket.value.on('disconnect', (reason) => {
      console.log('socket disconnect', reason)
    })

    // 接收消息 新增notify message
    socket.value.on('notify_message', (msg) => {
      console.log('socket: new notify_message', msg)
      if (messageStore.notifyList) {
        messageStore.notifyList[msg.data.type].last_message = msg.data
        messageStore.notifyList[msg.data.type].unReadCount++
      }
      messageStore.unreadCountTotal !== -1 && messageStore.unreadCountTotal++
    })

    // 接收消息 新增chat message
    socket.value.on('chat_message', (msg) => {
      console.log('socket: new chat message', msg)
      if (messageStore.notifyList) {
        // 提升/新增对话项
        messageStore.upChat(msg.data)
        // 更新总未读数
        messageStore.unreadCountTotal !== -1 && messageStore.unreadCountTotal++
      }
      // 如果在对话页面
      console.log(route.name === 'conversationdetail')
      if (route.name === 'conversationdetail' && route.params.conversationId === msg.data._id) {
        // 更新对话页消息列表
        pushMessageToList.value(msg.data.last_message)
      }
    })
  })

  onUnmounted(() => {
    if (socket.value) {
      // 断开连接(主动)
      socket.value.disconnect()
    }
  })
}
