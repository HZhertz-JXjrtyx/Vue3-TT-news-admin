<script setup>
import { ref } from 'vue'
import { getCommentListApi } from '@/api'
import { useCommentStore } from '@/stores'
import CommentItem from './CommentItem.vue'

const props = defineProps({
  commentType: {
    type: Number,
    required: true,
  },
  relatedId: {
    type: String,
    required: true,
  },
})

const commentStore = useCommentStore()

const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const hasMore = ref(true)

const getCommentList = async () => {
  const res = await getCommentListApi(props.commentType, props.relatedId, page.value, pageSize.value)
  console.log(res)
  if (res.data.length < pageSize.value) {
    hasMore.value = false
  }
  if ([1, 2].includes(props.commentType)) {
    commentStore.commentList = commentStore.commentList.concat(res.data)
  } else {
    commentStore.commentReplyList = commentStore.commentReplyList.concat(res.data)
  }

  loading.value = false
}

const finished = ref(false)
const onLoad = async () => {
  // console.log('hasMore.value', hasMore.value)
  if (hasMore.value) {
    loading.value = true
    getCommentList()
    page.value++
  } else {
    finished.value = true
  }
}

defineExpose({
  page,
  getCommentList,
})
</script>

<template>
  <div class="comment-list">
    <van-list
      v-if="[1, 2].includes(commentType)"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <CommentItem v-for="item in commentStore.commentList" :key="item._id" :comment="item" />
    </van-list>
    <van-list v-else v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <CommentItem v-for="item in commentStore.commentReplyList" :key="item._id" :comment="item" />
    </van-list>
  </div>
</template>

<style lang="less" scoped></style>
