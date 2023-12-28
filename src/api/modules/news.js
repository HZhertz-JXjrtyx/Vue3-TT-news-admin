import instance from '@/utils/request'

//获取新闻数据
export const getNews = (params) => {
  console.log(params)
  return instance({
    method: 'GET',
    url: '/news/list',
    params
  })
}
