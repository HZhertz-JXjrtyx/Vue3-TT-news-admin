<script setup>
import { ref, onMounted, computed } from 'vue'
import { debounce } from 'lodash'
import { useUserStore } from '@/stores'
import { isFollowUserApi, followUserApi, getUserDetailApi } from '@/api'
import UserItemSkt from './UserItemSkt.vue'
import FollowBotton from '@/components/FollowBotton.vue'

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
})

const isloading = ref(true)

const userStore = useUserStore()
const isShowFollowBtn = computed(() => {
  return props.userId !== userStore.userInfo.user_id
})

const userInfo = ref({})
const getUserInfo = async () => {
  const res = await getUserDetailApi(props.userId)
  console.log(res)
  userInfo.value = res.data
  isloading.value = false
}

const isFollow = ref(false)
const getIsFollow = async () => {
  const res = await isFollowUserApi(props.userId)
  console.log(res)
  isFollow.value = res.result
}
onMounted(() => {
  getUserInfo()
  getIsFollow()
})

// 关注/取消关注
const followUser = async () => {
  await followUserApi(props.userId, isFollow.value)
}
const debouncedFollowUser = debounce(followUser, 500)
const handleFollowClick = () => {
  isFollow.value = !isFollow.value
  debouncedFollowUser()
}
</script>
<template>
  <div v-if="!isloading" class="user-item">
    <div class="user-avatar">
      <van-image round :src="userInfo.user_avatar" />
    </div>
    <div class="info">
      <span class="nickname">{{ userInfo.user_nickname }}</span>
    </div>
    <div class="follow-btn">
      <FollowBotton v-if="isShowFollowBtn" :isFollow="isFollow" v-login="handleFollowClick" />
    </div>
  </div>
  <UserItemSkt v-else />
</template>

<style lang="less" scoped>
.user-item {
  position: relative;
  display: flex;
  align-items: center;
  margin: 20px;
  .user-avatar {
    :deep(.van-image) {
      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
      }
    }
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .nickname {
      padding-left: 20px;
    }
  }
  .follow-btn {
    position: absolute;
    right: 0;
  }
}
</style>
