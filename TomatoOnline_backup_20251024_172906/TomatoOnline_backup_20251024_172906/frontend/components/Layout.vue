<template>
  <div class="layout">
    <!-- 头部 -->
    <header class="layout-header">
      <n-layout-header bordered>
        <div class="header-content">
          <div class="header-left">
            <n-icon size="24" color="#ff6b35">
              <TimerIcon />
            </n-icon>
            <span class="app-title">番茄自习室</span>
          </div>
          <div class="header-right">
            <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
              <n-button quaternary>
                <template #icon>
                  <n-icon>
                    <PersonIcon />
                  </n-icon>
                </template>
                {{ userStore.user?.username || '用户' }}
                <template #icon>
                  <n-icon>
                    <ChevronDownIcon />
                  </n-icon>
                </template>
              </n-button>
            </n-dropdown>
          </div>
        </div>
      </n-layout-header>
    </header>

    <!-- 主体内容 -->
    <div class="layout-content">
      <!-- 侧边栏 -->
      <aside class="layout-sidebar" v-if="!isMobile">
        <n-layout-sider
          :width="240"
          :collapsed="collapsed"
          :collapsed-width="64"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
          bordered
        >
          <n-menu
            :value="currentRoute"
            :options="menuOptions"
            :collapsed="collapsed"
            @update:value="handleMenuSelect"
          />
        </n-layout-sider>
      </aside>

      <!-- 移动端菜单 -->
      <n-drawer v-model:show="mobileMenuVisible" :width="280" placement="left">
        <n-menu
          :value="currentRoute"
          :options="menuOptions"
          @update:value="handleMenuSelect"
        />
      </n-drawer>

      <!-- 主内容区 -->
      <main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useMessage, useDialog } from 'naive-ui'
import {
  Timer as TimerIcon,
  Person as PersonIcon,
  ChevronDown as ChevronDownIcon,
  Home as HomeIcon,
  List as ListIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon
} from '@vicons/ionicons5'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const message = useMessage()
const dialog = useDialog()

const collapsed = ref(false)
const mobileMenuVisible = ref(false)
const isMobile = ref(false)

const currentRoute = computed(() => route.name)

// 菜单选项
const menuOptions = [
  {
    label: '首页',
    key: 'Home',
    icon: () => h(HomeIcon)
  },
  {
    label: '任务管理',
    key: 'Tasks',
    icon: () => h(ListIcon)
  },
  {
    label: '学习统计',
    key: 'Statistics',
    icon: () => h(BarChartIcon)
  },
  {
    label: '个人中心',
    key: 'Profile',
    icon: () => h(SettingsIcon)
  }
]

// 用户菜单选项
const userMenuOptions = [
  {
    label: '个人中心',
    key: 'profile',
    icon: () => h(SettingsIcon)
  },
  {
    type: 'divider'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(LogOutIcon)
  }
]

// 处理菜单选择
const handleMenuSelect = (key) => {
  router.push({ name: key })
  mobileMenuVisible.value = false
}

// 处理用户菜单选择
const handleUserMenuSelect = (key) => {
  if (key === 'profile') {
    router.push({ name: 'Profile' })
  } else if (key === 'logout') {
    dialog.warning({
      title: '确认退出',
      content: '确定要退出登录吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        userStore.logout()
        message.success('已退出登录')
        router.push('/login')
      }
    })
  }
}

// 检测移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-content {
  flex: 1;
  display: flex;
}

.layout-sidebar {
  background: white;
}

.layout-main {
  flex: 1;
  padding: 24px;
  background: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-title {
  font-size: 20px;
  font-weight: bold;
  color: #ff6b35;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

@media (max-width: 768px) {
  .layout-content {
    flex-direction: column;
  }
  
  .layout-sidebar {
    display: none;
  }
  
  .layout-main {
    padding: 16px;
  }
}
</style>
