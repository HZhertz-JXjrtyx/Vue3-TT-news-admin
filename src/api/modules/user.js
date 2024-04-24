import instance from '../request'

// 登录
export const login = (data) => {
  return instance({
    method: 'POST',
    url: '/user/login',
    data,
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
// 用户名是否可用
export const isOnlyName = (data) => {
  return instance({
    method: 'POST',
    url: '/user/checkname',
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
// 发送验证码
export const sendCodeApi = (userName, userEmail, type) => {
  return instance({
    method: 'GET',
    url: '/user/codes',
    params: {
      userName,
      userEmail,
      type,
    },
  })
}

// 获取登录用户信息
export const getUserInfo = () => {
  return instance({
    method: 'GET',
    url: '/user/info',
  })
}
// 获取用户信息
export const getUserDetailApi = (userId) => {
  return instance({
    method: 'GET',
    url: '/user/detail',
    params: {
      userId,
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
// 获取登录用户绑定信息
export const getUserBindApi = () => {
  return instance({
    method: 'GET',
    url: '/user/bind',
  })
}
// 修改密码
export const changeUserPwdApi = (oldPwd, newPwd, code) => {
  return instance({
    method: 'PATCH',
    url: '/user/password',
    data: { oldPwd, newPwd, code },
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
    url: '/user/follow',
    data: {
      userId,
      type,
    },
  })
}

// 获取用户作品
// type: all article video
export const getUserWorksApi = (userId, type, page = 1, size = 10) => {
  return instance({
    method: 'GET',
    url: '/user/works',
    params: {
      userId,
      type,
      page,
      size,
    },
  })
}
// 获取用户粉丝
export const getUserfansApi = (userId, page = 1, size = 10) => {
  return instance({
    method: 'GET',
    url: '/user/fans',
    params: {
      userId,
      page,
      size,
    },
  })
}
// 获取用户关注
export const getUserfollowersApi = (userId, page = 1, size = 10) => {
  return instance({
    method: 'GET',
    url: '/user/followers',
    params: {
      userId,
      page,
      size,
    },
  })
}
// 获取用户收藏列表
export const getUserFavoriteApi = (type, page = 1, size = 10) => {
  return instance({
    method: 'GET',
    url: '/user/favorite',
    params: {
      type,
      page,
      size,
    },
  })
}
// 新增浏览历史
export const addUserBrowseApi = (id, type) => {
  return instance({
    method: 'POST',
    url: '/user/browse',
    data: {
      id,
      type,
    },
  })
}

// 获取用户浏览历史
export const getUserBrowseApi = (type, page = 1, size = 10) => {
  return instance({
    method: 'GET',
    url: '/user/browse',
    params: {
      type,
      page,
      size,
    },
  })
}
