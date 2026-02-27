<template>
  <div class="rule-management">
    <el-card class="header-card">
      <div class="header-content">
        <div>
          <h2 class="page-title">评价规则管理</h2>
          <p class="page-desc">配置各类评价指标的评分规则，支持论文、课题、比赛等类型的赋分细则</p>
        </div>
        <el-button type="primary" :icon="Plus" @click="showCreateDialog = true">
          新建评价规则
        </el-button>
      </div>
    </el-card>

    <div class="layout-container">
      <!-- 左侧规则列表 -->
      <el-card class="rules-list-card">
        <template #header>
          <div class="list-header">
            <span>规则列表</span>
            <el-input v-model="searchQuery" placeholder="搜索规则名称..." :prefix-icon="Search" size="small" style="width: 140px; margin-left: auto;" clearable />
          </div>
        </template>

        <div class="rules-list">
          <div
            v-for="rule in currentRules"
            :key="rule.id"
            class="rule-item"
            :class="{ active: selectedRuleId === rule.id }"
            @click="selectRule(rule)"
          >
            <div class="rule-item-header">
              <el-icon :size="18" class="rule-icon">
                <component :is="getTypeIcon(rule.type)" />
              </el-icon>
              <div class="rule-info">
                <h4 class="rule-name">{{ rule.name }}</h4>
                <p class="rule-desc">{{ rule.description }}</p>
              </div>
            </div>
            <div class="rule-meta">
              <el-tag size="small" type="info">{{ rule.scoringItems.length }} 项细则</el-tag>
              <span class="rule-date">{{ rule.createdAt }}</span>
            </div>
          </div>

          <el-empty
            v-if="currentRules.length === 0"
            description="未找到匹配的评价规则"
            :image-size="100"
          />
        </div>
      </el-card>

      <!-- 右侧规则详情 -->
      <div v-if="selectedRule" class="rule-detail-card">
        <el-card>
          <template #header>
            <div class="detail-header">
              <div class="detail-info">
                <h3 class="detail-title">{{ selectedRule.name }}</h3>
                <p class="detail-desc">{{ selectedRule.description }}</p>
              </div>
              <div class="detail-actions">
                <el-button type="primary" :icon="Edit" @click="editRule(selectedRule)">
                  编辑规则
                </el-button>
                <el-button type="danger" :icon="Delete" @click="handleDelete(selectedRule)">
                  删除规则
                </el-button>
              </div>
            </div>
          </template>

          <div class="scoring-items">
            <div class="items-header">
              <h4>评分细则</h4>
              <el-button type="primary" :icon="Plus" size="small" @click="addScoringItem(selectedRule)">
                添加评分项
              </el-button>
            </div>

            <el-table :data="selectedRule.scoringItems" border style="width: 100%">
              <el-table-column prop="indicator" label="指标" min-width="150" />
              <el-table-column prop="level" label="等级" width="150" />
              <el-table-column prop="score" label="分值" width="100">
                <template #default="{ row }">
                  <el-tag type="success">{{ row.score }} 分</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button
                    type="primary"
                    size="small"
                    link
                    :icon="Edit"
                    @click="editScoringItem(selectedRule, row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    link
                    :icon="Delete"
                    @click="deleteScoringItem(selectedRule, row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>

      <el-card v-else class="rule-detail-card">
        <el-empty
          description="请从左侧选择一个规则查看详情"
          :image-size="120"
        />
      </el-card>
    </div>

    <!-- 新建/编辑规则对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      :title="editingRule ? '编辑评价规则' : '新建评价规则'"
      width="600px"
      @close="resetForm"
    >
      <el-form :model="ruleForm" :rules="ruleFormRules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入规则名称" />
        </el-form-item>

        <el-form-item label="规则类型" prop="type">
          <el-select 
            v-model="ruleForm.type" 
            placeholder="请选择或输入新增规则类型" 
            filterable 
            allow-create
            style="width: 100%"
          >
            <el-option
              v-for="type in ruleTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="规则描述" prop="description">
          <el-input
            v-model="ruleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入规则描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="submitRule">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新建/编辑评分项对话框 -->
    <el-dialog
      v-model="showItemDialog"
      :title="editingItem ? '编辑评分项' : '添加评分项'"
      width="500px"
      @close="resetItemForm"
    >
      <el-form :model="itemForm" :rules="itemFormRules" ref="itemFormRef" label-width="120px">
        <el-form-item label="指标" prop="indicator">
          <el-select
            v-model="itemForm.indicator"
            placeholder="请选择"
            filterable
            allow-create
            style="width: 100%"
          >
            <el-option
              v-for="indicator in indicators"
              :key="indicator"
              :label="indicator"
              :value="indicator"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="等级" prop="level">
          <el-select
            v-model="itemForm.level"
            placeholder="请选择级别"
            filterable
            allow-create
            style="width: 100%"
          >
            <el-option
              v-for="level in levels"
              :key="level"
              :label="level"
              :value="level"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="分值" prop="score">
          <el-input-number v-model="itemForm.score" :min="0" :max="200" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showItemDialog = false">取消</el-button>
        <el-button type="primary" @click="submitItem">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Document, FolderOpened, Trophy, Search } from '@element-plus/icons-vue'
import { useRulesStore } from '@/stores/rules'

const rulesStore = useRulesStore()

// 搜索名
const searchQuery = ref('')

// 选中的规则ID
const selectedRuleId = ref(null)

// 选中的规则
const selectedRule = computed(() => {
  if (!selectedRuleId.value) return null
  return rulesStore.getRuleById(selectedRuleId.value)
})

// 对话框显示状态
const showCreateDialog = ref(false)
const showItemDialog = ref(false)

// 当前编辑的规则和评分项
const editingRule = ref(null)
const editingItem = ref(null)
const currentRuleId = ref(null)

// 规则类型
const ruleTypes = rulesStore.ruleTypes

// 获取过滤的规则
const currentRules = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return rulesStore.rules
  }
  return rulesStore.rules.filter(rule => rule.name.toLowerCase().includes(query))
})

// 获取类型对应的图标
const getTypeIcon = (type) => {
  const iconMap = {
    'attendance': 'Clock',
    'open_class': 'VideoCamera',
    'training': 'Reading',
    'basic_skills': 'Trophy',
    'paper': 'Document',
    'academic_work': 'Collection'
  }
  return iconMap[type] || 'Document'
}

// 选择规则
const selectRule = (rule) => {
  selectedRuleId.value = rule.id
}

// 表单引用
const ruleFormRef = ref(null)
const itemFormRef = ref(null)

// 规则表单
const ruleForm = reactive({
  name: '',
  type: 'paper',
  description: ''
})

// 规则表单验证规则
const ruleFormRules = {
  name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择规则类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入规则描述', trigger: 'blur' }]
}

// 评分项表单
const itemForm = reactive({
  indicator: '',
  level: '',
  score: 0
})

// 评分项表单验证规则
const itemFormRules = {
  indicator: [{ required: true, message: '请选择或输入指标', trigger: 'change' }],
  level: [{ required: false, message: '请选择或输入等级', trigger: 'change' }],
  score: [{ required: true, message: '请输入分值', trigger: 'blur' }]
}

// 根据当前选中的规则提供预设选项
const indicators = computed(() => {
  if (!selectedRuleId.value) return []
  const type = selectedRule.value?.type || 'paper'
  const indicatorMap = {
    attendance: ['迟到', '早退', '缺勤'],
    open_class: ['级部', '学科组', '教研组', '校级'],
    training: ['校级', '市级', '省级', '国家级'],
    basic_skills: ['国家级', '省级', '地市级', '县市区', '校级'],
    paper: ['国家级', '省级', '地市级', '县市区', '校级'],
    academic_work: ['单独作者', '多作者']
  }
  return indicatorMap[type] || []
})

const levels = computed(() => {
  if (!selectedRuleId.value) return []
  const type = selectedRule.value?.type || 'paper'
  const levelMap = {
    attendance: [],
    open_class: [],
    training: [],
    basic_skills: ['一等奖', '二等奖', '三等奖', '优秀奖'],
    paper: ['一等奖', '二等奖', '三等奖', '优秀奖'],
    academic_work: ['一作', '二作', '三作', '其他']
  }
  return levelMap[type] || []
})

// 编辑规则
const editRule = (rule) => {
  editingRule.value = rule
  ruleForm.name = rule.name
  ruleForm.type = rule.type
  ruleForm.description = rule.description
  showCreateDialog.value = true
}

// 删除规则
const handleDelete = (rule) => {
  ElMessageBox.confirm(
    `确定要删除规则"${rule.name}"吗？此操作不可恢复。`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    rulesStore.deleteRule(rule.id)
    if (selectedRuleId.value === rule.id) {
      selectedRuleId.value = null
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 提交规则
const submitRule = () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      if (editingRule.value) {
        rulesStore.updateRule(editingRule.value.id, ruleForm)
        ElMessage.success('更新成功')
      } else {
        const newRule = rulesStore.addRule(ruleForm)
        selectedRuleId.value = newRule.id
        ElMessage.success('创建成功')
      }
      showCreateDialog.value = false
      resetForm()
    }
  })
}

// 重置规则表单
const resetForm = () => {
  editingRule.value = null
  ruleForm.name = ''
  ruleForm.type = 'paper'
  ruleForm.description = ''
  ruleFormRef.value?.clearValidate()
}

// 添加评分项
const addScoringItem = (rule) => {
  currentRuleId.value = rule.id
  editingItem.value = null
  itemForm.indicator = ''
  itemForm.level = ''
  itemForm.score = 0
  showItemDialog.value = true
}

// 编辑评分项
const editScoringItem = (rule, item) => {
  currentRuleId.value = rule.id
  editingItem.value = item
  itemForm.indicator = item.indicator
  itemForm.level = item.level
  itemForm.score = item.score
  showItemDialog.value = true
}

// 删除评分项
const deleteScoringItem = (rule, itemId) => {
  ElMessageBox.confirm(
    '确定要删除该评分项吗？',
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    rulesStore.deleteScoringItem(rule.id, itemId)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 提交评分项
const submitItem = () => {
  itemFormRef.value.validate((valid) => {
    if (valid) {
      if (editingItem.value) {
        rulesStore.updateScoringItem(currentRuleId.value, editingItem.value.id, itemForm)
        ElMessage.success('更新成功')
      } else {
        rulesStore.addScoringItem(currentRuleId.value, itemForm)
        ElMessage.success('添加成功')
      }
      showItemDialog.value = false
      resetItemForm()
    }
  })
}

// 重置评分项表单
const resetItemForm = () => {
  editingItem.value = null
  currentRuleId.value = null
  itemForm.indicator = ''
  itemForm.level = ''
  itemForm.score = 0
  itemFormRef.value?.clearValidate()
}
</script>

<style scoped>
.rule-management {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-card {
  margin-bottom: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 8px 0;
}

.page-desc {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.layout-container {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.rules-list-card {
  width: 380px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.rules-list-card :deep(.el-card__body) {
  padding: 0;
  flex: 1;
  overflow-y: auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.rule-item {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s;
}

.rule-item:hover {
  background: #fafafa;
}

.rule-item.active {
  background: #e6f7ff;
  border-left: 3px solid #1890ff;
}

.rule-item-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.rule-icon {
  color: #1890ff;
  flex-shrink: 0;
  margin-top: 2px;
}

.rule-info {
  flex: 1;
  min-width: 0;
}

.rule-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 4px 0;
}

.rule-desc {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rule-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
}

.rule-date {
  font-size: 12px;
  color: #bfbfbf;
}

.rule-detail-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.rule-detail-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.detail-info {
  flex: 1;
}

.detail-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 8px 0;
}

.detail-desc {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.detail-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.scoring-items {
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.items-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background: #f5f5f5;
}

:deep(.el-empty) {
  padding: 60px 0;
}
</style>
