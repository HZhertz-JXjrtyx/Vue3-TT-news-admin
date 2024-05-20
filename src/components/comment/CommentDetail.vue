<script setup>
import { ref, computed, watch, watchEffect, nextTick } from 'vue'
import { debounce } from 'lodash'
import { useCommentStore } from '@/stores'
import { getCommentDetailApi, likeCommentApi } from '@/api'
import UserInfo from '@/components/user/UserInfo.vue'
import UserInfoSkt from '@/components/user/UserInfoSkt.vue'
import CommentList from '@/components/comment/CommentList.vue'
import CommentBar from '@/components/CommentBar.vue'

const commentStore = useCommentStore()

const isLikeComment = computed(() => {
  const likeIndex = commentStore.commentList.findIndex((item) => {
    return item._id === commentStore.commentDetailId
  })
  return commentStore.commentList[likeIndex].is_like
})

/* 获取评论详情 */
const commentDetail = ref({})
const isLoading = ref(true)
const getCommentDetail = async () => {
  const res = await getCommentDetailApi(commentStore.commentDetailId)
  console.log(res)
  commentDetail.value = res.data
  // isLikeComment.value = res.data.is_like
  isLoading.value = false
}
watchEffect(async () => {
  await getCommentDetail()
  commentStore.replyCount = commentDetail.value.reply_count
  commentStore.commentType = 3
  commentStore.parentComment = commentDetail.value._id
  commentStore.relatedId = commentDetail.value._id
})

const commentListRef = ref(null)
watch(
  () => commentStore.commentDetailId,
  () => {
    commentStore.commentReplyList = []
    commentListRef.value.page = 1
    // CommentList不会立刻重新渲染
    nextTick(() => {
      commentListRef.value.getCommentList()
    })
  }
)

/* 点赞 */
const likeComment = async () => {
  await likeCommentApi(commentDetail.value._id, isLikeComment.value)
}
const debouncedLikeComment = debounce(likeComment, 500)
const handleClickLike = () => {
  const likeIndex = commentStore.commentList.findIndex((item) => {
    return item._id === commentStore.commentDetailId
  })
  commentStore.commentList[likeIndex].is_like = !commentStore.commentList[likeIndex].is_like
  isLikeComment.value && commentStore.commentList[likeIndex].like_count++
  !isLikeComment.value && commentStore.commentList[likeIndex].like_count--
  debouncedLikeComment()
}
</script>

<template>
  <div class="comment-page">
    <van-sticky>
      <van-nav-bar title="评论回复" class="app-nav-bar">
        <template #left>
          <span
            class="iconfont icon-arrow_left"
            @click="
              () => {
                commentStore.isShowCommentDetail = false
              }
            "
          ></span>
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="detail">
      <UserInfo
        v-if="!isLoading"
        :userInfo="commentDetail.user_info"
        :publishTime="commentDetail.created_time"
      ></UserInfo>
      <UserInfoSkt v-if="isLoading" />
      <div class="content">{{ commentDetail.content }}</div>
    </div>
    <div class="divider"></div>
    <div class="reply">
      <div class="reply-header">
        <div class="title">评论回复 {{ commentStore.replyCount }}</div>
      </div>
      <CommentList ref="commentListRef" :commentType="3" :relatedId="commentStore.commentDetailId" />
    </div>
    <CommentBar
      v-if="!isLoading"
      :commentType="3"
      :relatedId="commentStore.commentDetailId"
      :replyUser="commentDetail.user_info._id"
      :replyName="commentDetail.user_info.user_nickname"
      :isLike="isLikeComment"
      @clickLike="handleClickLike"
    />
  </div>
</template>

<style lang="less" scoped>
.app-nav-bar {
  background-color: #fff;
  border-bottom: 1px solid #d6d6d6;

  :deep(.van-nav-bar__title) {
    color: #000000;
  }
}
.comment-page {
  .detail {
    margin: 20px;
    .content {
      padding: 10px;
      font-size: 30px;
      line-height: 1.6;
      word-wrap: break-word;
    }
  }
  .divider {
    width: 750px;
    height: 12px;
    margin: 0;
    background-color: var(--bg-color-3);
  }
  .reply {
    margin: 20px 20px 200px 20px;
    .reply-header {
      border-bottom: 1px solid var(--bg-color-3);

      .title {
        display: inline-block;

        height: 60px;
        color: var(--main-color-red-1);
        border-bottom: 2px solid var(--main-color-red-1);
      }
    }
  }
}
.van-popup {
  z-index: 2024;
}
</style>
