<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <n-icon size="48" color="#ff6b35">
          <TimerIcon />
        </n-icon>
        <h1>番茄自习室</h1>
        <p>专注学习，高效成长</p>
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

        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
            :input-props="{ autocomplete: 'current-password' }"
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
            登录
          </n-button>
        </n-form-item>
      </n-form>

      <div class="login-footer">
        <p>
          还没有账号？
          <n-button text type="primary" @click="$router.push('/register')">
            立即注册
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
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    
    await userStore.loginUser(formData)
    message.success('登录成功')
    router.push('/home')
  } catch (error) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error('登录失败，请检查用户名和密码')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b35, #ff8a65);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 16px 0 8px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  color: #666;
}

.login-footer p {
  margin: 0;
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }
}
</style>
