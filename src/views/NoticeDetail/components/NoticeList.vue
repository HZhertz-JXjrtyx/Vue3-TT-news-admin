<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNotifyDetailApi } from '@/api'
import ListItem from './ListItem.vue'

const props = defineProps({
  noticeType: {
    type: String,
    required: true,
  },
})
const router = useRouter()

const page = ref(1)
const pageSize = ref(10)
const noticeDetail = ref([])
const loading = ref(false)
const hasMore = ref(true)
const getNotifyDetail = async () => {
  const res = await getNotifyDetailApi(props.noticeType, page.value, pageSize.value)
  console.log(res)
  if (res.data.length < pageSize.value) {
    hasMore.value = false
  }
  noticeDetail.value = noticeDetail.value.concat(res.data)
  loading.value = false
}

const finished = ref(false)
const onLoad = async () => {
  // console.log('hasMore.value', hasMore.value)
  if (hasMore.value) {
    loading.value = true
    getNotifyDetail()
    page.value++
  } else {
    finished.value = true
  }
}
const refreshing = ref(false)
const onRefresh = () => {
  noticeDetail.value = []
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

  switch (item.entity_type) {
    case 'Article':
      router.push({
        name: 'articledetail',
        params: {
          articleId: item.related_entity._id,
        },
      })
      break
    case 'Video':
      router.push({
        name: 'videodetail',
        params: {
          videoId: item.related_entity._id,
        },
      })
      break
    case 'Comment':
      item.work_type === 'Article' &&
        router.push({
          name: 'articledetail',
          params: {
            articleId: item.related_work,
          },
        })
      item.work_type === 'Video' &&
        router.push({
          name: 'videodetail',
          params: {
            videoId: item.related_work,
          },
        })
      break
    case 'User':
      router.push({
        name: 'userspace',
        params: {
          userId: item.related_entity.user_id,
        },
      })
      break
    default:
      break
  }
}
</script>

<template>
  <div class="notice-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ListItem v-for="item in noticeDetail" :key="item._id" :notice="item" @click="goDetail(item)" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<style lang="less" scoped>
.van-list {
  height: calc(100vh - 100px);
  overflow: auto;
}
</style>
