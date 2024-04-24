<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import FavoriteList from './components/FavoriteList.vue'

const active = ref(0)
</script>

<template>
  <NavBar title="我的收藏" />
  <van-tabs v-model:active="active">
    <van-tab title="文章">
      <div class="scroll-container">
        <FavoriteList favoriteType="article" />
      </div>
    </van-tab>
    <van-tab title="视频">
      <div class="scroll-container">
        <FavoriteList favoriteType="video" />
      </div>
    </van-tab>
  </van-tabs>
</template>

<style lang="less" scoped>
.scroll-container {
  height: calc(100vh - 200px);
  overflow: auto;
}
</style>
