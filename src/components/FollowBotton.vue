<script setup>
defineProps({
  isFollow: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['click'])
</script>

<template>
  <div class="follow-button" @click="emit('click')">
    <van-button
      v-if="!isFollow"
      class="follow-btn"
      size="small"
      color="linear-gradient(to right, #ff6034, #ee0a24)"
    >
      <span class="text">关注 </span>
      <span class="iconfont icon-a-44tubiao-88"></span>
    </van-button>
    <span v-else class="iconfont icon-a-44tubiao-66 follow-btn"></span>
  </div>
</template>

<style lang="less" scoped>
.follow-button {
  display: inline-block;
  width: 130px;
  height: 64px;
  .icon-a-44tubiao-66 {
    position: absolute;
    right: 20px;
    top: 15px;
  }
}
</style>
