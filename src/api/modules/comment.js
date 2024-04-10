import instance from '@/utils/request'

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
