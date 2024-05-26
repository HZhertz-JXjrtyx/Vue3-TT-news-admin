<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, inject } from 'vue'
import { useUserStore, useMessageStore } from '@/stores'
import { getChatDetailApi, sendChatMessageApi, clearUnreadApi } from '@/api'
import { formatTimeAccurately } from '@/utils'
import NavBar from '@/components/NavBar.vue'

const props = defineProps({
  conversationId: {
    type: String,
    required: true,
  },
})

const userStore = useUserStore()
const messageStore = useMessageStore()

const interlocutor = ref({})
const messageList = ref([])
const getChatDetail = async () => {
  const res = await getChatDetailApi(props.conversationId)
  console.log(res)
  interlocutor.value = res.data.interlocutor
  messageList.value = insertTimeToList(res.data.messages)
  console.log(messageList.value)
}
const insertTimeToList = (messageList) => {
  const threshold = 5 * 60 * 1000
  const messagesWithTime = []
  for (let i = 0; i < messageList.length; i++) {
    i === 0 &&
      messagesWithTime.push({
        isTimeLabel: true,
        time: messageList[0].created_at,
      })
    messagesWithTime.push(messageList[i])
    if (i < messageList.length - 1) {
      const currentMessageTime = messageList[i].created_at
      const nextMessageTime = messageList[i + 1].created_at

      if (nextMessageTime - currentMessageTime > threshold) {
        messagesWithTime.push({
          isTimeLabel: true,
          time: messageList[i + 1].created_at,
        })
      }
    }
  }
  return messagesWithTime
}

let resizeObserver = null
onMounted(async () => {
  await getChatDetail()
  nextTick(() => {
    scrollToBottom()
  })
  // 创建一个新的 ResizeObserver 实例来监听 .message-list 的高度变化
  resizeObserver = new ResizeObserver(() => {
    // 当 .message-list 的高度变化时，滚动消息列表到底部
    scrollToBottom()
  })
  // 开始观察 .message-list
  resizeObserver.observe(messageListRef.value)
})

onUnmounted(async () => {
  // 前端更新
  messageStore.clearChatUnread(props.conversationId)
  // 后端更新
  await clearUnreadApi('chat', props.conversationId)

  // 停止观察 .message-list
  if (resizeObserver && messageListRef.value) {
    resizeObserver.unobserve(messageListRef.value)
  }

  pushMessageToList.value = null
})

const messageListRef = ref(null)
const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

const pushMessageToList = inject('pushMessageToList')
const insertTimeOnPush = (message) => {
  if (
    messageList.value.length === 0 ||
    (messageList.value.length !== 0 &&
      message.created_at - messageList.value.at(-1).created_at > 5 * 60 * 1000)
  ) {
    messageList.value.push({
      isTimeLabel: true,
      time: message.created_at,
    })
  }
}
pushMessageToList.value = (newMessage) => {
  console.log('pushMessageToList调用', newMessage)
  insertTimeOnPush(newMessage)
  messageList.value.push(newMessage)
  nextTick(() => {
    scrollToBottom()
  })
}

const sendMessage = ref('')
const isSendDisabled = computed(() => {
  return sendMessage.value === ''
})
const handleSend = async () => {
  const res = await sendChatMessageApi(interlocutor.value._id, props.conversationId, sendMessage.value)
  console.log(res)
  if (res.status === 200) {
    sendMessage.value = ''
    // 消息列表更新
    pushMessageToList.value(res.data)
    // 对话列表更新
    messageStore.notifyList &&
      messageStore.upChat({
        _id: res.data.related_entity,
        interlocutor: res.data.receiver,
        last_message: res.data,
        unread_count: 0,
      })
  }
}
</script>
<template>
  <NavBar :title="interlocutor.user_nickname || ''" />
  <div class="container">
    <div class="message-list" ref="messageListRef">
      <ul>
        <li v-for="item in messageList" :key="item._id">
          <div class="time-label" v-if="item.isTimeLabel">{{ formatTimeAccurately(item.time) }}</div>
          <div
            class="message-item"
            :class="{ 'send-itself': item.sender._id === userStore.userInfo._id }"
            v-else
          >
            <div class="user-avatar">
              <van-image round fit="cover" position="center" :src="item.sender.user_avatar" />
            </div>
            <span class="message-content">{{ item.content.split(' ').join('&nbsp;') }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom-send">
      <van-field
        v-model="sendMessage"
        rows="1"
        autosize
        type="textarea"
        maxlength="300"
        placeholder="发消息..."
      />
      <span class="iconfont icon-image"></span>
      <span class="send-icon" :class="{ 'send-icon-disabled': isSendDisabled }" @click="handleSend">
        发送
      </span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
}

.message-list {
  flex: 1;
  overflow: auto;
  margin-top: 20px;
  .time-label {
    text-align: center;
    font-size: 22px;
    color: #909090;
  }
  .message-item {
    display: flex;
    margin: 20px;
    .user-avatar {
      width: 80px;
      height: 80px;
      .van-image {
        width: 100%;
        height: 100%;
        border: 1px solid #f3f3f3;
      }
    }
    .message-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 70%;
      margin: 0 15px;
      padding: 15px;
      line-height: 1.5;
      word-wrap: break-word;
      border-radius: 10px;
      background-color: #eaeaea;
    }
  }
  .send-itself {
    flex-direction: row-reverse;
  }
}

.bottom-send {
  display: flex;
  align-items: flex-end;
  background-color: #ffffff;
  border-top: 1px solid #e8e8e8;
  width: 100%;
  .van-field {
    background-color: #f3f3f3;
    border-radius: 10px;
    padding: 10px 20px;
    margin: 10px;
    // width: 200px;
    :deep(.van-field__control) {
      max-height: 126px;
      line-height: 1.5;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .iconfont {
    font-size: 40px;
    margin: 20px;
  }
  .send-icon {
    width: 120px;
    margin: 20px;
    font-size: 34px;
    color: rgb(91, 157, 255);
  }
  .send-icon-disabled {
    pointer-events: none;
    color: #9191917f;
  }
}
</style>
