import instance from '../request'

// 获取文章信息
export const getArticleInfoApi = (articleId) => {
  return instance({
    method: 'GET',
    url: '/article/info',
    params: {
      articleId,
    },
  })
}
// 收藏、取消收藏文章
export const collectArticleApi = (articleId, type) => {
  return instance({
    method: 'POST',
    url: '/article/collect',
    data: {
      articleId,
      type,
    },
  })
}
// 点赞、取消点赞文章
export const likeArticleApi = (articleId, type) => {
  return instance({
    method: 'POST',
    url: '/article/like',
    data: {
      articleId,
      type,
    },
  })
}

// 上传文章图片
export const uploadArticleImgApi = (formData) => {
  return instance({
    method: 'POST',
    url: '/article/publish/image',
    data: formData,
  })
}

// 上传文章封面
export const uploadArticleCoverApi = (formData) => {
  return instance({
    method: 'POST',
    url: '/article/publish/cover',
    data: formData,
  })
}
// 发布文章
export const publishArticleApi = (
  channelId,
  title,
  content,
  coverImage,
  articleImage,
  uiStyle,
  publishTime = ~~(Date.now() / 1000)
) => {
  return instance({
    method: 'POST',
    url: '/article/publish',
    data: {
      channelId,
      title,
      content,
      coverImage,
      articleImage,
      uiStyle,
      publishTime,
    },
  })
}
