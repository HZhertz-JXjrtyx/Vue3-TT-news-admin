import { ref, onMounted, onUnmounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { io } from 'socket.io-client'
import { useUserStore, useMessageStore } from '@/stores'

export default () => {
  const addMessage = ref(null)
  provide('addMessage', addMessage)

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
      console.log('新增notify_message', msg)
      if (messageStore.notifyList) {
        messageStore.notifyList[msg.data.type].last_message = msg.data
        messageStore.notifyList[msg.data.type].unReadCount++
      }
      messageStore.unreadCountTotal !== -1 && messageStore.unreadCountTotal++
    })
    // 接收消息 新增chat
    socket.value.on('chat', (msg) => {
      console.log('新增chat', msg)
      // 更新数据
      // 对话列表项
      if (messageStore.notifyList) {
        messageStore.chatList.unshift(msg.data)
      }
    })
    // 接收消息 新增chat message
    socket.value.on('chat_message', (msg) => {
      console.log('新增chat message', msg)
      // 更新数据
      // 对话列表项
      if (messageStore.notifyList) {
        // 找到匹配对话的索引
        const chatIndex = messageStore.chatList.findIndex((item) => item._id === msg.data.related_entity)
        console.log(chatIndex)
        if (chatIndex !== -1) {
          // 将匹配对话移动到首位
          if (chatIndex !== 0) {
            let [chat] = messageStore.chatList.splice(chatIndex, 1)
            messageStore.chatList.unshift(chat)
          }
          // 修改字段值
          messageStore.chatList[0].last_message = msg.data
          messageStore.chatList[0].unread_count++
        }
      }
      // 总未读数
      messageStore.unreadCountTotal !== -1 && messageStore.unreadCountTotal++

      // 如果在对话页面
      console.log(route.name === 'conversationdetail')
      if (route.name === 'conversationdetail' && route.params.conversationId === msg.data.related_entity) {
        addMessage.value(msg.data)
      }
    })
  })

  // 发送消息(未使用)
  // msgType: chat-新增对话 chat_message-新增对话消息
  const sendMessageBySocket = (msgType, senderId, receiverId, msg) => {
    if (socket.value) {
      socket.value.emit(msgType, { senderId, receiverId, msg })
    }
  }

  onUnmounted(() => {
    if (socket.value) {
      // 断开连接(主动)
      socket.value.disconnect()
    }
  })

  return { sendMessageBySocket }
}
