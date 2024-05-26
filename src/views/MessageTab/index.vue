<script setup>
import { ref, watchEffect, onMounted, onActivated, onDeactivated } from 'vue'
import { showConfirmDialog } from 'vant'
import { useUserStore, useMessageStore } from '@/stores'
import { clearUnreadApi } from '@/api'
import ConversationList from './components/ConversationList.vue'

const userStore = useUserStore()
const messageStore = useMessageStore()

watchEffect(() => {
  if (userStore.token) {
    console.log('token change')
    messageStore.getNotifyList()
  } else {
    messageStore.initialize()
  }
})

const conversationListRef = ref(null)

const loading = ref(false)
const onRefresh = async () => {
  messageStore.initialize()
  await messageStore.getNotifyList()
  await messageStore.getTotalUnreadCount()
  conversationListRef.value.pre = ''
  conversationListRef.value.loading = false
  conversationListRef.value.hasMore = true
  conversationListRef.value.finished = false
  await conversationListRef.value.onLoad()
  loading.value = false
}

const handleClearAll = () => {
  messageStore.unreadCountTotal > 0 &&
    showConfirmDialog({
      title: '确定清除所有未读消息吗？',
    })
      .then(async () => {
        // 发起删除请求
        const res = await clearUnreadApi('all')
        console.log(res)
        if (res.status === 200) {
          // 前端更新
          for (let key in messageStore.notifyList) {
            messageStore.notifyList[key].unReadCount = 0
          }
          messageStore.chatList.forEach((item) => {
            item.unread_count = 0
          })
          messageStore.unreadCountTotal = 0
        }
      })
      .catch()
}

onMounted(() => {
  console.log('MessageTab onMounted')
})

onActivated(() => {
  console.log('MessageTab被重新激活')
})

onDeactivated(() => {
  console.log('MessageTab被缓存')
})
</script>

<template>
  <div class="nav-bar">
    <span class="tab-title">消息私信</span>
    <i class="clear-icon">
      <span class="iconfont icon-clear" @click="handleClearAll"></span>
    </i>
  </div>

  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <template #loading>
      <img class="loading-gif-1" src="@/assets/image/loading1.gif" />
    </template>
    <div class="message-container">
      <div class="inform">
        <van-cell
          is-link
          :to="{
            name: 'noticedetail',
            params: {
              noticeType: 'comment',
            },
          }"
        >
          <template #icon>
            <div class="inform-icon" :style="{ backgroundColor: '#00b2fd' }">
              <img src="@/assets/image/comment_icon.png" alt="" />
            </div>
          </template>
          <template #title>
            <div class="inform-content">
              <span class="content__type-text">评论</span>
              <span class="content__latest-word" v-if="messageStore.commentNotify">{{
                messageStore.commentNotify
              }}</span>
            </div>
          </template>
          <template #value>
            <div class="inform-badge">
              <van-badge
                v-if="messageStore.notifyList?.comment?.unReadCount > 0"
                :content="messageStore.notifyList.comment.unReadCount"
                max="99"
              />
            </div>
          </template>
        </van-cell>
        <van-cell
          is-link
          :to="{
            name: 'noticedetail',
            params: {
              noticeType: 'like',
            },
          }"
        >
          <template #icon>
            <div class="inform-icon" :style="{ backgroundColor: '#ff676c' }">
              <img src="@/assets/image/like_icon.png" alt="" />
            </div>
          </template>
          <template #title>
            <div class="inform-content">
              <span class="content__type-text">点赞</span>
              <span class="content__latest-word" v-if="messageStore.likeNotify">{{
                messageStore.likeNotify
              }}</span>
            </div>
          </template>
          <template #value>
            <div class="inform-badge">
              <van-badge
                v-if="messageStore.notifyList?.like?.unReadCount > 0"
                :content="messageStore.notifyList.like.unReadCount"
                max="99"
              />
            </div>
          </template>
        </van-cell>
        <van-cell
          is-link
          :to="{
            name: 'noticedetail',
            params: {
              noticeType: 'follow',
            },
          }"
        >
          <template #icon>
            <div class="inform-icon" :style="{ backgroundColor: '#ff7f21' }">
              <img src="@/assets/image/fans_icon.png" alt="" />
            </div>
          </template>
          <template #title>
            <div class="inform-content">
              <span class="content__type-text">粉丝</span>
              <span class="content__latest-word" v-if="messageStore.followNotify">{{
                messageStore.followNotify
              }}</span>
            </div>
          </template>
          <template #value>
            <div class="inform-badge">
              <van-badge
                v-if="messageStore.notifyList?.follow?.unReadCount > 0"
                :content="messageStore.notifyList.follow.unReadCount"
                max="99"
              />
            </div>
          </template>
        </van-cell>
      </div>
      <ConversationList v-if="userStore.token" ref="conversationListRef" />
      <div class="no-login" v-else>
        <div class="no-login__text">登录后查看更多~</div>
        <van-button color="#f04142" to="/user/login">登录</van-button>
      </div>
    </div>
  </van-pull-refresh>
</template>

<style lang="less" scoped>
.nav-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 2024;
  width: 100%;
  height: 100px;

  background-color: #fff;
  border-bottom: 1px solid #eeeeee;
  .tab-title {
    font-size: 34px;
  }
  .clear-icon {
    // position: relative;
    display: inline-block;
    width: 45px;
    height: 45px;
    margin: 0 20px;
    border: 1px solid #939393;
    border-radius: 50%;
    background-color: #f3f3f3;
    .icon-clear {
      // position: absolute;
      // top: 1px;
      line-height: 45px;
      margin-left: 2px;
    }
  }
}

.message-container {
  margin: 100px 0;
}
.inform {
  border-bottom: 8px solid #f0f0f0;
  .inform-icon {
    background-color: blue;
    width: 100px;
    height: 100px;
    margin-right: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 60%;
    }
  }
  .inform-badge {
    position: relative;
    .van-badge {
      position: absolute;
      top: 70px;
      right: 28px;
    }
  }
  :deep(.van-cell__right-icon) {
    line-height: 100px;
  }
}

.inform-content {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.content__type-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 440px;
  font-size: 30px;
  font-weight: bolder;
}
.content__latest-word {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 440px;
  font-size: 26px;
  color: #686868;
}

.conversation-list {
  min-height: 1000px;
}

.no-login {
  text-align: center;
  .no-login__text {
    margin: 30px 0;
  }
  .van-button {
    width: 200px;
    height: 80px;
  }
}
</style>
