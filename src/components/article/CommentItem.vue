<script setup>
import { computed } from 'vue'
import { useCommentStore } from '@/stores'
import { formatCount, convertToMMDDHHmm } from '@/utils/convert'
import CommentReply from './CommentReply.vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const isShowCommentReply = computed(() => {
  return props.comment.replies.length !== 0
})

// 回复评论
const commentStore = useCommentStore()

const handleReplyCommentClick = () => {
  commentStore.textareaPlaceholder = `回复 ${props.comment.user_info.user_nickname}:`
  commentStore.isShowTextarea = true
  commentStore.typeParam = 3
  commentStore.sourceidParam = props.comment.comment_id
  commentStore.replyUseridParam = props.comment.user_info.user_id
}
</script>

<template>
  <div class="comment-item">
    <div class="user-info">
      <div class="avatar">
        <van-image width="50px" height="50px" round lazy-load :src="comment.user_info.user_avatar" />
      </div>
      <div class="info">
        <div class="name">
          {{ comment.user_info.user_nickname }}
        </div>
        <div class="pub-time">{{ convertToMMDDHHmm(comment.publish_time) }}</div>
      </div>
    </div>

    <div class="content" @click="handleReplyCommentClick">{{ comment.content }}</div>
    <div class="operation">
      <div class="like-count">
        <span class="iconfont icon-a-44tubiao-21"></span>
        <span class="count">{{ formatCount(comment.like_count) }}</span>
      </div>

      <span class="iconfont icon-fenxiang"></span>
      <span class="iconfont icon-a-44tubiao-112" @click="handleReplyCommentClick"></span>
    </div>
    <div class="comment_reply" v-if="isShowCommentReply">
      <CommentReply :commentReply="comment.replies" :userid="comment.user_info.user_id" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.comment-item {
  .user-info {
    display: flex;
    margin: 15px;
    height: 70px;
    .avatar {
      margin-right: 15px;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .name {
        color: var(--main-color-red-3);
      }
      .pub-time {
        font-size: 24px;
        color: var(--text-color-2);
      }
    }
  }
  .content {
    width: 720px;
    max-height: 280px;
    padding-left: 100px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    overflow: hidden;
    line-height: 1.6;
  }
  .operation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    padding-left: 100px;
    width: 300px;
    .like-count {
      .count {
        font-size: 26px;
      }
    }
  }
  .comment_reply {
    padding-left: 100px;
  }
}
:deep(.van-image.van-image--round) {
  width: 70px !important;
  height: 70px !important;
}
</style>
