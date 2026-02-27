<template>
  <div class="notification">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">系统通知</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">
            发布通知
          </el-button>
        </div>
      </template>

      <el-table :data="notificationData" style="width: 100%">
        <el-table-column prop="title" label="通知标题" width="300" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)" size="small">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sender" label="发布人" width="120" />
        <el-table-column prop="sendTime" label="发布时间" width="180" />
        <el-table-column prop="readCount" label="已读/总数" width="120">
          <template #default="{ row }">
            {{ row.readCount }} / {{ row.totalCount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已发布' ? 'success' : 'info'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleView(row)">查看</el-link>
            <el-divider direction="vertical" />
            <el-link type="primary" :underline="false" @click="handleEdit(row)" v-if="row.status === '草稿'">
              编辑
            </el-link>
            <el-link type="danger" :underline="false" @click="handleDelete(row)" v-else>
              撤回
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

    <!-- 通知编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑通知' : '发布通知'"
      width="700px"
    >
      <el-form :model="notificationForm" :rules="rules" ref="notificationFormRef" label-width="100px">
        <el-form-item label="通知标题" prop="title">
          <el-input v-model="notificationForm.title" placeholder="请输入通知标题" />
        </el-form-item>
        <el-form-item label="通知类型" prop="type">
          <el-select v-model="notificationForm.type" placeholder="请选择">
            <el-option label="系统通知" value="系统通知" />
            <el-option label="评价通知" value="评价通知" />
            <el-option label="任务提醒" value="任务提醒" />
            <el-option label="公告" value="公告" />
          </el-select>
        </el-form-item>
        <el-form-item label="接收对象" prop="receiver">
          <el-radio-group v-model="notificationForm.receiver">
            <el-radio value="all">全体用户</el-radio>
            <el-radio value="teacher">仅教师</el-radio>
            <el-radio value="admin">仅管理员</el-radio>
            <el-radio value="custom">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="通知内容" prop="content">
          <el-input
            v-model="notificationForm.content"
            type="textarea"
            :rows="8"
            placeholder="请输入通知内容"
          />
        </el-form-item>
        <el-form-item label="发布方式">
          <el-radio-group v-model="notificationForm.sendType">
            <el-radio value="now">立即发布</el-radio>
            <el-radio value="schedule">定时发布</el-radio>
            <el-radio value="draft">保存草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布时间" v-if="notificationForm.sendType === 'schedule'">
          <el-date-picker
            v-model="notificationForm.scheduleTime"
            type="datetime"
            placeholder="选择发布时间"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看通知对话框 -->
    <el-dialog v-model="viewDialogVisible" title="通知详情" width="600px">
      <div class="notification-detail">
        <h3 class="detail-title">{{ currentNotification.title }}</h3>
        <div class="detail-info">
          <el-tag size="small">{{ currentNotification.type }}</el-tag>
          <span class="info-item">发布人：{{ currentNotification.sender }}</span>
          <span class="info-item">发布时间：{{ currentNotification.sendTime }}</span>
        </div>
        <el-divider />
        <div class="detail-content">{{ currentNotification.content }}</div>
      </div>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const isEdit = ref(false)
const notificationFormRef = ref(null)
const currentNotification = ref({})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const notificationForm = reactive({
  title: '',
  type: '系统通知',
  receiver: 'all',
  content: '',
  sendType: 'now',
  scheduleTime: null
})

const rules = {
  title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
  receiver: [{ required: true, message: '请选择接收对象', trigger: 'change' }],
  content: [{ required: true, message: '请输入通知内容', trigger: 'blur' }]
}

const notificationData = ref([
  {
    id: 1,
    title: '2024年度教师自评通知',
    type: '评价通知',
    sender: '管理员',
    sendTime: '2024-02-20 10:00:00',
    readCount: 96,
    totalCount: 128,
    status: '已发布',
    content: '请各位教师在2024年3月31日前完成年度自我评价...'
  },
  {
    id: 2,
    title: '系统维护通知',
    type: '系统通知',
    sender: '管理员',
    sendTime: '2024-02-18 15:00:00',
    readCount: 125,
    totalCount: 128,
    status: '已发布',
    content: '系统将于2月25日凌晨2:00-4:00进行维护，届时将无法访问...'
  },
  {
    id: 3,
    title: '评分标准更新说明',
    type: '公告',
    sender: '管理员',
    sendTime: '2024-02-15 09:00:00',
    readCount: 120,
    totalCount: 128,
    status: '已发布',
    content: '根据学校要求，本次评价指标体系进行了以下调整...'
  }
])

pagination.total = notificationData.value.length

function getTypeColor(type) {
  const map = {
    '系统通知': 'info',
    '评价通知': 'primary',
    '任务提醒': 'warning',
    '公告': 'success'
  }
  return map[type] || 'info'
}

function handleAdd() {
  isEdit.value = false
  Object.assign(notificationForm, {
    title: '',
    type: '系统通知',
    receiver: 'all',
    content: '',
    sendType: 'now',
    scheduleTime: null
  })
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  Object.assign(notificationForm, { ...row })
  dialogVisible.value = true
}

function handleSave() {
  notificationFormRef.value?.validate((valid) => {
    if (valid) {
      dialogVisible.value = false
      ElMessage.success(notificationForm.sendType === 'draft' ? '草稿保存成功' : '通知发布成功')
    }
  })
}

function handleView(row) {
  currentNotification.value = row
  viewDialogVisible.value = true
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定要撤回通知「${row.title}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('通知已撤回')
  })
}
</script>

<style scoped>
.notification {
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

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.notification-detail {
  padding: 16px;
}

.detail-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 16px 0;
}

.detail-info {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #8c8c8c;
}

.detail-content {
  font-size: 14px;
  color: #595959;
  line-height: 1.8;
  white-space: pre-wrap;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
