<script setup>
import { ref } from 'vue'
const sty = ref({ overflow: 'auto' })

const handleWheel = (e) => {
  // 如果页面没有滚动到底部
  if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
    // 如果是向下滚动
    if (e.deltaY > 0) {
      // // 阻止子元素滚动容器的滚动
      // e.preventDefault()
      // // 使整个页面向下滚动
      // window.scrollTo({
      //   top: window.scrollY + 4 * e.deltaY,
      //   behavior: 'smooth',
      // })
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
  console.log('Touchstart')
  console.log(e)
  // 记录初始触摸位置
  initialTouchPosition = e.touches[0].clientY
}

const handleTouchmove = (e) => {
  console.log('Touchmove')
  console.log(e)
  // 如果页面没有滚动到底部
  if (window.innerHeight + window.scrollY < document.body.offsetHeight) {
    // 如果是向下滚动
    console.log(e.touches[0].clientY, initialTouchPosition)
    if (e.touches[0].clientY < initialTouchPosition) {
      // // 阻止子元素滚动容器的滚动
      // e.preventDefault()
      // // 使整个页面向下滚动
      // let deltaY = initialTouchPosition - e.touches[0].clientY
      // // window.scrollBy(0, deltaY)
      // window.scrollTo({
      //   top: window.scrollY + deltaY,
      //   behavior: 'smooth',
      // })
      sty.value.overflow = 'hidden'
    } else {
      sty.value.overflow = 'auto'
    }
  } else {
    sty.value.overflow = 'auto'
  }
}

const handleTouchend = (e) => {
  // 重置初始触摸位置
  initialTouchPosition = null
  console.log('Touchend')
  console.log(e)
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
  overflow: auto;
  padding: 10px 20px;
}
</style>
