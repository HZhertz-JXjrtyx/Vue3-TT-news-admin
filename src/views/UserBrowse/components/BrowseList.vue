<script setup>
import { ref } from 'vue'
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

const loading = ref(false)
const hasMore = ref(true)
const finished = ref(false)

const browseList = ref([])
const getBrowseList = async () => {
  const res = await getUserBrowseApi(props.browseType, page.value, pageSize.value)
  console.log(res)
  if (res.data.length < pageSize.value) {
    hasMore.value = false
  }
  browseList.value = browseList.value.concat(res.data)
}

const onLoad = async () => {
  // console.log('hasMore.value', hasMore.value)
  if (hasMore.value) {
    loading.value = true
    await getBrowseList()
    loading.value = false
    page.value++
  } else {
    finished.value = true
  }
}

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
    <template #loading>
      <img class="loading-gif-2" src="@/assets/image/loading2.gif" />
    </template>
    <WorkItem v-for="item in browseList" :key="item._id" :work="item" @click="goDetail(item)" />
  </van-list>
</template>

<style lang="less" scoped></style>
