<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, usePublishStore } from '@/stores'
import { uploadArticleImgApi, uploadArticleCoverApi } from '@/api'
import { formatVideoDuration } from '@/utils'
import { CTV } from '@/assets/js'
import CoverPreview from './CoverPreview.vue'

const props = defineProps({
  publishType: {
    type: String,
    required: true,
  },
})
const router = useRouter()
const userStore = useUserStore()
const publishStore = usePublishStore()

// 选择封面类型
publishStore.coverType = props.publishType === 'article' ? 'image_none' : 'image_large|video'
const changeCoverType = (e) => {
  console.dir(e.target, e.target.innerText)
  if (props.publishType === 'article') {
    if (e.target.tagName === 'SPAN') {
      console.log('e.target.getAttribute(data-ui)', e.target.getAttribute('data-ui'))
      publishStore.coverType = e.target.getAttribute('data-ui')
    }
  }
}

// 封面文件列表
const afterRead = (file, index) => {
  console.log(file, index)
  publishStore.articleCoverFileList[index] = file
}

// 选择视频封面
const handleSelectVideoCover = () => {
  let fileInput = document.createElement('input')
  fileInput.setAttribute('type', 'file')
  fileInput.setAttribute('accept', 'image/*')
  fileInput.click()

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0]
    publishStore.videoFile = file
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      publishStore.videoCoverDataurl = reader.result
    }
  })
}

// 选择频道分区
const result = ref('')
const showPicker = ref(false)
const columns = CTV
const onConfirm = ({ selectedOptions }) => {
  result.value = selectedOptions[0]?.text
  publishStore.channelId = selectedOptions[0]?.value
  showPicker.value = false
}

// 发布按钮状态
const publishBtnDisabled = ref(true)
watch(
  [() => publishStore.coverType, () => publishStore.articleCoverFileList, () => publishStore.channelId],
  () => {
    if (publishStore.channelId) {
      if (props.publishType === 'video') {
        publishBtnDisabled.value = false
      } else {
        if (publishStore.coverType === 'image_none') {
          publishBtnDisabled.value = false
        } else if (publishStore.coverType === 'image_right') {
          publishBtnDisabled.value = !publishStore.articleCoverFileList[0]
        } else if (publishStore.coverType === 'image_list') {
          console.log(Object.keys(publishStore.articleCoverFileList).length !== 3)
          publishBtnDisabled.value = Object.keys(publishStore.articleCoverFileList).length !== 3
        }
      }
    }
  },
  { deep: true }
)

watch(
  () => publishStore.quillContent,
  (nv) => {
    publishStore.articleContent = nv
  },
  { immediate: true }
)

// 发布
const handlePublish = () => {
  if (props.publishType === 'article') {
    handlePublishArticle()
  } else {
    handlePublishVideo()
  }
}
// 发布文章
const handlePublishArticle = async () => {
  // 上传封面
  if (publishStore.coverType !== 'image_none') {
    const formData = new FormData()
    formData.append('folder', 'article_images')
    publishStore.articleCoverFileList.forEach((file) => {
      formData.append('article_cover', file)
    })
    const res = await uploadArticleCoverApi(formData)
    console.log(res)
    publishStore.articleCoverSrcList = res.coverList
  }
  // 上传图片
  if (publishStore.articleImageFileList.length > 0) {
    const formData = new FormData()
    formData.append('folder', 'article_images')
    // 将所有图片添加到 FormData 对象中
    publishStore.articleImageFileList.forEach((fileObj) => {
      console.log(fileObj)
      formData.append('article_img', fileObj.file)
    })
    const res = await uploadArticleImgApi(formData)
    console.log(res)
    publishStore.articleImageSrcList = res.imageList
  }

  // 替换富文本图片url
  publishStore.articleImageFileList.forEach((fileObj, index) => {
    publishStore.articleContent = publishStore.articleContent.replace(
      fileObj.imageDataUrl,
      publishStore.articleImageSrcList[index]
    )
  })
  console.log(publishStore.articleContent)

  // 上传文章
  const res = await publishStore.publishArticle()
  console.log(res)
  if (res.status === 200) {
    router.go(-1)
    publishStore.initialize()
  }
}
// 发布视频
const handlePublishVideo = async () => {}
</script>
<template>
  <div class="publish-setting">
    <div class="publish-preview--video" v-if="props.publishType === 'video'">
      <div class="preview__content">
        <i class="content__bg" :style="{ backgroundImage: `url(${publishStore.videoCoverDataurl})` }"></i>
        <div class="content__cover">
          <van-image fit="cover" position="center" :src="publishStore.videoCoverDataurl" />
        </div>
        <span class="content__playicon iconfont icon-playfill"></span>
        <span class="content__duration">{{ formatVideoDuration(publishStore.videoDuration) }}</span>
      </div>
    </div>
    <div class="publish-preview--article">
      <div class="preview__content">
        <div class="content__title">{{ publishStore.title }}</div>
        <div class="content__cover--list" v-if="publishStore.coverType === 'image_list'">
          <CoverPreview
            v-for="(item, index) in publishStore.articleCoverFileList"
            :key="index"
            :file="item"
            @after-read="(file) => afterRead(file, index)"
          />
        </div>
        <div class="content__user-info">用户{{ userStore.userInfo.user_id }}</div>
      </div>
      <div class="preview__cover--right" v-if="publishStore.coverType === 'image_right'">
        <CoverPreview
          :file="publishStore.articleCoverFileList[0]"
          @after-read="(file) => afterRead(file, 0)"
        />
      </div>
    </div>

    <div class="cover-setting" v-if="props.publishType === 'article'">
      <span class="setting__title">封面设置</span>

      <div class="setting__type" @click="changeCoverType">
        <span :class="{ selected: publishStore.coverType === 'image_none' }" data-ui="image_none">无图</span>
        <span :class="{ selected: publishStore.coverType === 'image_right' }" data-ui="image_right">
          单图
        </span>
        <span :class="{ selected: publishStore.coverType === 'image_list' }" data-ui="image_list">三图</span>
      </div>
    </div>
    <van-cell v-else title="封面替换" is-link @click="handleSelectVideoCover" />
    <div class="select-channel">
      <van-field
        v-model="result"
        is-link
        readonly
        name="picker"
        label="选择分区"
        placeholder="点击选择分区"
        @click="showPicker = true"
      />
    </div>

    <div class="bottom">
      <van-button :disabled="publishBtnDisabled" type="primary" @click="handlePublish">发布</van-button>
    </div>
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker :columns="columns" @confirm="onConfirm" @cancel="showPicker = false" />
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.publish-setting {
  margin: 100px 0;
}
.publish-preview--article {
  display: flex;
  position: relative;
  border-top: 1px solid var(--bg-color-3);
  border-bottom: 1px solid var(--bg-color-3);
  .preview__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .content__title {
      margin: 40px 40px 0;
      font-size: 34px;
      font-weight: 500;
      word-break: break-all;
    }
    .content__cover--list {
      display: flex;
      justify-content: space-between;
      padding: 20px 40px 0 40px;
    }
    .content__user-info {
      margin: 10px 0 40px 40px;
      font-size: 24px;
      color: var(--text-color-3);
    }
  }
  .preview__cover--right {
    .cover-preview {
      margin: 40px 30px 40px 0;
    }
  }
}
.publish-preview--video {
  .preview__content {
    position: relative;
    margin: 10px 30px 0 30px;
    border-radius: 10px;
    overflow: hidden;
    .content__bg {
      display: block;
      width: 100%;
      height: 388px;
      filter: blur(10px);
      transform: scale(1.7);
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .content__cover {
      position: absolute;
      top: 0;
      width: 100%;
      height: 388px;
      overflow: hidden;
      :deep(.van-image) {
        width: 100%;
        height: 388px;
      }
    }
    .content__playicon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 80px;
      color: rgb(255, 255, 255);
    }
    .content__duration {
      position: absolute;
      right: 30px;
      bottom: 20px;
      color: rgb(255, 255, 255);
    }
  }
}
.cover-setting {
  height: 100px;
  line-height: 100px;

  border-bottom: 1px solid var(--bg-color-3);
  .setting__title {
    margin-left: 40px;
  }
  .setting__type {
    float: right;
    margin-right: 40px;
    span {
      display: inline-block;
      width: 100px;
      height: 50px;
      margin: 0 10px;
      border-radius: 25px;
      background-color: var(--bg-color-3);
      text-align: center;
      line-height: 50px;
      font-size: 25px;
    }
    .selected {
      color: var(--main-color-red-1);
      background-color: #ff373a32;
    }
  }
}
.van-cell {
  padding: 20px 40px;
}
.bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 120px;
  line-height: 100px;
  text-align: center;
  border-top: 1px solid var(--bd-color-1);
  .van-button {
    width: 280px;
  }
}
</style>
