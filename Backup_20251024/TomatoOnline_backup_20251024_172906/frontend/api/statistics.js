import api from './index'

// 获取学习统计
export const getStudyStatistics = (params = {}) => {
  return api.get('/study_log/statistics', { params })
}

// 获取每日学习时长
export const getDailyStudyTime = (date) => {
  return api.get('/study_log/daily', { params: { date } })
}

// 获取每周学习时长
export const getWeeklyStudyTime = (week) => {
  return api.get('/study_log/weekly', { params: { week } })
}

// 获取每月学习时长
export const getMonthlyStudyTime = (month) => {
  return api.get('/study_log/monthly', { params: { month } })
}

// 获取学习记录
export const getStudyLogs = (params = {}) => {
  return api.get('/study_log/list', { params })
}

// 创建学习记录
export const createStudyLog = (logData) => {
  return api.post('/study_log/add', logData)
}
