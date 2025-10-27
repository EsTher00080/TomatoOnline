<template>
  <div class="home-container">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <n-card>
        <div class="welcome-content">
          <div class="welcome-text">
            <h2>欢迎回来，{{ userStore.user?.username }}！</h2>
            <p>今天也要保持专注，高效学习哦～</p>
          </div>
          <div class="welcome-stats">
            <n-statistic label="今日学习时长" :value="todayStudyTime" suffix="分钟" />
            <n-statistic label="连续学习天数" :value="userStore.user?.consecutiveDays || 0" suffix="天" />
          </div>
        </div>
      </n-card>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧：番茄钟 -->
      <div class="left-panel">
        <n-card title="番茄钟" class="timer-card">
          <PomodoroTimer />
        </n-card>
      </div>

      <!-- 右侧：任务概览 -->
      <div class="right-panel">
        <!-- 任务统计 -->
        <n-card title="任务概览" class="stats-card">
          <div class="task-stats">
            <n-statistic label="总任务数" :value="taskStats.total" />
            <n-statistic label="已完成" :value="taskStats.completed" />
            <n-statistic label="进行中" :value="taskStats.inProgress" />
            <n-statistic label="待开始" :value="taskStats.pending" />
          </div>
        </n-card>

        <!-- 最近任务 -->
        <n-card title="最近任务" class="recent-tasks-card">
          <div v-if="recentTasks.length === 0" class="empty-state">
            <n-empty description="暂无任务">
              <template #extra>
                <n-button type="primary" @click="$router.push('/tasks')">
                  创建任务
                </n-button>
              </template>
            </n-empty>
          </div>
          <div v-else class="task-list">
            <div
              v-for="task in recentTasks"
              :key="task.id"
              class="task-item"
              @click="handleTaskClick(task)"
            >
              <div class="task-info">
                <h4>{{ task.taskName }}</h4>
                <p>{{ task.description || '暂无描述' }}</p>
              </div>
              <div class="task-meta">
                <n-tag :type="getStatusType(task.status)">
                  {{ getStatusText(task.status) }}
                </n-tag>
                <span class="task-duration">{{ task.plannedDuration }}分钟</span>
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <n-card title="快速操作">
        <div class="action-buttons">
          <n-button type="primary" @click="$router.push('/tasks')">
            <template #icon>
              <n-icon>
                <AddIcon />
              </n-icon>
            </template>
            创建任务
          </n-button>
          <n-button @click="$router.push('/statistics')">
            <template #icon>
              <n-icon>
                <BarChartIcon />
              </n-icon>
            </template>
            查看统计
          </n-button>
          <n-button @click="$router.push('/profile')">
            <template #icon>
              <n-icon>
                <SettingsIcon />
              </n-icon>
            </template>
            个人设置
          </n-button>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useTasksStore } from '@/stores/tasks'
import { useMessage } from 'naive-ui'
import PomodoroTimer from '@/components/PomodoroTimer.vue'
import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon
} from '@vicons/ionicons5'

const router = useRouter()
const userStore = useUserStore()
const tasksStore = useTasksStore()
const message = useMessage()

const todayStudyTime = ref(0)
const recentTasks = ref([])

// 任务统计
const taskStats = computed(() => {
  const tasks = tasksStore.tasks
  return {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in_progress').length,
    pending: tasks.filter(task => task.status === 'pending').length
  }
})

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'in_progress':
      return 'warning'
    case 'pending':
      return 'default'
    default:
      return 'default'
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return '已完成'
    case 'in_progress':
      return '进行中'
    case 'pending':
      return '待开始'
    default:
      return '未知'
  }
}

// 处理任务点击
const handleTaskClick = (task) => {
  router.push({ name: 'Tasks', query: { taskId: task.id } })
}

// 加载数据
const loadData = async () => {
  try {
    await tasksStore.fetchTasks()
    recentTasks.value = tasksStore.tasks.slice(0, 5)
  } catch (error) {
    message.error('加载数据失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 24px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.welcome-text p {
  margin: 0;
  color: #666;
}

.welcome-stats {
  display: flex;
  gap: 32px;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.timer-card {
  height: fit-content;
}

.stats-card {
  margin-bottom: 24px;
}

.task-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.task-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #333;
}

.task-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.task-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.task-duration {
  font-size: 12px;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .welcome-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .welcome-stats {
    gap: 16px;
  }
  
  .task-stats {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
