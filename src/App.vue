<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component v-if="route.meta.keepAlive" :key="route.name" :is="Component" />
    </keep-alive>
    <component v-if="!route.meta.keepAlive" :key="route.name" :is="Component" />
  </router-view>
</template>

<style lang="less" scoped></style>
