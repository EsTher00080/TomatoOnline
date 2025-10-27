<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <n-icon size="48" color="#ff6b35">
          <TimerIcon />
        </n-icon>
        <h1>注册账号</h1>
        <p>加入番茄自习室，开启高效学习之旅</p>
      </div>

      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        size="large"
        @submit.prevent="handleSubmit"
      >
        <n-form-item path="username" label="用户名">
          <n-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
            :input-props="{ autocomplete: 'username' }"
          />
        </n-form-item>

        <n-form-item path="email" label="邮箱">
          <n-input
            v-model:value="formData.email"
            placeholder="请输入邮箱"
            :input-props="{ autocomplete: 'email' }"
          />
        </n-form-item>

        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
            :input-props="{ autocomplete: 'new-password' }"
            show-password-on="click"
          />
        </n-form-item>

        <n-form-item path="confirmPassword" label="确认密码">
          <n-input
            v-model:value="formData.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            :input-props="{ autocomplete: 'new-password' }"
            show-password-on="click"
          />
        </n-form-item>

        <n-form-item>
          <n-button
            type="primary"
            size="large"
            block
            :loading="loading"
            @click="handleSubmit"
          >
            注册
          </n-button>
        </n-form-item>
      </n-form>

      <div class="register-footer">
        <p>
          已有账号？
          <n-button text type="primary" @click="$router.push('/login')">
            立即登录
          </n-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useMessage } from 'naive-ui'
import { Timer as TimerIcon } from '@vicons/ionicons5'

const router = useRouter()
const userStore = useUserStore()
const message = useMessage()

const formRef = ref(null)
const loading = ref(false)

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validatePassword = (rule, value) => {
  if (!value) {
    return new Error('请输入密码')
  }
  if (value.length < 6) {
    return new Error('密码长度至少6个字符')
  }
  if (value.length > 20) {
    return new Error('密码长度不能超过20个字符')
  }
  return true
}

const validateConfirmPassword = (rule, value) => {
  if (!value) {
    return new Error('请确认密码')
  }
  if (value !== formData.password) {
    return new Error('两次输入的密码不一致')
  }
  return true
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    
    const { confirmPassword, ...registerData } = formData
    await userStore.registerUser(registerData)
    message.success('注册成功，请登录')
    router.push('/login')
  } catch (error) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error('注册失败，请重试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b35, #ff8a65);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 16px 0 8px;
}

.register-header p {
  color: #666;
  font-size: 14px;
}

.register-footer {
  text-align: center;
  margin-top: 24px;
  color: #666;
}

.register-footer p {
  margin: 0;
}

@media (max-width: 480px) {
  .register-card {
    padding: 24px;
  }
}
</style>
