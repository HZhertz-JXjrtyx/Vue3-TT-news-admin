<template>
  <div class="article-comment">
    评论：
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="item in commentStore.comment" :key="item.comment_id">{{ item.content }}</div>
    </van-list>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCommentStore } from '@/stores'

const props = defineProps({
  sourceId: {
    type: String,
    required: true
  }
})
const commentStore = useCommentStore()
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const finished = ref(false)

const onLoad = async () => {
  const hasMore = await commentStore.getComment(
    'article_comment',
    props.sourceId,
    page.value,
    pageSize.value
  )
  console.log(hasMore)
  loading.value = false
  if (hasMore) {
    page.value++
  } else {
    finished.value = true
  }
}
</script>
<style lang="less" scoped></style>
