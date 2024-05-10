import instance from '../request'

// 获取通知列表
export const getNotifyListApi = (userId) => {
  return instance({
    method: 'GET',
    url: '/message/notify/list',
    params: {
      userId,
    },
  })
}
// 获取通知消息内容
// type:comment like follow
export const getNotifyDetailApi = (userId, type, page, size) => {
  return instance({
    method: 'GET',
    url: '/message/notify/detail',
    params: {
      userId,
      type,
      page,
      size,
    },
  })
}
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
// 获取对话消息内容
export const getChatDetailApi = (userId, conversationId) => {
  return instance({
    method: 'GET',
    url: '/message/chat/detail',
    params: {
      userId,
      conversationId,
    },
  })
}
