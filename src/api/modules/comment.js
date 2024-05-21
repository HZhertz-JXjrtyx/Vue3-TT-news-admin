import instance from '../request'

// 获取评论列表
// commentType:评论类型 1：文章评论 2：视频评论 3：评论回复 4: 回复回复
// relatedEntity：根据类型不同表示不同的id
export const getCommentListApi = (commentType, relatedEntity, page, size) => {
  return instance({
    method: 'GET',
    url: '/comment/list',
    params: {
      commentType,
      relatedEntity,
      page,
      size,
    },
  })
}

// 新增评论
export const addCommentApi = (
  commentType,
  replyUser = '',
  content,
  createdTime = Date.now(),
  parentComment = '',
  relatedEntity,
  relatedWork,
  workType
) => {
  return instance({
    method: 'POST',
    url: '/comment/add',
    data: {
      commentType,
      replyUser,
      content,
      createdTime,
      parentComment,
      relatedEntity,
      relatedWork,
      workType,
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

// 删除评论
export const deleteCommentApi = (commentId, commentType, relatedId) => {
  return instance({
    method: 'DELETE',
    url: '/comment/delete',
    data: {
      commentId,
      commentType,
      relatedId,
    },
  })
}

// 获取评论详情
export const getCommentDetailApi = (commentId) => {
  return instance({
    method: 'GET',
    url: '/comment/detail',
    params: {
      commentId,
    },
  })
}
