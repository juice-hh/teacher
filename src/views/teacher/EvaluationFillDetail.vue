<template>
  <div class="evaluation-fill-detail">
    <el-card shadow="hover" class="page-card">
      <template #header>
        <div class="card-header">
          <div class="title-section">
            <el-button link :icon="ArrowLeft" @click="router.back()">返回</el-button>
            <el-divider direction="vertical" />
            <span class="card-title">{{ taskInfo.name || '填报详情' }}</span>
          </div>
          <el-button type="primary" :icon="Check" @click="handleSubmit">提交评价填报</el-button>
        </div>
      </template>

      <!-- 任务基本信息 -->
      <el-descriptions class="task-info" :column="3" border>
        <el-descriptions-item label="评价周期">{{ taskInfo.period }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="taskInfo.status === 'pending' ? 'warning' : 'success'">
            {{ taskInfo.status === 'pending' ? '待评' : '已评' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="填报截止日期">{{ taskInfo.deadline }}</el-descriptions-item>
      </el-descriptions>

      <!-- 绑定的指标列表 -->
      <div class="indicators-section">
        <h3>所需填报指标清单</h3>
        <el-table :data="indicators" border style="width: 100%; margin-top: 16px;">
          <el-table-column prop="primaryName" label="一级指标" width="150" show-overflow-tooltip />
          <el-table-column prop="name" label="明细指标" min-width="150" show-overflow-tooltip />
          <el-table-column prop="score" label="满分" width="80">
            <template #default="{ row }">
              <el-tag type="warning" size="small">{{ row.score }}分</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="scoringRule" label="评分规则" min-width="200" show-overflow-tooltip />
          <el-table-column prop="materialRequirement" label="材料要求" min-width="200" show-overflow-tooltip />
          
          <!-- 填报操作列 -->
          <el-table-column label="填报操作" width="160" fixed="right" align="center">
            <template #default="{ row }">
              <div class="fill-actions">
                <div v-if="row.selfScore !== null">
                  <el-tag type="success" size="small" class="mb-2 w-full block">已填报 ({{ row.selfScore }}分)</el-tag>
                  <div class="text-xs text-gray-500 mb-2">
                    {{ row.files && row.files.length ? `已传 ${row.files.length} 个附件` : '无附件' }}
                  </div>
                  <el-button type="primary" size="small" plain @click="goFill(row)">修改填报</el-button>
                </div>
                <div v-else>
                  <el-button type="primary" size="small" @click="goFill(row)">去填报</el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useFillStore } from '@/stores/fill'

const route = useRoute()
const router = useRouter()
const fillStore = useFillStore()

const { taskInfo, indicators } = storeToRefs(fillStore)

const goFill = (row) => {
  const taskId = route.params.id || 'default'
  router.push(`/teacher/indicator-fill/${taskId}/${row.id}`)
}

const handleSubmit = () => {
  // 简易校验是否填写完毕
  const isAllFilled = indicators.value.every(item => item.selfScore !== null)
  if (!isAllFilled) {
    ElMessage.warning('请确保所有指标项已进行自评打分')
    return
  }

  const totalExpectedScore = indicators.value.reduce((sum, item) => sum + (item.selfScore || 0), 0)

  ElMessage.success(`填报完成，预估总分为: ${totalExpectedScore}分！已成功提交！`)
  fillStore.clear()
  router.push('/teacher/evaluation-projects')
}

onMounted(() => {
  const taskId = route.params.id || 'default'
  fillStore.init(taskId)
})
</script>

<style scoped>
.evaluation-fill-detail {
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

.task-info {
  margin-bottom: 32px;
}

.indicators-section h3 {
  font-size: 15px;
  color: #333;
  font-weight: 600;
  margin-bottom: 12px;
  border-left: 3px solid #1890ff;
  padding-left: 8px;
}

.fill-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.mb-2 {
  margin-bottom: 8px;
}

.w-full {
  width: 100%;
}

.block {
  display: block;
}

.text-xs {
  font-size: 12px;
}

.text-gray-500 {
  color: #6b7280;
}
</style>
