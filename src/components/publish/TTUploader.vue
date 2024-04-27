<script setup>
defineProps({
  dataUrl: {
    type: String,
    required: true,
  },
})
</script>
<template>
  <div class="uploader">
    <span class="iconfont icon-cc-plus-crude"></span>
    <span>添加封面图</span>
  </div>
  <div class="preview"></div>
</template>

<style lang="less" scoped></style>
