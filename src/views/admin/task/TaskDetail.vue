<template>
  <div class="task-detail">
    <el-page-header @back="goBack" class="page-header">
      <template #content>
        <span class="page-title">任务详情</span>
      </template>
    </el-page-header>

    <!-- 任务基本信息 -->
    <el-card class="info-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">任务基本信息</span>
          <el-tag :type="getStatusType(taskDetail.status)" size="large">
            {{ taskDetail.status }}
          </el-tag>
        </div>
      </template>

      <el-descriptions :column="3" border>
        <el-descriptions-item label="任务名称">
          {{ taskDetail.name }}
        </el-descriptions-item>
        <el-descriptions-item label="任务类型">
          <el-tag :type="getTypeColor(taskDetail.type)" size="small">
            {{ getTypeName(taskDetail.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="评价周期">
          {{ taskDetail.period }}
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ taskDetail.startDate }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ taskDetail.endDate }}
        </el-descriptions-item>
        <el-descriptions-item label="参与人数">
          {{ taskDetail.participantCount }} 人
        </el-descriptions-item>
        <el-descriptions-item label="完成人数">
          {{ taskDetail.completedCount }} 人
        </el-descriptions-item>
        <el-descriptions-item label="完成率">
          <el-tag :type="getCompletionRateType(taskDetail.completionRate)" size="small">
            {{ taskDetail.completionRate }}%
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="绑定指标" :span="3">
          <div class="indicators-tags">
            <el-tag
              v-for="indicator in taskDetail.indicators"
              :key="indicator.id"
              type="info"
              size="small"
              class="indicator-tag"
            >
              {{ indicator.name }}（{{ indicator.score }}分）
            </el-tag>
            <span v-if="!taskDetail.indicators || taskDetail.indicators.length === 0" class="empty-text">
              未绑定指标
            </span>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 任务完成明细 -->
    <el-card class="detail-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">任务完成明细</span>
          <div class="header-actions">
            <el-button :icon="Download" @click="handleExport">导出数据</el-button>
          </div>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true">
          <el-form-item label="教师姓名">
            <el-input v-model="searchForm.teacherName" placeholder="请输入教师姓名" clearable />
          </el-form-item>
          <el-form-item label="部门">
            <el-select v-model="searchForm.department" placeholder="请选择部门" clearable>
              <el-option label="计算机学院" value="计算机学院" />
              <el-option label="数学学院" value="数学学院" />
              <el-option label="英语学院" value="英语学院" />
              <el-option label="物理学院" value="物理学院" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="completionData" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="teacherName" label="教师姓名" width="120" />
        <el-table-column prop="department" label="部门" width="150" />

        <!-- 动态指标列 -->
        <el-table-column
          v-for="indicator in taskDetail.indicators"
          :key="indicator.id"
          :label="indicator.name"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            <span :class="getScoreClass(row.scores[indicator.id])">
              {{ row.scores[indicator.id] || '-' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="totalScore" label="总分" width="100" fixed="right">
          <template #default="{ row }">
            <el-tag :type="getTotalScoreType(row.totalScore)" size="small">
              {{ row.totalScore }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              link
              :icon="View"
              @click="handleViewTeacherDetail(row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </el-card>

    <!-- 教师详情对话框 -->
    <el-dialog
      v-model="teacherDetailDialogVisible"
      title="教师评价详情"
      width="800px"
    >
      <div v-if="currentTeacher">
        <el-descriptions :column="2" border class="teacher-info">
          <el-descriptions-item label="教师姓名">
            {{ currentTeacher.teacherName }}
          </el-descriptions-item>
          <el-descriptions-item label="部门">
            {{ currentTeacher.department }}
          </el-descriptions-item>
          <el-descriptions-item label="总分">
            <el-tag :type="getTotalScoreType(currentTeacher.totalScore)" size="large">
              {{ currentTeacher.totalScore }} 分
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">
            {{ currentTeacher.submitTime }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">各项指标得分</el-divider>

        <div class="indicator-scores">
          <div
            v-for="indicator in taskDetail.indicators"
            :key="indicator.id"
            class="indicator-score-item"
          >
            <div class="indicator-label">{{ indicator.name }}</div>
            <el-progress
              :percentage="getScorePercentage(currentTeacher.scores[indicator.id], indicator.score)"
              :color="getProgressColor(currentTeacher.scores[indicator.id], indicator.score)"
            />
            <div class="score-text">
              {{ currentTeacher.scores[indicator.id] || 0 }} / {{ indicator.score }}
            </div>
          </div>
        </div>

        <el-divider content-position="left">已上传材料</el-divider>

        <div class="materials-list">
          <el-tag
            v-for="material in currentTeacher.materials"
            :key="material.id"
            class="material-tag"
            :type="getMaterialStatusType(material.status)"
          >
            {{ material.indicatorName }}: {{ material.materialName }}
          </el-tag>
          <el-empty
            v-if="!currentTeacher.materials || currentTeacher.materials.length === 0"
            description="暂无上传材料"
            :image-size="60"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Download, Search, View } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const taskDetail = ref({
  id: 1,
  name: '2024年度教师自评',
  type: 'self',
  period: '2024年度',
  startDate: '2024-03-01',
  endDate: '2024-03-31',
  indicators: [
    { id: 1, name: '备课充分', score: 5 },
    { id: 5, name: '教学方法创新', score: 8 }
  ],
  participantCount: 128,
  completedCount: 96,
  completionRate: 75,
  status: '进行中'
})

const searchForm = reactive({
  teacherName: '',
  department: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const teacherDetailDialogVisible = ref(false)
const currentTeacher = ref(null)

// 模拟完成数据
const completionData = ref([
  {
    id: 1,
    teacherName: '张老师',
    department: '计算机学院',
    scores: { 1: 5, 5: 7 },
    totalScore: 92.5,
    submitTime: '2024-03-15 14:30:00',
    materials: [
      { id: 1, indicatorId: 1, indicatorName: '备课充分', materialName: '教学教案.pdf', status: 'approved' }
    ]
  },
  {
    id: 2,
    teacherName: '李老师',
    department: '数学学院',
    scores: { 1: 4, 5: 6 },
    totalScore: 87.5,
    submitTime: '2024-03-16 10:20:00',
    materials: []
  },
  {
    id: 3,
    teacherName: '王老师',
    department: '英语学院',
    scores: { 1: 5, 5: 8 },
    totalScore: 95.0,
    submitTime: '2024-03-14 16:45:00',
    materials: [
      { id: 2, indicatorId: 1, indicatorName: '备课充分', materialName: '教案.docx', status: 'approved' },
      { id: 3, indicatorId: 5, indicatorName: '教学方法创新', materialName: '教学改革报告.pdf', status: 'approved' }
    ]
  }
])

pagination.total = completionData.value.length

function getTypeName(type) {
  const map = {
    'self': '自我评价',
    'peer': '同行评审',
    'comprehensive': '综合评价'
  }
  return map[type] || type
}

function getTypeColor(type) {
  const map = {
    'self': 'primary',
    'peer': 'success',
    'comprehensive': 'warning'
  }
  return map[type] || 'info'
}

function getStatusType(status) {
  const map = {
    '未开始': 'info',
    '进行中': 'primary',
    '已结束': 'success'
  }
  return map[status] || 'info'
}

function getCompletionRateType(rate) {
  if (rate >= 80) return 'success'
  if (rate >= 50) return 'warning'
  return 'danger'
}

function getScoreClass(score) {
  if (!score) return 'text-muted'
  if (score >= 4) return 'text-success'
  if (score >= 3) return 'text-warning'
  return 'text-danger'
}

function getTotalScoreType(score) {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

function getScorePercentage(score, maxScore) {
  if (!score) return 0
  return Math.round((score / maxScore) * 100)
}

function getProgressColor(score, maxScore) {
  const percentage = getScorePercentage(score, maxScore)
  if (percentage >= 80) return '#67c23a'
  if (percentage >= 60) return '#e6a23c'
  return '#f56c6c'
}

function getMaterialStatusType(status) {
  const map = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return map[status] || 'info'
}

function goBack() {
  router.back()
}

function handleSearch() {
  ElMessage.success('查询成功')
}

function handleReset() {
  Object.assign(searchForm, {
    teacherName: '',
    department: ''
  })
}

function handleExport() {
  ElMessage.success('导出功能开发中...')
}

function handleViewTeacherDetail(row) {
  currentTeacher.value = row
  teacherDetailDialogVisible.value = true
}
</script>

<style scoped>
.task-detail {
  padding: 0;
}

.page-header {
  margin-bottom: 20px;
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
}

.info-card,
.detail-card {
  margin-bottom: 20px;
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

.header-actions {
  display: flex;
  gap: 12px;
}

.indicators-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.indicator-tag {
  margin: 0;
}

.empty-text {
  color: #bfbfbf;
  font-size: 14px;
}

.search-bar {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.text-success {
  color: #67c23a;
  font-weight: 600;
}

.text-warning {
  color: #e6a23c;
  font-weight: 600;
}

.text-danger {
  color: #f56c6c;
  font-weight: 600;
}

.text-muted {
  color: #bfbfbf;
}

.teacher-info {
  margin-bottom: 24px;
}

.indicator-scores {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.indicator-score-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.indicator-label {
  width: 150px;
  font-size: 14px;
  font-weight: 500;
  color: #1f1f1f;
}

.score-text {
  width: 80px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
}

.materials-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.material-tag {
  margin: 0;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-progress) {
  flex: 1;
}
</style>
