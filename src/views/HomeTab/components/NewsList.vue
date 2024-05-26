<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getNewsListApi } from '@/api'
import ListItem from './ListItem.vue'

const props = defineProps({
  channelId: {
    type: String,
    required: true,
  },
  channelName: {
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

const newsList = ref([])
const getNewsList = async () => {
  const res = await getNewsListApi(props.channelId, page.value, pageSize.value)
  // console.log(res)
  if (res.data.length < pageSize.value) {
    hasMore.value = false
  }
  newsList.value = newsList.value.concat(res.data)
}

const onLoad = async () => {
  // console.log('hasMore.value', hasMore.value)
  if (hasMore.value) {
    loading.value = true
    await getNewsList()
    loading.value = false
    page.value++
  } else {
    finished.value = true
  }
}

const refreshing = ref(false)
const onRefresh = async () => {
  newsList.value = []
  page.value = 1
  hasMore.value = true
  await onLoad()
  refreshing.value = false
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
  <div class="news-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <template #loading>
        <img class="loading-gif-1" src="@/assets/image/loading1.gif" />
      </template>
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <template #loading>
          <img class="loading-gif-2" src="@/assets/image/loading2.gif" />
        </template>
        <ListItem v-for="item in newsList" :key="item._id" :news="item" @click="goDetail(item)"></ListItem>
      </van-list>
    </van-pull-refresh>
    <!-- <van-back-top right="28px" bottom="90px" /> -->
  </div>
</template>

<style lang="less" scoped></style>
