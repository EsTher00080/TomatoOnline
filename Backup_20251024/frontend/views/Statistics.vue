<template>
  <div class="statistics-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>学习统计</h2>
      <div class="header-actions">
        <n-select
          v-model:value="timeRange"
          :options="timeRangeOptions"
          style="width: 120px"
          @update:value="handleTimeRangeChange"
        />
        <n-button @click="refreshData">
          <template #icon>
            <n-icon>
              <RefreshIcon />
            </n-icon>
          </template>
          刷新
        </n-button>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <n-card title="学习概览">
        <div class="overview-grid">
          <div class="stat-item">
            <n-statistic label="总学习时长" :value="totalStudyTime" suffix="分钟" />
          </div>
          <div class="stat-item">
            <n-statistic label="今日学习" :value="todayStudyTime" suffix="分钟" />
          </div>
          <div class="stat-item">
            <n-statistic label="本周学习" :value="weekStudyTime" suffix="分钟" />
          </div>
          <div class="stat-item">
            <n-statistic label="连续天数" :value="consecutiveDays" suffix="天" />
          </div>
        </div>
      </n-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <div class="chart-row">
        <!-- 每日学习时长 -->
        <n-card title="每日学习时长" class="chart-card">
          <div v-if="dailyChartLoading" class="chart-loading">
            <n-spin size="large" />
          </div>
          <div v-else class="chart-container">
            <v-chart
              :option="dailyChartOption"
              style="height: 300px; width: 100%"
            />
          </div>
        </n-card>

        <!-- 学习时长分布 -->
        <n-card title="学习时长分布" class="chart-card">
          <div v-if="distributionChartLoading" class="chart-loading">
            <n-spin size="large" />
          </div>
          <div v-else class="chart-container">
            <v-chart
              :option="distributionChartOption"
              style="height: 300px; width: 100%"
            />
          </div>
        </n-card>
      </div>

      <!-- 学习趋势 -->
      <div class="chart-row">
        <n-card title="学习趋势" class="chart-card full-width">
          <div v-if="trendChartLoading" class="chart-loading">
            <n-spin size="large" />
          </div>
          <div v-else class="chart-container">
            <v-chart
              :option="trendChartOption"
              style="height: 400px; width: 100%"
            />
          </div>
        </n-card>
      </div>
    </div>

    <!-- 学习记录 -->
    <div class="study-logs">
      <n-card title="最近学习记录">
        <div v-if="studyLogsLoading" class="loading">
          <n-spin size="large" />
        </div>
        <div v-else-if="studyLogs.length === 0" class="empty-state">
          <n-empty description="暂无学习记录" />
        </div>
        <div v-else class="logs-list">
          <div
            v-for="log in studyLogs"
            :key="log.id"
            class="log-item"
          >
            <div class="log-info">
              <h4>{{ log.taskName || '未知任务' }}</h4>
              <p>{{ log.description || '暂无描述' }}</p>
            </div>
            <div class="log-meta">
              <span class="log-duration">{{ log.focusDuration }}分钟</span>
              <span class="log-date">{{ formatDate(log.startTime) }}</span>
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { Refresh as RefreshIcon } from '@vicons/ionicons5'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const timeRange = ref('week')
const totalStudyTime = ref(0)
const todayStudyTime = ref(0)
const weekStudyTime = ref(0)
const consecutiveDays = ref(0)

const dailyChartLoading = ref(false)
const distributionChartLoading = ref(false)
const trendChartLoading = ref(false)
const studyLogsLoading = ref(false)

const studyLogs = ref([])

const timeRangeOptions = [
  { label: '最近一周', value: 'week' },
  { label: '最近一月', value: 'month' },
  { label: '最近三月', value: 'quarter' }
]

// 每日学习时长图表配置
const dailyChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value',
    name: '学习时长(分钟)'
  },
  series: [
    {
      name: '学习时长',
      type: 'bar',
      data: [120, 200, 150, 80, 70, 110, 130],
      itemStyle: {
        color: '#ff6b35'
      }
    }
  ]
}))

// 学习时长分布图表配置
const distributionChartOption = computed(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '学习时长',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '专注学习' },
        { value: 735, name: '休息时间' },
        { value: 580, name: '其他活动' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))

// 学习趋势图表配置
const trendChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月']
  },
  yAxis: {
    type: 'value',
    name: '学习时长(小时)'
  },
  series: [
    {
      name: '学习时长',
      type: 'line',
      data: [2.1, 3.2, 2.8, 4.1, 3.9, 4.5],
      smooth: true,
      itemStyle: {
        color: '#ff6b35'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 107, 53, 0.3)' },
            { offset: 1, color: 'rgba(255, 107, 53, 0.1)' }
          ]
        }
      }
    }
  ]
}))

// 格式化日期
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 处理时间范围变化
const handleTimeRangeChange = (value) => {
  loadChartData()
}

// 刷新数据
const refreshData = () => {
  loadOverviewData()
  loadChartData()
  loadStudyLogs()
}

// 加载概览数据
const loadOverviewData = async () => {
  // 模拟数据，实际应该调用 API
  totalStudyTime.value = 1250
  todayStudyTime.value = 120
  weekStudyTime.value = 680
  consecutiveDays.value = 7
}

// 加载图表数据
const loadChartData = async () => {
  dailyChartLoading.value = true
  distributionChartLoading.value = true
  trendChartLoading.value = true

  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    dailyChartLoading.value = false
    distributionChartLoading.value = false
    trendChartLoading.value = false
  }
}

// 加载学习记录
const loadStudyLogs = async () => {
  studyLogsLoading.value = true
  try {
    // 模拟数据
    studyLogs.value = [
      {
        id: 1,
        taskName: 'Vue 3 学习',
        description: '学习 Vue 3 组合式 API',
        focusDuration: 25,
        startTime: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        taskName: 'TypeScript 练习',
        description: 'TypeScript 类型系统学习',
        focusDuration: 30,
        startTime: '2024-01-15T14:00:00Z'
      }
    ]
  } finally {
    studyLogsLoading.value = false
  }
}

onMounted(() => {
  loadOverviewData()
  loadChartData()
  loadStudyLogs()
})
</script>

<style scoped>
.statistics-container {
  max-width: 1200px;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-overview {
  margin-bottom: 24px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.charts-section {
  margin-bottom: 24px;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  min-height: 400px;
}

.chart-card.full-width {
  grid-column: 1 / -1;
}

.chart-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.chart-container {
  width: 100%;
}

.study-logs {
  margin-bottom: 24px;
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

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.log-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #ff6b35;
}

.log-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #333;
}

.log-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.log-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.log-duration {
  font-size: 16px;
  font-weight: bold;
  color: #ff6b35;
}

.log-date {
  font-size: 12px;
  color: #999;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .header-actions {
    justify-content: space-between;
  }
  
  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-row {
    grid-template-columns: 1fr;
  }
  
  .log-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .log-meta {
    align-items: flex-start;
  }
}
</style>
