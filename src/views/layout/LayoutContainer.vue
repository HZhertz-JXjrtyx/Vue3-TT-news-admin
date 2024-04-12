<script setup>
// import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import LoadIcon from '@/components/layout/LoadIcon.vue'

// const userStore = useUserStore()
const route = useRoute()
</script>

<template>
  <div>
    <!-- 使用keepalive缓存组件状态，结合路由meta对象配置 -->
    <!-- 需要将keepalive写在routerview内部 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component v-if="route.meta.keepAlive" :key="route.name" :is="Component" />
      </keep-alive>
      <component v-if="!route.meta.keepAlive" :key="route.name" :is="Component" />
    </router-view>

    <van-tabbar route active-color="#f04142">
      <van-tabbar-item replace to="/home">
        <template #icon="{ active }">
          <LoadIcon iconSrc="https://cdn.lordicon.com/cnpvyndp.json" :active="active"></LoadIcon>
        </template>
        首页
      </van-tabbar-item>
      <van-tabbar-item replace to="/hot">
        <template #icon="{ active }">
          <LoadIcon iconSrc="https://cdn.lordicon.com/aklfruoc.json" :active="active"></LoadIcon>
        </template>
        视频
      </van-tabbar-item>
      <van-tabbar-item replace to="/message">
        <template #icon="{ active }">
          <LoadIcon iconSrc="https://cdn.lordicon.com/fdxqrdfe.json" :active="active"></LoadIcon>
        </template>
        消息
      </van-tabbar-item>
      <van-tabbar-item replace to="/user">
        <template #icon="{ active }">
          <LoadIcon iconSrc="https://cdn.lordicon.com/kthelypq.json" :active="active"></LoadIcon>
        </template>
        {{ user.token ? '我的' : '未登录' }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="less">
.van-tabbar-item__icon {
  margin-bottom: 0;
  padding-top: 4px;
  font-size: 0;
}
.van-tabbar-item__text {
  font-size: 14px;
  padding-bottom: 3px;
}
</style>
