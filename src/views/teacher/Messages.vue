<template>
  <div class="messages">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">消息中心</span>
          <el-button @click="markAllRead" :disabled="unreadCount === 0">
            全部标为已读
          </el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane name="all">
          <template #label>
            <span class="tab-label">
              全部消息
              <el-badge :value="total" v-if="total > 0" />
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="unread">
          <template #label>
            <span class="tab-label">
              未读消息
              <el-badge :value="unreadCount" v-if="unreadCount > 0" />
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="system">
          <template #label>
            <span class="tab-label">系统通知</span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="evaluation">
          <template #label>
            <span class="tab-label">评价通知</span>
          </template>
        </el-tab-pane>
      </el-tabs>

      <div class="message-list">
        <div
          class="message-item"
          v-for="message in filteredMessages"
          :key="message.id"
          :class="{ unread: !message.read }"
          @click="handleViewMessage(message)"
        >
          <div class="message-icon">
            <el-icon :size="20" :color="getMessageIconColor(message.type)">
              <component :is="getMessageIcon(message.type)" />
            </el-icon>
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-title">{{ message.title }}</span>
              <span class="message-time">{{ message.time }}</span>
            </div>
            <div class="message-preview">{{ message.preview }}</div>
            <el-tag v-if="!message.read" size="small" type="danger">未读</el-tag>
          </div>
        </div>

        <el-empty v-if="filteredMessages.length === 0" description="暂无消息" />
      </div>

      <div class="pagination" v-if="filteredMessages.length > 0">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50]"
          :total="filteredMessages.length"
          layout="total, sizes, prev, pager, next"
        />
      </div>
    </el-card>

    <!-- 消息详情对话框 -->
    <el-dialog v-model="detailDialogVisible" :title="currentMessage?.title" width="600px">
      <div class="message-detail" v-if="currentMessage">
        <div class="detail-meta">
          <el-tag size="small">{{ currentMessage.type }}</el-tag>
          <span class="meta-time">{{ currentMessage.time }}</span>
        </div>
        <el-divider />
        <div class="detail-content">{{ currentMessage.content }}</div>
        <el-divider v-if="currentMessage.attachments && currentMessage.attachments.length > 0" />
        <div class="detail-attachments" v-if="currentMessage.attachments && currentMessage.attachments.length > 0">
          <div class="attachment-title">附件：</div>
          <div class="attachment-list">
            <el-link
              v-for="(file, index) in currentMessage.attachments"
              :key="index"
              type="primary"
              :underline="false"
              @click="downloadAttachment(file)"
            >
              <el-icon><Paperclip /></el-icon>
              {{ file }}
            </el-link>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Bell, ChatDotRound, Warning, Paperclip } from '@element-plus/icons-vue'

const activeTab = ref('all')
const detailDialogVisible = ref(false)
const currentMessage = ref(null)

const pagination = ref({
  page: 1,
  size: 10
})

const messages = ref([
  {
    id: 1,
    type: '评价通知',
    title: '2024年度教师自评开始',
    preview: '请于2024年3月31日前完成年度自我评价，逾期将影响考核...',
    content: '尊敬的老师：\n\n2024年度教师自评工作现已开始，请您于2024年3月31日前登录系统完成自我评价。\n\n评价内容包括：\n1. 教学态度（20分）\n2. 教学方法（25分）\n3. 育人成效（25分）\n4. 专业发展（20分）\n5. 社会服务（10分）\n\n请注意：逾期未完成将影响您的年度考核结果。\n\n如有疑问，请联系教务处。',
    time: '2小时前',
    read: false,
    attachments: []
  },
  {
    id: 2,
    type: '评价通知',
    title: '同行评审任务分配通知',
    preview: '您已被分配对李老师、王老师进行同行评审，请在截止日期前完成...',
    content: '尊敬的老师：\n\n您已被分配以下同行评审任务：\n\n1. 李老师（数学学院）- 截止日期：2024-03-20\n2. 王老师（英语学院）- 截止日期：2024-03-25\n\n请客观公正地完成评审工作。',
    time: '1天前',
    read: false,
    attachments: []
  },
  {
    id: 3,
    type: '系统通知',
    title: '系统维护通知',
    preview: '系统将于2月25日凌晨2:00-4:00进行维护，届时将无法访问...',
    content: '尊敬的用户：\n\n为了提供更好的服务，系统将于2024年2月25日凌晨2:00-4:00进行系统维护和升级。\n\n维护期间系统将无法访问，请您提前安排好相关工作。\n\n给您带来的不便，敬请谅解。',
    time: '3天前',
    read: true,
    attachments: []
  },
  {
    id: 4,
    type: '系统通知',
    title: '评分标准更新说明',
    preview: '根据学校要求，本次评价指标体系进行了以下调整，请仔细阅读...',
    content: '各位老师：\n\n根据学校最新要求，本次评价指标体系进行了以下调整：\n\n1. 教学方法指标分值由20分调整为25分\n2. 新增信息技术应用作为评分参考项\n3. 科研成果认定标准更新\n\n详情请查看系统中的评价指标说明。',
    time: '5天前',
    read: true,
    attachments: ['评分标准更新说明.pdf', '评价指标体系2024版.docx']
  },
  {
    id: 5,
    type: '评价通知',
    title: '评价结果已公布',
    preview: '2023年度教师评价结果已公布，恭喜您获得优秀等级...',
    content: '尊敬的老师：\n\n2023年度教师评价工作已结束，您的评价结果已公布。\n\n总分：91.0分\n排名：10/128\n等级：优秀\n\n感谢您在过去一年中的辛勤付出！',
    time: '1周前',
    read: true,
    attachments: []
  }
])

const total = computed(() => messages.value.length)
const unreadCount = computed(() => messages.value.filter(m => !m.read).length)

const filteredMessages = computed(() => {
  let result = messages.value

  if (activeTab.value === 'unread') {
    result = result.filter(m => !m.read)
  } else if (activeTab.value === 'system') {
    result = result.filter(m => m.type === '系统通知')
  } else if (activeTab.value === 'evaluation') {
    result = result.filter(m => m.type === '评价通知')
  }

  return result
})

function getMessageIcon(type) {
  if (type === '系统通知') return Bell
  if (type === '评价通知') return ChatDotRound
  return Warning
}

function getMessageIconColor(type) {
  if (type === '系统通知') return '#1890ff'
  if (type === '评价通知') return '#52c41a'
  return '#faad14'
}

function handleTabChange() {
  pagination.value.page = 1
}

function handleViewMessage(message) {
  currentMessage.value = message
  message.read = true
  detailDialogVisible.value = true
}

function markAllRead() {
  messages.value.forEach(m => m.read = true)
  ElMessage.success('已全部标记为已读')
}

function downloadAttachment(file) {
  ElMessage.success(`正在下载：${file}`)
}
</script>

<style scoped>
.messages {
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

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 400px;
}

.message-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.3s;
}

.message-item:hover {
  background: #fafafa;
}

.message-item.unread {
  background: #f0f7ff;
}

.message-item.unread:hover {
  background: #e6f3ff;
}

.message-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-title {
  font-size: 15px;
  font-weight: 500;
  color: #1f1f1f;
}

.message-time {
  font-size: 13px;
  color: #bfbfbf;
  flex-shrink: 0;
  margin-left: 16px;
}

.message-preview {
  font-size: 14px;
  color: #595959;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.message-detail {
  padding: 16px;
}

.detail-meta {
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

.detail-attachments {
  margin-top: 16px;
}

.attachment-title {
  font-size: 13px;
  color: #595959;
  margin-bottom: 8px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 0;
}

:deep(.el-tabs__content) {
  padding: 0 20px 20px;
}

:deep(.el-tabs__item) {
  font-size: 15px;
}
</style>
