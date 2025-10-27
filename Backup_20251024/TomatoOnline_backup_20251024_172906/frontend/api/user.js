import api from './index'

// 用户登录
export const login = (credentials) => {
  return api.post('/user/add', credentials)
}

// 用户注册
export const register = (userData) => {
  return api.post('/user/add', userData)
}

// 获取用户信息
export const getUserInfo = () => {
  return api.get('/user/list')
}

// 更新用户信息
export const updateUser = (userData) => {
  return api.put('/user/update', userData)
}

// 修改密码
export const changePassword = (passwordData) => {
  return api.put('/user/update', passwordData)
}
