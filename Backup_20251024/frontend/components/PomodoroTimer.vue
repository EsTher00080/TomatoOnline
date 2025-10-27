<template>
  <div class="pomodoro-timer">
    <div class="timer-container">
      <!-- 模式选择 -->
      <div class="mode-selector">
        <n-button-group>
          <n-button
            :type="pomodoroStore.mode === 'work' ? 'primary' : 'default'"
            @click="pomodoroStore.setMode('work')"
          >
            工作 (25分钟)
          </n-button>
          <n-button
            :type="pomodoroStore.mode === 'shortBreak' ? 'primary' : 'default'"
            @click="pomodoroStore.setMode('shortBreak')"
          >
            短休息 (5分钟)
          </n-button>
          <n-button
            :type="pomodoroStore.mode === 'longBreak' ? 'primary' : 'default'"
            @click="pomodoroStore.setMode('longBreak')"
          >
            长休息 (15分钟)
          </n-button>
        </n-button-group>
      </div>

      <!-- 计时器圆圈 -->
      <div class="timer-circle" :class="{ 'timer-running': pomodoroStore.isRunning }">
        <div class="timer-content">
          <div class="timer-text">
            {{ pomodoroStore.formatTime(pomodoroStore.timeLeft) }}
          </div>
          <div class="timer-mode">
            {{ getModeText() }}
          </div>
        </div>
        <!-- 进度环 -->
        <svg class="progress-ring" width="200" height="200">
          <circle
            class="progress-ring-circle"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            cx="100"
            cy="100"
            r="90"
          />
        </svg>
      </div>

      <!-- 控制按钮 -->
      <div class="timer-controls">
        <n-button
          v-if="!pomodoroStore.isRunning"
          type="primary"
          size="large"
          @click="pomodoroStore.startTimer()"
        >
          <template #icon>
            <n-icon>
              <PlayIcon />
            </n-icon>
          </template>
          开始
        </n-button>
        <template v-else>
          <n-button
            v-if="!pomodoroStore.isPaused"
            type="warning"
            size="large"
            @click="pomodoroStore.pauseTimer()"
          >
            <template #icon>
              <n-icon>
                <PauseIcon />
              </n-icon>
            </template>
            暂停
          </n-button>
          <n-button
            v-else
            type="success"
            size="large"
            @click="pomodoroStore.startTimer()"
          >
            <template #icon>
              <n-icon>
                <PlayIcon />
              </n-icon>
            </template>
            继续
          </n-button>
        </template>
        <n-button
          size="large"
          @click="pomodoroStore.resetTimer()"
        >
          <template #icon>
            <n-icon>
              <RefreshIcon />
            </n-icon>
          </template>
          重置
        </n-button>
      </div>

      <!-- 会话统计 -->
      <div class="session-stats">
        <n-statistic label="已完成会话" :value="pomodoroStore.sessionCount" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePomodoroStore } from '@/stores/pomodoro'
import {
  Play as PlayIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon
} from '@vicons/ionicons5'

const pomodoroStore = usePomodoroStore()

// 进度环计算
const circumference = computed(() => 2 * Math.PI * 90)
const strokeDashoffset = computed(() => {
  const progress = pomodoroStore.progress / 100
  return circumference.value - (progress * circumference.value)
})

const getModeText = () => {
  switch (pomodoroStore.mode) {
    case 'work':
      return '专注时间'
    case 'shortBreak':
      return '短休息'
    case 'longBreak':
      return '长休息'
    default:
      return '专注时间'
  }
}
</script>

<style scoped>
.pomodoro-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.timer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.mode-selector {
  display: flex;
  gap: 8px;
}

.timer-circle {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b35, #ff8a65);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.timer-circle.timer-running {
  box-shadow: 0 0 30px rgba(255, 107, 53, 0.5);
}

.timer-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.timer-text {
  font-size: 48px;
  font-weight: bold;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.timer-mode {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 8px;
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
}

.progress-ring-circle {
  fill: none;
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.timer-controls {
  display: flex;
  gap: 16px;
}

.session-stats {
  text-align: center;
}

@media (max-width: 768px) {
  .pomodoro-timer {
    padding: 24px;
  }
  
  .timer-circle {
    width: 160px;
    height: 160px;
  }
  
  .timer-text {
    font-size: 36px;
  }
  
  .progress-ring {
    width: 160px;
    height: 160px;
  }
  
  .progress-ring-circle {
    cx: 80;
    cy: 80;
    r: 72;
  }
}
</style>
