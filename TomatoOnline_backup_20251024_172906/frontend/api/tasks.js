import api from './index'

// 获取任务列表
export const getTasks = (params = {}) => {
  return api.get('/pomodoro_task/list', { params })
}

// 创建任务
export const createTask = (taskData) => {
  return api.post('/pomodoro_task/add', taskData)
}

// 更新任务
export const updateTask = (id, taskData) => {
  return api.put(`/pomodoro_task/update/${id}`, taskData)
}

// 删除任务
export const deleteTask = (id) => {
  return api.delete(`/pomodoro_task/delete/${id}`)
}

// 获取任务详情
export const getTask = (id) => {
  return api.get(`/pomodoro_task/${id}`)
}

// 更新任务状态
export const updateTaskStatus = (id, status) => {
  return api.put(`/pomodoro_task/update/${id}`, { status })
}
