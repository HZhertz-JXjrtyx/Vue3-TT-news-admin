<script setup>
import { useUserStore } from '@/stores'
import LoadIcon from './LoadIcon.vue'

const userStore = useUserStore()
</script>
<template>
  <div class="tabbar">
    <van-tabbar route active-color="#f04142">
      <van-tabbar-item replace to="/home">
        <template #icon="{ active }">
          <LoadIcon iconSrc="http://127.0.0.1:3007/other/lord_icon/home.json" :active="active" />
        </template>
        首页
      </van-tabbar-item>
      <van-tabbar-item replace to="/hot">
        <template #icon="{ active }">
          <LoadIcon
            iconSrc="http://127.0.0.1:3007/other/lord_icon/explore-compass.json"
            :active="active"
          ></LoadIcon>
        </template>
        热点
      </van-tabbar-item>
      <van-tabbar-item replace to="/message">
        <template #icon="{ active }">
          <LoadIcon iconSrc="http://127.0.0.1:3007/other/lord_icon/chat.json" :active="active"></LoadIcon>
        </template>
        消息
      </van-tabbar-item>
      <van-tabbar-item replace to="/user">
        <template #icon="{ active }">
          <LoadIcon iconSrc="http://127.0.0.1:3007/other/lord_icon/account.json" :active="active"></LoadIcon>
        </template>
        {{ userStore.token ? '我的' : '未登录' }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="less" scoped>
:deep(.van-tabbar-item__icon) {
  margin: 0;
  padding: 0;
}
</style>
