<script setup>
import { useRouter } from 'vue-router'

defineProps({
  title: {
    type: String,
    required: true,
  },
})

const router = useRouter()
</script>

<template>
  <van-sticky>
    <van-nav-bar :title="title" class="app-nav-bar">
      <template #left>
        <span class="iconfont icon-arrow_left" @click="router.back()"></span>
      </template>
      <template #right>
        <span class="iconfont icon-home" @click="router.replace('/home')"></span>
      </template>
    </van-nav-bar>
  </van-sticky>
</template>

<style lang="less" scoped>
.app-nav-bar {
  background-color: #fff;
  border-bottom: 1px solid #d6d6d6;

  :deep(.van-nav-bar__title) {
    color: #000000;
  }
}
</style>
