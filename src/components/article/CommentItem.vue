<script setup>
import { computed, ref, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
let commentUserId
if (props.comment.type === 3) {
  commentUserId = inject('commentUserId')
}

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
// watch(isOpen, (newValue) => {
//   if (newValue) {
//     isOverflow.value = false
//   } else {
//     isOverflow.value = contentRef.value.scrollHeight > contentRef.value.clientHeight
//   }
// })

// 是否显示回复区域
const isShowCommentReply = computed(() => {
  return props.comment.replies?.length !== 0
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
// const commentCount = commentStore.commentCount
// const commentCount = inject('commentCount')
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
        commentStore.commentCount--
        emit('updCommentlist', props.comment.comment_id)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

//  跳转评论详情
const router = useRouter()
const goToCommentDetail = () => {
  router.push({
    name: 'commentdetail',
    params: {
      commentId: props.comment.comment_id,
    },
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
        <div class="name-reply">
          <span class="name">
            {{ comment.user_info.user_nickname }}
          </span>
          <div class="reply" v-if="comment.type === 3 && commentUserId !== comment.reply_user">
            <span class="reply_user">
              回复
              <span class="reply-user-name">{{ comment.reply_user_nickname }} </span>:
            </span>
          </div>
        </div>

        <div class="pub-time">{{ convertToMMDDHHmm(comment.publish_time) }}</div>
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

    <div class="comment_reply" v-if="isShowCommentReply && comment.type !== 3" @click="goToCommentDetail">
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
      .name-reply {
        display: flex;
      }
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
