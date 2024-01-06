import instance from '@/utils/request'

export const getComment = (params) => {
  console.log(params)
  return instance({
    method: 'GET',
    url: '/comment/list',
    params
  })
}
