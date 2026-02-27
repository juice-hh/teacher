<template>
  <div class="statistics">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">统计分析</span>
          <div class="header-actions">
            <el-date-picker
              v-model="dateRange"
              type="year"
              placeholder="选择年份"
              value-format="YYYY"
            />
            <el-button type="primary" @click="handleRefresh">刷新</el-button>
            <el-button :icon="Download" @click="handleExport">导出报告</el-button>
          </div>
        </div>
      </template>

      <el-row :gutter="24">
        <el-col :span="24">
          <div class="section-title">整体统计</div>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-bottom: 24px;">
        <el-col :span="6" v-for="stat in overallStats" :key="stat.key">
          <div class="stat-box">
            <div class="stat-icon" :style="{ background: stat.color }">
              <el-icon :size="24" color="#fff">
                <component :is="stat.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-title">评价分数分布</div>
            <div class="chart-placeholder">
              <el-icon :size="60" color="#d9d9d9"><PieChart /></el-icon>
              <p>分数分布图表</p>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-title">各部门平均分对比</div>
            <div class="chart-placeholder">
              <el-icon :size="60" color="#d9d9d9"><Histogram /></el-icon>
              <p>部门平均分柱状图</p>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 24px;">
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-title">各项指标平均分</div>
            <div class="chart-placeholder">
              <el-icon :size="60" color="#d9d9d9"><TrendCharts /></el-icon>
              <p>指标平均分折线图</p>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-title">评价完成进度</div>
            <div class="chart-placeholder">
              <el-icon :size="60" color="#d9d9d9"><DataLine /></el-icon>
              <p>完成进度图表</p>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 24px;">
        <el-col :span="24">
          <div class="chart-card">
            <div class="chart-title">各部门详细数据</div>
            <el-table :data="departmentData" style="width: 100%; margin-top: 16px;">
              <el-table-column prop="department" label="部门" />
              <el-table-column prop="total" label="总人数" width="100" />
              <el-table-column prop="completed" label="完成人数" width="100" />
              <el-table-column prop="avgScore" label="平均分" width="100">
                <template #default="{ row }">
                  <el-tag :type="getScoreType(row.avgScore)">{{ row.avgScore }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="excellent" label="优秀(90+)" width="100" />
              <el-table-column prop="good" label="良好(80-89)" width="100" />
              <el-table-column prop="pass" label="及格(60-79)" width="100" />
              <el-table-column prop="fail" label="不及格(<60)" width="120" />
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, PieChart, Histogram, TrendCharts, DataLine } from '@element-plus/icons-vue'

const dateRange = ref('2024')

const overallStats = [
  {
    key: 'teachers',
    label: '参与教师',
    value: '128',
    icon: 'User',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    key: 'completed',
    label: '已完成评价',
    value: '96',
    icon: 'Checked',
    color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
  },
  {
    key: 'avgScore',
    label: '全校平均分',
    value: '85.6',
    icon: 'TrendCharts',
    color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
  },
  {
    key: 'excellentRate',
    label: '优秀率',
    value: '32%',
    icon: 'Star',
    color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  }
]

const departmentData = ref([
  {
    department: '计算机学院',
    total: 35,
    completed: 32,
    avgScore: 87.5,
    excellent: 12,
    good: 15,
    pass: 5,
    fail: 0
  },
  {
    department: '数学学院',
    total: 28,
    completed: 25,
    avgScore: 86.2,
    excellent: 8,
    good: 12,
    pass: 5,
    fail: 0
  },
  {
    department: '英语学院',
    total: 30,
    completed: 22,
    avgScore: 84.8,
    excellent: 7,
    good: 10,
    pass: 5,
    fail: 0
  },
  {
    department: '物理学院',
    total: 25,
    completed: 17,
    avgScore: 83.2,
    excellent: 5,
    good: 8,
    pass: 4,
    fail: 0
  }
])

function getScoreType(score) {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

function handleRefresh() {
  ElMessage.success('数据已刷新')
}

function handleExport() {
  ElMessage.success('正在导出统计报告...')
}
</script>

<style scoped>
.statistics {
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
  align-items: center;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #595959;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-top: 4px;
}

.chart-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.chart-title {
  font-size: 14px;
  font-weight: 500;
  color: #595959;
  margin-bottom: 16px;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bfbfbf;
}

.chart-placeholder p {
  margin-top: 12px;
  font-size: 13px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
