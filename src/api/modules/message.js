import instance from '../request'

// 获取对话列表
export const getChatListApi = (userId) => {
  return instance({
    method: 'GET',
    url: '/message/chat/list',
    params: {
      userId,
    },
  })
}
// 获取通知列表
// type:comment like follow
export const getNotifyListApi = (userId, type) => {
  return instance({
    method: 'GET',
    url: '/message/notify/list',
    params: {
      userId,
      type,
    },
  })
}
