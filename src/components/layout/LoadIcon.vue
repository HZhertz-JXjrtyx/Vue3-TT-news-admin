<template>
  <lord-icon
    trigger="click"
    :src="props.iconSrc"
    :colors="props.active ? 'primary:#c71f16' : 'primary:#545454'"
    style="width: 93px; height: 26px"
  >
  </lord-icon>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  iconSrc: String,
  active: Boolean
})
</script>
