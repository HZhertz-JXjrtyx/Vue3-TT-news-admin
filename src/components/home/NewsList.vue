<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useNewsStore } from '@/stores'
import { getNews } from '@/api'
import ListItem from '@/components/home/ListItem.vue'
// import useScrollPosition from '@/composables/useScrollPosition.js' // 引入useScrollPosition

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

const page = ref(1)
const pageSize = ref(10)
const newsList = ref([])
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

const loading = ref(false)
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

// const scrollPositions = ref(JSON.parse(sessionStorage.getItem('scrollPositions')) || {})
onMounted(() => {
  // console.log('onMounted')
  onLoad()

  // window.addEventListener('scroll', function () {
  //   // document.documentElement.scrollTop || 0
  //   // const scrollTop = newsTab.value.scrollTop
  //   // console.log(window.scrollY)
  //   // console.log(document.documentElement.scrollTop)
  //   // console.log('实时滚动位置：', document.documentElement.scrollTop)
  //   // scrollPositions.value[props.channelId] = scrollTop
  //   // sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions.value))
  // })
})
onUnmounted(() => {
  // console.log('onUnmounted')
})

const router = useRouter()
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
  <div class="news-list" ref="newsTab">
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
