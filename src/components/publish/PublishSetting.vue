<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, usePublishStore } from '@/stores'
import { uploadArticleImgApi, uploadArticleCoverApi } from '@/api'
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
publishStore.coverType = 'image_none'
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
      if (publishStore.coverType === 'image_none') {
        publishBtnDisabled.value = false
      } else if (publishStore.coverType === 'image_right') {
        publishBtnDisabled.value = !publishStore.articleCoverFileList[0]
      } else if (publishStore.coverType === 'image_list') {
        console.log(Object.keys(publishStore.articleCoverFileList).length !== 3)
        publishBtnDisabled.value = Object.keys(publishStore.articleCoverFileList).length !== 3
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
const handlePublish = async () => {
  // 上传封面
  if (publishStore.coverType !== 'image_none') {
    const formData = new FormData()
    formData.append('folder', 'article_images')
    publishStore.articleCoverFileList.forEach((file) => {
      formData.append('article_cover', file)
    })
    const res = await uploadArticleCoverApi(formData)
    console.log(res)
    publishStore.articleCoverList = res.coverList
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
    publishStore.articleImageList = res.imageList
  }

  // 替换富文本图片url
  publishStore.articleImageFileList.forEach((fileObj, index) => {
    publishStore.articleContent = publishStore.articleContent.replace(
      fileObj.imageDataUrl,
      publishStore.articleImageList[index]
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
</script>
<template>
  <div class="publish-setting">
    <div class="publish-info">
      <div class="info__content">
        <div class="content__title">{{ publishStore.title }}</div>
        <div v-if="publishStore.coverType === 'image_list'" class="content__cover">
          <CoverPreview
            v-for="(item, index) in publishStore.articleCoverFileList"
            :key="index"
            :file="item"
            @after-read="(file) => afterRead(file, index)"
          />
        </div>
        <div class="content__user-info">用户{{ userStore.userInfo.user_id }}</div>
      </div>
      <div v-if="publishStore.coverType === 'image_right'" class="info__cover">
        <CoverPreview
          :file="publishStore.articleCoverFileList[0]"
          @after-read="(file) => afterRead(file, 0)"
        />
      </div>
    </div>
    <div class="cover-setting">
      <span class="setting__title">封面设置</span>

      <div class="setting__type" @click="changeCoverType">
        <span :class="{ selected: publishStore.coverType === 'image_none' }" data-ui="image_none">无图</span>
        <span :class="{ selected: publishStore.coverType === 'image_right' }" data-ui="image_right">
          单图
        </span>
        <span :class="{ selected: publishStore.coverType === 'image_list' }" data-ui="image_list">三图</span>
      </div>
    </div>
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
.publish-info {
  display: flex;
  position: relative;
  border-top: 1px solid var(--bg-color-3);
  border-bottom: 1px solid var(--bg-color-3);
  .info__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    .content__title {
      margin: 40px 40px 0;
      font-size: 34px;
      font-weight: 600;
      word-break: break-all;
    }
    .content__cover {
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
  .info__cover {
    .cover-preview {
      margin: 40px 30px 40px 0;
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
