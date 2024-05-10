import instance from '../request'

// 获取通知列表
export const getNotifyListApi = () => {
  return instance({
    method: 'GET',
    url: '/message/notify/list',
  })
}
// 获取通知消息内容
// type:comment like follow
export const getNotifyDetailApi = (type, page, size) => {
  return instance({
    method: 'GET',
    url: '/message/notify/detail',
    params: {
      type,
      page,
      size,
    },
  })
}
// 获取对话列表
export const getChatListApi = () => {
  return instance({
    method: 'GET',
    url: '/message/chat/list',
  })
}
// 获取对话消息内容
export const getChatDetailApi = (conversationId) => {
  return instance({
    method: 'GET',
    url: '/message/chat/detail',
    params: {
      conversationId,
    },
  })
}
