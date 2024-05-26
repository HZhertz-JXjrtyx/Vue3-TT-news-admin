<script setup>
import { ref } from 'vue'
import { getUserWorksApi } from '@/api'
import WorkItem from './WorkItem.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  worksType: {
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

const workList = ref([])
const getWorkList = async () => {
  const res = await getUserWorksApi(props.userId, props.worksType, page.value, pageSize.value)
  console.log(res)
  if (res.data.length < pageSize.value) {
    hasMore.value = false
  }
  workList.value = workList.value.concat(res.data)
}

const onLoad = async () => {
  // console.log('hasMore.value', hasMore.value)
  if (hasMore.value) {
    loading.value = true
    await getWorkList()
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
  <div class="work-list">
    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <template #loading>
        <img class="loading-gif-2" src="@/assets/image/loading2.gif" />
      </template>
      <WorkItem v-for="item in workList" :key="item._id" :work="item" @click="goDetail(item)" />
    </van-list>
  </div>
</template>

<style lang="less" scoped></style>
