<template>
  <div class="tasks-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>任务管理</h2>
      <n-button type="primary" @click="showCreateModal = true">
        <template #icon>
          <n-icon>
            <AddIcon />
          </n-icon>
        </template>
        创建任务
      </n-button>
    </div>

    <!-- 任务筛选 -->
    <n-card class="filter-card">
      <div class="filter-content">
        <n-space>
          <n-select
            v-model:value="filters.status"
            placeholder="选择状态"
            :options="statusOptions"
            clearable
            style="width: 120px"
          />
          <n-select
            v-model:value="filters.priority"
            placeholder="选择优先级"
            :options="priorityOptions"
            clearable
            style="width: 120px"
          />
          <n-input
            v-model:value="filters.keyword"
            placeholder="搜索任务名称"
            clearable
            style="width: 200px"
          />
          <n-button @click="handleFilter">
            <template #icon>
              <n-icon>
                <SearchIcon />
              </n-icon>
            </template>
            搜索
          </n-button>
          <n-button @click="handleReset">
            <template #icon>
              <n-icon>
                <RefreshIcon />
              </n-icon>
            </template>
            重置
          </n-button>
        </n-space>
      </div>
    </n-card>

    <!-- 任务列表 -->
    <n-card class="tasks-card">
      <div v-if="tasksStore.loading" class="loading">
        <n-spin size="large" />
      </div>
      <div v-else-if="filteredTasks.length === 0" class="empty-state">
        <n-empty description="暂无任务">
          <template #extra>
            <n-button type="primary" @click="showCreateModal = true">
              创建第一个任务
            </n-button>
          </template>
        </n-empty>
      </div>
      <div v-else class="task-list">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-item"
          :class="{ 'task-completed': task.status === 'completed' }"
        >
          <div class="task-main">
            <div class="task-header">
              <h3 class="task-title">{{ task.taskName }}</h3>
              <div class="task-actions">
                <n-button
                  size="small"
                  @click="handleEdit(task)"
                >
                  编辑
                </n-button>
                <n-button
                  size="small"
                  type="error"
                  @click="handleDelete(task)"
                >
                  删除
                </n-button>
              </div>
            </div>
            <p class="task-description">{{ task.description || '暂无描述' }}</p>
            <div class="task-meta">
              <n-tag :type="getStatusType(task.status)">
                {{ getStatusText(task.status) }}
              </n-tag>
              <span class="task-duration">{{ task.plannedDuration }}分钟</span>
              <span class="task-time">
                {{ formatDate(task.createTime) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </n-card>

    <!-- 创建/编辑任务弹窗 -->
    <n-modal v-model:show="showCreateModal" preset="card" title="创建任务" size="huge">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="任务名称" path="taskName">
          <n-input v-model:value="formData.taskName" placeholder="请输入任务名称" />
        </n-form-item>
        <n-form-item label="任务描述" path="description">
          <n-input
            v-model:value="formData.description"
            type="textarea"
            placeholder="请输入任务描述"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </n-form-item>
        <n-form-item label="计划时长" path="plannedDuration">
          <n-input-number
            v-model:value="formData.plannedDuration"
            :min="1"
            :max="480"
            placeholder="分钟"
            style="width: 200px"
          />
        </n-form-item>
        <n-form-item label="优先级" path="priority">
          <n-select
            v-model:value="formData.priority"
            :options="priorityOptions"
            placeholder="选择优先级"
          />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select
            v-model:value="formData.status"
            :options="statusOptions"
            placeholder="选择状态"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="handleCancel">取消</n-button>
          <n-button type="primary" :loading="submitLoading" @click="handleSubmit">
            {{ isEdit ? '更新' : '创建' }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useMessage, useDialog } from 'naive-ui'
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@vicons/ionicons5'

const tasksStore = useTasksStore()
const message = useMessage()
const dialog = useDialog()

const showCreateModal = ref(false)
const submitLoading = ref(false)
const isEdit = ref(false)
const editingTask = ref(null)

const formRef = ref(null)

const filters = reactive({
  status: null,
  priority: null,
  keyword: ''
})

const formData = reactive({
  taskName: '',
  description: '',
  plannedDuration: 25,
  priority: 'medium',
  status: 'pending'
})

const statusOptions = [
  { label: '待开始', value: 'pending' },
  { label: '进行中', value: 'in_progress' },
  { label: '已完成', value: 'completed' }
]

const priorityOptions = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' }
]

const rules = {
  taskName: [
    { required: true, message: '请输入任务名称', trigger: 'blur' }
  ],
  plannedDuration: [
    { required: true, message: '请输入计划时长', trigger: 'blur' }
  ]
}

// 过滤后的任务列表
const filteredTasks = computed(() => {
  let tasks = tasksStore.tasks

  if (filters.status) {
    tasks = tasks.filter(task => task.status === filters.status)
  }

  if (filters.priority) {
    tasks = tasks.filter(task => task.priority === filters.priority)
  }

  if (filters.keyword) {
    tasks = tasks.filter(task =>
      task.taskName.toLowerCase().includes(filters.keyword.toLowerCase())
    )
  }

  return tasks
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

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 处理筛选
const handleFilter = () => {
  // 筛选逻辑已在 computed 中处理
}

// 重置筛选
const handleReset = () => {
  filters.status = null
  filters.priority = null
  filters.keyword = ''
}

// 处理编辑
const handleEdit = (task) => {
  isEdit.value = true
  editingTask.value = task
  Object.assign(formData, task)
  showCreateModal.value = true
}

// 处理删除
const handleDelete = (task) => {
  dialog.warning({
    title: '确认删除',
    content: `确定要删除任务"${task.taskName}"吗？`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await tasksStore.removeTask(task.id)
        message.success('删除成功')
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

// 处理提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitLoading.value = true

    if (isEdit.value) {
      await tasksStore.editTask(editingTask.value.id, formData)
      message.success('更新成功')
    } else {
      await tasksStore.addTask(formData)
      message.success('创建成功')
    }

    handleCancel()
  } catch (error) {
    message.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

// 处理取消
const handleCancel = () => {
  showCreateModal.value = false
  isEdit.value = false
  editingTask.value = null
  Object.assign(formData, {
    taskName: '',
    description: '',
    plannedDuration: 25,
    priority: 'medium',
    status: 'pending'
  })
}

// 加载数据
const loadData = async () => {
  try {
    await tasksStore.fetchTasks()
  } catch (error) {
    message.error('加载数据失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.tasks-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.filter-card {
  margin-bottom: 24px;
}

.filter-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.tasks-card {
  min-height: 400px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-item {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  background: white;
  transition: all 0.2s ease;
}

.task-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.task-item.task-completed {
  opacity: 0.7;
  background: #f8f9fa;
}

.task-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.task-title {
  margin: 0;
  font-size: 18px;
  color: #333;
  flex: 1;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.task-description {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.task-duration,
.task-time {
  font-size: 14px;
  color: #999;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .filter-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .task-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .task-actions {
    align-self: flex-start;
  }
  
  .task-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
