<template>
  <div class="score-dashboard">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">积分看板</span>
          <el-select v-model="selectedSemester" placeholder="选择学期" style="width: 200px" @change="handleSemesterChange">
            <el-option
              v-for="semester in semesters"
              :key="semester"
              :label="semester"
              :value="semester"
            />
          </el-select>
        </div>
      </template>

      <div v-if="selectedSemester">
        <!-- 统计概览 -->
        <div class="stats-overview">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" style="background: #e6f7ff">
                <el-icon :size="32" color="#1890ff"><User /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ semesterStats.total }}</div>
                <div class="stat-label">教师总数</div>
              </div>
            </div>
          </el-card>

          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" style="background: #f6ffed">
                <el-icon :size="32" color="#52c41a"><CircleCheck /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ semesterStats.confirmed }}</div>
                <div class="stat-label">已确认</div>
              </div>
            </div>
          </el-card>

          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" style="background: #fff7e6">
                <el-icon :size="32" color="#fa8c16"><Clock /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ semesterStats.unconfirmed }}</div>
                <div class="stat-label">待确认</div>
              </div>
            </div>
          </el-card>

          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" style="background: #f0f5ff">
                <el-icon :size="32" color="#722ed1"><TrendCharts /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ semesterStats.avgScore.toFixed(1) }}</div>
                <div class="stat-label">平均分</div>
              </div>
            </div>
          </el-card>

          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" style="background: #f9f0ff">
                <el-icon :size="32" color="#722ed1"><Trophy /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ semesterStats.maxScore }}</div>
                <div class="stat-label">最高分</div>
              </div>
            </div>
          </el-card>

          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" style="background: #fff2e8">
                <el-icon :size="32" color="#fa8c16"><DataLine /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ semesterStats.minScore }}</div>
                <div class="stat-label">最低分</div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 图表分析区 -->
        <el-row :gutter="20" class="chart-row">
          <!-- 左侧宽版 -->
          <el-col :span="16" class="col-16-layout">
            <el-card class="chart-card mb-20" shadow="hover">
              <div class="card-header-simple">部门平均分对比</div>
              <div ref="barChartRef" class="chart-container"></div>
            </el-card>

            <el-card class="chart-card" shadow="hover">
              <div class="card-header-simple">学期分数段走势</div>
              <div ref="lineChartRef" class="chart-container"></div>
            </el-card>
          </el-col>

          <!-- 右侧窄版 -->
          <el-col :span="8" class="col-8-layout">
            <el-card class="chart-card mb-20" shadow="hover">
              <div class="card-header-simple">各部门教师分布</div>
              <div ref="donutChartRef" class="chart-container donut-container"></div>
            </el-card>

            <el-card class="chart-card" shadow="hover">
              <div class="card-header-simple">个人得分透视</div>
              <div ref="scatterChartRef" class="chart-container scatter-container"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <el-empty
        v-else
        description="请选择学期查看数据"
        :image-size="120"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import {
  User, CircleCheck, Clock, TrendCharts, Trophy, DataLine
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useScoreStore } from '@/stores/scores'

const scoreStore = useScoreStore()

const selectedSemester = ref('')

const semesterStats = ref({
  total: 0,
  confirmed: 0,
  unconfirmed: 0,
  avgScore: 0,
  maxScore: 0,
  minScore: 0
})

// 直接使用store，不解构
const semesters = computed(() => scoreStore.semesters)

const barChartRef = ref(null)
const lineChartRef = ref(null)
const donutChartRef = ref(null)
const scatterChartRef = ref(null)

let barChartInstance = null
let lineChartInstance = null
let donutChartInstance = null
let scatterChartInstance = null

function initCharts() {
  if (barChartRef.value) barChartInstance = echarts.init(barChartRef.value)
  if (lineChartRef.value) lineChartInstance = echarts.init(lineChartRef.value)
  if (donutChartRef.value) donutChartInstance = echarts.init(donutChartRef.value)
  if (scatterChartRef.value) scatterChartInstance = echarts.init(scatterChartRef.value)

  updateCharts()

  window.addEventListener('resize', () => {
    barChartInstance?.resize()
    lineChartInstance?.resize()
    donutChartInstance?.resize()
    scatterChartInstance?.resize()
  })
}

function updateCharts() {
  if (!selectedSemester.value) return
  
  const scores = scoreStore.getScoresBySemester(selectedSemester.value)
  if (!scores.length) return

  // 1. Bar Chart Data
  const deptMap = {}
  scores.forEach(s => {
    if (!deptMap[s.department]) deptMap[s.department] = { sum: 0, count: 0 }
    deptMap[s.department].sum += s.totalScore
    deptMap[s.department].count++
  })
  const depts = Object.keys(deptMap)
  const avgScores = depts.map(d => (deptMap[d].sum / deptMap[d].count).toFixed(1))

  barChartInstance?.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: depts },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [{
      name: '平均分',
      type: 'bar',
      barWidth: '40%',
      data: avgScores,
      itemStyle: { color: '#1890ff', borderRadius: [4, 4, 0, 0] }
    }]
  })

  // 2. Line Chart Data
  let s90 = 0, s80 = 0, s70 = 0, s60 = 0, sUnder = 0
  scores.forEach(s => {
    if (s.totalScore >= 90) s90++
    else if (s.totalScore >= 80) s80++
    else if (s.totalScore >= 70) s70++
    else if (s.totalScore >= 60) s60++
    else sUnder++
  })

  lineChartInstance?.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['90分以上', '80-89分', '70-79分', '60-69分', '60分以下'] },
    yAxis: { type: 'value' },
    series: [{
      name: '人数',
      type: 'line',
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(114, 46, 209, 0.3)' },
          { offset: 1, color: 'rgba(114, 46, 209, 0.1)' }
        ])
      },
      itemStyle: { color: '#722ed1' },
      data: [s90, s80, s70, s60, sUnder]
    }]
  })

  // 3. Donut Chart Data
  const donutData = depts.map(d => ({ name: d, value: deptMap[d].count }))
  
  donutChartInstance?.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}人 ({d}%)' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [{
      name: '教师分布',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      label: { show: false, position: 'center' },
      emphasis: {
        label: { show: true, fontSize: '14', fontWeight: 'bold' }
      },
      labelLine: { show: false },
      data: donutData,
      color: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96']
    }]
  })

  // 4. Scatter Chart Data
  const scatterData = scores.map(s => [
    depts.indexOf(s.department),
    s.totalScore,
    s.teacherName
  ])

  scatterChartInstance?.setOption({
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.data[2]} (${depts[params.data[0]]})<br/>分数: ${params.data[1]}`
      }
    },
    grid: { left: '3%', right: '10%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: depts,
      axisLabel: { interval: 0, rotate: 30 }
    },
    yAxis: { type: 'value', min: 'dataMin' },
    series: [{
      name: '个人得分',
      symbolSize: 12,
      data: scatterData,
      type: 'scatter',
      itemStyle: { color: '#fa8c16', opacity: 0.7 }
    }]
  })
}

function handleSemesterChange() {
  if (selectedSemester.value) {
    semesterStats.value = scoreStore.getSemesterStats(selectedSemester.value)
    nextTick(() => {
      updateCharts()
    })
  }
}

watch(selectedSemester, () => {
  handleSemesterChange()
})

onMounted(() => {
  console.log('=== ScoreDashboard Debug ===')
  console.log('Scores count:', scoreStore.scores.length)
  console.log('Semesters:', semesters.value)

  // 如果数据是空的，重置
  if (scoreStore.scores.length === 0) {
    const stored = localStorage.getItem('evaluationScores')
    if (stored) {
      console.log('Found data in localStorage but store is empty, reloading...')
      scoreStore.resetScores()
    }
  }

  // 自动选择第一个学期
  if (semesters.value.length > 0) {
    selectedSemester.value = semesters.value[0]
    handleSemesterChange()
  }

  nextTick(() => {
    initCharts()
  })
})
</script>

<style scoped>
.score-dashboard {
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

.stats-overview {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  border: 1px solid #e8e8e8;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f1f1f;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
}

.chart-row {
  margin-top: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.chart-card {
  height: calc(50% - 10px);
  min-height: 300px;
  border: 1px solid #e8e8e8;
}

.chart-card:last-child {
  height: 50%;
}

.col-16-layout .chart-card {
  height: calc(50% - 10px) !important;
}

.card-header-simple {
  font-size: 15px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 16px;
  position: relative;
  padding-left: 10px;
}

.card-header-simple::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px;
  bottom: 2px;
  width: 3px;
  background-color: #1890ff;
  border-radius: 2px;
}

.chart-container {
  width: 100%;
  height: 250px;
}

.donut-container {
  height: 250px;
}

.scatter-container {
  height: 250px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
