import instance from '@/utils/request'

// 登录
export const login = (data) => {
  return instance({
    method: 'POST',
    url: '/user/login',
    data,
  })
}

// 登出
export const logout = () => {
  return instance({
    method: 'POST',
    url: '/user/logout',
  })
}

// 用户名是否可用
export const isOnlyName = (data) => {
  return instance({
    method: 'POST',
    url: '/user/checkname',
    data,
  })
}

// 发送验证码
export const sendCode = (params) => {
  console.log(params)
  return instance({
    method: 'GET',
    url: '/user/codes',
    params,
  })
}

// 注册
export const register = (data) => {
  return instance({
    method: 'POST',
    url: '/user/register',
    data,
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return instance({
    method: 'GET',
    url: '/user/info',
  })
}

// 是否关注
export const isFollowUserApi = (userId) => {
  return instance({
    method: 'GET',
    url: '/user/isfollow',
    params: {
      userId,
    },
  })
}
// 关注、取消关注 用户
export const followUserApi = (userId, type) => {
  return instance({
    method: 'POST',
    url: '/user/followings',
    data: {
      userId,
      type,
    },
  })
}

// 上传头像
export const uploadUserAvatarApi = (formData) => {
  return instance({
    method: 'POST',
    url: '/user/upload/avatar',
    data: formData,
  })
}

// 更新资料
export const updateUserProfileApi = (data) => {
  return instance({
    method: 'PATCH',
    url: '/user/profile',
    data,
  })
}
