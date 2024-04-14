<script setup>
defineProps({
  commentReply: {
    type: Array,
    required: true,
  },

  userid: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="comment-reply">
    <div class="list">
      <span class="item" v-for="item in commentReply" :key="item._id">
        <span class="user-name">{{ item.user_info.user_nickname }}&#xFF1A;</span>
        <span class="reply-user" v-if="userid !== item.reply_user">
          回复
          <span class="reply-user-name">{{ item.reply_user_nickname }}&#xFF1A;</span>：
        </span>
        <span>{{ item.content }}</span>
      </span>
    </div>
    <div class="bottom" v-if="commentReply.length > 3">共{{ commentReply.length }}条回复</div>
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
      overflow-wrap: break-word;
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
