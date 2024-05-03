import { defineStore } from 'pinia'
import { ref } from 'vue'
import storeNames from '../storeNames'
import { publishArticleApi } from '@/api'

export const usePublishStore = defineStore(storeNames.PUBLISH, () => {
  // 标题
  const title = ref('')
  // 富文本编辑器内容
  const quillContent = ref('')
  // 要上传的文章内容
  const articleContent = ref('')
  // 文章图片文件列表 存储 dataUrl 与 File
  // 文件上传成功后将 quillContent 中的 dataUrl 替换为 数据库存储的 url
  const articleImageFileList = ref([])
  // 文章图片列表
  const articleImageSrcList = ref([])
  // 封面文件列表
  const articleCoverFileList = ref(new Array(3))
  // 封面列表
  const articleCoverSrcList = ref([])
  // 封面图片数量
  const coverType = ref('')
  // 频道
  const channelId = ref('')

  // 视频简介
  const videoIntro = ref('')
  // 视频时长
  const videoDuration = ref(0)
  // 视频文件
  const videoFile = ref(null)
  // 视频地址
  const videoSrc = ref('')
  // 视频封面 dataUrl
  const videoCoverDataurl = ref('')
  // 视频封面
  const videoCoverFile = ref(null)
  // 视频封面地址
  const videoCoverSrc = ref('')

  const publishArticle = async () => {
    return await publishArticleApi(
      channelId.value,
      title.value,
      articleContent.value,
      articleCoverSrcList.value,
      articleImageSrcList.value,
      coverType.value
    )
  }
  const initialize = () => {
    title.value = ''
    quillContent.value = ''
    articleContent.value = ''
    articleImageFileList.value = []
    articleImageSrcList.value = []
    articleCoverFileList.value = new Array(3)
    articleCoverSrcList.value = []
    coverType.value = ''
    channelId.value = ''
  }

  return {
    title,
    quillContent,
    articleContent,
    articleImageFileList,
    articleImageSrcList,
    articleCoverFileList,
    articleCoverSrcList,
    coverType,
    channelId,
    videoIntro,
    videoDuration,
    videoFile,
    videoSrc,
    videoCoverDataurl,
    videoCoverFile,
    videoCoverSrc,
    publishArticle,
    initialize,
  }
})
