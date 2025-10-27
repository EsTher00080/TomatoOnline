<template>
  <div class="profile-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>个人中心</h2>
    </div>

    <div class="profile-content">
      <!-- 用户信息卡片 -->
      <n-card title="个人信息" class="profile-card">
        <div class="profile-info">
          <div class="avatar-section">
            <n-avatar
              :size="80"
              :src="userStore.user?.avatar"
              fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG"
            />
            <n-button type="primary" size="small" @click="showAvatarModal = true">
              更换头像
            </n-button>
          </div>
          <div class="user-details">
            <h3>{{ userStore.user?.username || '用户' }}</h3>
            <p>{{ userStore.user?.email || '未设置邮箱' }}</p>
            <p>{{ userStore.user?.signature || '这个人很懒，什么都没有留下' }}</p>
          </div>
        </div>
      </n-card>

      <!-- 学习统计 -->
      <n-card title="学习统计" class="stats-card">
        <div class="stats-grid">
          <div class="stat-item">
            <n-statistic label="总学习时长" :value="totalStudyTime" suffix="分钟" />
          </div>
          <div class="stat-item">
            <n-statistic label="连续学习天数" :value="userStore.user?.consecutiveDays || 0" suffix="天" />
          </div>
          <div class="stat-item">
            <n-statistic label="完成任务数" :value="completedTasks" suffix="个" />
          </div>
          <div class="stat-item">
            <n-statistic label="学习效率" :value="studyEfficiency" suffix="%" />
          </div>
        </div>
      </n-card>

      <!-- 设置选项 -->
      <n-card title="账户设置" class="settings-card">
        <n-list>
          <n-list-item>
            <template #prefix>
              <n-icon>
                <PersonIcon />
              </n-icon>
            </template>
            <n-thing title="修改个人信息">
              <template #description>
                修改用户名、邮箱、个性签名等基本信息
              </template>
            </n-thing>
            <template #suffix>
              <n-button text @click="showEditModal = true">
                编辑
              </n-button>
            </template>
          </n-list-item>
          <n-list-item>
            <template #prefix>
              <n-icon>
                <LockIcon />
              </n-icon>
            </template>
            <n-thing title="修改密码">
              <template #description>
                修改登录密码，提高账户安全性
              </template>
            </n-thing>
            <template #suffix>
              <n-button text @click="showPasswordModal = true">
                修改
              </n-button>
            </template>
          </n-list-item>
          <n-list-item>
            <template #prefix>
              <n-icon>
                <SettingsIcon />
              </n-icon>
            </template>
            <n-thing title="偏好设置">
              <template #description>
                设置番茄钟时长、提醒方式等个人偏好
              </template>
            </n-thing>
            <template #suffix>
              <n-button text @click="showPreferencesModal = true">
                设置
              </n-button>
            </template>
          </n-list-item>
        </n-list>
      </n-card>
    </div>

    <!-- 编辑个人信息弹窗 -->
    <n-modal v-model:show="showEditModal" preset="card" title="编辑个人信息" size="huge">
      <n-form
        ref="editFormRef"
        :model="editFormData"
        :rules="editRules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="editFormData.username" placeholder="请输入用户名" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="editFormData.email" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item label="个性签名" path="signature">
          <n-input
            v-model:value="editFormData.signature"
            type="textarea"
            placeholder="请输入个性签名"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showEditModal = false">取消</n-button>
          <n-button type="primary" :loading="editLoading" @click="handleEditSubmit">
            保存
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 修改密码弹窗 -->
    <n-modal v-model:show="showPasswordModal" preset="card" title="修改密码" size="huge">
      <n-form
        ref="passwordFormRef"
        :model="passwordFormData"
        :rules="passwordRules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="当前密码" path="currentPassword">
          <n-input
            v-model:value="passwordFormData.currentPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password-on="click"
          />
        </n-form-item>
        <n-form-item label="新密码" path="newPassword">
          <n-input
            v-model:value="passwordFormData.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password-on="click"
          />
        </n-form-item>
        <n-form-item label="确认新密码" path="confirmPassword">
          <n-input
            v-model:value="passwordFormData.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password-on="click"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showPasswordModal = false">取消</n-button>
          <n-button type="primary" :loading="passwordLoading" @click="handlePasswordSubmit">
            修改
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 偏好设置弹窗 -->
    <n-modal v-model:show="showPreferencesModal" preset="card" title="偏好设置" size="huge">
      <n-form
        ref="preferencesFormRef"
        :model="preferencesFormData"
        label-placement="left"
        label-width="auto"
      >
        <n-form-item label="番茄钟时长">
          <n-input-number
            v-model:value="preferencesFormData.pomodoroDuration"
            :min="5"
            :max="60"
            placeholder="分钟"
            style="width: 200px"
          />
        </n-form-item>
        <n-form-item label="短休息时长">
          <n-input-number
            v-model:value="preferencesFormData.shortBreakDuration"
            :min="1"
            :max="30"
            placeholder="分钟"
            style="width: 200px"
          />
        </n-form-item>
        <n-form-item label="长休息时长">
          <n-input-number
            v-model:value="preferencesFormData.longBreakDuration"
            :min="5"
            :max="60"
            placeholder="分钟"
            style="width: 200px"
          />
        </n-form-item>
        <n-form-item label="提醒方式">
          <n-checkbox-group v-model:value="preferencesFormData.notifications">
            <n-checkbox value="sound">声音提醒</n-checkbox>
            <n-checkbox value="desktop">桌面通知</n-checkbox>
            <n-checkbox value="browser">浏览器通知</n-checkbox>
          </n-checkbox-group>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showPreferencesModal = false">取消</n-button>
          <n-button type="primary" :loading="preferencesLoading" @click="handlePreferencesSubmit">
            保存
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 更换头像弹窗 -->
    <n-modal v-model:show="showAvatarModal" preset="card" title="更换头像" size="huge">
      <div class="avatar-upload">
        <n-upload
          :show-file-list="false"
          :on-before-upload="handleAvatarUpload"
          accept="image/*"
        >
          <n-button type="primary">
            <template #icon>
              <n-icon>
                <UploadIcon />
              </n-icon>
            </template>
            选择头像
          </n-button>
        </n-upload>
        <p class="upload-tip">支持 JPG、PNG 格式，文件大小不超过 2MB</p>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useTasksStore } from '@/stores/tasks'
import { useMessage } from 'naive-ui'
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  Upload as UploadIcon
} from '@vicons/ionicons5'

const userStore = useUserStore()
const tasksStore = useTasksStore()
const message = useMessage()

const showEditModal = ref(false)
const showPasswordModal = ref(false)
const showPreferencesModal = ref(false)
const showAvatarModal = ref(false)

const editLoading = ref(false)
const passwordLoading = ref(false)
const preferencesLoading = ref(false)

const editFormRef = ref(null)
const passwordFormRef = ref(null)
const preferencesFormRef = ref(null)

const totalStudyTime = ref(1250)
const completedTasks = ref(15)

const studyEfficiency = computed(() => {
  return Math.round((completedTasks.value / (completedTasks.value + 5)) * 100)
})

const editFormData = reactive({
  username: '',
  email: '',
  signature: ''
})

const passwordFormData = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const preferencesFormData = reactive({
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  notifications: ['sound']
})

const editRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value) => {
        if (value !== passwordFormData.newPassword) {
          return new Error('两次输入的密码不一致')
        }
        return true
      },
      trigger: 'blur'
    }
  ]
}

// 处理编辑提交
const handleEditSubmit = async () => {
  try {
    await editFormRef.value?.validate()
    editLoading.value = true

    await userStore.updateUserInfo(editFormData)
    message.success('更新成功')
    showEditModal.value = false
  } catch (error) {
    message.error('更新失败')
  } finally {
    editLoading.value = false
  }
}

// 处理密码修改
const handlePasswordSubmit = async () => {
  try {
    await passwordFormRef.value?.validate()
    passwordLoading.value = true

    // 调用修改密码 API
    message.success('密码修改成功')
    showPasswordModal.value = false
  } catch (error) {
    message.error('密码修改失败')
  } finally {
    passwordLoading.value = false
  }
}

// 处理偏好设置
const handlePreferencesSubmit = async () => {
  try {
    preferencesLoading.value = true

    // 保存偏好设置
    message.success('设置保存成功')
    showPreferencesModal.value = false
  } catch (error) {
    message.error('设置保存失败')
  } finally {
    preferencesLoading.value = false
  }
}

// 处理头像上传
const handleAvatarUpload = (data) => {
  const file = data.file
  if (file.size > 2 * 1024 * 1024) {
    message.error('文件大小不能超过 2MB')
    return false
  }
  
  // 处理头像上传
  message.success('头像上传成功')
  showAvatarModal.value = false
  return false
}

// 初始化表单数据
const initFormData = () => {
  if (userStore.user) {
    editFormData.username = userStore.user.username || ''
    editFormData.email = userStore.user.email || ''
    editFormData.signature = userStore.user.signature || ''
  }
}

onMounted(() => {
  initFormData()
})
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card,
.stats-card,
.settings-card {
  width: 100%;
}

.profile-info {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.user-details h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #333;
}

.user-details p {
  margin: 0 0 8px 0;
  color: #666;
  line-height: 1.5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.avatar-upload {
  text-align: center;
  padding: 20px;
}

.upload-tip {
  margin: 16px 0 0 0;
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
