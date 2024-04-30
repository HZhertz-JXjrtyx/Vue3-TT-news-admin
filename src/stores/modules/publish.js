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
  const articleImageList = ref([])
  // 封面文件列表
  const articleCoverFileList = ref(new Array(3))
  // 封面列表
  const articleCoverList = ref([])
  // 封面图片数量
  const coverType = ref('')
  // 频道
  const channelId = ref('')

  const publishArticle = async () => {
    return await publishArticleApi(
      channelId.value,
      title.value,
      articleContent.value,
      articleCoverList.value,
      articleImageList.value,
      coverType.value
    )
  }

  return {
    title,
    quillContent,
    articleContent,
    articleImageFileList,
    articleImageList,
    articleCoverFileList,
    articleCoverList,
    coverType,
    channelId,
    publishArticle,
  }
})
