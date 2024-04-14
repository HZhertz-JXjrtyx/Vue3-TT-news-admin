<script setup>
import { onMounted, ref, provide } from 'vue'
// import { useRouter } from 'vue-router'
import { getCommentDetailApi } from '@/api'
import CommentList from '@/components/article/CommentList.vue'
import UserInfo from '@/components/UserInfo.vue'
import UserInfoSkt from '@/components/UserInfoSkt.vue'
import NavBar from '@/components/NavBar.vue'
// import { convertToMMDDHHmm } from '@/utils/convert'

const props = defineProps({
  commentId: {
    type: String,
    required: true,
  },
})

// const router = useRouter()

// 获取评论详情
const commentDetail = ref({})
const isLoading = ref(true)
const commentUserId = ref('')
provide('commentUserId', commentUserId)
const getCommentDetail = async () => {
  const res = await getCommentDetailApi(props.commentId)
  console.log(res)
  commentDetail.value = res.data
  commentUserId.value = res.data.user_id
  isLoading.value = false
}
onMounted(() => {
  getCommentDetail()
})
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
      <CommentList :type="3" :sourceId="commentId" />
    </div>
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
  }
}
</style>
