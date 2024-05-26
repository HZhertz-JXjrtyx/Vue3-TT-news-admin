<script setup>
import { ref, onMounted } from 'vue'
import { showConfirmDialog } from 'vant'
import { useMessageStore } from '@/stores'
import { deleteChatApi } from '@/api'
import { formatTimeRoughly } from '@/utils'

const messageStore = useMessageStore()

const pre = ref('')
const pageSize = ref(10)

const loading = ref(false)
const hasMore = ref(true)
const finished = ref(false)

const onLoad = async () => {
  // console.log('hasMore.value', hasMore.value)
  console.log()
  if (hasMore.value) {
    loading.value = true
    const result = await messageStore.getChatList(pre.value, pageSize.value)
    pre.value = messageStore.chatList.at(-1)?._id || ''

    hasMore.value = !result
    loading.value = false
  } else {
    finished.value = true
  }
}

onMounted(() => {
  onLoad()
})

const beforeClose = ({ position }, conversationId) => {
  // console.log(conversationId)
  switch (position) {
    case 'left':
    case 'cell':
    case 'outside':
      return true
    case 'right':
      return new Promise((resolve) => {
        showConfirmDialog({
          title: '确定删除吗？此操作将清空对话',
        })
          .then(async () => {
            // 发起删除请求
            const res = await deleteChatApi(conversationId)
            console.log(res)
            if (res.status === 200) {
              messageStore.chatList = messageStore.chatList.filter((c) => {
                return c._id !== conversationId
              })
              messageStore.unreadCountTotal -= res.clearCount
              resolve(true)
            } else {
              resolve(false)
            }
          })
          .catch(() => resolve(false))
      })
  }
}
</script>

<template>
  <div class="conversation-list">
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
      <van-swipe-cell
        right-width="40"
        v-for="item in messageStore.chatList"
        :key="item._id"
        :before-close="(args) => beforeClose(args, item._id)"
      >
        <router-link
          class="conversation"
          :to="{
            name: 'conversationdetail',
            params: {
              conversationId: item._id,
            },
          }"
        >
          <div class="conversation-left">
            <div class="left__user-avatar">
              <van-image round fit="cover" position="center" :src="item.interlocutor.user_avatar" />
            </div>
          </div>
          <div class="conversation-center">
            <span class="center__user-nickname">{{ item.interlocutor.user_nickname }}</span>
            <span class="center__latest-word">{{ item.last_message?.content }}</span>
          </div>
          <div class="conversation-right">
            <span class="right__latest-time">{{ formatTimeRoughly(item.last_message?.created_at) }}</span>
            <span class="right__badge">
              <van-badge v-if="item.unread_count > 0" :content="item.unread_count" max="99" />
            </span>
          </div>
        </router-link>
        <template #right>
          <van-button square type="danger" text="删除" />
        </template>
      </van-swipe-cell>
    </van-list>
  </div>
</template>

<style lang="less" scoped>
.conversation {
  display: flex;
  padding: 20px 30px;
  border-bottom: 1px solid #efefef;
  .conversation-left {
    .left__user-avatar {
      width: 100px;
      height: 100px;
      margin-right: 30px;
      .van-image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .conversation-center {
    flex: 1;
  }
  .conversation-right {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    width: 120px;
    text-align: right;
    .right__latest-time {
      font-size: 24px;
      color: #a8a8a8;
    }
    .right__badge {
      position: relative;
      height: 40px;
      .van-badge {
        position: absolute;
        top: 20px;
        right: 28px;
      }
    }
  }
}

.van-swipe-cell__right {
  width: 100px;
  text-align: center;
  .van-button {
    height: 100%;
    width: 100px;
    padding: 0 30px 0 12px;
  }
}

.conversation-center {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.center__user-nickname {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 440px;
  font-size: 30px;
  font-weight: bolder;
}

.center__latest-word {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 440px;
  font-size: 26px;
  color: #686868;
}
</style>
