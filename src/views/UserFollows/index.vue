<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores'
import NavBar from '@/components/NavBar.vue'

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
  </div>
</template>

<style lang="less" scoped></style>
