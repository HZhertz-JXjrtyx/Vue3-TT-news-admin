<script setup>
import { ref, onMounted } from 'vue'
import { getUserFavoriteApi } from '@/api'
import WorkItem from '@/components/work/WorkItem.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  favoriteType: {
    type: String,
    required: true,
  },
})

const router = useRouter()

const page = ref(1)
const pageSize = ref(10)
const favoriteList = ref([])
const loading = ref(false)
const hasMore = ref(true)
const getFavoriteList = async () => {
  const res = await getUserFavoriteApi(props.favoriteType, page.value, pageSize.value)
  console.log(res)
  if (res.data.length < pageSize.value) {
    hasMore.value = false
  }
  favoriteList.value = favoriteList.value.concat(res.data)
  loading.value = false
}

const finished = ref(false)
const onLoad = async () => {
  // console.log('hasMore.value', hasMore.value)
  if (hasMore.value) {
    loading.value = true
    getFavoriteList()
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
        articleId: item._id,
      },
    })
  }
  if (item.type === 'video') {
    router.push({
      name: 'videodetail',
      params: {
        videoId: item._id,
      },
    })
  }
}
</script>
<template>
  <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <WorkItem v-for="item in favoriteList" :key="item._id" :work="item" @click="goDetail(item)" />
  </van-list>
</template>

<style lang="less" scoped></style>
