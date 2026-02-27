<template>
  <div class="appeal-handling">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">申诉处理</span>
          <div class="header-stats">
            <el-tag type="warning" size="large">
              待处理: {{ pendingAppeals.length }} 项
            </el-tag>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeTab" class="appeal-tabs">
        <!-- 待处理申诉 -->
        <el-tab-pane label="待处理申诉" name="pending">
          <el-table :data="pendingAppeals" style="width: 100%">
            <el-table-column prop="teacherName" label="教师姓名" width="120" />
            <el-table-column prop="department" label="部门" width="150" />
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
            <el-table-column prop="submitTime" label="提交时间" width="160" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="success"
                  size="small"
                  :icon="CircleCheck"
                  @click="handleApprove(row)"
                >
                  通过
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :icon="CircleClose"
                  @click="handleReject(row)"
                >
                  驳回
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  link
                  :icon="View"
                  @click="handleView(row)"
                >
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-empty
            v-if="pendingAppeals.length === 0"
            description="暂无待处理申诉"
            :image-size="120"
          />
        </el-tab-pane>

        <!-- 已处理申诉 -->
        <el-tab-pane label="已处理申诉" name="processed">
          <el-table :data="processedAppeals" style="width: 100%">
            <el-table-column prop="teacherName" label="教师姓名" width="120" />
            <el-table-column prop="department" label="部门" width="150" />
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
            <el-table-column label="处理结果" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'approved' ? 'success' : 'danger'" size="small">
                  {{ row.status === 'approved' ? '已通过' : '已驳回' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="handleResult" label="处理意见" min-width="200" show-overflow-tooltip />
            <el-table-column prop="handler" label="处理人" width="100" />
            <el-table-column prop="handleTime" label="处理时间" width="160" />
          </el-table>

          <el-empty
            v-if="processedAppeals.length === 0"
            description="暂无已处理申诉"
            :image-size="120"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 处理申诉对话框 -->
    <el-dialog
      v-model="handleDialogVisible"
      :title="handleType === 'approve' ? '通过申诉' : '驳回申诉'"
      width="600px"
      @close="resetHandleForm"
    >
      <div v-if="currentAppeal">
        <el-descriptions :column="2" border class="appeal-info">
          <el-descriptions-item label="教师姓名">
            {{ currentAppeal.teacherName }}
          </el-descriptions-item>
          <el-descriptions-item label="部门">
            {{ currentAppeal.department }}
          </el-descriptions-item>
          <el-descriptions-item label="指标名称" :span="2">
            {{ currentAppeal.indicatorName }}
          </el-descriptions-item>
          <el-descriptions-item label="原始得分">
            {{ currentAppeal.originalScore }}
          </el-descriptions-item>
          <el-descriptions-item label="期望得分">
            {{ currentAppeal.expectedScore }}
          </el-descriptions-item>
          <el-descriptions-item label="申诉原因" :span="2">
            {{ currentAppeal.reason }}
          </el-descriptions-item>
          <el-descriptions-item label="提交时间" :span="2">
            {{ currentAppeal.submitTime }}
          </el-descriptions-item>
        </el-descriptions>

        <el-form :model="handleForm" :rules="handleRules" ref="handleFormRef" label-width="100px">
          <el-form-item label="处理意见" prop="result">
            <el-input
              v-model="handleForm.result"
              type="textarea"
              :rows="4"
              :placeholder="handleType === 'approve' ? '请说明通过理由' : '请说明驳回理由'"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="handleDialogVisible = false">取消</el-button>
        <el-button :type="handleType === 'approve' ? 'success' : 'danger'" @click="confirmHandle">
          确认{{ handleType === 'approve' ? '通过' : '驳回' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CircleCheck, CircleClose, View } from '@element-plus/icons-vue'
import { useScoreStore } from '@/stores/scores'

const scoreStore = useScoreStore()

const activeTab = ref('pending')
const handleDialogVisible = ref(false)
const handleType = ref('approve')
const currentAppeal = ref(null)
const handleFormRef = ref(null)

const handleForm = ref({
  result: ''
})

const handleRules = {
  result: [{ required: true, message: '请输入处理意见', trigger: 'blur' }]
}

// 直接使用store，不解构
const appeals = computed(() => scoreStore.appeals)
const pendingAppeals = computed(() => scoreStore.pendingAppeals)

const processedAppeals = computed(() => {
  return appeals.value.filter(appeal => appeal.status !== 'pending')
})

function handleApprove(row) {
  currentAppeal.value = row
  handleType.value = 'approve'
  handleForm.value.result = `经复核，同意将「${row.indicatorName}」得分从${row.originalScore}分调整为${row.expectedScore}分`
  handleDialogVisible.value = true
}

function handleReject(row) {
  currentAppeal.value = row
  handleType.value = 'reject'
  handleForm.value.result = ''
  handleDialogVisible.value = true
}

function resetHandleForm() {
  currentAppeal.value = null
  handleForm.value.result = ''
  handleFormRef.value?.clearValidate()
}

function confirmHandle() {
  handleFormRef.value?.validate((valid) => {
    if (valid) {
      const status = handleType.value === 'approve' ? 'approved' : 'rejected'
      scoreStore.handleAppeal(currentAppeal.value.id, '管理员', handleForm.value.result, status)
      handleDialogVisible.value = false
      ElMessage.success(status === 'approved' ? '申诉通过' : '申诉驳回')
    }
  })
}

function handleView(row) {
  ElMessageBox.alert(row.reason, '申诉详情', {
    confirmButtonText: '知道了'
  })
}

onMounted(() => {
  console.log('=== AppealHandling Debug ===')
  console.log('Appeals count:', scoreStore.appeals.length)
  console.log('Pending appeals:', pendingAppeals.value.length)

  // 如果数据是空的，重置
  if (scoreStore.appeals.length === 0) {
    const stored = localStorage.getItem('scoreAppeals')
    if (stored) {
      console.log('Found data in localStorage but store is empty, reloading...')
      scoreStore.resetScores()
    }
  }
})
</script>

<style scoped>
.appeal-handling {
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

.header-stats {
  display: flex;
  gap: 12px;
}

.appeal-tabs {
  margin-top: 16px;
}

.appeal-info {
  margin-bottom: 20px;
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
