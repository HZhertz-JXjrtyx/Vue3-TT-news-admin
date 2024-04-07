<template>
  <div>AccountSecurity</div>
  <van-button type="danger" @click="onLogout">退出登录</van-button>
</template>

<script setup>
import { showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'
import { logout } from '@/api'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
function onLogout() {
  showConfirmDialog({
    title: '确认退出吗？'
  })
    .then(async () => {
      await logout()
      userStore.removeToken()
      router.push('/user')
    })
    .catch(() => {
      console.log('取消')
    })
}
</script>
<style lang="less" scoped></style>
