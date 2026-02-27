<template>
  <div class="indicator-fill">
    <el-card shadow="hover" class="page-card" v-if="indicator">
      <template #header>
        <div class="card-header">
          <div class="title-section">
            <el-button link :icon="ArrowLeft" @click="goBack">返回</el-button>
            <el-divider direction="vertical" />
            <span class="card-title">指标填报 - {{ indicator.name }}</span>
          </div>
          <el-button type="primary" :icon="Check" @click="handleSave" :disabled="!formValid">确认并保存</el-button>
        </div>
      </template>

      <div class="content-wrapper">
        <el-row :gutter="24">
          <!-- 左侧：填报信息与要求 -->
          <el-col :span="10">
            <div class="info-section">
              <h3 class="section-title">指标说明</h3>
              <el-descriptions :column="1" border class="mb-4">
                <el-descriptions-item label="所属任务">{{ taskInfo.name }}</el-descriptions-item>
                <el-descriptions-item label="一级指标">{{ indicator.primaryName }}</el-descriptions-item>
                <el-descriptions-item label="指标分值">
                  <el-tag type="warning">{{ indicator.score }}分</el-tag>
                </el-descriptions-item>
              </el-descriptions>

              <el-alert
                title="评分规则"
                type="info"
                :description="indicator.scoringRule"
                :closable="false"
                class="mb-4"
              />

              <el-alert
                title="证明材料要求"
                type="warning"
                :description="indicator.materialRequirement"
                :closable="false"
              />
            </div>
          </el-col>

          <!-- 右侧：填报表单 -->
          <el-col :span="14">
            <div class="form-section">
              <h3 class="section-title">填报表单</h3>
              <el-form :model="formData" label-width="100px" class="fill-form">
                
                <el-form-item label="自评指标" required>
                  <el-select
                    v-model="formData.selectedIndicator"
                    placeholder="请选择适用的实际指标"
                    class="w-full"
                    @change="handleIndicatorChange"
                  >
                    <el-option
                      v-for="item in availableIndicators"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="自评等级" v-if="hasLevels" required>
                  <el-select
                    v-model="formData.selectedLevel"
                    placeholder="请选择适用的等级"
                    class="w-full"
                    @change="calculateScore"
                  >
                    <el-option
                      v-for="item in availableLevels"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>

                <el-form-item label="预得分">
                  <div class="score-display">
                    <span v-if="formData.selfScore !== null" class="score-value">{{ formData.selfScore }} 分</span>
                    <span v-else class="score-placeholder">请选择指标参数后自动计算</span>
                  </div>
                </el-form-item>

                <el-form-item label="补充说明">
                  <el-input 
                    v-model="formData.notes" 
                    type="textarea" 
                    :rows="4" 
                    placeholder="请输入对该指标自评的补充说明（选填）"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item label="佐证材料">
                  <el-upload
                    action="#"
                    :auto-upload="false"
                    :limit="5"
                    multiple
                    :file-list="formData.files"
                    @change="handleFileUpload"
                    @remove="handleFileRemove"
                    class="upload-demo"
                  >
                    <el-button type="primary" plain :icon="Upload">选择证明材料(.pdf / .jpg / .zip)</el-button>
                    <template #tip>
                      <div class="el-upload__tip">
                        请上传符合要求的支撑材料文件，最多支持上传 5 个附件
                      </div>
                    </template>
                  </el-upload>
                </el-form-item>

              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-empty v-else description="找不到该指标信息" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Check, Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useFillStore } from '@/stores/fill'
import { useRulesStore } from '@/stores/rules'

const route = useRoute()
const router = useRouter()
const fillStore = useFillStore()
const rulesStore = useRulesStore()

const taskInfo = computed(() => fillStore.taskInfo)
const indicator = ref(null)

const formData = ref({
  selectedIndicator: '',
  selectedLevel: '',
  selfScore: null,
  notes: '',
  files: []
})

const availableIndicators = computed(() => {
  if (!indicator.value) return []
  const rules = rulesStore.getRulesByType(indicator.value.scoringRuleType)
  if (!rules.length) return []
  const uniqueIndicators = new Set(rules[0].scoringItems.map(item => item.indicator))
  return Array.from(uniqueIndicators)
})

const availableLevels = computed(() => {
  if (!indicator.value) return []
  const rules = rulesStore.getRulesByType(indicator.value.scoringRuleType)
  if (!rules.length) return []
  const uniqueLevels = new Set(rules[0].scoringItems.map(item => item.level).filter(Boolean))
  return Array.from(uniqueLevels)
})

const hasLevels = computed(() => availableLevels.value.length > 0)

const formValid = computed(() => {
  if (!formData.value.selectedIndicator) return false
  if (hasLevels.value && !formData.value.selectedLevel) return false
  return formData.value.selfScore !== null
})

const goBack = () => {
  router.back()
}

const handleIndicatorChange = () => {
  formData.value.selectedLevel = ''
  calculateScore()
}

const calculateScore = () => {
  if (!indicator.value) return
  const rules = rulesStore.getRulesByType(indicator.value.scoringRuleType)
  if (!rules.length) {
    formData.value.selfScore = 0
    return
  }
  const rule = rules[0]
  const matchedItem = rule.scoringItems.find(item => {
    const indicatorMatch = item.indicator === formData.value.selectedIndicator
    const levelMatch = !item.level || item.level === formData.value.selectedLevel
    return indicatorMatch && levelMatch
  })
  
  if (matchedItem) {
    formData.value.selfScore = matchedItem.score
  } else {
    formData.value.selfScore = 0
  }
}

const handleFileUpload = (uploadFile, uploadFiles) => {
  formData.value.files = uploadFiles
}

const handleFileRemove = (file, uploadFiles) => {
  formData.value.files = uploadFiles
}

const handleSave = () => {
  if (!formValid.value) return
  
  // Update the centralized store
  fillStore.updateIndicatorFill(indicator.value.id, {
    selectedIndicator: formData.value.selectedIndicator,
    selectedLevel: formData.value.selectedLevel,
    selfScore: formData.value.selfScore,
    notes: formData.value.notes,
    files: formData.value.files
  })
  
  ElMessage.success('已保存填报信息')
  router.back()
}

onMounted(() => {
  const indicatorId = route.params.indicatorId
  
  if (!fillStore.isInitialized) {
    // Need to initialize if accessing directly via URL without going through the list page
    const taskId = route.params.taskId
    fillStore.init(taskId)
  }
  
  const found = fillStore.getIndicatorById(indicatorId)
  if (found) {
    indicator.value = found
    // Echo back existing data if present
    formData.value = {
      selectedIndicator: found.selectedIndicator || '',
      selectedLevel: found.selectedLevel || '',
      selfScore: found.selfScore !== null ? found.selfScore : null,
      notes: found.notes || '',
      files: found.files ? [...found.files] : []
    }
  } else {
    ElMessage.error('无法找到指定的评价指标')
  }
})
</script>

<style scoped>
.indicator-fill {
  padding: 0;
}

.page-card {
  border-radius: 8px;
  min-height: calc(100vh - 120px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
}

.content-wrapper {
  margin-top: 16px;
}

.section-title {
  font-size: 15px;
  color: #333;
  font-weight: 600;
  margin-bottom: 16px;
  border-left: 3px solid #1890ff;
  padding-left: 8px;
}

.info-section {
  padding-right: 24px;
  border-right: 1px dashed #e8e8e8;
}

.form-section {
  padding-left: 12px;
}

.fill-form {
  max-width: 600px;
}

.w-full {
  width: 100%;
}

.mb-4 {
  margin-bottom: 16px;
}

.score-display {
  display: flex;
  align-items: center;
  height: 32px;
}

.score-value {
  font-size: 20px;
  font-weight: 600;
  color: #52c41a;
}

.score-placeholder {
  color: #bfbfbf;
  font-size: 13px;
}

.upload-demo {
  margin-top: 8px;
}
</style>
