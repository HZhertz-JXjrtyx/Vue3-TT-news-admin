<script setup>
import { ref, inject } from 'vue'
import { getComment } from '@/api'
import CommentItem from './CommentItem.vue'

const props = defineProps({
  type: {
    type: Number,
    required: true,
  },
  sourceId: {
    type: String,
    required: true,
  },
})

const commentList = inject('commentList')

const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const hasMore = ref(true)

const getCommentList = async () => {
  const res = await getComment(props.type, props.sourceId, page.value, pageSize.value)
  console.log('评论列表', res)
  if (res.data.length < pageSize.value) {
    hasMore.value = false
  }
  commentList.value = commentList.value.concat(res.data)
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

const updCommentlist = (commentId) => {
  commentList.value = commentList.value.filter((item) => {
    return item.comment_id !== commentId
  })
}
</script>

<template>
  <div class="comment-list">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <CommentItem
        v-for="item in commentList"
        :key="item.comment_id"
        :comment="item"
        @updCommentlist="updCommentlist"
      />
    </van-list>
  </div>
</template>

<style lang="less" scoped></style>
