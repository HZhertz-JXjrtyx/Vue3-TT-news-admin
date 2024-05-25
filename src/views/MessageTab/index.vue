<script setup>
import { watchEffect, onMounted, onActivated, onDeactivated } from 'vue'
import { useUserStore, useMessageStore } from '@/stores'
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
  <div class="tab-title">消息私信</div>
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
    <ConversationList v-if="userStore.token" />
    <div class="no-login" v-else>
      <div class="no-login__text">登录后查看更多~</div>
      <van-button color="#f04142" to="/user/login">登录</van-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tab-title {
  position: fixed;
  top: 0;
  z-index: 2024;
  width: 100%;
  height: 100px;

  font-size: 34px;
  text-align: center;
  line-height: 100px;
  background-color: #fff;
  border-bottom: 1px solid #eeeeee;
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
