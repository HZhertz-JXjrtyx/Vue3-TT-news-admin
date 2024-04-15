<script setup>
import { ref, onMounted, computed } from 'vue'
import { debounce } from 'lodash'
import { useUserStore } from '@/stores'
import { followUserApi, isFollowUserApi } from '@/api'
import { convertToMMDDHHmm } from '@/utils/convert'
import FollowBotton from '@/components/FollowBotton.vue'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
  publishTime: {
    type: Number,
    required: true,
  },
})

const userStore = useUserStore()
const isShowFollowBtn = computed(() => {
  return props.userInfo.user_id !== userStore.userInfo.user_id
})

// 是否关注
const isFollow = ref(false)
const getIsFollow = async () => {
  const res = await isFollowUserApi(props.userInfo.user_id)
  isFollow.value = res.result
  console.log(res)
}
onMounted(() => {
  if (props.userInfo.user_id && userStore.userInfo.user_id) {
    getIsFollow()
  }
})
// 关注
const followUser = async () => {
  await followUserApi(props.userInfo.user_id, isFollow.value)
}
const debouncedFollowUser = debounce(followUser, 500)
const handleFollowClick = () => {
  isFollow.value = !isFollow.value
  debouncedFollowUser()
}
</script>

<template>
  <div class="user-info">
    <van-image class="user-avatar" round width="40px" height="40px" :src="userInfo?.user_avatar || ''" />
    <span class="user-name">{{ userInfo?.user_nickname || '' }}</span>
    <span class="pub-time">{{ convertToMMDDHHmm(publishTime) }}</span>
    <div class="follow-btn">
      <FollowBotton v-if="isShowFollowBtn" :isFollow="isFollow" v-login="handleFollowClick" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.user-info {
  position: relative;
  margin-bottom: 20px;

  .user-name {
    position: absolute;
    left: 110px;
  }

  .pub-time {
    position: absolute;
    top: 48px;
    left: 110px;
    font-size: 28px;
    color: var(--text-color-2);
  }

  .follow-btn {
    position: absolute;
    top: 20px;
    right: 0px;
  }
}
</style>
