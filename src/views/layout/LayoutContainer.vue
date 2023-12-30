<template>
  <div>
    <router-view></router-view>
    <van-tabbar route active-color="#f04142">
      <van-tabbar-item replace to="/home">
        <template #icon="{ active }">
          <LoadIcon iconSrc="https://cdn.lordicon.com/cnpvyndp.json" :active="active"></LoadIcon>
        </template>
        首页
      </van-tabbar-item>
      <van-tabbar-item replace to="/video">
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

<script setup>
import lottie from 'lottie-web'
import { defineElement } from '@lordicon/element'
import LoadIcon from '@/components/layout/LoadIcon.vue'
import { useUserStore } from '@/stores'

const user = useUserStore()

// 定义 "lord-icon" 自定义元素
defineElement(lottie.loadAnimation)
</script>
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
