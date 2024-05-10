<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { usePublishStore } from '@/stores'
import PublishSetting from '@/components/publish/PublishSetting.vue'
import { base64ToFile } from '@/utils'

const router = useRouter()
const publishStore = usePublishStore()

// 标题验证
const validator = () => {
  publishStore.title = publishStore.title.trim()
  return /.{5,}/.test(publishStore.title)
}

// 选择视频文件
// const selectedFile = ref(null)
const videoUrl = ref(null)
const selectVideoFile = () => {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'video/*'
  fileInput.addEventListener('change', (event) => {
    publishStore.videoFile = event.target.files[0]
    videoUrl.value = URL.createObjectURL(publishStore.videoFile)
  })
  fileInput.click()
}

// 获取第一帧图像做默认封面
const videoElement = ref(null)
const coverUrl = ref(null)
const captureCover = () => {
  // console.dir(videoElement.value)
  // 获取视频时长
  publishStore.videoDuration = videoElement.value.duration
  const canvas = document.createElement('canvas')
  canvas.width = videoElement.value.clientWidth
  canvas.height = videoElement.value.clientHeight
  const context = canvas.getContext('2d')
  context.drawImage(videoElement.value, 0, 0, canvas.width, canvas.height)
  coverUrl.value = canvas.toDataURL('image/png')
  publishStore.videoCoverDataurl = coverUrl.value
  publishStore.videoCoverFile = base64ToFile(coverUrl.value)
  console.log(coverUrl.value)
}
// const handleLoadedData = () => {
//   captureCover()
// }

const titleFormRef = ref(null)
const showPopup = ref(false)
const handleNext = async () => {
  await titleFormRef.value.validate('title')
  publishStore.videoIntro = publishStore.videoIntro.trim()
  if (!videoUrl.value) {
    showToast('请选择视频文件')
    return
  }
  videoElement.value.pause()
  showPopup.value = true
}
</script>
<template>
  <div class="header">
    <span class="back" @click="router.back()">取消</span>
    <span class="go" @click="handleNext">下一步</span>
  </div>
  <van-form ref="titleFormRef">
    <van-field
      class="video-title"
      v-model="publishStore.title"
      rows="1"
      autosize
      type="textarea"
      placeholder="添加标题(必填5-30字)"
      maxlength="30"
      name="title"
      :rules="[{ validator, message: '请输入5-30字标题' }]"
    />
    <van-field
      class="video-intro"
      v-model="publishStore.videoIntro"
      rows="1"
      autosize
      type="textarea"
      placeholder="简介(选填)"
      maxlength="300"
      name="intro"
    />
  </van-form>
  <div class="video-preview">
    <div class="preview--no-video" v-if="!videoUrl" @click="selectVideoFile">
      <span class="iconfont icon-plus"></span>
      <span class="preview__text">选择视频文件</span>
    </div>
    <div class="preview--has-video" v-else>
      <video
        autoplay
        controls
        :src="videoUrl"
        ref="videoElement"
        @loadeddata="
          () => {
            captureCover()
          }
        "
      ></video>
      <span @click="selectVideoFile">重新上传</span>
    </div>
  </div>

  <!-- 右侧弹出 -->
  <van-popup
    v-model:show="showPopup"
    closeable
    close-icon-position="top-left"
    position="right"
    :style="{ width: '100%', height: '100%' }"
  >
    <PublishSetting publishType="video" />
  </van-popup>
</template>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin: 30px;
  .go {
    color: var(--main-color-red-1);
  }
}
.video-title {
  :deep(textarea) {
    font-size: 36px;
    font-weight: 500;
  }
}
.video-preview {
  .preview--no-video {
    position: relative;
    height: 400px;
    margin: 20px 30px;
    border: 1px dashed #bdbdbd;
    border-radius: 10px;
    background-color: #f5f5f5;
    .iconfont {
      position: absolute;
      top: 160px;
      left: 50%;
      transform: translate(-50%);
      color: #bdbdbd;
    }
    .preview__text {
      position: absolute;
      top: 200px;
      left: 50%;
      transform: translate(-50%);
      color: #bdbdbd;
    }
  }
  .preview--has-video {
    padding: 20px 30px;
    video {
      width: 100%;
    }
    span {
      display: inline-block;
      width: 140px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      color: #727272;
      border: 1px solid #bdbdbd;
      border-radius: 2px;
    }
  }
}
//
</style>
