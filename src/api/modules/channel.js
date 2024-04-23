import instance from '../request'

// 获取用户频道列表
export const getUserChannelsApi = () => {
  return instance({
    method: 'GET',
    url: '/channel/user',
  })
}
// 更新用户频道列表
export const updateUserChannelsApi = (data) => {
  return instance({
    method: 'PATCH',
    url: '/channel/user',
    data,
  })
}
