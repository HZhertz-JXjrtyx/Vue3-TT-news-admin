<script setup>
import { onMounted, ref, provide } from 'vue'
import { debounce } from 'lodash'
import { getCommentDetailApi, likeCommentApi } from '@/api'
import NavBar from '@/components/NavBar.vue'
import UserInfo from '@/components/user/UserInfo.vue'
import UserInfoSkt from '@/components/user/UserInfoSkt.vue'
import CommentList from '@/components/comment/CommentList.vue'
import DetailBottom from '@/components/DetailBottom.vue'

const props = defineProps({
  commentId: {
    type: String,
    required: true,
  },
})

const commentCount = ref(0)
provide('commentCount', commentCount)
const commentList = ref([])
provide('commentList', commentList)
const isShowTextarea = ref(false)
provide('isShowTextarea', isShowTextarea)
const isLike = ref(false)
provide('isLike', isLike)

/* 获取评论详情 */
const commentDetail = ref({})
const isLoading = ref(true)
const getCommentDetail = async () => {
  const res = await getCommentDetailApi(props.commentId)
  console.log(res)
  commentDetail.value = res.data
  commentCount.value = res.data.reply_count
  isLike.value = res.data.is_like
  isLoading.value = false
}
onMounted(() => {
  getCommentDetail()
})

/* 点赞 */
const likeComment = async () => {
  await likeCommentApi(commentDetail.value.comment_id, isLike.value)
}
const debouncedLikeComment = debounce(likeComment, 500)
const handleClickLike = () => {
  isLike.value = !isLike.value
  debouncedLikeComment()
}
</script>

<template>
  <div class="comment-page">
    <NavBar title="评论详情" />
    <div class="detail">
      <UserInfo
        v-if="!isLoading"
        :userInfo="commentDetail.user_info"
        :publishTime="commentDetail.publish_time"
      ></UserInfo>
      <UserInfoSkt v-if="isLoading" />
      <div class="content">{{ commentDetail.content }}</div>
    </div>
    <div class="divider"></div>
    <div class="reply">
      <div class="reply-header">
        <div class="title">评论回复 {{ commentCount }}</div>
      </div>
      <CommentList :type="3" :sourceId="commentId" />
    </div>
    <DetailBottom
      v-if="!isLoading"
      :sourceType="3"
      :sourceId="props.commentId"
      :replyName="commentDetail.user_info.user_nickname"
      @clickLike="handleClickLike"
    />
  </div>
</template>

<style lang="less" scoped>
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
</style>
