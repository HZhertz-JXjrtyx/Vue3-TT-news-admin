<script setup>
defineProps({
  commentReply: {
    type: Array,
    required: true,
  },
  replyCount: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="comment-reply">
    <div class="list">
      <div class="item" v-for="item in commentReply" :key="item._id">
        <span class="user-name">{{ item.user_info.user_nickname }}:</span>
        <span class="reply-user" v-if="username !== item.reply_user_nickname">
          回复
          <span class="reply-user-name">{{ item.reply_user_nickname }} </span>:
        </span>
        <span>{{ item.content }}</span>
      </div>
    </div>
    <div class="bottom">共{{ replyCount }}条回复</div>
  </div>
</template>

<style lang="less" scoped>
.comment-reply {
  width: 600px;
  max-height: 320px;
  padding: 10px;
  background-color: var(--bg-color-3);
  border-radius: 10px;
  .list {
    .item {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      line-height: 1.6;
      .user-name,
      .reply-user-name {
        color: var(--main-color-blue-2);
      }
    }
  }
  .bottom {
    margin: 5px 0;
    font-size: 20px;
    color: var(--main-color-blue-2);
  }
}
</style>
