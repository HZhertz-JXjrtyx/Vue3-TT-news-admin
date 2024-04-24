<script setup>
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
import 'vant/es/dialog/style'
import { useUserStore } from '@/stores'
import { logout } from '@/api'
import NavBar from '@/components/NavBar.vue'

const userStore = useUserStore()
const router = useRouter()

const onLogout = () => {
  showConfirmDialog({
    title: '确认退出吗？',
  })
    .then(async () => {
      await logout()
      userStore.token = ''
      userStore.userInfo = {}
      router.push('/user')
    })
    .catch(() => {
      console.log('取消')
    })
}
</script>

<template>
  <div class="secority">
    <NavBar title="账户安全" />
    <van-cell title="修改密码" is-link to="/security/password">
      <template #icon>
        <span class="iconfont icon-a-44tubiao-33"></span>
      </template>
    </van-cell>
    <van-cell title="更换手机" is-link to="/security">
      <template #icon>
        <span class="iconfont icon-a-44tubiao-57"></span>
      </template>
    </van-cell>
    <van-cell title="更换邮箱" is-link to="/security">
      <template #icon>
        <span class="iconfont icon-a-44tubiao-118"></span>
      </template>
    </van-cell>
  </div>
  <van-button type="danger" @click="onLogout">退出登录</van-button>
</template>

<style lang="less" scoped>
.van-cell {
  .iconfont {
    font-size: 40px;
    margin-right: 20px;
  }
  font-size: 32px;
}
button {
  margin: 0 280px;
}
</style>
