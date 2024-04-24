<script setup>
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import BrowseList from './components/BrowseList.vue'

const active = ref(0)
</script>

<template>
  <NavBar title="浏览历史" />
  <van-tabs v-model:active="active">
    <van-tab title="文章">
      <div class="scroll-container">
        <BrowseList browseType="article" />
      </div>
    </van-tab>
    <van-tab title="视频">
      <div class="scroll-container">
        <BrowseList browseType="video" />
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
