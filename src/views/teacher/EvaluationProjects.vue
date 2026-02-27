<template>
  <div class="evaluation-projects">
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card pending">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><Timer /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">待评项目</div>
              <div class="stat-value">{{ pendingCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card completed">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><CircleCheckFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">已评项目</div>
              <div class="stat-value">{{ completedCount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card points">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon><StarFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">当前积分</div>
              <div class="stat-value">{{ currentPoints }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="list-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">本学期全部需评价项目清单</span>
        </div>
      </template>
      <el-table :data="projects" style="width: 100%">
        <el-table-column prop="cycle" label="评价周期" width="180" />
        <el-table-column prop="type" label="评价类型" width="150" />
        <el-table-column prop="task" label="评价任务" min-width="150" />
        <el-table-column prop="indicator" label="评价指标" min-width="150" />
        <el-table-column prop="status" label="评价状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'">
              {{ row.status === 'pending' ? '待评' : '已评' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending'"
              type="primary"
              size="small"
              @click="handleEvaluate(row)"
            >
              去评价
            </el-button>
            <template v-else>
              <el-button
                type="info"
                size="small"
                plain
                @click="handleView(row)"
              >
                查看记录
              </el-button>
              <el-button
                type="success"
                size="small"
                plain
                @click="handleDownload(row)"
              >
                下载报告
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Timer, CircleCheckFilled, StarFilled } from '@element-plus/icons-vue'

const router = useRouter()

const currentPoints = ref(85)

const projects = ref([
  {
    id: 1,
    cycle: '2023-2024学年第二学期',
    type: '综合素养评价',
    task: '班主任工作考核',
    indicator: '班级管理与学生指导',
    status: 'pending',
    route: '/teacher/evaluation-fill/1'
  },
  {
    id: 2,
    cycle: '2023-2024学年第二学期',
    type: '听评课评价',
    task: '公开课听评课',
    indicator: '教学设计与实施',
    status: 'completed',
    route: '/teacher/evaluation-fill/2'
  },
  {
    id: 3,
    cycle: '2023-2024学年第一学期',
    type: '教研考勤评价',
    task: '集体备课与教研',
    indicator: '教研活动出勤率',
    status: 'completed',
    route: '/teacher/evaluation-fill/3'
  }
])

const pendingCount = computed(() => projects.value.filter(p => p.status === 'pending').length)
const completedCount = computed(() => projects.value.filter(p => p.status === 'completed').length)

const handleEvaluate = (row) => {
  if (row.route) {
    router.push(row.route)
  }
}

const handleView = (row) => {
  ElMessage.success('正在查看评价记录')
  if (row.route) {
    router.push(row.route)
  }
}

const handleDownload = (row) => {
  ElMessage.success('报告下载中...')
}
</script>

<style scoped>
.evaluation-projects {
  padding: 0;
}

.stat-cards {
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 8px;
}

.stat-card.pending .stat-icon {
  color: #faad14;
  background: #fffbe6;
}

.stat-card.completed .stat-icon {
  color: #52c41a;
  background: #f6ffed;
}

.stat-card.points .stat-icon {
  color: #1890ff;
  background: #e6f7ff;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #1f1f1f;
  line-height: 1;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
}

.list-card {
  border-radius: 8px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}
</style>
