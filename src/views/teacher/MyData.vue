<template>
  <div class="my-data">
    <el-tabs v-model="activeTab" class="custom-tabs">
      <el-tab-pane label="数据概览" name="overview">
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="summary-cards">
              <div class="summary-card" v-for="item in summaryData" :key="item.key">
                <div class="summary-icon" :style="{ background: item.color }">
                  <el-icon :size="20" color="#fff">
                    <component :is="item.icon" />
                  </el-icon>
                </div>
                <div class="summary-info">
                  <div class="summary-value">{{ item.value }}</div>
                  <div class="summary-label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top: 24px;">
          <el-col :span="16">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">历年评价分数趋势</span>
                  <el-radio-group v-model="chartPeriod" size="small">
                    <el-radio-button value="all">全部</el-radio-button>
                    <el-radio-button value="3year">近3年</el-radio-button>
                    <el-radio-button value="1year">近1年</el-radio-button>
                  </el-radio-group>
                </div>
              </template>
              <div class="chart-placeholder">
                <el-icon :size="60" color="#d9d9d9"><TrendCharts /></el-icon>
                <p>评价分数趋势图</p>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card class="radar-card" shadow="hover">
              <template #header>
                <span class="card-title">五维能力雷达图</span>
              </template>
              <div class="chart-placeholder">
                <el-icon :size="60" color="#d9d9d9"><Compass /></el-icon>
                <p>能力雷达图</p>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top: 24px;">
          <el-col :span="24">
            <el-card class="detail-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span class="card-title">评价记录详情</span>
                  <div class="header-actions">
                    <el-select v-model="filterYear" size="small" placeholder="选择年份" style="width: 120px;">
                      <el-option label="全部年份" value="" />
                      <el-option label="2024年" value="2024" />
                      <el-option label="2023年" value="2023" />
                      <el-option label="2022年" value="2022" />
                    </el-select>
                    <el-button :icon="Download" @click="handleExport">导出数据</el-button>
                  </div>
                </div>
              </template>

              <el-table :data="evaluationRecords" style="width: 100%">
                <el-table-column prop="period" label="评价周期" width="150" />
                <el-table-column prop="type" label="评价类型" width="120" />
                <el-table-column prop="attitude" label="教学态度" width="100" />
                <el-table-column prop="method" label="教学方法" width="100" />
                <el-table-column prop="effect" label="育人成效" width="100" />
                <el-table-column prop="development" label="专业发展" width="100" />
                <el-table-column prop="service" label="社会服务" width="100" />
                <el-table-column prop="total" label="总分" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getScoreTypeLegacy(row.total)">{{ row.total }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="rank" label="排名" width="100" />
                <el-table-column prop="evaluator" label="评价人" width="120" />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="{ row }">
                    <el-link type="primary" :underline="false" @click="handleViewDetail(row)">查看详情</el-link>
                    <el-divider direction="vertical" />
                    <el-link type="primary" :underline="false" @click="handleDownload(row)">下载报告</el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 积分明细 -->
      <el-tab-pane label="积分明细" name="detail">
        <div class="filter-bar">
          <el-select v-model="selectedSemester" placeholder="选择学期" style="width: 200px" @change="handleSemesterChange">
            <el-option
              v-for="semester in semesters"
              :key="semester"
              :label="semester"
              :value="semester"
            />
          </el-select>
        </div>

        <div v-if="selectedSemester && currentSemesterScore">
          <!-- 总分卡片 -->
          <el-card class="total-score-card" shadow="hover">
            <div class="total-content">
              <div class="total-info">
                <div class="total-label">{{ currentSemesterScore.semester }}</div>
                <div class="total-score">{{ currentSemesterScore.totalScore }}</div>
                <div class="total-desc">发展性积分总分</div>
              </div>
              <div class="total-status">
                <el-tag :type="currentSemesterScore.confirmed ? 'success' : 'warning'" size="large">
                  {{ currentSemesterScore.confirmed ? '已确认' : '待确认' }}
                </el-tag>
              </div>
            </div>
          </el-card>

          <!-- 积分明细列表 -->
          <el-card class="detail-list-card" shadow="hover">
            <template #header>
              <span>各项指标得分明细</span>
            </template>

            <el-table :data="currentSemesterScore.details" style="width: 100%" border>
              <el-table-column prop="taskName" label="任务名称" width="200" />
              <el-table-column prop="indicatorName" label="指标名称" width="150" />
              <el-table-column prop="score" label="得分" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getScoreType(row.score)" size="small">
                    {{ row.score }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="maxScore" label="满分" width="100" align="center" />
              <el-table-column label="得分率" width="150" align="center">
                <template #default="{ row }">
                  <el-progress
                    :percentage="getScorePercentage(row.score, row.maxScore)"
                    :color="getProgressColor(row.score, row.maxScore)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                  <el-button
                    v-if="!currentSemesterScore.confirmed"
                    type="warning"
                    size="small"
                    link
                    @click="handleAppeal(row)"
                  >
                    申诉
                  </el-button>
                  <el-button
                    v-else
                    type="success"
                    size="small"
                    link
                    disabled
                  >
                    已确认
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>

        <el-empty
          v-else
          description="请选择学期查看积分明细"
          :image-size="120"
        />
      </el-tab-pane>

      <!-- 我的申诉 -->
      <el-tab-pane label="我的申诉" name="appeals">
        <el-table :data="myAppeals" style="width: 100%" border>
          <el-table-column prop="indicatorName" label="指标名称" width="150" />
          <el-table-column label="原始得分" width="100" align="center">
            <template #default="{ row }">
              <el-tag type="info" size="small">{{ row.originalScore }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="期望得分" width="100" align="center">
            <template #default="{ row }">
              <el-tag type="warning" size="small">{{ row.expectedScore }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="申诉原因" min-width="200" show-overflow-tooltip />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag
                :type="getAppealStatusType(row.status)"
                size="small"
              >
                {{ getAppealStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="160" />
          <el-table-column label="处理结果" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              <span v-if="row.handleResult">{{ row.handleResult }}</span>
              <span v-else class="text-muted">-</span>
            </template>
          </el-table-column>
        </el-table>

        <el-empty
          v-if="myAppeals && myAppeals.length === 0"
          description="暂无申诉记录"
          :image-size="120"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="评价详情" width="800px">
      <div class="detail-content" v-if="currentRecord">
        <div class="detail-header">
          <h3>{{ currentRecord.period }} · {{ currentRecord.type }}</h3>
          <el-tag :type="getScoreTypeLegacy(currentRecord.total)" size="large">总分：{{ currentRecord.total }}</el-tag>
        </div>

        <el-divider />

        <div class="score-breakdown">
          <div class="breakdown-title">各项得分明细</div>
          <el-row :gutter="16">
            <el-col :span="12" v-for="item in scoreBreakdown" :key="item.key">
              <div class="score-item">
                <span class="score-label">{{ item.label }}</span>
                <div class="score-bar">
                  <div
                    class="score-fill"
                    :style="{ width: (currentRecord[item.key] / item.max * 100) + '%', background: item.color }"
                  ></div>
                </div>
                <span class="score-value">{{ currentRecord[item.key] }}/{{ item.max }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-divider />

        <div class="comments-section">
          <div class="section-title">评价意见</div>
          <div class="comment-box">
            <p v-if="currentRecord.comment">{{ currentRecord.comment }}</p>
            <p v-else class="no-comment">暂无评价意见</p>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleDownload(currentRecord)">下载报告</el-button>
      </template>
    </el-dialog>

    <!-- 申诉对话框 -->
    <el-dialog
      v-model="appealDialogVisible"
      title="提交积分申诉"
      width="600px"
      @close="resetAppealForm"
    >
      <el-form :model="appealForm" :rules="appealRules" ref="appealFormRef" label-width="120px">
        <el-form-item label="指标名称">
          <el-input v-model="appealForm.indicatorName" disabled />
        </el-form-item>
        <el-form-item label="原始得分" prop="originalScore">
          <el-input-number v-model="appealForm.originalScore" disabled />
        </el-form-item>
        <el-form-item label="期望得分" prop="expectedScore">
          <el-input-number v-model="appealForm.expectedScore" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="申诉原因" prop="reason">
          <el-input
            v-model="appealForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请详细说明申诉原因"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="appealDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAppeal">提交申诉</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, TrendCharts, Compass } from '@element-plus/icons-vue'
import { useScoreStore } from '@/stores/scores'

const scoreStore = useScoreStore()

const activeTab = ref('overview')
const chartPeriod = ref('all')
const filterYear = ref('')
const detailDialogVisible = ref(false)
const currentRecord = ref(null)

const selectedSemester = ref('')
const currentSemesterScore = ref(null)
const appealDialogVisible = ref(false)
const currentDetail = ref(null)
const appealFormRef = ref(null)

const appealForm = ref({
  scoreId: null,
  indicatorName: '',
  originalScore: 0,
  expectedScore: 0,
  reason: ''
})

const appealRules = {
  expectedScore: [
    { required: true, message: '请输入期望得分', trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请输入申诉原因', trigger: 'blur' }
  ]
}

const semesters = computed(() => scoreStore.semesters)

const myAppeals = computed(() => {
  const teacherId = 'T001'
  return scoreStore.getTeacherAppeals(teacherId)
})

const summaryData = [
  {
    key: 'avgScore',
    label: '平均分',
    value: '86.5',
    icon: 'TrendCharts',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    key: 'bestScore',
    label: '最高分',
    value: '92.0',
    icon: 'Trophy',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    key: 'evaluationCount',
    label: '评价次数',
    value: '12',
    icon: 'Document',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    key: 'avgRank',
    label: '平均排名',
    value: '18/128',
    icon: 'Medal',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]

const scoreBreakdown = [
  { key: 'attitude', label: '教学态度', max: 20, color: '#1890ff' },
  { key: 'method', label: '教学方法', max: 25, color: '#52c41a' },
  { key: 'effect', label: '育人成效', max: 25, color: '#faad14' },
  { key: 'development', label: '专业发展', max: 20, color: '#722ed1' },
  { key: 'service', label: '社会服务', max: 10, color: '#eb2f96' }
]

const evaluationRecords = ref([
  {
    id: 1,
    period: '2024年度',
    type: '年度评价',
    attitude: 18,
    method: 22,
    effect: 21,
    development: 17,
    service: 8.5,
    total: 86.5,
    rank: '18/128',
    evaluator: '综合评价',
    comment: '教学态度认真，方法得当，效果良好。建议进一步加强科研与教学的结合。'
  },
  {
    id: 2,
    period: '2023年度',
    type: '年度评价',
    attitude: 19,
    method: 23,
    effect: 22,
    development: 18,
    service: 9,
    total: 91.0,
    rank: '10/128',
    evaluator: '综合评价',
    comment: '各项表现优秀，教学科研成果显著，育人工作突出。'
  },
  {
    id: 3,
    period: '2023年秋季',
    type: '学期评价',
    attitude: 17,
    method: 21,
    effect: 20,
    development: 16,
    service: 8,
    total: 82.0,
    rank: '25/128',
    evaluator: '综合评价',
    comment: ''
  }
])

function getScoreTypeLegacy(score) {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

function handleSemesterChange() {
  if (selectedSemester.value) {
    const teacherScores = scoreStore.getTeacherScores('T001')
    currentSemesterScore.value = teacherScores.find(
      s => s.semester === selectedSemester.value
    ) || null
  }
}

function getScoreType(score) {
  if (score >= 4) return 'success'
  if (score >= 3) return 'warning'
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

function getAppealStatusType(status) {
  const map = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return map[status] || 'info'
}

function getAppealStatusText(status) {
  const map = {
    'pending': '待处理',
    'approved': '已通过',
    'rejected': '已驳回'
  }
  return map[status] || '未知'
}

function handleAppeal(row) {
  currentDetail.value = row
  appealForm.value = {
    scoreId: currentSemesterScore.value.id,
    indicatorName: row.indicatorName,
    originalScore: row.score,
    expectedScore: row.score,
    reason: ''
  }
  appealDialogVisible.value = true
}

function resetAppealForm() {
  currentDetail.value = null
  appealForm.value = {
    scoreId: null,
    indicatorName: '',
    originalScore: 0,
    expectedScore: 0,
    reason: ''
  }
  appealFormRef.value?.clearValidate()
}

function submitAppeal() {
  appealFormRef.value?.validate((valid) => {
    if (valid) {
      scoreStore.submitAppeal({
        teacherId: 'T001',
        teacherName: '张老师',
        department: '计算机学院',
        ...appealForm.value
      })
      appealDialogVisible.value = false
      ElMessage.success('申诉提交成功')
      resetAppealForm()
    }
  })
}

function handleViewDetail(row) {
  currentRecord.value = row
  detailDialogVisible.value = true
}

function handleDownload(row) {
  ElMessage.success('正在下载评价报告...')
}

function handleExport() {
  ElMessage.success('正在导出个人评价数据...')
}

onMounted(() => {
  if (scoreStore.scores.length === 0) {
    const stored = localStorage.getItem('evaluationScores')
    if (stored) {
      scoreStore.resetScores()
    }
  }

  if (semesters.value.length > 0) {
    selectedSemester.value = semesters.value[0]
    handleSemesterChange()
  }
})
</script>

<style scoped>
.my-data {
  padding: 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.custom-tabs {
  padding: 20px;
}

.summary-cards {
  display: flex;
  gap: 24px;
}

.summary-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
}

.summary-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-top: 4px;
}

.chart-card,
.radar-card,
.detail-card {
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
  align-items: center;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bfbfbf;
}

.chart-placeholder p {
  margin-top: 12px;
  font-size: 13px;
}

.detail-content {
  padding: 16px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0;
}

.breakdown-title {
  font-size: 15px;
  font-weight: 500;
  color: #595959;
  margin-bottom: 16px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.score-label {
  font-size: 14px;
  color: #595959;
  min-width: 80px;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.score-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f1f1f;
  min-width: 50px;
  text-align: right;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #595959;
  margin-bottom: 12px;
}

.comment-box {
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.comment-box p {
  font-size: 14px;
  color: #595959;
  line-height: 1.8;
  margin: 0;
}

.no-comment {
  color: #bfbfbf !important;
}

/* Score detail styles */
.filter-bar {
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.total-score-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.total-score-card :deep(.el-card__body) {
  padding: 24px;
}

.total-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-info {
  flex: 1;
}

.total-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.total-score {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.total-desc {
  font-size: 14px;
  opacity: 0.9;
}

.total-status :deep(.el-tag) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.detail-list-card {
  border: 1px solid #e8e8e8;
}

.text-muted {
  color: #bfbfbf;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-tabs__content) {
  padding: 16px 0 0 0;
}
</style>
