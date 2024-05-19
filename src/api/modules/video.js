import instance from '../request'

// 获取视频信息
export const getVideoInfoApi = (videoId) => {
  return instance({
    method: 'GET',
    url: '/video/info',
    params: {
      videoId,
    },
  })
}
// 收藏、取消收藏视频
export const collectVideoApi = (videoId, type) => {
  return instance({
    method: 'POST',
    url: '/video/collect',
    data: {
      videoId,
      type,
    },
  })
}
// 点赞、取消点赞视频
export const likeVideoApi = (videoId, type) => {
  return instance({
    method: 'POST',
    url: '/video/like',
    data: {
      videoId,
      type,
    },
  })
}

// 上传视频
export const uploadVideoApi = (formData) => {
  return instance({
    method: 'POST',
    url: '/video/publish/video',
    data: formData,
  })
}

// 上传视频封面
export const uploadVideoCoverApi = (formData) => {
  return instance({
    method: 'POST',
    url: '/video/publish/cover',
    data: formData,
  })
}
// 发布视频
export const publishVideoApi = (
  channelId,
  title,
  intro,
  video,
  coverImage,
  duration,
  uiStyle,
  publishTime = ~~(Date.now() / 1000)
) => {
  return instance({
    method: 'POST',
    url: '/video/publish',
    data: {
      channelId,
      title,
      intro,
      video,
      coverImage,
      duration,
      uiStyle,
      publishTime,
    },
  })
}
