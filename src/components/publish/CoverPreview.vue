<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({
  file: {
    type: File,
    required: false,
  },
})
const emit = defineEmits(['after-read'])

const dataUrl = ref('')

onMounted(() => {
  const reader = new FileReader()
  reader.onloadend = () => {
    dataUrl.value = reader.result
  }
  if (props.file) {
    reader.readAsDataURL(props.file)
  }
})

const handleSelectImage = () => {
  let fileInput = document.createElement('input')
  fileInput.setAttribute('type', 'file')
  fileInput.setAttribute('accept', 'image/*')
  fileInput.click()

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0]

    const reader = new FileReader()
    reader.onloadend = () => {
      dataUrl.value = reader.result
    }
    if (file) {
      reader.readAsDataURL(file)
      emit('after-read', file)
    }
  })
}
</script>
<template>
  <div class="cover-preview">
    <div v-if="!dataUrl" class="preview--no-img" @click="handleSelectImage">
      <span class="iconfont icon-cc-plus-crude"></span>
      <span class="text">添加封面图</span>
    </div>
    <div v-else class="preview--has-img">
      <img :src="dataUrl" alt="" />
      <span @click="handleSelectImage">替换</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.preview--no-img,
.preview--has-img {
  width: 220px;
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
}
.preview--no-img {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  text-align: center;
  background-color: var(--bg-color-3);
  span {
    color: var(--text-color-3);
  }
}

.preview--has-img {
  position: relative;
  text-align: center;
  img {
    position: absolute;
    transform: translate(-50%);
    height: 100%;
  }
  span {
    position: absolute;
    bottom: 10px;
    transform: translate(-50%);
    width: 100px;
    height: 50px;
    font-size: 26px;
    color: var(--text-color-4);
    line-height: 50px;
    background-color: #0000007e;
    border-radius: 10px;
  }
}
</style>
