<template>
  <div class="task-management">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">评价任务管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">
            新增任务
          </el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-form :inline="true">
          <el-form-item label="任务名称">
            <el-input v-model="searchForm.name" placeholder="请输入任务名称" clearable />
          </el-form-item>
          <el-form-item label="任务类型">
            <el-select v-model="searchForm.type" placeholder="请选择" clearable>
              <el-option label="自我评价" value="self" />
              <el-option label="同行评审" value="peer" />
              <el-option label="综合评价" value="comprehensive" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择" clearable>
              <el-option label="未开始" value="未开始" />
              <el-option label="进行中" value="进行中" />
              <el-option label="已结束" value="已结束" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="taskData" style="width: 100%">
        <el-table-column prop="name" label="任务名称" width="200">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleViewDetail(row)">
              {{ row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="任务类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">
              {{ getTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="period" label="评价周期" width="120" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column label="绑定指标" width="200">
          <template #default="{ row }">
            <el-popover placement="top" :width="300" trigger="hover">
              <template #reference>
                <el-tag v-if="row.indicators && row.indicators.length > 0" type="info" size="small">
                  已绑定 {{ row.indicators.length }} 个指标
                </el-tag>
                <el-tag v-else type="info" size="small" effect="plain">未绑定</el-tag>
              </template>
              <div v-if="row.indicators && row.indicators.length > 0">
                <div v-for="ind in row.indicators" :key="ind.id" class="indicator-item">
                  <el-tag size="small" :type="ind.type === 'primary' ? 'primary' : 'warning'">
                    {{ ind.name }}
                  </el-tag>
                  <span class="indicator-score">{{ ind.score }}分</span>
                </div>
              </div>
              <div v-else>该任务未绑定任何指标</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="participantCount" label="参与人数" width="100" />
        <el-table-column prop="completedCount" label="完成人数" width="100" />
        <el-table-column label="完成率" width="100">
          <template #default="{ row }">
            <el-tag :type="getCompletionRateType(row.completionRate)" size="small">
              {{ row.completionRate }}%
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
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleViewDetail(row)">查看详情</el-link>
            <el-divider direction="vertical" />
            <el-link type="primary" :underline="false" @click="handleEdit(row)">编辑</el-link>
            <el-divider direction="vertical" />
            <el-link type="primary" :underline="false" @click="handlePublish(row)" v-if="row.status === '未开始'">
              发布
            </el-link>
            <el-link type="danger" :underline="false" @click="handleDelete(row)" v-else>
              删除
            </el-link>
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

    <!-- 任务编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑任务' : '新增任务'"
      width="800px"
    >
      <el-form :model="taskForm" :rules="rules" ref="taskFormRef" label-width="120px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="taskForm.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="评价周期" prop="period">
          <el-select v-model="taskForm.period" placeholder="请选择">
            <el-option label="2024年度" value="2024年度" />
            <el-option label="2024年春季学期" value="2024年春季学期" />
            <el-option label="2024年秋季学期" value="2024年秋季学期" />
          </el-select>
        </el-form-item>
        <el-form-item label="起止时间" prop="dateRange">
          <el-date-picker
            v-model="taskForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="绑定指标" prop="primaryIndicatorIds">
          <div class="indicator-selector">
            <el-select
              v-model="taskForm.primaryIndicatorIds"
              multiple
              placeholder="请选择一级评价指标"
              style="width: 100%"
            >
              <el-option
                v-for="primary in primaryIndicators"
                :key="primary.id"
                :label="`${primary.name}（${primary.score}分）`"
                :value="primary.id"
              >
                <div class="indicator-option">
                  <span>{{ primary.name }}</span>
                  <el-tag size="small" type="primary">{{ primary.score }}分</el-tag>
                </div>
              </el-option>
            </el-select>
            <el-button
              type="primary"
              :icon="Plus"
              size="small"
              class="add-indicator-btn"
              @click="showQuickCreateDialog"
            >
              快速创建指标
            </el-button>
          </div>
          <div class="form-tip">
            <el-icon><InfoFilled /></el-icon>
            已选择 {{ taskForm.primaryIndicatorIds?.length || 0 }} 个一级指标
          </div>

          <!-- 动态回显此任务下包含的所有二级指标明细 -->
          <div v-if="taskForm.primaryIndicatorIds && taskForm.primaryIndicatorIds.length > 0" class="linked-rule-details" style="margin-top: 12px; width: 100%">
            <div class="linked-rule-title" style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #595959;">指标明细全览</div>
            <el-table :data="selectedSecondaryDetails" border size="small">
              <el-table-column prop="primaryName" label="一级指标" width="120" show-overflow-tooltip />
              <el-table-column prop="name" label="二级指标" min-width="120" show-overflow-tooltip />
              <el-table-column prop="score" label="分值" width="70">
                <template #default="{ row }">
                  <el-tag size="small" type="warning">{{ row.score }}分</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="scoringRule" label="评分规则" min-width="150" show-overflow-tooltip />
              <el-table-column prop="materialRequirement" label="材料要求" min-width="150" show-overflow-tooltip />
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="参与人员">
          <el-button @click="selectParticipants">选择人员</el-button>
          <span class="participant-count">已选择 {{ taskForm.participants?.length || 0 }} 人</span>
        </el-form-item>
        <el-form-item label="任务说明">
          <el-input v-model="taskForm.description" type="textarea" :rows="4" placeholder="请输入任务说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <!-- 快速创建指标对话框 -->
    <el-dialog
      v-model="quickCreateDialogVisible"
      title="快速创建指标"
      width="600px"
      @close="resetQuickCreateForm"
    >
      <el-form :model="quickCreateForm" :rules="quickCreateRules" ref="quickCreateFormRef" label-width="120px">
        <el-form-item label="指标名称" prop="name">
          <el-input v-model="quickCreateForm.name" placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="所属一级指标" prop="primaryId">
          <el-select v-model="quickCreateForm.primaryId" placeholder="请选择所属一级指标" style="width: 100%">
            <el-option
              v-for="primary in primaryIndicators"
              :key="primary.id"
              :label="`${primary.name}（${primary.score}分）`"
              :value="primary.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input-number v-model="quickCreateForm.score" :min="1" :max="50" />
        </el-form-item>
        <el-form-item label="评分规则" prop="scoringRule">
          <el-input
            v-model="quickCreateForm.scoringRule"
            type="textarea"
            :rows="3"
            placeholder="请输入评分规则"
          />
        </el-form-item>
        <el-form-item label="材料要求" prop="materialRequirement">
          <el-input
            v-model="quickCreateForm.materialRequirement"
            type="textarea"
            :rows="2"
            placeholder="请输入材料要求"
          />
        </el-form-item>
        <el-form-item label="责任部门" prop="responsibleBody">
          <el-input v-model="quickCreateForm.responsibleBody" placeholder="请输入责任部门" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="quickCreateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleQuickCreate">确定并添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, InfoFilled } from '@element-plus/icons-vue'
import { useIndicatorStore } from '@/stores/indicator'

const router = useRouter()

const indicatorStore = useIndicatorStore()
const { primaryIndicators } = storeToRefs(indicatorStore)
const { getSecondaryByPrimary } = indicatorStore

const dialogVisible = ref(false)
const quickCreateDialogVisible = ref(false)
const isEdit = ref(false)
const taskFormRef = ref(null)
const quickCreateFormRef = ref(null)

const searchForm = reactive({
  name: '',
  type: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const taskForm = reactive({
  name: '',
  period: '',
  dateRange: null,
  primaryIndicatorIds: [],
  participants: [],
  description: ''
})

const selectedSecondaryDetails = computed(() => {
  if (!taskForm.primaryIndicatorIds || taskForm.primaryIndicatorIds.length === 0) return []
  const details = []
  taskForm.primaryIndicatorIds.forEach(primaryId => {
    const primary = primaryIndicators.value.find(p => p.id === primaryId)
    const secondaries = getSecondaryByPrimary(primaryId)
    if (primary && secondaries) {
      secondaries.forEach(sec => {
        details.push({
          ...sec,
          primaryName: primary.name
        })
      })
    }
  })
  return details
})

const quickCreateForm = reactive({
  name: '',
  primaryId: null,
  score: 5,
  scoringRule: '',
  materialRequirement: '',
  responsibleBody: ''
})

const rules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  period: [{ required: true, message: '请选择评价周期', trigger: 'change' }],
  dateRange: [{ required: true, message: '请选择起止时间', trigger: 'change' }]
}

const quickCreateRules = {
  name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
  primaryId: [{ required: true, message: '请选择所属一级指标', trigger: 'change' }],
  score: [{ required: true, message: '请输入分值', trigger: 'blur' }],
  scoringRule: [{ required: true, message: '请输入评分规则', trigger: 'blur' }],
  materialRequirement: [{ required: true, message: '请输入材料要求', trigger: 'blur' }],
  responsibleBody: [{ required: true, message: '请输入责任部门', trigger: 'blur' }]
}

const taskData = ref([
  {
    id: 1,
    name: '2024年度教师自评',
    type: 'self',
    period: '2024年度',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    indicators: [
      { id: 1, name: '备课充分', score: 5, type: 'secondary' },
      { id: 5, name: '教学方法创新', score: 8, type: 'secondary' }
    ],
    participantCount: 128,
    completedCount: 96,
    completionRate: 75,
    status: '进行中'
  },
  {
    id: 2,
    name: '第一季度同行评审',
    type: 'peer',
    period: '2024年春季学期',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    indicators: [],
    participantCount: 128,
    completedCount: 0,
    completionRate: 0,
    status: '未开始'
  },
  {
    id: 3,
    name: '教学态度专项评价',
    type: 'comprehensive',
    period: '2023年度',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    indicators: [
      { id: 1, name: '备课充分', score: 5, type: 'secondary' },
      { id: 2, name: '课堂管理', score: 5, type: 'secondary' },
      { id: 3, name: '作业批改', score: 5, type: 'secondary' }
    ],
    participantCount: 128,
    completedCount: 128,
    completionRate: 100,
    status: '已结束'
  }
])

pagination.total = taskData.value.length

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

function handleSearch() {
  ElMessage.success('查询成功')
}

function handleReset() {
  Object.assign(searchForm, {
    name: '',
    type: '',
    status: ''
  })
}

function handleAdd() {
  isEdit.value = false
  Object.assign(taskForm, {
    name: '',
    period: '',
    dateRange: null,
    primaryIndicatorIds: [],
    participants: [],
    description: ''
  })
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  // 如果之前是按 secondary 绑定的，这里我们为了保证不出错尝试从 indicators 提取所属的一级指标，或直接重置
  const primaryIds = new Set()
  if (row.indicators) {
    row.indicators.forEach(ind => {
      // 通过二级指标找一级指标id
      const p = primaryIndicators.value.find(pri => 
        getSecondaryByPrimary(pri.id).some(s => s.id === ind.id)
      )
      if (p) primaryIds.add(p.id)
    })
  }

  Object.assign(taskForm, {
    ...row,
    dateRange: [row.startDate, row.endDate],
    primaryIndicatorIds: Array.from(primaryIds)
  })
  dialogVisible.value = true
}

function handleView(row) {
  ElMessage.info(`查看任务：${row.name}`)
}

function handleViewDetail(row) {
  // 跳转到任务详情页面
  router.push(`/admin/task-detail/${row.id}`)
}

function handleSave() {
  taskFormRef.value?.validate((valid) => {
    if (valid) {
      const taskData = {
        ...taskForm,
        startDate: taskForm.dateRange[0],
        endDate: taskForm.dateRange[1],
        indicators: selectedSecondaryDetails.value.map(s => ({
            id: s.id,
            name: s.name,
            score: s.score,
            type: 'secondary'
          }))
      }

      console.log('保存任务:', taskData)
      dialogVisible.value = false
      ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    }
  })
}

function handlePublish(row) {
  ElMessageBox.confirm(`确定要发布任务「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = '进行中'
    ElMessage.success('任务发布成功')
  })
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除任务「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

function selectParticipants() {
  ElMessage.info('打开人员选择器')
}

// 快速创建指标相关方法
function showQuickCreateDialog() {
  quickCreateDialogVisible.value = true
}

function resetQuickCreateForm() {
  quickCreateFormRef.value?.clearValidate()
  Object.assign(quickCreateForm, {
    name: '',
    primaryId: null,
    score: 5,
    scoringRule: '',
    materialRequirement: '',
    responsibleBody: ''
  })
}

function handleQuickCreate() {
  quickCreateFormRef.value?.validate((valid) => {
    if (valid) {
      // 创建新的二级指标
      const newIndicator = {
        id: Date.now(),
        primaryId: quickCreateForm.primaryId,
        name: quickCreateForm.name,
        score: quickCreateForm.score,
        scoringRule: quickCreateForm.scoringRule,
        materialRequirement: quickCreateForm.materialRequirement,
        responsibleBody: quickCreateForm.responsibleBody
      }

      // 添加到 store
      indicatorStore.addSecondaryIndicator(newIndicator)

      // 自动添加到当前任务的指标列表中
      if (!taskForm.primaryIndicatorIds) {
        taskForm.primaryIndicatorIds = []
      }
      if (!taskForm.primaryIndicatorIds.includes(newIndicator.primaryId)) {
        taskForm.primaryIndicatorIds.push(newIndicator.primaryId)
      }

      quickCreateDialogVisible.value = false
      ElMessage.success('指标创建成功并已自动关联所在一级指标')

      // 重置表单
      resetQuickCreateForm()
    }
  })
}
</script>

<style scoped>
.task-management {
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

.participant-count {
  margin-left: 12px;
  font-size: 13px;
  color: #8c8c8c;
}

.indicator-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add-indicator-btn {
  align-self: flex-start;
}

.indicator-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.form-tip .el-icon {
  font-size: 14px;
}

.indicator-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.indicator-item:last-child {
  margin-bottom: 0;
}

.indicator-score {
  font-size: 12px;
  color: #8c8c8c;
  margin-left: 8px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-select-dropdown__item) {
  padding: 8px 12px;
}
</style>
