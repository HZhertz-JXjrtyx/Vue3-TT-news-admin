import instance from '@/utils/request'

export const login = (data) => {
  return instance({
    method: 'POST',
    url: '/user/login',
    data
  })
}
export const logout = () => {
  return instance({
    method: 'POST',
    url: '/user/logout'
  })
}
export const isOnlyName = (data) => {
  return instance({
    method: 'POST',
    url: '/user/checkname',
    data
  })
}
export const sendCode = (params) => {
  console.log(params)
  return instance({
    method: 'GET',
    url: '/user/codes',
    params
  })
}
export const register = (data) => {
  return instance({
    method: 'POST',
    url: '/user/register',
    data
  })
}
export const getUserInfo = () => {
  return instance({
    method: 'GET',
    url: '/user/info'
  })
}

// 关注、取消关注 用户
export const followUserApi = (userId, type) => {
  return instance({
    method: 'POST',
    url: '/user/followings',
    data: {
      userId,
      type
    }
  })
}
