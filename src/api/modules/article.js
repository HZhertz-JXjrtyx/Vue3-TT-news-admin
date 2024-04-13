import instance from '@/utils/request'

// 获取文章信息
export const getArticle = (params) => {
  console.log(params)
  return instance({
    method: 'GET',
    url: '/article/info',
    params,
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
