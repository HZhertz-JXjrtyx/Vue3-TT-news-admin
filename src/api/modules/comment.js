import instance from '@/utils/request'

// 获取评论
// type:评论类型 1：文章评论 2：视频评论 3：评论回复
// id：根据类型不同表示不同的id
export const getComment = (type, id, page, pageSize) => {
  return instance({
    method: 'GET',
    url: '/comment/list',
    params: {
      type,
      id,
      page,
      pageSize,
    },
  })
}

// 新增评论
// content:评论内容 pubTime:发布时间 replyId:如果是评论回复，回复的用户的id
export const addCommentApi = (type, id, content, replyId = 0, pubTime = ~~(Date.now() / 1000)) => {
  return instance({
    method: 'POST',
    url: '/comment/add',
    data: {
      type,
      id,
      content,
      replyId,
      pubTime,
    },
  })
}

// 点赞评论
export const likeCommentApi = (commentId, type) => {
  return instance({
    method: 'POST',
    url: '/comment/like',
    data: {
      commentId,
      type,
    },
  })
}
