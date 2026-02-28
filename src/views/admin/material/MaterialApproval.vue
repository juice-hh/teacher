<template>
  <div class="material-approval">
    <el-card shadow="hover">
      <template #header>
        <div class="header">
          <span class="title">评价填报审批</span>
          <div class="stats">
            <el-tag type="warning">待审批: {{ pendingCount }}</el-tag>
            <el-tag type="info">已处理: {{ processedCount }}</el-tag>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <!-- 待办审批 -->
        <el-tab-pane label="待办审批" name="pending">
          <el-table :data="pendingMaterials" border stripe>
            <el-table-column prop="taskName" label="任务名称" width="180" />
            <el-table-column prop="indicatorName" label="评价指标" width="120" />
            <el-table-column prop="teacherName" label="教师" width="100" />
            <el-table-column prop="materialName" label="材料名称" width="180" show-overflow-tooltip />
            <el-table-column prop="description" label="说明" min-width="200" show-overflow-tooltip />
            <el-table-column prop="uploadTime" label="上传时间" width="160" />
            <el-table-column label="操作" width="240" fixed="right">
              <template #default="{ row }">
                <el-button type="success" size="small" @click="handleApprove(row)">通过</el-button>
                <el-button type="danger" size="small" @click="handleReject(row)">驳回</el-button>
                <el-button type="primary" size="small" @click="handleView(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="pendingMaterials.length === 0" description="暂无待审批材料" />
        </el-tab-pane>

        <!-- 已办审批 -->
        <el-tab-pane label="已办审批" name="processed">
          <el-table :data="processedMaterials" border stripe>
            <el-table-column prop="taskName" label="任务名称" width="180" />
            <el-table-column prop="indicatorName" label="评价指标" width="120" />
            <el-table-column prop="teacherName" label="教师" width="100" />
            <el-table-column prop="materialName" label="材料名称" width="180" show-overflow-tooltip />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'approved' ? 'success' : 'danger'">
                  {{ row.status === 'approved' ? '已通过' : '已驳回' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="approver" label="审批人" width="100" />
            <el-table-column prop="approveTime" label="审批时间" width="160" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleView(row)">查看</el-button>
                <el-button v-if="row.status === 'rejected'" type="info" size="small" @click="showRejectReason(row)">原因</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="processedMaterials.length === 0" description="暂无已处理材料" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewVisible" title="材料详情" width="600px">
      <el-descriptions v-if="currentMaterial" :column="2" border>
        <el-descriptions-item label="任务名称">{{ currentMaterial.taskName }}</el-descriptions-item>
        <el-descriptions-item label="评价指标">{{ currentMaterial.indicatorName }}</el-descriptions-item>
        <el-descriptions-item label="教师姓名">{{ currentMaterial.teacherName }}</el-descriptions-item>
        <el-descriptions-item label="材料名称">{{ currentMaterial.materialName }}</el-descriptions-item>
        <el-descriptions-item label="材料说明" :span="2">{{ currentMaterial.description }}</el-descriptions-item>
        <el-descriptions-item label="上传时间" :span="2">{{ currentMaterial.uploadTime }}</el-descriptions-item>
        <el-descriptions-item v-if="currentMaterial.status !== 'pending'" label="审批状态" :span="2">
          <el-tag :type="currentMaterial.status === 'approved' ? 'success' : 'danger'">
            {{ currentMaterial.status === 'approved' ? '已通过' : '已驳回' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentMaterial.approver" label="审批人">{{ currentMaterial.approver }}</el-descriptions-item>
        <el-descriptions-item v-if="currentMaterial.approveTime" label="审批时间">{{ currentMaterial.approveTime }}</el-descriptions-item>
        <el-descriptions-item v-if="currentMaterial.rejectReason" label="驳回原因" :span="2">
          <span style="color: #f56c6c">{{ currentMaterial.rejectReason }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 驳回对话框 -->
    <el-dialog v-model="rejectVisible" title="驳回材料" width="500px">
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="驳回原因" required>
          <el-input v-model="rejectForm.reason" type="textarea" :rows="4" placeholder="请输入驳回原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject">确认驳回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useMaterialsStore } from '@/stores/materials'

const materialsStore = useMaterialsStore()

const activeTab = ref('pending')
const viewVisible = ref(false)
const rejectVisible = ref(false)
const currentMaterial = ref(null)
const rejectForm = ref({ reason: '' })

// 直接使用store的computed属性
const pendingMaterials = computed(() => materialsStore.pendingMaterials)
const processedMaterials = computed(() => materialsStore.processedMaterials)
const pendingCount = computed(() => pendingMaterials.value.length)
const processedCount = computed(() => processedMaterials.value.length)

// 确保store已初始化
onMounted(() => {
  console.log('=== MaterialApproval Debug ===')
  console.log('Store materials length:', materialsStore.materials.length)
  console.log('Pending materials:', pendingMaterials.value.length)
  console.log('Processed materials:', processedMaterials.value.length)

  // 如果localStorage有数据但store是空的，手动重新加载
  if (materialsStore.materials.length === 0) {
    const stored = localStorage.getItem('evaluationMaterials')
    if (stored) {
      console.log('Found data in localStorage but store is empty, reloading...')
      materialsStore.resetMaterials()
    }
  }
})

const handleApprove = (row) => {
  ElMessageBox.confirm(`确定通过「${row.teacherName}」的材料吗？`, '确认通过', {
    type: 'success'
  }).then(() => {
    approveMaterial(row.id, '管理员')
    ElMessage.success('已通过')
  }).catch(() => {})
}

const handleReject = (row) => {
  currentMaterial.value = row
  rejectForm.value.reason = ''
  rejectVisible.value = true
}

const confirmReject = () => {
  if (!rejectForm.value.reason.trim()) {
    ElMessage.warning('请输入驳回原因')
    return
  }
  rejectMaterial(currentMaterial.value.id, '管理员', rejectForm.value.reason)
  rejectVisible.value = false
  ElMessage.success('已驳回')
}

const handleView = (row) => {
  currentMaterial.value = row
  viewVisible.value = true
}

const showRejectReason = (row) => {
  ElMessageBox.alert(row.rejectReason, '驳回原因', {
    confirmButtonText: '知道了'
  })
}
</script>

<style scoped>
.material-approval {
  padding: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: 600;
}

.stats {
  display: flex;
  gap: 12px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
