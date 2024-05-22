import instance from '../request'

// 获取未读消息数
export const getTotalUnreadCountApi = () => {
  return instance({
    method: 'GET',
    url: '/message/unread/total',
  })
}

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
// 是否已有对话
export const isHaveChat = (interlocutor) => {
  return instance({
    method: 'GET',
    url: '/message/chat/ishas',
    params: {
      interlocutor,
    },
  })
}
// 新增对话
export const addChatApi = (interlocutor) => {
  return instance({
    method: 'POST',
    url: '/message/chat/add',
    data: {
      interlocutor,
    },
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

// 发送对话消息
export const sendChatMessageApi = (receiverId, conversationId, content, createdAt = Date.now()) => {
  return instance({
    method: 'POST',
    url: '/message/chat/send',
    data: {
      receiverId,
      conversationId,
      content,
      createdAt,
    },
  })
}

// 清除未读消息
// messageType: comment,like,follow,chat,all
export const clearUnreadApi = (messageType, conversationId) => {
  return instance({
    method: 'PATCH',
    url: '/message/clear/unread',
    data: {
      messageType,
      conversationId,
    },
  })
}
