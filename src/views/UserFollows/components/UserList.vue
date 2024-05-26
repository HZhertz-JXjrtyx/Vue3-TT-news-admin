<script setup>
import { ref, computed } from 'vue'
import { getUserfansApi, getUserfollowersApi } from '@/api'
import UserItem from '@/components/user/UserItem.vue'
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

const page = ref(1)
const pageSize = ref(10)

const loading = ref(false)
const hasMore = ref(true)
const finished = ref(false)

const userList = ref([])
const getUserList = async () => {
  let res
  if (props.userType === 'fans') {
    res = await getUserfansApi(props.userId, page.value, pageSize.value)
  } else if (props.userType === 'followers') {
    res = await getUserfollowersApi(props.userId, page.value, pageSize.value)
  }

  console.log(res)
  if (res.data.length < pageSize.value) {
    hasMore.value = false
  }
  userList.value = userList.value.concat(res.data)
}

const onLoad = async () => {
  // console.log('hasMore.value', hasMore.value)
  if (hasMore.value) {
    loading.value = true
    await getUserList()
    loading.value = false
    page.value++
  } else {
    finished.value = true
  }
}

const followText = computed(() => {
  if (props.userType === 'fans') {
    return '回关'
  } else {
    return '关注'
  }
})
</script>
<template>
  <div class="user-list">
    <van-empty
      v-if="!loading && userList.length === 0"
      image="https://fastly.jsdelivr.net/npm/@vant/assets/custom-empty-image.png"
      image-size="80"
      description="没有用户"
    />
    <van-list v-else v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <template #loading>
        <img class="loading-gif-2" src="@/assets/image/loading2.gif" />
      </template>
      <UserItem
        v-for="item in userList"
        :key="item._id"
        :userInfo="item"
        :showIntro="true"
        :followText="followText"
      />
    </van-list>
  </div>
</template>

<style lang="less" scoped></style>
