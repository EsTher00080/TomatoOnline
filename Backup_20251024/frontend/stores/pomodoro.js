import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePomodoroStore = defineStore('pomodoro', () => {
  const isRunning = ref(false)
  const isPaused = ref(false)
  const timeLeft = ref(25 * 60) // 25分钟，以秒为单位
  const totalTime = ref(25 * 60)
  const mode = ref('work') // work, shortBreak, longBreak
  const sessionCount = ref(0)
  const timer = ref(null)

  const minutes = computed(() => Math.floor(timeLeft.value / 60))
  const seconds = computed(() => timeLeft.value % 60)
  const progress = computed(() => ((totalTime.value - timeLeft.value) / totalTime.value) * 100)

  const startTimer = () => {
    if (isPaused.value) {
      isPaused.value = false
    } else {
      isRunning.value = true
    }
    
    timer.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        completeSession()
      }
    }, 1000)
  }

  const pauseTimer = () => {
    isPaused.value = true
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  const resetTimer = () => {
    isRunning.value = false
    isPaused.value = false
    timeLeft.value = totalTime.value
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }

  const setMode = (newMode) => {
    mode.value = newMode
    resetTimer()
    
    switch (newMode) {
      case 'work':
        totalTime.value = 25 * 60
        timeLeft.value = 25 * 60
        break
      case 'shortBreak':
        totalTime.value = 5 * 60
        timeLeft.value = 5 * 60
        break
      case 'longBreak':
        totalTime.value = 15 * 60
        timeLeft.value = 15 * 60
        break
    }
  }

  const completeSession = () => {
    isRunning.value = false
    isPaused.value = false
    
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }

    if (mode.value === 'work') {
      sessionCount.value++
      // 每4个番茄钟后进入长休息
      if (sessionCount.value % 4 === 0) {
        setMode('longBreak')
      } else {
        setMode('shortBreak')
      }
    } else {
      setMode('work')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    isRunning,
    isPaused,
    timeLeft,
    totalTime,
    mode,
    sessionCount,
    minutes,
    seconds,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    setMode,
    completeSession,
    formatTime
  }
})
