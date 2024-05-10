<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores'
import { getChatDetailApi } from '@/api'
import { formatMessageTime } from '@/utils'
import NavBar from '@/components/NavBar.vue'

const props = defineProps({
  conversationId: {
    type: String,
    required: true,
  },
})

const userStore = useUserStore()

const interlocutor = ref({})
const messageList = ref([])
const getChatDetail = async () => {
  const res = await getChatDetailApi(userStore.userInfo._id, props.conversationId)
  console.log(res)
  interlocutor.value = res.data.interlocutor
  messageList.value = addMessageTime(res.data.messages)
  console.log(messageList.value)
}
const addMessageTime = (messageList) => {
  const threshold = 5 * 60 * 1000
  const messagesWithTime = []
  for (let i = 0; i < messageList.length; i++) {
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
onMounted(() => {
  getChatDetail()
})

const sendMessage = ref('')
</script>
<template>
  <NavBar :title="interlocutor.user_nickname || ''" />
  <div class="message-list">
    <ul>
      <li v-for="item in messageList" :key="item._id">
        <div class="time-label" v-if="item.isTimeLabel">{{ formatMessageTime(item.time) }}</div>
        <div
          class="message-item"
          :class="{ 'send-itself': item.sender._id === userStore.userInfo._id }"
          v-else
        >
          <div class="user-avatar">
            <van-image round fit="cover" position="center" :src="item.sender.user_avatar" />
          </div>
          <span class="message-content">{{ item.content }}</span>
        </div>
      </li>
    </ul>
  </div>
  <div class="bottom-send">
    <van-field v-model="sendMessage" rows="1" autosize type="textarea" placeholder="发消息..." />
  </div>
</template>

<style lang="less" scoped>
.message-list {
  height: calc(100vh - 200px);
  overflow: hidden;
}
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
.bottom-send {
  position: absolute;
  bottom: 0;
  border: 1px solid #000;
  // min-height: 100px;
  width: 100%;
}
</style>
