<template>
  <div id="app">
    <n-config-provider :theme="theme" :locale="zhCN" :date-locale="dateZhCN">
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <Layout />
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NConfigProvider, NMessageProvider, NNotificationProvider, NDialogProvider, zhCN, dateZhCN, darkTheme } from 'naive-ui'
import Layout from './components/Layout.vue'

// 主题配置
const theme = ref(null) // 使用浅色主题
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
