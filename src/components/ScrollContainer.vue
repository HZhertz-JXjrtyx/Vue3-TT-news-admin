<script setup>
import { ref } from 'vue'
const sty = ref({ overflow: 'auto' })

const handleWheel = (e) => {
  if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
    if (e.deltaY > 0) {
      sty.value.overflow = 'hidden'
    } else {
      sty.value.overflow = 'auto'
    }
  } else {
    sty.value.overflow = 'auto'
  }
}

let initialTouchPosition = null
const handleTouchstart = (e) => {
  initialTouchPosition = e.touches[0].clientY
}

const handleTouchmove = (e) => {
  if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
    if (e.touches[0].clientY < initialTouchPosition) {
      sty.value.overflow = 'hidden'
    } else {
      sty.value.overflow = 'auto'
    }
  } else {
    sty.value.overflow = 'auto'
  }
}

const handleTouchend = () => {
  initialTouchPosition = null
}
</script>
<template>
  <div
    class="scroll-container"
    :style="sty"
    @wheel="handleWheel"
    @touchstart="handleTouchstart"
    @touchmove="handleTouchmove"
    @touchend="handleTouchend"
  >
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.scroll-container {
  height: calc(100vh - 100px);
  overflow: hidden;
}
</style>
