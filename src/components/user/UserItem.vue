<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import { useUserStore } from '@/stores'
import { isFollowUserApi, followUserApi } from '@/api'
import { formatTimeAccurately } from '@/utils'
import UserItemSkt from './UserItemSkt.vue'
import FollowBotton from '@/components/FollowBotton.vue'

const props = defineProps({
  userInfo: { type: Object, required: true },
  showTime: { type: Boolean, default: false },
  time: { type: Number },
  showIntro: { type: Boolean, default: false },
  showNotify: { type: Boolean, default: false },
  isLink: { type: Boolean, default: false },
  size: { type: String, default: 'normal' },
  followText: { type: String, default: '关注' },
})

const userStore = useUserStore()
const router = useRouter()

const isShowFollowBtn = computed(() => {
  return props.userInfo.user_id !== userStore.userInfo.user_id
})

const isloading = ref(true)
const isFollow = ref(false)
const getIsFollow = async () => {
  const res = await isFollowUserApi(props.userInfo.user_id)
  console.log(res)
  isFollow.value = res.result
  isloading.value = false
}
onMounted(() => {
  getIsFollow()
})

// 关注/取消关注
const followUser = async () => {
  await followUserApi(props.userInfo.user_id, isFollow.value)
}
const debouncedFollowUser = debounce(followUser, 500)
const handleFollowClick = () => {
  isFollow.value = !isFollow.value
  debouncedFollowUser()
}

const goUserSpace = () => {
  router.push({
    name: 'userspace',
    params: {
      userId: props.userInfo.user_id,
    },
  })
}
</script>
<template>
  <div v-if="!isloading" class="user-item" @click="isLink ? goUserSpace : ''">
    <div class="user-avatar" @click.stop="goUserSpace">
      <van-image round :src="userInfo.user_avatar" />
    </div>
    <div class="user-info">
      <span class="nickname-notify">
        <span class="user-nickname" @click.stop="goUserSpace">{{ userInfo.user_nickname }}</span>
        <span v-if="showNotify">&nbsp;关注了你</span>
      </span>
      <span class="user-intro" v-if="showIntro">{{ userInfo.user_intro }}</span>
      <span class="relate-time" v-if="showTime">{{ formatTimeAccurately(time) }}</span>
    </div>
    <div class="follow-btn">
      <FollowBotton
        v-if="isShowFollowBtn"
        :isFollow="isFollow"
        :followText="followText"
        v-login.stop="handleFollowClick"
      />
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
  border-bottom: 1px solid #f3f3f3;
  .user-avatar {
    width: 100px;
    height: 100px;
    .van-image {
      width: 100%;
      height: 100%;
      border: 1px solid #e1e1e1;
    }
  }
  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 100px;
    padding-left: 20px;
    .nickname-notify {
      display: flex;
      .user-nickname {
        display: inline-block;
        font-size: 30px;
        max-width: 300px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .user-intro,
    .relate-time {
      font-size: 26px;
      color: #818181;
    }
    & > span {
      width: 440px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .follow-btn {
    position: absolute;
    right: 0;
  }
}
</style>
