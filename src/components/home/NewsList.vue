<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNews } from '@/api'
import ListItem from '@/components/home/ListItem.vue'

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
const newsList = ref([])
const loading = ref(false)
const hasMore = ref(true)

const getNewsList = async () => {
  const res = await getNews({ channel_id: props.channelId, page: page.value, pageSize: pageSize.value })
  // console.log(res)
  if (res.data.length < pageSize.value) {
    hasMore.value = false
  }
  newsList.value = newsList.value.concat(res.data)
  loading.value = false
}

const finished = ref(false)
const onLoad = async () => {
  // console.log('hasMore.value', hasMore.value)
  if (hasMore.value) {
    loading.value = true
    getNewsList()
    page.value++
  } else {
    finished.value = true
  }
}
const refreshing = ref(false)
const onRefresh = () => {
  newsList.value = []
  page.value = 1
  hasMore.value = true
  onLoad()
  refreshing.value = false
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
  <div class="news-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ListItem v-for="item in newsList" :key="item._id" :news="item" @click="goDetail(item)"></ListItem>
      </van-list>
    </van-pull-refresh>
    <!-- <van-back-top right="28px" bottom="90px" /> -->
  </div>
</template>

<style lang="less" scoped>
.news-list {
  margin: 20px 28px 100px;
}
</style>
