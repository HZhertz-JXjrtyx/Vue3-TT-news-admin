import instance from '../request'

//获取新闻列表数据
export const getNewsListApi = (channelId, page, size) => {
  return instance({
    method: 'GET',
    url: '/news/list',
    params: {
      channelId,
      page,
      size,
    },
  })
}
//获取热点列表数据
export const getHotListApi = () => {
  return instance({
    method: 'GET',
    url: '/news/hotlist',
  })
}
