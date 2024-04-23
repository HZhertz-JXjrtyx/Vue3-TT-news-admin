<script setup>
import { ref, onMounted } from 'vue'
import { getUserBrowseApi } from '@/api'
import WorkItem from '@/components/work/WorkItem.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  browseType: {
    type: String,
    required: true,
  },
})

const router = useRouter()

const page = ref(1)
const pageSize = ref(10)
const browseList = ref([])
const loading = ref(false)
const hasMore = ref(true)
const getBrowseList = async () => {
  const res = await getUserBrowseApi(props.browseType, page.value, pageSize.value)
  console.log(res)
  if (res.data.length < pageSize.value) {
    hasMore.value = false
  }
  browseList.value = browseList.value.concat(res.data)
  loading.value = false
}

const finished = ref(false)
const onLoad = async () => {
  // console.log('hasMore.value', hasMore.value)
  if (hasMore.value) {
    loading.value = true
    getBrowseList()
    page.value++
  } else {
    finished.value = true
  }
}

onMounted(() => {
  onLoad()
})

const goDetail = (item) => {
  console.log(item)
  if (item.type === 'article') {
    router.push({
      name: 'articledetail',
      params: {
        articleId: item.article_id,
      },
    })
  }
  if (item.type === 'video') {
    router.push({
      name: 'videodetail',
      params: {
        videoId: item.video_id,
      },
    })
  }
}
</script>
<template>
  <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <WorkItem v-for="item in browseList" :key="item._id" :work="item" @click="goDetail(item)" />
  </van-list>
</template>

<style lang="less" scoped></style>
