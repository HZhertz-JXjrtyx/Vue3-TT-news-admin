<template>
  <div>
    LayoutContainer
    <router-view></router-view>
    <van-tabbar route v-model="active" active-color="rgb(197, 66, 34)">
      <van-tabbar-item replace to="/home" icon="wap-home-o">标签</van-tabbar-item>
      <van-tabbar-item replace to="/search" icon="search">标签</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup></script>
<style lang="less" scoped></style>
