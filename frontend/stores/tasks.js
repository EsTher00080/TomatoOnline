import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTasks, createTask, updateTask, deleteTask } from '@/api/tasks'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)

  const fetchTasks = async () => {
    loading.value = true
    try {
      const response = await getTasks()
      tasks.value = response.data
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const addTask = async (taskData) => {
    try {
      const response = await createTask(taskData)
      tasks.value.push(response.data)
      return response
    } catch (error) {
      throw error
    }
  }

  const editTask = async (id, taskData) => {
    try {
      const response = await updateTask(id, taskData)
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      return response
    } catch (error) {
      throw error
    }
  }

  const removeTask = async (id) => {
    try {
      await deleteTask(id)
      tasks.value = tasks.value.filter(task => task.id !== id)
    } catch (error) {
      throw error
    }
  }

  const getTaskById = (id) => {
    return tasks.value.find(task => task.id === id)
  }

  const getTasksByStatus = (status) => {
    return tasks.value.filter(task => task.status === status)
  }

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    getTaskById,
    getTasksByStatus
  }
})
