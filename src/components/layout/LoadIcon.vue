<template>
  <lord-icon
    trigger="click"
    target=".van-tabbar-item"
    :src="props.iconSrc"
    :colors="props.active ? 'primary:#f04142' : 'primary:#545454'"
    style="width: 30px; height: 26px"
  >
  </lord-icon>
</template>

<script setup>
import lottie from 'lottie-web'
import { defineElement } from '@lordicon/element'

// 定义 "lord-icon" 自定义元素
defineElement(lottie.loadAnimation)
const props = defineProps({
  iconSrc: String,
  active: Boolean
})
</script>
