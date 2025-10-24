import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, register, getUserInfo, updateUser } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  const loginUser = async (credentials) => {
    try {
      const response = await login(credentials)
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      return response
    } catch (error) {
      throw error
    }
  }

  const registerUser = async (userData) => {
    try {
      const response = await register(userData)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo()
      user.value = response.data
      return response
    } catch (error) {
      logout()
      throw error
    }
  }

  const updateUserInfo = async (userData) => {
    try {
      const response = await updateUser(userData)
      user.value = { ...user.value, ...response.data }
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    loginUser,
    registerUser,
    logout,
    fetchUserInfo,
    updateUserInfo
  }
})
