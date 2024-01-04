<template>
  <div>
    <!-- 使用keepalive缓存组件状态，结合路由meta对象配置 -->
    <!-- 需要将keepalive写在routerview内部 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component v-if="$route.meta.keepAlive" :key="$route.name" :is="Component" />
      </keep-alive>
      <component v-if="!$route.meta.keepAlive" :key="$route.name" :is="Component" />
    </router-view>

    <van-tabbar route active-color="#f04142">
      <van-tabbar-item replace to="/home">
        <template #icon="{ active }">
          <LoadIcon
            iconSrc="http://127.0.0.1:3007/other/lord_icon/home.json"
            :active="active"
          ></LoadIcon>
        </template>
        首页
      </van-tabbar-item>
      <van-tabbar-item replace to="/video">
        <template #icon="{ active }">
          <LoadIcon
            iconSrc="http://127.0.0.1:3007/other/lord_icon/explore-compass.json"
            :active="active"
          ></LoadIcon>
        </template>
        动态
      </van-tabbar-item>
      <van-tabbar-item replace to="/message">
        <template #icon="{ active }">
          <LoadIcon
            iconSrc="http://127.0.0.1:3007/other/lord_icon/chat.json"
            :active="active"
          ></LoadIcon>
        </template>
        消息
      </van-tabbar-item>
      <van-tabbar-item replace to="/user">
        <template #icon="{ active }">
          <LoadIcon
            iconSrc="http://127.0.0.1:3007/other/lord_icon/account.json"
            :active="active"
          ></LoadIcon>
        </template>
        {{ userStore.token ? '我的' : '未登录' }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import LoadIcon from '@/components/layout/LoadIcon.vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
</script>
<style lang="less" scoped></style>
