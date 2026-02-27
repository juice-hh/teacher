<template>
  <div class="score-detail">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">教师积分明细</span>
          <div class="header-actions">
            <el-button type="primary" :icon="Check" @click="handleBatchConfirm" :disabled="!hasUnconfirmed">
              批量确认本学期全部积分
            </el-button>
          </div>
        </div>
      </template>

      <div class="filter-bar">
        <el-form :inline="true">
          <el-form-item label="学期">
            <el-select v-model="filterForm.semester" placeholder="请选择学期" clearable @change="handleFilter">
              <el-option
                v-for="semester in semesters"
                :key="semester"
                :label="semester"
                :value="semester"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="部门">
            <el-select v-model="filterForm.department" placeholder="请选择部门" clearable @change="handleFilter">
              <el-option label="计算机学院" value="计算机学院" />
              <el-option label="数学学院" value="数学学院" />
              <el-option label="英语学院" value="英语学院" />
              <el-option label="物理学院" value="物理学院" />
            </el-select>
          </el-form-item>
          <el-form-item label="确认状态">
            <el-select v-model="filterForm.confirmed" placeholder="请选择状态" clearable @change="handleFilter">
              <el-option label="已确认" value="true" />
              <el-option label="待确认" value="false" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="filteredScores" style="width: 100%" border>
        <el-table-column prop="teacherName" label="教师姓名" width="120" />
        <el-table-column prop="department" label="部门" width="150" />
        <el-table-column prop="semester" label="学期" width="150" />
        <el-table-column prop="totalScore" label="总分" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getScoreType(row.totalScore)" size="large">
              {{ row.totalScore }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="确认状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.confirmed ? 'success' : 'warning'" size="small">
              {{ row.confirmed ? '已确认' : '待确认' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="confirmedBy" label="确认人" width="100" />
        <el-table-column prop="confirmedAt" label="确认时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              link
              :icon="View"
              @click="handleViewDetail(row)"
            >
              查看明细
            </el-button>
            <el-button
              v-if="!row.confirmed"
              type="success"
              size="small"
              link
              :icon="Check"
              @click="handleConfirm(row)"
            >
              确认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 积分明细对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="`${currentTeacher?.teacherName} - ${currentTeacher?.semester} 积分明细`"
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
          <el-descriptions-item label="学期">
            {{ currentTeacher.semester }}
          </el-descriptions-item>
          <el-descriptions-item label="总分">
            <el-tag :type="getScoreType(currentTeacher.totalScore)" size="large">
              {{ currentTeacher.totalScore }} 分
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">各指标得分明细</el-divider>

        <el-table :data="currentTeacher.details" style="width: 100%" border>
          <el-table-column prop="taskName" label="任务名称" width="180" />
          <el-table-column prop="indicatorName" label="指标名称" width="150" />
          <el-table-column prop="score" label="得分" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getScoreType(row.score)" size="small">
                {{ row.score }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="maxScore" label="满分" width="100" align="center" />
          <el-table-column label="得分率" width="120" align="center">
            <template #default="{ row }">
              <el-progress
                :percentage="getScorePercentage(row.score, row.maxScore)"
                :color="getProgressColor(row.score, row.maxScore)"
                :stroke-width="8"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, View } from '@element-plus/icons-vue'
import { useScoreStore } from '@/stores/scores'

const scoreStore = useScoreStore()

const filterForm = ref({
  semester: '',
  department: '',
  confirmed: ''
})

const detailDialogVisible = ref(false)
const currentTeacher = ref(null)

// 直接使用store，不解构
const scores = computed(() => scoreStore.scores)
const semesters = computed(() => scoreStore.semesters)

const filteredScores = computed(() => {
  let result = scores.value

  if (filterForm.value.semester) {
    result = result.filter(s => s.semester === filterForm.value.semester)
  }

  if (filterForm.value.department) {
    result = result.filter(s => s.department === filterForm.value.department)
  }

  if (filterForm.value.confirmed !== '') {
    const confirmed = filterForm.value.confirmed === 'true'
    result = result.filter(s => s.confirmed === confirmed)
  }

  return result
})

const hasUnconfirmed = computed(() => {
  return filteredScores.value.some(s => !s.confirmed)
})

function handleFilter() {
  // Filter is handled by computed property
}

function getScoreType(score) {
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

function handleConfirm(row) {
  ElMessageBox.confirm(`确认「${row.teacherName}」的积分吗？`, '确认积分', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    scoreStore.confirmScore(row.id, '管理员')
    ElMessage.success('积分确认成功')
  }).catch(() => {})
}

function handleBatchConfirm() {
  const semester = filterForm.value.semester
  if (!semester) {
    ElMessage.warning('请先选择学期')
    return
  }

  ElMessageBox.confirm(`确认本学期「${semester}」的全部积分吗？`, '批量确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const count = scoreStore.batchConfirmScores(semester, '管理员')
    ElMessage.success(`已确认 ${count} 位教师的积分`)
  }).catch(() => {})
}

function handleViewDetail(row) {
  currentTeacher.value = row
  detailDialogVisible.value = true
}

onMounted(() => {
  console.log('=== ScoreDetail Debug ===')
  console.log('Scores count:', scoreStore.scores.length)
  console.log('Semesters:', semesters.value)

  // 如果数据是空的，重置
  if (scoreStore.scores.length === 0) {
    const stored = localStorage.getItem('evaluationScores')
    if (stored) {
      console.log('Found data in localStorage but store is empty, reloading...')
      scoreStore.resetScores()
    }
  }

  // 自动选择第一个学期
  if (semesters.value.length > 0) {
    filterForm.value.semester = semesters.value[0]
  }
})
</script>

<style scoped>
.score-detail {
  padding: 0;
}

.page-card {
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

.filter-bar {
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.teacher-info {
  margin-bottom: 24px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
