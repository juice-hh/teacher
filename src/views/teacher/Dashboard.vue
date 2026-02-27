<template>
  <div class="teacher-dashboard">
    <el-row :gutter="24">
      <el-col :span="24">
        <el-card class="welcome-card" shadow="hover">
          <div class="welcome-content">
            <el-avatar :size="80" :icon="UserFilled" />
            <div class="welcome-info">
              <h2 class="welcome-title">欢迎回来，{{ teacherName }}！</h2>
              <p class="welcome-text">{{ currentDept }} · 副教授</p>
            </div>
            <div class="welcome-actions">
              <el-button type="primary" @click="$router.push('/teacher/self-evaluation')">
                开始自评
              </el-button>
              <el-button @click="$router.push('/teacher/peer-review')">
                评审他人
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" style="margin-top: 24px;">
      <el-col :span="6" v-for="stat in statistics" :key="stat.key">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="22" color="#fff">
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
        <el-card class="task-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">我的任务</span>
              <el-link type="primary" :underline="false">查看全部</el-link>
            </div>
          </template>
          <el-table :data="myTasks" style="width: 100%">
            <el-table-column prop="name" label="任务名称" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="row.type === '自评' ? 'primary' : 'success'" size="small">
                  {{ row.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="截止日期" width="120" />
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ row }">
                <el-link
                  type="primary"
                  :underline="false"
                  @click="handleTaskAction(row)"
                >
                  {{ row.status === '未开始' ? '开始' : '继续' }}
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="notice-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">最新通知</span>
              <el-badge :value="noticeCount" :max="99">
                <el-icon :size="20"><Bell /></el-icon>
              </el-badge>
            </div>
          </template>
          <div class="notice-list">
            <div class="notice-item" v-for="item in notices" :key="item.id">
              <div class="notice-dot"></div>
              <div class="notice-content">
                <div class="notice-title">{{ item.title }}</div>
                <div class="notice-time">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" style="margin-top: 24px;">
      <el-col :span="24">
        <el-card class="score-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">评价指标完成情况</span>
              <el-radio-group v-model="scorePeriod" size="small">
                <el-radio-button value="current">本年度</el-radio-button>
                <el-radio-button value="last">上年度</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="score-progress">
            <div class="progress-item" v-for="item in scoreItems" :key="item.name">
              <div class="progress-header">
                <span class="progress-label">{{ item.name }}</span>
                <span class="progress-value">{{ item.score }}/{{ item.total }}分</span>
              </div>
              <el-progress
                :percentage="(item.score / item.total) * 100"
                :color="item.color"
                :stroke-width="12"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserFilled, Document, Checked, Clock, Bell,
  TrendCharts
} from '@element-plus/icons-vue'

const router = useRouter()
const teacherName = ref('张老师')
const currentDept = ref('计算机学院')
const scorePeriod = ref('current')
const noticeCount = ref(3)

const statistics = [
  { key: 'pending', label: '待完成任务', value: '3', icon: Clock, color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { key: 'completed', label: '已完成评价', value: '12', icon: Checked, color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { key: 'peer', label: '待评审他人', value: '5', icon: Document, color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { key: 'totalScore', label: '综合得分', value: '92.5', icon: TrendCharts, color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }
]

const myTasks = [
  { name: '2024年度教师自评', type: '自评', status: '进行中', deadline: '2024-03-31' },
  { name: '李老师同行评审', type: '评审', status: '未开始', deadline: '2024-03-20' },
  { name: '王老师同行评审', type: '评审', status: '进行中', deadline: '2024-03-25' },
  { name: '科研成果补充', type: '自评', status: '已完成', deadline: '2024-02-28' }
]

const notices = [
  { id: 1, title: '2024年度自评通知', time: '2小时前' },
  { id: 2, title: '同行评审任务分配', time: '1天前' },
  { id: 3, title: '评价系统维护通知', time: '2天前' },
  { id: 4, title: '评分标准更新说明', time: '3天前' }
]

const scoreItems = [
  { name: '教学态度（20分）', score: 18, total: 20, color: '#1890ff' },
  { name: '教学方法（25分）', score: 23, total: 25, color: '#52c41a' },
  { name: '育人成效（25分）', score: 22, total: 25, color: '#faad14' },
  { name: '专业发展（20分）', score: 17, total: 20, color: '#722ed1' },
  { name: '社会服务（10分）', score: 8.5, total: 10, color: '#eb2f96' }
]

function getStatusType(status) {
  const map = {
    '进行中': 'primary',
    '未开始': 'warning',
    '已完成': 'success'
  }
  return map[status] || 'info'
}

function handleTaskAction(row) {
  if (row.type === '自评') {
    router.push('/teacher/self-evaluation')
  } else {
    router.push('/teacher/peer-review')
  }
}
</script>

<style scoped>
.teacher-dashboard {
  padding: 0;
}

.welcome-card {
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

:deep(.welcome-card .el-card__body) {
  padding: 32px;
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.welcome-info {
  flex: 1;
}

.welcome-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.welcome-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

.welcome-actions {
  display: flex;
  gap: 12px;
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
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-top: 6px;
}

.task-card,
.notice-card,
.score-card {
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

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.notice-item {
  display: flex;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.3s;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-item:hover {
  background: #fafafa;
  margin: 0 -20px;
  padding: 14px 20px;
}

.notice-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1890ff;
  margin-top: 6px;
  flex-shrink: 0;
}

.notice-content {
  flex: 1;
}

.notice-title {
  font-size: 14px;
  color: #595959;
  margin-bottom: 4px;
}

.notice-time {
  font-size: 12px;
  color: #bfbfbf;
}

.score-progress {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.progress-label {
  color: #595959;
}

.progress-value {
  font-weight: 600;
  color: #1f1f1f;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
