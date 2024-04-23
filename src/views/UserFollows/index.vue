<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores'
import NavBar from '@/components/NavBar.vue'
import UserList from './components/UserList.vue'

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
})

const userStore = useUserStore()

// 是否是个人关注/粉丝
const isSelf = computed(() => {
  return props.userId === userStore.userInfo.user_id
})
</script>

<template>
  <div class="user-follows">
    <NavBar :title="isSelf ? '我的好友' : 'Ta的好友'" />
    <van-tabs
      v-model:active="userStore.userFollowActiveTab"
      @change="
        (name) => {
          userStore.userFollowActiveTab = name
        }
      "
    >
      <van-tab title="关注">
        <div class="scroll-container">
          <UserList :userId="props.userId" userType="followers" />
        </div>
      </van-tab>
      <van-tab title="粉丝">
        <div class="scroll-container">
          <UserList :userId="props.userId" userType="fans" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="less" scoped>
.scroll-container {
  height: calc(100vh - 200px);
  overflow: auto;
}
</style>
