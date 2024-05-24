import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useUserStore } from '@/stores'

export default () => {
  const userStore = useUserStore()
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
      console.log('新增chat message', msg)
    })
    // 接收消息 新增chat
    socket.value.on('chat', (msg) => {
      console.log('新增chat', msg)
    })
    // 接收消息 新增chat message
    socket.value.on('chat_message', (msg) => {
      console.log('新增chat message', msg)
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
