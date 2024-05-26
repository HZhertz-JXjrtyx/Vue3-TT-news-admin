<script setup>
import { ref, computed, onMounted } from 'vue'
import { debounce } from 'lodash'
import { showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'
import { useCommentStore, useUserStore } from '@/stores'
import { likeCommentApi, deleteCommentApi } from '@/api'
import { formatCount, formatTimeAccurately } from '@/utils'
import CommentReply from './CommentReply.vue'

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})

const userStore = useUserStore()
const commentStore = useCommentStore()

// 展开折叠
const contentRef = ref(null)
// 内容是否被展开
const isOpen = ref(false)
// 内容是否溢出
const isOverflow = ref(false)
const contentSty = computed(() => {
  const sty = {}
  if (isOpen.value) {
    sty['max-height'] = 'none'
    sty['display'] = 'block'
  }
  return sty
})
onMounted(() => {
  isOverflow.value = contentRef.value.scrollHeight > contentRef.value.clientHeight
})

// 是否显示回复区域
const isShowCommentReply = computed(() => {
  return props.comment.replies?.length !== 0
})

// 点赞评论
const LikeComment = async () => {
  await likeCommentApi(props.comment._id, props.comment.is_like)
}
const debouncedLikeComment = debounce(LikeComment, 500)
const handleLikeCommentClick = () => {
  if (commentStore.isShowCommentDetail) {
    const likeIndex = commentStore.commentReplyList.findIndex((item) => {
      return item._id === props.comment._id
    })
    commentStore.commentReplyList[likeIndex].is_like = !commentStore.commentReplyList[likeIndex].is_like
    commentStore.commentReplyList[likeIndex].is_like && commentStore.commentReplyList[likeIndex].like_count++
    !commentStore.commentReplyList[likeIndex].is_like && commentStore.commentReplyList[likeIndex].like_count--
  } else {
    const likeIndex = commentStore.commentList.findIndex((item) => {
      return item._id === props.comment._id
    })
    commentStore.commentList[likeIndex].is_like = !commentStore.commentList[likeIndex].is_like
    commentStore.commentList[likeIndex].is_like && commentStore.commentList[likeIndex].like_count++
    !commentStore.commentList[likeIndex].is_like && commentStore.commentList[likeIndex].like_count--
  }
  debouncedLikeComment()
}

// 回复评论
const handleReplyCommentClick = () => {
  commentStore.textareaPlaceholder = `回复 ${props.comment.user_info.user_nickname}:`
  commentStore.isShowTextarea = true
  if ([1, 2].includes(props.comment.comment_type)) {
    commentStore.commentType = 3
    commentStore.replyUser = props.comment.user_info._id
    commentStore.parentComment = props.comment._id
    commentStore.relatedId = props.comment._id
  } else {
    commentStore.commentType = 4
    commentStore.replyUser = props.comment.user_info._id
  }
}

// 删除评论
const isShowDelIcon = computed(() => {
  return userStore.userInfo.user_id === props.comment.user_info.user_id
})
const handleDelCommentClick = () => {
  showConfirmDialog({
    title: '确认删除吗？',
  })
    .then(async () => {
      const res = await deleteCommentApi(
        props.comment._id,
        props.comment.comment_type,
        props.comment.related_entity
      )
      console.log(res)
      if (res.status === 200) {
        commentStore.commentCount--
        if (!commentStore.isShowCommentDetail) {
          commentStore.commentList = commentStore.commentList.filter((item) => {
            return item._id !== props.comment._id
          })
        } else {
          commentStore.commentReplyList = commentStore.commentReplyList.filter((item) => {
            return item._id !== props.comment._id
          })
        }
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

const showCommentDetail = () => {
  commentStore.isShowCommentDetail = true
  commentStore.commentDetailId = props.comment._id
  commentStore.commentType = 3
}
</script>

<template>
  <div class="comment-item">
    <div class="user-info">
      <div class="avatar">
        <van-image width="50px" height="50px" round lazy-load :src="comment.user_info.user_avatar" />
      </div>
      <div class="info">
        <div class="name-reply">
          <span class="name">
            {{ comment.user_info.user_nickname }}
          </span>
          <div class="reply" v-if="comment.comment_type === 4">
            <span class="reply_user">
              &nbsp;回复&nbsp;
              <span class="reply-user-name">{{ comment.reply_user.user_nickname }}</span
              >&#xFF1A;
            </span>
          </div>
        </div>

        <div class="pub-time">{{ formatTimeAccurately(comment.created_time) }}</div>
      </div>
    </div>

    <div ref="contentRef" class="content" v-login="handleReplyCommentClick" :style="contentSty">
      {{ comment.content }}
    </div>
    <div v-if="isOverflow" class="open" @click="isOpen = !isOpen">
      {{ isOpen ? '收起' : '展开' }}
    </div>
    <div class="operation">
      <div class="base">
        <div class="like-count">
          <span
            class="iconfont"
            :class="comment.is_like ? 'icon-like_fill' : 'icon-like'"
            v-login="handleLikeCommentClick"
          ></span>
          <span class="count" v-if="comment.like_count > 0">{{ formatCount(comment.like_count) }}</span>
        </div>
        <span class="iconfont icon-share"></span>
        <span class="iconfont icon-message" v-login="handleReplyCommentClick"></span>
      </div>
      <div class="del" v-if="isShowDelIcon">
        <span class="iconfont icon-delete" @click="handleDelCommentClick"></span>
      </div>
    </div>

    <div
      class="comment_reply"
      v-if="isShowCommentReply && [1, 2].includes(comment.comment_type)"
      @click="showCommentDetail"
    >
      <CommentReply :commentReply="comment.replies" :replyCount="comment.reply_count" />
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
      .name-reply {
        display: flex;
      }
      .name {
        color: var(--main-color-red-3);
      }
      .reply {
        .reply-user-name {
          color: var(--main-color-blue-2);
        }
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
    padding-right: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 6;
    overflow: hidden;
    line-height: 1.6;
    word-wrap: break-word;
  }
  .open {
    padding-left: 100px;
    font-size: 25px;
    color: var(--main-color-blue-2);
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
