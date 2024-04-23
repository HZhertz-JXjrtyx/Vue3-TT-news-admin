<script setup>
defineProps({
  isFollow: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <div class="follow-button" @click="emit('click')">
    <van-button v-if="!isFollow" size="small" color="linear-gradient(to right, #ff6034, #ee0a24)">
      <span class="text">关注 </span>
      <span class="iconfont icon-a-44tubiao-88"></span>
    </van-button>
    <van-button v-else class="isfollow" size="small" color="#ddd">
      <span class="text">已关注</span>
    </van-button>
  </div>
</template>

<style lang="less" scoped>
.van-button {
  width: 130px;
}
.isfollow {
  color: #666666 !important;
}
</style>
