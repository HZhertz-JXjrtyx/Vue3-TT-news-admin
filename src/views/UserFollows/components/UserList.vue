<script setup>
import { ref, onMounted } from 'vue'
import { getUserfansApi, getUserfollowersApi } from '@/api'
import UserItem from './UserItem.vue'
// import WorkItem from './WorkItem.vue'
// import { useRouter } from 'vue-router'

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
})

const isLoading = ref(true)

const page = ref(1)
const pageSize = ref(10)
const userList = ref([])
const loading = ref(false)
const hasMore = ref(true)
const getUserList = async () => {
  let res
  if (props.userType === 'fans') {
    res = await getUserfansApi(props.userId, page.value, pageSize.value)
  } else if (props.userType === 'followers') {
    res = await getUserfollowersApi(props.userId, page.value, pageSize.value)
  }
  isLoading.value = false
  console.log(res)
  if (res.data.length < pageSize.value) {
    hasMore.value = false
  }
  userList.value = userList.value.concat(res.data)
  loading.value = false
}
const finished = ref(false)
const onLoad = async () => {
  // console.log('hasMore.value', hasMore.value)
  if (hasMore.value) {
    loading.value = true
    getUserList()
    page.value++
  } else {
    finished.value = true
  }
}
onMounted(() => {
  onLoad()
})
</script>
<template>
  <div class="user-list">
    <van-empty
      v-if="!isLoading && userList.length === 0"
      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
      image-size="80"
      description="没有用户"
    />
    <van-list v-else v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <UserItem :userId="item" v-for="item in userList" :key="item" />
    </van-list>
  </div>
</template>

<style lang="less" scoped></style>
