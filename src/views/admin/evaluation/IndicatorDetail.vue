<template>
  <div class="indicator-detail-page">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin/indicator-management' }">评价指标管理</el-breadcrumb-item>
            <el-breadcrumb-item>指标详情</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="header-actions">
            <el-dropdown class="mr-2" @command="handleAddCommand">
              <el-button type="primary" :icon="Plus">
                新增指标<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="primary">新增一级指标</el-dropdown-item>
                  <el-dropdown-item command="secondary" :disabled="currentType !== 'primary'">在当前项下新增二级指标</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button @click="router.back()">返回</el-button>
          </div>
        </div>
      </template>

      <div class="detail-container">
        <!-- 左侧指标树 (简易列表) -->
        <div class="left-sidebar">
          <div class="sidebar-filter">
            <el-input placeholder="请输入标题" prefix-icon="Search" />
          </div>
          <div class="sidebar-tabs">
            <el-radio-group v-model="activeTab" size="small">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="active">启用中</el-radio-button>
              <el-radio-button label="inactive">已停用</el-radio-button>
            </el-radio-group>
          </div>
          <el-menu :default-active="activeMenuId" class="indicator-menu" @select="handleMenuSelect">
            <el-sub-menu v-for="primary in primaryIndicators" :key="primary.id" :index="`primary-${primary.id}`">
              <template #title>
                <el-icon><Folder /></el-icon>
                <span>{{ primary.name }}</span>
              </template>
              <el-menu-item 
                v-for="secondary in getSecondaryByPrimary(primary.id)" 
                :key="secondary.id" 
                :index="`secondary-${secondary.id}`"
              >
                <span class="text-truncate" :title="secondary.name">{{ secondary.name }}</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>

        <!-- 右侧详情区 -->
        <div class="right-content">
          <div class="section-title">
            <div class="title-left">
              <span class="title-bar"></span>
              基本信息
            </div>
            <div class="title-actions" v-if="currentData">
              <el-button type="primary" size="small" :icon="Edit" @click="handleEdit">编辑</el-button>
              <el-button type="danger" size="small" :icon="Delete" @click="handleDelete">删除</el-button>
            </div>
          </div>

          <div class="info-block" v-if="currentData">
            <template v-if="currentType === 'primary'">
              <div class="info-row">
                <div class="info-label">一级指标名称：</div>
                <div class="info-value font-bold">{{ currentData.name }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">分值：</div>
                <div class="info-value"><el-tag type="primary">{{ currentData.score }}分</el-tag></div>
              </div>
              <div class="info-row">
                <div class="info-label">指标描述：</div>
                <div class="info-value text-gray">{{ currentData.description || '暂无描述' }}</div>
              </div>
            </template>
            
            <template v-if="currentType === 'secondary'">
              <div class="info-row">
                <div class="info-label">二级指标名称：</div>
                <div class="info-value font-bold">{{ currentData.name }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">分值：</div>
                <div class="info-value"><el-tag type="warning">{{ currentData.score }}分</el-tag></div>
              </div>
              <div class="info-row">
                <div class="info-label">评分标准：</div>
                <div class="info-value text-gray">{{ currentData.scoringRule || '暂无填写' }}</div>
              </div>
              <div class="info-row type-row">
                <div class="info-label">关联评价规则：</div>
                <div class="info-value">
                  <el-tag v-if="currentData.linkedRule" type="info">{{ currentData.linkedRule }}</el-tag>
                  <span v-else class="text-placeholder">未关联</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-label">材料要求：</div>
                <div class="info-value">{{ currentData.materialRequirement || '暂无填写' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">责任部门：</div>
                <div class="info-value">{{ currentData.responsibleBody || '暂无填写' }}</div>
              </div>
            </template>
          </div>
          <div v-else class="empty-state">
            <el-empty description="请选择左侧指标" />
          </div>
        </div>
      </div>
    </el-card>

    <!-- 一级指标编辑对话框 -->
    <el-dialog
      v-model="primaryDialogVisible"
      :title="isEditPrimary ? '编辑一级指标' : '新增一级指标'"
      width="500px"
    >
      <el-form :model="primaryForm" label-width="100px">
        <el-form-item label="指标名称">
          <el-input v-model="primaryForm.name" placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="分值">
          <el-input-number v-model="primaryForm.score" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="primaryForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入指标描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="primaryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePrimaryIndicator">确定</el-button>
      </template>
    </el-dialog>

    <!-- 二级指标编辑对话框 -->
    <el-dialog
      v-model="secondaryDialogVisible"
      :title="isEditSecondary ? '编辑二级指标' : '新增二级指标'"
      width="600px"
    >
      <el-form :model="secondaryForm" label-width="100px">
        <el-form-item label="所属一级指标">
          <el-select v-model="secondaryForm.primaryId" placeholder="请选择" :disabled="isEditSecondary">
            <el-option
              v-for="item in primaryIndicators"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="指标名称">
          <el-input v-model="secondaryForm.name" placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="分值">
          <el-input-number v-model="secondaryForm.score" :min="1" :max="50" />
        </el-form-item>
        <el-form-item label="评分标准">
          <el-input
            v-model="secondaryForm.scoringRule"
            type="textarea"
            :rows="3"
            placeholder="请输入评分标准"
          />
        </el-form-item>
        <el-form-item label="关联评价规则">
          <el-select
            v-model="secondaryForm.linkedRuleId"
            placeholder="请选择关联的评价规则（可选）"
            clearable
            style="width: 100%"
          >
            <el-option-group
              v-for="type in ruleTypes"
              :key="type.value"
              :label="type.label"
            >
              <el-option
                v-for="rule in getRulesByType(type.value)"
                :key="rule.id"
                :label="rule.name"
                :value="rule.id"
              >
                <span>{{ rule.name }}</span>
                <span class="rule-option-desc">（{{ rule.scoringItems.length }} 项细则）</span>
              </el-option>
            </el-option-group>
          </el-select>
          <div class="form-tip">
            <el-icon><InfoFilled /></el-icon>
            选择后，该指标将按照所选规则的评分细则进行计算
          </div>
        </el-form-item>
        <el-form-item label="材料要求">
          <el-input
            v-model="secondaryForm.materialRequirement"
            type="textarea"
            :rows="2"
            placeholder="请输入材料要求"
          />
        </el-form-item>
        <el-form-item label="责任部门">
          <el-input v-model="secondaryForm.responsibleBody" placeholder="请输入责任部门" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="secondaryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSecondaryIndicator">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Folder, Search, Plus, Edit, Delete, ArrowDown, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useIndicatorStore } from '@/stores/indicator'
import { useRulesStore } from '@/stores/rules'

const route = useRoute()
const router = useRouter()
const indicatorStore = useIndicatorStore()
const rulesStore = useRulesStore()

const { primaryIndicators, getSecondaryByPrimary } = indicatorStore
const { ruleTypes, getRulesByType } = rulesStore

const activeTab = ref('all')
const mockAttachment = ref(false)

const currentId = ref(Number(route.params.id))
const currentType = ref(route.params.type) // 'primary' or 'secondary'

const activeMenuId = computed(() => `${currentType.value}-${currentId.value}`)

onMounted(() => {
  indicatorStore.loadFromLocal()
})

// 根据路由参数或者点击菜单获取当前展示的数据
const currentData = computed(() => {
  if (currentType.value === 'primary') {
    return primaryIndicators.find(p => p.id === currentId.value)
  } else if (currentType.value === 'secondary') {
    return indicatorStore.secondaryIndicators.find(s => s.id === currentId.value)
  }
  return null
})

function handleMenuSelect(index) {
  const [type, idStr] = index.split('-')
  const id = Number(idStr)
  currentType.value = type
  currentId.value = id
  
  // 更新路由参数，但不强制刷新页面组件
  router.replace({ params: { type, id } })
}

// 监听路由参数变化（以防用户直接改URL）
watch(() => route.params, (newParams) => {
  if (newParams.id && newParams.type) {
    currentId.value = Number(newParams.id)
    currentType.value = newParams.type
  }
})
// --- Dialog States ---
const primaryDialogVisible = ref(false)
const secondaryDialogVisible = ref(false)
const isEditPrimary = ref(false)
const isEditSecondary = ref(false)

const primaryForm = ref({
  id: null,
  name: '',
  score: 20,
  description: ''
})

const secondaryForm = ref({
  id: null,
  primaryId: null,
  name: '',
  score: 5,
  scoringRule: '',
  linkedRuleId: null,
  linkedRule: '',
  materialRequirement: '',
  responsibleBody: ''
})

// --- Methods ---
function handleAddCommand(command) {
  if (command === 'primary') {
    isEditPrimary.value = false
    primaryForm.value = { id: null, name: '', score: 20, description: '' }
    primaryDialogVisible.value = true
  } else if (command === 'secondary') {
    isEditSecondary.value = false
    secondaryForm.value = {
      id: null,
      primaryId: currentId.value,
      name: '',
      score: 5,
      scoringRule: '',
      linkedRuleId: null,
      linkedRule: '',
      materialRequirement: '',
      responsibleBody: ''
    }
    secondaryDialogVisible.value = true
  }
}

function handleEdit() {
  if (currentType.value === 'primary') {
    isEditPrimary.value = true
    primaryForm.value = { ...currentData.value }
    primaryDialogVisible.value = true
  } else {
    isEditSecondary.value = true
    secondaryForm.value = { ...currentData.value }
    secondaryDialogVisible.value = true
  }
}

function handleDelete() {
  const isPrimary = currentType.value === 'primary'
  const confirmMsg = isPrimary 
    ? '删除该指标将同时删除其下所有二级指标，确定要删除吗？' 
    : '确定要删除该二级指标吗？'
    
  ElMessageBox.confirm(confirmMsg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (isPrimary) {
      indicatorStore.deletePrimaryIndicator(currentId.value)
    } else {
      indicatorStore.deleteSecondaryIndicator(currentId.value)
    }
    ElMessage.success('删除成功')
    
    // 如果存在其他一级指标，跳转到第一个，否则回到列表
    if (primaryIndicators.length > 0) {
      router.replace(`/admin/indicator-detail/primary/${primaryIndicators[0].id}`)
    } else {
      router.back()
    }
  }).catch(() => {})
}

function savePrimaryIndicator() {
  if (!primaryForm.value.name) {
    ElMessage.warning('请输入指标名称')
    return
  }

  if (isEditPrimary.value) {
    indicatorStore.updatePrimaryIndicator(primaryForm.value.id, primaryForm.value)
    ElMessage.success('更新成功')
  } else {
    const newIndicator = indicatorStore.addPrimaryIndicator(primaryForm.value)
    ElMessage.success('添加成功')
    if (newIndicator) {
      router.replace(`/admin/indicator-detail/primary/${newIndicator.id}`)
    }
  }
  primaryDialogVisible.value = false
}

function saveSecondaryIndicator() {
  if (!secondaryForm.value.name) {
    ElMessage.warning('请输入指标名称')
    return
  }

  if (secondaryForm.value.linkedRuleId) {
    const rule = rulesStore.getRuleById(secondaryForm.value.linkedRuleId)
    if (rule) secondaryForm.value.linkedRule = rule.name
  } else {
    secondaryForm.value.linkedRule = ''
  }

  if (isEditSecondary.value) {
    indicatorStore.updateSecondaryIndicator(secondaryForm.value.id, secondaryForm.value)
    ElMessage.success('更新成功')
  } else {
    const newIndicator = indicatorStore.addSecondaryIndicator(secondaryForm.value)
    ElMessage.success('添加成功')
    if (newIndicator) {
      router.replace(`/admin/indicator-detail/secondary/${newIndicator.id}`)
    }
  }
  secondaryDialogVisible.value = false
}
</script>

<style scoped>
.indicator-detail-page {
  padding: 0;
  height: calc(100vh - 120px);
}

.page-card {
  height: 100%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

:deep(.el-card__body) {
  flex: 1;
  padding: 0;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-container {
  display: flex;
  height: 100%;
}

/* 左侧栏样式 */
.left-sidebar {
  width: 280px;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.sidebar-filter {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-tabs {
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
}

.indicator-menu {
  flex: 1;
  overflow-y: auto;
  border-right: none;
}

.mr-2 {
  margin-right: 8px;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;
  max-width: 170px;
}

/* 右侧内容样式 */
.right-content {
  flex: 1;
  padding: 24px 40px;
  overflow-y: auto;
  background-color: #fafafa;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.title-bar {
  display: inline-block;
  width: 4px;
  height: 16px;
  background-color: #1890ff;
  margin-right: 8px;
  border-radius: 2px;
}

.ml-2 {
  margin-left: 8px;
}

.mr-2 {
  margin-right: 8px;
}

.font-bold {
  font-weight: bold;
}

.info-block {
  background: #fff;
  padding: 32px;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

.info-row {
  display: flex;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.info-label {
  width: 130px;
  color: #606266;
  text-align: right;
  padding-right: 16px;
  flex-shrink: 0;
}

.info-value {
  color: #333;
  flex: 1;
}

.text-gray {
  color: #666;
  background: #fafafa;
  padding: 12px 16px;
  border-radius: 4px;
  font-size: 13px;
}

.type-row {
  margin-top: 12px;
}

.text-placeholder {
  color: #bfbfbf;
  font-size: 13px;
}

.rule-option-desc {
  font-size: 12px;
  color: #8c8c8c;
  margin-left: 8px;
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.form-tip .el-icon {
  font-size: 14px;
}

.sub-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
