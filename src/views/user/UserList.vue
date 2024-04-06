<template>
  <div v-if="props.type === 'follow'">UserFollow</div>
  <div v-else>UserFans</div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})
</script>
<style lang="less" scoped></style>
