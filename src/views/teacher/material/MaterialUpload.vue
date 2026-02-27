<template>
  <div class="material-upload">
    <el-card shadow="hover">
      <template #header>
        <span class="title">评价材料填报</span>
      </template>

      <div class="task-selector">
        <el-form inline>
          <el-form-item label="选择评价任务">
            <el-select v-model="selectedTaskId" placeholder="请选择任务" style="width: 300px" @change="handleTaskChange">
              <el-option
                v-for="task in tasks"
                :key="task.id"
                :label="task.name"
                :value="task.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- 当前任务填报指标全览 -->
      <div v-if="selectedTask" class="indicator-overview" style="margin-bottom: 20px;">
        <el-divider content-position="left">
          <h3>当前任务填报指标全览</h3>
        </el-divider>
        <el-table :data="indicators" border style="width: 100%">
          <el-table-column prop="name" label="指标名称" />
          <el-table-column prop="score" label="分值" width="80" align="center" />
          <el-table-column label="填写状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getFillingStatus(row.id).filled ? 'success' : 'info'">
                {{ getFillingStatus(row.id).filled ? '已填写' : '未填写' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(getFillingStatus(row.id).status)">
                {{ getStatusText(getFillingStatus(row.id).status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="申诉状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag type="info">无</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="selectedIndicatorId = row.id">
                填报材料
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="selectedTask && selectedIndicator" class="content">
        <el-divider content-position="left">
          <h3>{{ selectedTask.name }} - {{ selectedIndicator.name }}</h3>
        </el-divider>

        <div class="indicator-details" style="margin-bottom: 20px;">
          <el-descriptions title="指标详细信息" :column="2" border>
            <el-descriptions-item label="指标名称">{{ selectedIndicator.name }}</el-descriptions-item>
            <el-descriptions-item label="指标分值">
              <el-tag type="warning">{{ selectedIndicator.score }}分</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="评分标准" :span="2">{{ selectedIndicator.scoringRule }}</el-descriptions-item>
            <el-descriptions-item label="材料要求" :span="2">{{ selectedIndicator.materialRequirement }}</el-descriptions-item>
            <el-descriptions-item label="责任部门" :span="2">{{ selectedIndicator.responsibleBody }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="upload-section">
          <el-card shadow="hover" class="upload-card">
            <template #header>
              <div class="upload-header">
                <span>材料上传与管理</span>
              </div>
            </template>

            <!-- 已上传材料 -->
            <div v-if="getUploadedMaterials(selectedIndicator.id).length > 0" class="uploaded">
              <h5>已上传材料</h5>
              <div
                v-for="material in getUploadedMaterials(selectedIndicator.id)"
                :key="material.id"
                class="material-item"
              >
                <el-icon><Document /></el-icon>
                <span>{{ material.materialName }}</span>
                <el-tag :type="getStatusType(material.status)" size="small">
                  {{ getStatusText(material.status) }}
                </el-tag>
                <el-button
                  v-if="material.status !== 'approved'"
                  type="danger"
                  size="small"
                  link
                  @click="handleDelete(material)"
                >
                  删除
                </el-button>
              </div>
            </div>

            <!-- 上传区域 -->
            <el-upload
              class="upload-area"
              drag
              :auto-upload="false"
              :on-change="(file) => handleFileChange(file, selectedIndicator)"
              :show-file-list="false"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                拖拽文件到此处或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 doc、docx、pdf、jpg、png，不超过 10MB
                </div>
              </template>
            </el-upload>
          </el-card>
        </div>
      </div>

      <el-empty v-else description="请先选择一个任务" />
    </el-card>

    <!-- 上传对话框 -->
    <el-dialog v-model="uploadVisible" title="上传材料" width="600px">
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="100px">
        <el-form-item label="评价指标">
          <el-input :model-value="currentIndicator?.name" disabled />
        </el-form-item>
        <el-form-item label="材料名称" prop="materialName">
          <el-input v-model="uploadForm.materialName" placeholder="请输入材料名称" />
        </el-form-item>
        <el-form-item label="材料说明" prop="description">
          <el-input
            v-model="uploadForm.description"
            type="textarea"
            :rows="3"
            placeholder="请简要描述材料内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="uploadVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmUpload" :loading="uploading">
          确认上传
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, UploadFilled } from '@element-plus/icons-vue'
import { useMaterialsStore } from '@/stores/materials'
import { useIndicatorStore } from '@/stores/indicator'

const materialsStore = useMaterialsStore()
const indicatorStore = useIndicatorStore()

const selectedTaskId = ref(null)
const selectedTask = ref(null)
const selectedIndicatorId = ref(null)

const selectedIndicator = computed(() => {
  if (!selectedIndicatorId.value) return null
  return indicators.value.find(ind => ind.id === selectedIndicatorId.value)
})

// 页面加载时自动选择第一个任务
onMounted(() => {
  if (tasks.value.length > 0) {
    selectedTaskId.value = tasks.value[0].id
    handleTaskChange()
  }
})
const uploadVisible = ref(false)
const currentIndicator = ref(null)
const currentFile = ref(null)
const uploading = ref(false)

const uploadFormRef = ref(null)
const uploadForm = ref({
  materialName: '',
  description: ''
})

const uploadRules = {
  materialName: [{ required: true, message: '请输入材料名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入材料说明', trigger: 'blur' }]
}

// 模拟任务数据
const tasks = ref([
  {
    id: 1,
    name: '2024年度教师自评',
    indicators: [1, 5, 8, 11]
  },
  {
    id: 2,
    name: '第一季度同行评审',
    indicators: [2, 6, 9]
  }
])

const indicators = computed(() => {
  if (!selectedTask.value) return []

  return selectedTask.value.indicators
    .map(indicatorId => {
      for (const primary of indicatorStore.primaryIndicators) {
        const secondary = indicatorStore.getSecondaryByPrimary(primary.id)
          .find(s => s.id === indicatorId)
        if (secondary) return secondary
      }
      return null
    })
    .filter(Boolean)
})

const getUploadedMaterials = (indicatorId) => {
  return materialsStore.materials.filter(m =>
    m.teacherId === 'T001' &&
    m.taskId === selectedTaskId.value &&
    m.indicatorId === indicatorId
  )
}

const getStatusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger' }
  return map[status] || 'info'
}

const getFillingStatus = (indicatorId) => {
  const materials = getUploadedMaterials(indicatorId)
  if (materials.length > 0) {
    const hasRejected = materials.some(m => m.status === 'rejected')
    const hasPending = materials.some(m => m.status === 'pending')
    let status = 'approved'
    if (hasRejected) status = 'rejected'
    else if (hasPending) status = 'pending'
    return { filled: true, status }
  }
  return { filled: false, status: 'none' }
}

const getStatusText = (status) => {
  const map = { pending: '待审批', approved: '已通过', rejected: '已驳回', none: '-' }
  return map[status] || '-'
}

const handleTaskChange = () => {
  selectedTask.value = tasks.value.find(t => t.id === selectedTaskId.value)
  if (indicators.value.length > 0) {
    selectedIndicatorId.value = indicators.value[0].id
  } else {
    selectedIndicatorId.value = null
  }
}

const handleIndicatorChange = () => {
  // Indicator selected logic if needed
}

const handleFileChange = (file, indicator) => {
  currentIndicator.value = indicator
  currentFile.value = file
  uploadForm.value.materialName = file.name.split('.')[0]
  uploadVisible.value = true
}

const confirmUpload = () => {
  uploadFormRef.value?.validate((valid) => {
    if (valid) {
      uploading.value = true

      setTimeout(() => {
        const materialData = {
          taskId: selectedTaskId.value,
          taskName: selectedTask.value.name,
          indicatorId: currentIndicator.value.id,
          indicatorName: currentIndicator.value.name,
          teacherId: 'T001',
          teacherName: '张老师',
          materialName: uploadForm.value.materialName,
          materialType: 'document',
          fileUrl: '/files/' + currentFile.value.name,
          description: uploadForm.value.description
        }

        materialsStore.uploadMaterial(materialData)

        uploading.value = false
        uploadVisible.value = false
        ElMessage.success('上传成功')

        uploadForm.value = { materialName: '', description: '' }
      }, 1000)
    }
  })
}

const handleDelete = (material) => {
  ElMessageBox.confirm('确定要删除这个材料吗？', '确认删除', {
    type: 'warning'
  }).then(() => {
    materialsStore.deleteMaterial(material.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.material-upload {
  padding: 0;
}

.title {
  font-size: 16px;
  font-weight: 600;
}

.task-selector {
  margin-bottom: 20px;
}

.content {
  margin-top: 20px;
}

.upload-section {
  margin-top: 20px;
}

.upload-card {
  border: 1px solid #e8e8e8;
}

.upload-header {
  font-size: 15px;
  font-weight: 600;
}

.uploaded {
  margin-bottom: 16px;
}

.uploaded h5 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-upload-dragger) {
  padding: 30px;
}
</style>
