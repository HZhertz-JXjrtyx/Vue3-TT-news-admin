<template>
  <div>MessageTab</div>
</template>

<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  console.log('组件被重新激活')
})

onDeactivated(() => {
  console.log('组件被缓存')
})
</script>
<style lang="less" scoped></style>
