<template>
  <el-container class="admin-layout">
    <el-aside width="240px" class="sidebar">
      <div class="sidebar-header">
        <el-icon :size="32"><School /></el-icon>
        <span class="sidebar-title">教师评价管理系统</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :router="true"
        class="sidebar-menu"
      >
        <el-sub-menu index="evaluation">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>评价项目管理</span>
          </template>
          <el-menu-item index="/admin/indicator-management">评价指标管理</el-menu-item>
          <el-menu-item index="/admin/rule-management">评价规则管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="task">
          <template #title>
            <el-icon><List /></el-icon>
            <span>评价任务管理</span>
          </template>
          <el-menu-item index="/admin/task-management">任务管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="material">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>评价填报管理</span>
          </template>
          <el-menu-item index="/admin/material-approval">评价填报审批</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="statistics">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>统计分析</span>
          </template>
          <el-menu-item index="/admin/score-dashboard">积分看板</el-menu-item>
          <el-menu-item index="/admin/score-detail">积分明细</el-menu-item>
          <el-menu-item index="/admin/appeal-handling">申诉处理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="notification">
          <template #title>
            <el-icon><Bell /></el-icon>
            <span>系统通知</span>
          </template>
          <el-menu-item index="/admin/notification">系统通知</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              v-for="item in breadcrumbs"
              :key="item.path"
              :to="{ path: item.path }"
            >
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :icon="UserFilled" />
              <span class="username">管理员</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="switch">切换角色</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoleStore } from '@/stores/role'
import {
  School, HomeFilled, Setting, Document, List, DataLine,
  TrendCharts, Bell, UserFilled, ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const roleStore = useRoleStore()

const activeMenu = computed(() => route.path)

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title)
  return matched.map(item => ({
    path: item.path,
    title: item.meta.title
  }))
})

function handleCommand(command) {
  switch (command) {
    case 'profile':
      router.push('/admin/profile')
      break
    case 'switch':
      roleStore.clearRole()
      router.push('/role-select')
      break
    case 'logout':
      roleStore.clearRole()
      router.push('/role-select')
      break
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.sidebar {
  background: #fff;
  overflow-x: hidden;
  border-right: 1px solid #e6e6e6;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-header .el-icon {
  color: #1890ff;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
}

.sidebar-menu {
  border-right: none;
  background: #fff;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 240px;
}

:deep(.el-menu) {
  background: #fff;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #595959;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: #f5f5f5;
  color: #1890ff;
}

:deep(.el-menu-item.is-active) {
  background: #e6f7ff;
  color: #1890ff;
  border-left: 3px solid #1890ff;
}

:deep(.el-sub-menu .el-menu-item) {
  background: #fff !important;
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  background: #e6f7ff !important;
  color: #1890ff !important;
}

.header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-info:hover {
  background: #f5f5f5;
}

.username {
  font-size: 14px;
  color: #595959;
}

.main-content {
  background: #f0f2f5;
  padding: 24px;
  overflow-y: auto;
}
</style>
