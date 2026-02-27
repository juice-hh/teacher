<template>
  <div class="dashboard-container">
    <el-row :gutter="24">
      <el-col :span="6" v-for="stat in statistics" :key="stat.key">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="24" color="#fff">
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" style="margin-top: 24px;">
      <el-col :span="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">评价数据统计</span>
              <el-radio-group v-model="chartPeriod" size="small">
                <el-radio-button value="week">本周</el-radio-button>
                <el-radio-button value="month">本月</el-radio-button>
                <el-radio-button value="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-placeholder">
            <el-icon :size="80" color="#d9d9d9"><TrendCharts /></el-icon>
            <p class="placeholder-text">图表区域 - 评价数据趋势</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="notice-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">待办事项</span>
              <el-link type="primary" :underline="false">查看全部</el-link>
            </div>
          </template>
          <div class="notice-list">
            <div class="notice-item" v-for="item in todoList" :key="item.id">
              <el-badge :value="item.count" :max="99" class="notice-badge">
                <span class="notice-text">{{ item.text }}</span>
              </el-badge>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" style="margin-top: 24px;">
      <el-col :span="12">
        <el-card class="table-card" shadow="hover">
          <template #header>
            <span class="card-title">最近评价任务</span>
          </template>
          <el-table :data="recentTasks" style="width: 100%">
            <el-table-column prop="name" label="任务名称" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="截止日期" width="120" />
            <el-table-column label="操作" width="100" fixed="right">
              <template #default>
                <el-link type="primary" :underline="false">查看</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="table-card" shadow="hover">
          <template #header>
            <span class="card-title">最近登录用户</span>
          </template>
          <el-table :data="recentUsers" style="width: 100%">
            <el-table-column prop="name" label="姓名" />
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="time" label="登录时间" width="160" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { TrendCharts, User, Document, DataLine, Checked, Bell } from '@element-plus/icons-vue'

const chartPeriod = ref('week')

const statistics = [
  { key: 'teachers', label: '教师总数', value: '128', icon: User, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { key: 'indicators', label: '评价指标', value: '13', icon: Document, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { key: 'tasks', label: '进行中任务', value: '8', icon: DataLine, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { key: 'completed', label: '已完成评价', value: '96%', icon: Checked, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
]

const todoList = [
  { id: 1, text: '待审核评价', count: 5 },
  { id: 2, text: '待发布任务', count: 2 },
  { id: 3, text: '系统通知', count: 3 },
  { id: 4, text: '待处理申诉', count: 1 }
]

const recentTasks = [
  { name: '2024年度教师自评', status: '进行中', deadline: '2024-03-31' },
  { name: '第一季度同行评审', status: '待开始', deadline: '2024-04-15' },
  { name: '教学态度专项评价', status: '已完成', deadline: '2024-02-28' },
  { name: '科研成果评分', status: '进行中', deadline: '2024-03-20' }
]

const recentUsers = [
  { name: '张老师', department: '计算机学院', time: '2024-02-26 09:30' },
  { name: '李老师', department: '数学学院', time: '2024-02-26 08:45' },
  { name: '王老师', department: '英语学院', time: '2024-02-26 08:20' },
  { name: '刘老师', department: '物理学院', time: '2024-02-25 17:30' }
]

function getStatusType(status) {
  const map = {
    '进行中': 'primary',
    '待开始': 'info',
    '已完成': 'success'
  }
  return map[status] || 'info'
}
</script>

<style scoped>
.dashboard-container {
  padding: 0;
}

.stat-card {
  border-radius: 8px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #1f1f1f;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin-top: 8px;
}

.chart-card,
.notice-card,
.table-card {
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bfbfbf;
}

.placeholder-text {
  margin-top: 16px;
  font-size: 14px;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notice-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.notice-item:hover {
  background: #f0f2f5;
}

.notice-badge {
  flex: 1;
}

.notice-text {
  font-size: 14px;
  color: #595959;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
