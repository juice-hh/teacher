<template>
  <div class="peer-review">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">评审他人</span>
        </div>
      </template>

      <el-alert
        title="请客观公正地对被评审人进行评价，评价结果将作为教师年度考核的重要依据"
        type="warning"
        :closable="false"
        show-icon
        style="margin-bottom: 24px;"
      />

      <el-table :data="reviewList" style="width: 100%">
        <el-table-column prop="name" label="被评审人" width="120">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="32" :icon="UserFilled" />
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" width="150" />
        <el-table-column prop="title" label="职称" width="100" />
        <el-table-column prop="taskName" label="评审任务" />
        <el-table-column prop="deadline" label="截止日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-link
              type="primary"
              :underline="false"
              @click="handleReview(row)"
              :disabled="row.status === '已完成'"
            >
              {{ row.status === '已完成' ? '查看' : '开始评审' }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 评审对话框 -->
    <el-dialog
      v-model="reviewDialogVisible"
      title="同行评审"
      width="800px"
      @close="handleCloseDialog"
    >
      <div class="review-content" v-if="currentUser">
        <div class="teacher-info">
          <el-avatar :size="60" :icon="UserFilled" />
          <div class="info-right">
            <h3 class="teacher-name">{{ currentUser.name }}</h3>
            <p class="teacher-dept">{{ currentUser.department }} · {{ currentUser.title }}</p>
          </div>
        </div>

        <el-divider />

        <div class="review-items">
          <h4 class="items-title">请对以下方面进行评价（每项10分）</h4>

          <div class="review-item" v-for="(item, index) in reviewItems" :key="index">
            <div class="item-header">
              <span class="item-name">{{ item.name }}</span>
              <el-rate
                v-model="reviewScores[index]"
                :max="10"
                show-score
                score-template="{value} 分"
                allow-half
              />
            </div>
            <el-input
              v-model="reviewComments[index]"
              type="textarea"
              :rows="2"
              :placeholder="`请对${item.name}进行评价说明（选填）`"
              style="margin-top: 12px;"
            />
          </div>
        </div>

        <el-divider />

        <div class="overall-comment">
          <h4>综合评价</h4>
          <el-input
            v-model="overallComment"
            type="textarea"
            :rows="4"
            placeholder="请输入对该教师的综合评价意见"
          />
        </div>
      </div>

      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview" :disabled="isReviewCompleted">
          {{ isReviewCompleted ? '已完成' : '提交评审' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'

const reviewDialogVisible = ref(false)
const currentUser = ref(null)
const isReviewCompleted = ref(false)

const reviewScores = reactive({})
const reviewComments = reactive({})
const overallComment = ref('')

const reviewItems = [
  { name: '教学态度', key: 'attitude' },
  { name: '教学方法', key: 'method' },
  { name: '教学效果', key: 'effect' },
  { name: '育人工作', key: 'education' },
  { name: '专业素养', key: 'professional' }
]

const reviewList = ref([
  {
    id: 1,
    name: '李老师',
    department: '数学学院',
    title: '教授',
    taskName: '2024年春季同行评审',
    deadline: '2024-03-20',
    status: '未开始'
  },
  {
    id: 2,
    name: '王老师',
    department: '英语学院',
    title: '副教授',
    taskName: '2024年春季同行评审',
    deadline: '2024-03-25',
    status: '进行中'
  },
  {
    id: 3,
    name: '刘老师',
    department: '物理学院',
    title: '讲师',
    taskName: '2024年春季同行评审',
    deadline: '2024-03-15',
    status: '已完成'
  }
])

function getStatusType(status) {
  const map = {
    '未开始': 'info',
    '进行中': 'primary',
    '已完成': 'success'
  }
  return map[status] || 'info'
}

function handleReview(row) {
  currentUser.value = row
  isReviewCompleted.value = row.status === '已完成'

  // 重置表单
  reviewItems.forEach((_, index) => {
    reviewScores[index] = isReviewCompleted.value ? 8 : 0
    reviewComments[index] = ''
  })
  overallComment.value = ''

  reviewDialogVisible.value = true
}

function submitReview() {
  // 验证是否已评分
  const hasEmptyScore = Object.values(reviewScores).some(score => !score || score === 0)
  if (hasEmptyScore) {
    ElMessage.warning('请完成所有项目的评分')
    return
  }

  const totalScore = Object.values(reviewScores).reduce((sum, score) => sum + score, 0)

  ElMessageBox.confirm(
    `评审总分为 ${totalScore} 分，确定要提交吗？`,
    '确认提交',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 更新状态
    if (currentUser.value) {
      currentUser.value.status = '已完成'
    }
    reviewDialogVisible.value = false
    ElMessage.success('评审提交成功')
  })
}

function handleCloseDialog() {
  // 清理表单数据
  reviewItems.forEach((_, index) => {
    reviewScores[index] = 0
    reviewComments[index] = ''
  })
  overallComment.value = ''
}
</script>

<style scoped>
.peer-review {
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

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-content {
  padding: 16px;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.info-right {
  flex: 1;
}

.teacher-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 4px 0;
}

.teacher-dept {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.review-items {
  margin-top: 16px;
}

.items-title {
  font-size: 15px;
  font-weight: 500;
  color: #595959;
  margin: 0 0 16px 0;
}

.review-item {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f1f1f;
}

.overall-comment {
  margin-top: 16px;
}

.overall-comment h4 {
  font-size: 15px;
  font-weight: 500;
  color: #595959;
  margin: 0 0 12px 0;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-rate) {
  display: flex;
  align-items: center;
}
</style>
