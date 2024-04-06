import instance from '@/utils/request'

export const getUserChannels = () => {
  return instance({
    method: 'GET',
    url: '/channel/user',
  })
}
export const updateUserChannels = (data) => {
  return instance({
    method: 'PATCH',
    url: '/channel/user',
    data,
  })
}
