<script setup>
import { computed, ref, inject } from 'vue'
import { debounce } from 'lodash'
import { showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'
import { useCommentStore, useUserStore } from '@/stores'
import { likeCommentApi, deleteCommentApi } from '@/api'
import { formatCount, convertToMMDDHHmm } from '@/utils/convert'
import CommentReply from './CommentReply.vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['updCommentlist'])

const isShowCommentReply = computed(() => {
  return props.comment.replies.length !== 0
})

// 点赞评论
const isLikeComment = ref(props.comment.is_like)
const likeCount = ref(props.comment.like_count)
const LikeComment = async () => {
  await likeCommentApi(props.comment.comment_id, isLikeComment.value)
}
const debouncedLikeComment = debounce(LikeComment, 500)
const handleLikeCommentClick = () => {
  isLikeComment.value ? likeCount.value-- : likeCount.value++
  isLikeComment.value = !isLikeComment.value
  debouncedLikeComment()
}

// 回复评论
const commentStore = useCommentStore()

const handleReplyCommentClick = () => {
  commentStore.textareaPlaceholder = `回复 ${props.comment.user_info.user_nickname}:`
  commentStore.isShowTextarea = true
  commentStore.typeParam = 3
  commentStore.sourceidParam = props.comment.comment_id
  commentStore.replyUseridParam = props.comment.user_info.user_id
}

// 删除评论
const userStore = useUserStore()
const commentCount = inject('commentCount')
const isShowDelIcon = computed(() => {
  return userStore.userInfo.user_id === props.comment.user_info.user_id
})
const handleDelCommentClick = () => {
  showConfirmDialog({
    title: '确认删除吗？',
  })
    .then(async () => {
      const res = await deleteCommentApi(
        props.comment.comment_id,
        props.comment.type,
        props.comment.source_id
      )
      console.log(res)
      if (res.status === 200) {
        commentCount.value--
        emit('updCommentlist', props.comment.comment_id)
      }
    })
    .catch(() => {
      console.log('取消')
    })
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

    <div class="content" v-login="handleReplyCommentClick">{{ comment.content }}</div>
    <div class="operation">
      <div class="base">
        <div class="like-count">
          <span
            class="iconfont"
            :class="isLikeComment ? 'icon-a-44tubiao-188' : 'icon-a-44tubiao-21'"
            v-login="handleLikeCommentClick"
          ></span>
          <span class="count">{{ formatCount(likeCount) }}</span>
        </div>
        <span class="iconfont icon-fenxiang"></span>
        <span class="iconfont icon-a-44tubiao-112" v-login="handleReplyCommentClick"></span>
      </div>
      <div class="del" v-if="isShowDelIcon">
        <span class="iconfont icon-a-44tubiao-46" @click="handleDelCommentClick"></span>
      </div>
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
    // justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    padding-left: 100px;

    .base {
      display: flex;
      justify-content: space-between;
      width: 200px;
      .like-count {
        .count {
          font-size: 26px;
        }
      }
    }
    .del {
      margin-left: 40px;
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
