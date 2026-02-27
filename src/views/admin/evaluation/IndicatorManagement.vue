<template>
  <div class="indicator-management">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">评价指标管理</span>
          <div class="header-actions">
            <el-button type="primary" :icon="Plus" @click="handleAddPrimary">
              新增一级指标
            </el-button>
          </div>
        </div>
      </template>

      <el-collapse v-model="activeNames" class="indicator-collapse">
        <el-collapse-item
          v-for="primary in primaryIndicators"
          :key="primary.id"
          :name="primary.id"
        >
          <template #title>
            <div class="primary-title">
              <span class="primary-name">{{ primary.name }}</span>
              <el-tag type="primary" size="large">{{ primary.score }}分</el-tag>
              <el-tag type="info" size="small">共 {{ getSecondaryByPrimary(primary.id).length }} 项二级指标</el-tag>
              <span class="primary-desc">{{ primary.description }}</span>
              <div class="title-actions" @click.stop>
                <el-button
                  type="primary"
                  size="small"
                  :icon="Plus"
                  @click="handleAddSecondary(primary.id)"
                >
                  新增二级指标
                </el-button>
                <el-button
                  type="success"
                  size="small"
                  :icon="View"
                  @click="handleViewPrimary(primary.id)"
                >
                  查看
                </el-button>
                <el-button
                  size="small"
                  :icon="Edit"
                  @click="handleEditPrimary(primary)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="handleDeletePrimary(primary.id)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </template>

          <div class="secondary-list">
            <el-table :data="getSecondaryByPrimary(primary.id)" style="width: 100%">
              <el-table-column prop="name" label="二级指标名称" width="150" />
              <el-table-column prop="score" label="分值" width="80">
                <template #default="{ row }">
                  <el-tag type="warning">{{ row.score }}分</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="scoringRule" label="评分标准" show-overflow-tooltip />
              <el-table-column prop="linkedRule" label="关联评价规则" width="150" show-overflow-tooltip>
                <template #default="{ row }">
                  <el-tag v-if="row.linkedRule" type="info" size="small">{{ row.linkedRule }}</el-tag>
                  <span v-else class="text-placeholder">未关联</span>
                </template>
              </el-table-column>
              <el-table-column prop="materialRequirement" label="材料要求" width="180" show-overflow-tooltip />
              <el-table-column prop="responsibleBody" label="责任部门" width="120" />
              <el-table-column label="操作" width="240" fixed="right">
                <template #default="{ row }">
                  <el-button
                    type="success"
                    size="small"
                    :icon="View"
                    @click="handleViewSecondary(row.id)"
                  >
                    查看
                  </el-button>
                  <el-button
                    type="primary"
                    size="small"
                    :icon="Edit"
                    @click="handleEditSecondary(row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    :icon="Delete"
                    @click="handleDeleteSecondary(row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
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
          
          <!-- 选中关联规则后回显评分细则 -->
          <div v-if="secondaryForm.linkedRuleId" class="linked-rule-details" style="margin-top: 12px; width: 100%">
            <div class="linked-rule-title" style="font-size: 13px; font-weight: 500; margin-bottom: 8px; color: #595959;">主要评分细则预览</div>
            <el-table :data="getRuleScoringItems(secondaryForm.linkedRuleId)" border size="small">
              <el-table-column prop="indicator" label="细则指标" min-width="120" />
              <el-table-column prop="level" label="指标等级" width="100" />
              <el-table-column prop="score" label="对应分值" width="80">
                <template #default="{ row }">
                  <el-tag size="small" type="success">{{ row.score }}分</el-tag>
                </template>
              </el-table-column>
            </el-table>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, InfoFilled, View } from '@element-plus/icons-vue'
import { useIndicatorStore } from '@/stores/indicator'
import { useRulesStore } from '@/stores/rules'


const router = useRouter()
const indicatorStore = useIndicatorStore()
const rulesStore = useRulesStore()
const { primaryIndicators, secondaryIndicators, getSecondaryByPrimary } = indicatorStore
const { ruleTypes, getRulesByType, getRuleById } = rulesStore

const activeNames = ref([1, 2, 3, 4, 5])
const primaryDialogVisible = ref(false)
const secondaryDialogVisible = ref(false)
const isEditPrimary = ref(false)
const isEditSecondary = ref(false)

const getRuleScoringItems = (ruleId) => {
  if (!ruleId) return []
  const rule = getRuleById(ruleId)
  return rule ? rule.scoringItems : []
}

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

onMounted(() => {
  indicatorStore.loadFromLocal()
})

// 一级指标操作
function handleAddPrimary() {
  isEditPrimary.value = false
  primaryForm.value = { id: null, name: '', score: 20, description: '' }
  primaryDialogVisible.value = true
}

function handleEditPrimary(primary) {
  isEditPrimary.value = true
  primaryForm.value = { ...primary }
  primaryDialogVisible.value = true
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
    indicatorStore.addPrimaryIndicator(primaryForm.value)
    ElMessage.success('添加成功')
  }
  primaryDialogVisible.value = false
}

function handleDeletePrimary(id) {
  ElMessageBox.confirm('删除该指标将同时删除其下所有二级指标，确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    indicatorStore.deletePrimaryIndicator(id)
    ElMessage.success('删除成功')
  })
}

// 二级指标操作
function handleAddSecondary(primaryId) {
  isEditSecondary.value = false
  secondaryForm.value = {
    id: null,
    primaryId,
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

function handleEditSecondary(secondary) {
  isEditSecondary.value = true
  secondaryForm.value = { ...secondary }
  secondaryDialogVisible.value = true
}

function saveSecondaryIndicator() {
  if (!secondaryForm.value.name) {
    ElMessage.warning('请输入指标名称')
    return
  }

  // 如果选择了关联规则，获取规则名称
  if (secondaryForm.value.linkedRuleId) {
    const rule = rulesStore.getRuleById(secondaryForm.value.linkedRuleId)
    if (rule) {
      secondaryForm.value.linkedRule = rule.name
    }
  } else {
    secondaryForm.value.linkedRule = ''
  }

  if (isEditSecondary.value) {
    indicatorStore.updateSecondaryIndicator(secondaryForm.value.id, secondaryForm.value)
    ElMessage.success('更新成功')
  } else {
    indicatorStore.addSecondaryIndicator(secondaryForm.value)
    ElMessage.success('添加成功')
  }
  secondaryDialogVisible.value = false
}

function handleDeleteSecondary(id) {
  ElMessageBox.confirm('确定要删除该二级指标吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    indicatorStore.deleteSecondaryIndicator(id)
    ElMessage.success('删除成功')
  })
}

// 查看详情跳转
function handleViewPrimary(id) {
  router.push(`/admin/indicator-detail/primary/${id}`)
}

function handleViewSecondary(id) {
  router.push(`/admin/indicator-detail/secondary/${id}`)
}
</script>

<style scoped>
.indicator-management {
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

.indicator-collapse {
  border: none;
}

:deep(.el-collapse-item__header) {
  background: #fafafa;
  border-radius: 6px;
  padding: 0 16px;
  margin-bottom: 8px;
  height: 60px;
}

:deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 16px;
}

.primary-title {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.primary-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f1f1f;
}

.primary-desc {
  flex: 1;
  font-size: 13px;
  color: #8c8c8c;
}

.title-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.secondary-list {
  padding: 0 16px;
  background: #fff;
}

:deep(.el-table) {
  border-radius: 6px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
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

.text-placeholder {
  color: #bfbfbf;
  font-size: 13px;
}
</style>
