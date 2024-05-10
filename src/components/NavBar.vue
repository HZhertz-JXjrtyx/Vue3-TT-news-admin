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
    </van-nav-bar>
  </van-sticky>
</template>

<style lang="less" scoped></style>
