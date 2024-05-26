<script setup>
import { ref } from 'vue'

defineProps({
  isFollow: {
    type: Boolean,
    required: true,
  },
  size: {
    type: String,
    default: 'small',
  },
  followText: {
    type: String,
    default: '关注',
  },
})

const emit = defineEmits(['click'])

const isTouchDown = ref(false)
const handleTouchStart = () => {
  isTouchDown.value = true
}
const handleTouchEnd = () => {
  isTouchDown.value = false
}
</script>

<template>
  <div class="follow-button">
    <span
      :class="{ followed: isFollow, 'large-btn': size === 'large' }"
      @click="emit('click')"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <i v-show="isTouchDown" class="btn-overlay"></i>
      {{ isFollow ? '已关注' : followText }}
    </span>
  </div>
</template>

<style lang="less" scoped>
span {
  position: relative;
  display: inline-block;
  width: 130px;
  height: 65px;
  border: 1px solid #ffffff;
  border-radius: 12px;
  font-size: 30px;
  text-align: center;
  line-height: 60px;
  color: #ffffff;
  background: linear-gradient(to right, #ff6034, #ee0a24);
  user-select: none;
  .btn-overlay {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background-color: rgba(151, 151, 151, 0.3);
    z-index: 2025;
  }
}
.followed {
  color: #888;
  background: #ddd;
}
.large-btn {
  width: 420px;
  height: 65px;
}
</style>
