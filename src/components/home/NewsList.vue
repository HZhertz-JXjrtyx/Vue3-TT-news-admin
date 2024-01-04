<template>
  <div class="news-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <ListItem
          v-for="item in newsStore.newsList[channelName]"
          :key="item._id"
          :news="item"
        ></ListItem>
      </van-list>
    </van-pull-refresh>
    <van-back-top right="28px" bottom="90px" />
  </div>
</template>

<script setup>
import ListItem from '@/components/home/ListItem.vue'
import { useNewsStore } from '@/stores'
import { ref } from 'vue'

const props = defineProps({
  channelId: {
    type: String,
    required: true
  },
  channelName: {
    type: String,
    required: true
  }
})
const newsStore = useNewsStore()
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const onLoad = async () => {
  const hasMore = await newsStore.fetchNewsList(
    props.channelId,
    props.channelName,
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
const onRefresh = () => {
  newsStore.newsList[props.channelName] = []
  page.value = 1
  loading.value = true
  onLoad()
  refreshing.value = false
}
</script>
<style lang="less" scoped>
.news-list {
  margin: 10px 14px 50px;
}
</style>
