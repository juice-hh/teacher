<template>
  <div class="data-management">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">数据管理</span>
          <div class="header-actions">
            <el-button :icon="Download" @click="handleExport">导出数据</el-button>
            <el-button :icon="Upload" @click="handleImport">导入数据</el-button>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="评价数据" name="evaluation">
          <div class="search-bar">
            <el-form :inline="true">
              <el-form-item label="评价周期">
                <el-select v-model="searchForm.period" placeholder="请选择">
                  <el-option label="2024年度" value="2024" />
                  <el-option label="2023年度" value="2023" />
                </el-select>
              </el-form-item>
              <el-form-item label="部门">
                <el-select v-model="searchForm.department" placeholder="请选择" clearable>
                  <el-option label="计算机学院" value="计算机学院" />
                  <el-option label="数学学院" value="数学学院" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-table :data="evaluationData" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="period" label="评价周期" width="120" />
            <el-table-column prop="attitude" label="教学态度" width="100" />
            <el-table-column prop="method" label="教学方法" width="100" />
            <el-table-column prop="effect" label="育人成效" width="100" />
            <el-table-column prop="development" label="专业发展" width="100" />
            <el-table-column prop="service" label="社会服务" width="100" />
            <el-table-column prop="total" label="总分" width="100">
              <template #default="{ row }">
                <el-tag :type="getScoreType(row.total)">{{ row.total }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-link type="primary" :underline="false" @click="handleViewDetail(row)">查看详情</el-link>
                <el-divider direction="vertical" />
                <el-link type="primary" :underline="false" @click="handleExportOne(row)">导出</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="任务数据" name="task">
          <el-table :data="taskData" style="width: 100%">
            <el-table-column prop="name" label="任务名称" />
            <el-table-column prop="type" label="类型" width="120" />
            <el-table-column prop="total" label="应参与人数" width="120" />
            <el-table-column prop="completed" label="已完成人数" width="120" />
            <el-table-column prop="rate" label="完成率" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.rate" :color="getProgressColor(row.rate)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-link type="primary" :underline="false" @click="handleViewTask(row)">查看详情</el-link>
                <el-divider direction="vertical" />
                <el-link type="primary" :underline="false" @click="handleRemind(row)">提醒未完成</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="材料文件" name="materials">
          <el-table :data="materialData" style="width: 100%">
            <el-table-column prop="fileName" label="文件名称" />
            <el-table-column prop="uploader" label="上传人" width="120" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column prop="size" label="大小" width="100" />
            <el-table-column prop="uploadTime" label="上传时间" width="180" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-link type="primary" :underline="false" @click="handleDownload(row)">下载</el-link>
                <el-divider direction="vertical" />
                <el-link type="danger" :underline="false" @click="handleDeleteFile(row)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 导入对话框 -->
    <el-dialog v-model="importDialogVisible" title="导入数据" width="500px">
      <el-upload
        action="#"
        :auto-upload="false"
        drag
        accept=".xlsx,.xls,.csv"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 .xlsx、.xls、.csv 格式，文件大小不超过 10MB
          </div>
        </template>
      </el-upload>
      <el-divider>或</el-divider>
      <p class="template-tip">下载导入模板：</p>
      <el-link type="primary" :underline="false" @click="downloadTemplate">
        <el-icon><Download /></el-icon>
        评价数据导入模板.xlsx
      </el-link>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImportSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Upload, UploadFilled } from '@element-plus/icons-vue'

const activeTab = ref('evaluation')
const importDialogVisible = ref(false)

const searchForm = reactive({
  period: '',
  department: ''
})

const evaluationData = ref([
  {
    id: 1,
    name: '张老师',
    department: '计算机学院',
    period: '2024年度',
    attitude: 18,
    method: 22,
    effect: 21,
    development: 17,
    service: 8,
    total: 86
  },
  {
    id: 2,
    name: '李老师',
    department: '数学学院',
    period: '2024年度',
    attitude: 19,
    method: 23,
    effect: 22,
    development: 18,
    service: 9,
    total: 91
  },
  {
    id: 3,
    name: '王老师',
    department: '英语学院',
    period: '2024年度',
    attitude: 17,
    method: 20,
    effect: 19,
    development: 16,
    service: 7,
    total: 79
  }
])

const taskData = ref([
  {
    id: 1,
    name: '2024年度教师自评',
    type: '自我评价',
    total: 128,
    completed: 96,
    rate: 75
  },
  {
    id: 2,
    name: '第一季度同行评审',
    type: '同行评审',
    total: 128,
    completed: 45,
    rate: 35
  }
])

const materialData = ref([
  {
    id: 1,
    fileName: '教学教案_张老师.pdf',
    uploader: '张老师',
    type: 'PDF',
    size: '2.3MB',
    uploadTime: '2024-02-26 10:30:00'
  },
  {
    id: 2,
    fileName: '科研成果证明_李老师.pdf',
    uploader: '李老师',
    type: 'PDF',
    size: '1.8MB',
    uploadTime: '2024-02-26 09:15:00'
  }
])

function getScoreType(score) {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

function getProgressColor(rate) {
  if (rate >= 80) return '#52c41a'
  if (rate >= 50) return '#1890ff'
  return '#ff4d4f'
}

function handleSearch() {
  ElMessage.success('查询成功')
}

function handleViewDetail(row) {
  ElMessage.info(`查看 ${row.name} 的评价详情`)
}

function handleExportOne(row) {
  ElMessage.success(`导出 ${row.name} 的评价数据`)
}

function handleExport() {
  ElMessage.success('正在导出数据...')
}

function handleImport() {
  importDialogVisible.value = true
}

function handleImportSubmit() {
  importDialogVisible.value = false
  ElMessage.success('数据导入成功')
}

function downloadTemplate() {
  ElMessage.success('正在下载模板...')
}

function handleViewTask(row) {
  ElMessage.info(`查看任务 ${row.name} 的详情`)
}

function handleRemind(row) {
  ElMessage.success(`已向未完成用户发送提醒通知`)
}

function handleDownload(row) {
  ElMessage.success(`正在下载 ${row.fileName}`)
}

function handleDeleteFile(row) {
  ElMessage.success(`文件 ${row.fileName} 已删除`)
}
</script>

<style scoped>
.data-management {
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

.search-bar {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.template-tip {
  font-size: 14px;
  color: #595959;
  margin-bottom: 8px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-upload-dragger) {
  padding: 40px;
}
</style>
