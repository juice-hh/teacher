<template>
  <div class="self-evaluation">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">自我评价</span>
          <div class="header-actions">
            <el-button @click="handleSaveDraft">保存草稿</el-button>
            <el-button type="primary" @click="handleSubmit">提交评价</el-button>
          </div>
        </div>
      </template>

      <div class="evaluation-content">
        <el-alert
          title="请根据各项指标要求，如实填写自我评价，并上传相关证明材料"
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 24px;"
        />

        <div class="indicator-sections">
          <div
            class="indicator-section"
            v-for="primary in primaryIndicators"
            :key="primary.id"
          >
            <div class="section-header">
              <h3 class="section-title">
                {{ primary.name }}
                <el-tag type="primary" size="large">{{ primary.score }}分</el-tag>
              </h3>
              <p class="section-desc">{{ primary.description }}</p>
            </div>

            <div class="secondary-items">
              <div
                class="secondary-item"
                v-for="secondary in getSecondaryByPrimary(primary.id)"
                :key="secondary.id"
              >
                <div class="item-header">
                  <span class="item-name">{{ secondary.name }}</span>
                  <el-tag type="warning" size="small">{{ secondary.score }}分</el-tag>
                </div>

                <div class="item-info">
                  <div class="info-row">
                    <span class="info-label">评分标准：</span>
                    <span class="info-value">{{ secondary.scoringRule }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">材料要求：</span>
                    <span class="info-value">{{ secondary.materialRequirement }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">责任部门：</span>
                    <span class="info-value">{{ secondary.responsibleBody }}</span>
                  </div>
                </div>

                <div class="item-score">
                  <el-form-item label="自评分数">
                    <el-input-number
                      v-model="evaluationData[secondary.id]"
                      :min="0"
                      :max="secondary.score"
                      :precision="1"
                    />
                    <span class="score-tip">/ {{ secondary.score }}分</span>
                  </el-form-item>
                </div>

                <div class="item-material">
                  <el-form-item label="上传材料">
                    <el-upload
                      action="#"
                      :auto-upload="false"
                      :on-change="(file) => handleUpload(secondary.id, file)"
                      :file-list="materialFiles[secondary.id] || []"
                      :limit="5"
                      multiple
                    >
                      <el-button size="small" :icon="Upload">上传文件</el-button>
                      <template #tip>
                        <div class="upload-tip">支持上传图片、PDF、Word等格式，最多5个文件</div>
                      </template>
                    </el-upload>
                  </el-form-item>
                </div>

                <div class="item-remark">
                  <el-input
                    v-model="remarks[secondary.id]"
                    type="textarea"
                    :rows="2"
                    placeholder="请填写自评说明（选填）"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="score-summary">
          <div class="summary-card">
            <div class="summary-title">评分统计</div>
            <div class="summary-content">
              <div class="summary-item">
                <span class="summary-label">教学态度</span>
                <span class="summary-value">{{ getScoreByPrimary(1) }} / 20分</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">教学方法</span>
                <span class="summary-value">{{ getScoreByPrimary(2) }} / 25分</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">育人成效</span>
                <span class="summary-value">{{ getScoreByPrimary(3) }} / 25分</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">专业发展</span>
                <span class="summary-value">{{ getScoreByPrimary(4) }} / 20分</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">社会服务</span>
                <span class="summary-value">{{ getScoreByPrimary(5) }} / 10分</span>
              </div>
              <el-divider />
              <div class="summary-total">
                <span class="total-label">总分</span>
                <span class="total-value">{{ totalScore }} / 100分</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { useIndicatorStore } from '@/stores/indicator'

const indicatorStore = useIndicatorStore()
const { primaryIndicators, getSecondaryByPrimary } = indicatorStore

const evaluationData = ref({})
const remarks = ref({})
const materialFiles = ref({})

onMounted(() => {
  indicatorStore.loadFromLocal()
  loadSavedData()
})

// 计算总分
const totalScore = computed(() => {
  let sum = 0
  Object.values(evaluationData.value).forEach(score => {
    sum += Number(score) || 0
  })
  return sum.toFixed(1)
})

// 获取某个一级指标的总分
function getScoreByPrimary(primaryId) {
  const items = getSecondaryByPrimary(primaryId)
  let sum = 0
  items.forEach(item => {
    sum += Number(evaluationData.value[item.id]) || 0
  })
  return sum.toFixed(1)
}

// 处理文件上传
function handleUpload(id, file) {
  if (!materialFiles.value[id]) {
    materialFiles.value[id] = []
  }
  materialFiles.value[id].push(file)
}

// 保存草稿
function handleSaveDraft() {
  const data = {
    evaluationData: evaluationData.value,
    remarks: remarks.value,
    timestamp: new Date().toISOString()
  }
  localStorage.setItem('evaluation_draft', JSON.stringify(data))
  ElMessage.success('草稿已保存')
}

// 加载已保存的数据
function loadSavedData() {
  const saved = localStorage.getItem('evaluation_draft')
  if (saved) {
    const data = JSON.parse(saved)
    evaluationData.value = data.evaluationData || {}
    remarks.value = data.remarks || {}
  }
}

// 提交评价
function handleSubmit() {
  // 检查是否所有项目都已评分
  const allItems = indicatorStore.secondaryIndicators
  const scoredItems = Object.keys(evaluationData.value).filter(
    key => evaluationData.value[key] !== undefined && evaluationData.value[key] !== ''
  )

  if (scoredItems.length < allItems.length) {
    ElMessage.warning('请完成所有项目的评分后再提交')
    return
  }

  ElMessageBox.confirm(
    `您的自评总分为 ${totalScore.value} 分，确定要提交吗？提交后将无法修改。`,
    '确认提交',
    {
      confirmButtonText: '确定提交',
      cancelButtonText: '再检查一下',
      type: 'warning'
    }
  ).then(() => {
    // 保存提交数据
    const submission = {
      evaluationData: evaluationData.value,
      remarks: remarks.value,
      totalScore: totalScore.value,
      submitTime: new Date().toISOString()
    }
    localStorage.setItem('evaluation_submission', JSON.stringify(submission))
    // 清除草稿
    localStorage.removeItem('evaluation_draft')
    ElMessage.success('评价提交成功！')
  })
}
</script>

<style scoped>
.self-evaluation {
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

.evaluation-content {
  max-width: 900px;
}

.indicator-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.indicator-section {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 8px 0;
}

.section-desc {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.secondary-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.secondary-item {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.item-name {
  font-size: 15px;
  font-weight: 500;
  color: #1f1f1f;
}

.item-info {
  margin-bottom: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 6px;
}

.info-row {
  display: flex;
  margin-bottom: 8px;
  font-size: 13px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #595959;
  min-width: 80px;
}

.info-value {
  color: #1f1f1f;
  flex: 1;
}

.item-score,
.item-material,
.item-remark {
  margin-bottom: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

.score-tip {
  margin-left: 8px;
  font-size: 13px;
  color: #8c8c8c;
}

.upload-tip {
  font-size: 12px;
  color: #bfbfbf;
  margin-top: 4px;
}

.score-summary {
  margin-top: 32px;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: #fff;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.summary-label {
  opacity: 0.9;
}

.summary-value {
  font-weight: 500;
}

:deep(.el-divider) {
  border-color: rgba(255, 255, 255, 0.2);
  margin: 16px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
