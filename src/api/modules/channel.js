import instance from '@/utils/request'

export const getUserChannels = () => {
  return instance({
    method: 'GET',
    url: '/channel/user'
  })
}
