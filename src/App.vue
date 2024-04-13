<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Tabbar from './components/tabbar/Tabbar.vue'

const route = useRoute()

const isShowTabbar = computed(() => {
  return ['home', 'hot', 'message', 'user'].includes(route.name)
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component v-if="route.meta.keepAlive" :key="route.name" :is="Component" />
    </keep-alive>
    <component v-if="!route.meta.keepAlive" :key="route.name" :is="Component" />
  </router-view>
  <Tabbar v-if="isShowTabbar" />
</template>

<style lang="less" scoped></style>
