import instance from '@/utils/request'

//获取新闻数据
export const getNews = (params) => {
  return instance({
    method: 'GET',
    url: '/news/list',
    params,
  })
}
//获取热点列表数据
export const getHotListApi = () => {
  return instance({
    method: 'GET',
    url: '/news/hotlist',
  })
}
