<template>
  <div class="role-select-container">
    <div class="role-select-box">
      <div class="logo-section">
        <div class="logo-icon">
          <el-icon :size="48"><School /></el-icon>
        </div>
        <h1 class="system-title">教师评价管理系统</h1>
        <p class="system-subtitle">Teacher Evaluation Management System</p>
      </div>

      <div class="role-cards">
        <div
          class="role-card admin-card"
          @click="selectRole('admin')"
        >
          <div class="role-icon">
            <el-icon :size="64"><Setting /></el-icon>
          </div>
          <h2 class="role-title">管理员</h2>
          <p class="role-desc">评价管理 · 数据分析</p>
          <div class="role-features">
            <span class="feature-tag">评价项目管理</span>
            <span class="feature-tag">评价任务管理</span>
            <span class="feature-tag">数据管理</span>
            <span class="feature-tag">统计分析</span>
            <span class="feature-tag">系统通知</span>
          </div>
          <el-button type="primary" size="large" class="enter-btn">
            进入管理端
          </el-button>
        </div>

        <div
          class="role-card teacher-card"
          @click="selectRole('teacher')"
        >
          <div class="role-icon">
            <el-icon :size="64"><User /></el-icon>
          </div>
          <h2 class="role-title">教师</h2>
          <p class="role-desc">自我评价 · 评审他人 · 数据查看</p>
          <div class="role-features">
            <span class="feature-tag">个人中心</span>
            <span class="feature-tag">自我评价</span>
            <span class="feature-tag">评审他人</span>
            <span class="feature-tag">个人数据</span>
            <span class="feature-tag">消息中心</span>
          </div>
          <el-button type="primary" size="large" class="enter-btn">
            进入教师端
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useRoleStore } from '@/stores/role'
import { School, Setting, User } from '@element-plus/icons-vue'

const router = useRouter()
const roleStore = useRoleStore()

function selectRole(role) {
  roleStore.setRole(role)
  if (role === 'admin') {
    router.push('/admin/dashboard')
  } else {
    router.push('/teacher/dashboard')
  }
}
</script>

<style scoped>
.role-select-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #1890ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.role-select-box {
  text-align: center;
}

.logo-section {
  margin-bottom: 48px;
}

.logo-icon {
  display: inline-flex;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 20px;
}

.system-title {
  font-size: 36px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.system-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 300;
  letter-spacing: 1px;
}

.role-cards {
  display: flex;
  gap: 32px;
  justify-content: center;
  flex-wrap: wrap;
}

.role-card {
  width: 320px;
  background: #fff;
  border-radius: 16px;
  padding: 40px 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.role-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.role-icon {
  color: #1890ff;
  margin-bottom: 24px;
}

.role-title {
  font-size: 28px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 8px;
}

.role-desc {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 24px;
}

.role-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 32px;
}

.feature-tag {
  padding: 4px 12px;
  background: #f0f2f5;
  border-radius: 4px;
  font-size: 12px;
  color: #595959;
}

.enter-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}
</style>
