<template>
  <div class="menu-management">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">菜单管理</span>
          <div class="header-actions">
            <el-button type="primary" :icon="Plus" @click="handleAddTop">
              新增一级菜单
            </el-button>
          </div>
        </div>
      </template>

      <el-row :gutter="24">
        <el-col :span="24">
          <div class="tree-header">
            <span class="tree-title">菜单列表</span>
            <div class="tree-actions">
              <el-button size="small" @click="expandAll">全部展开</el-button>
              <el-button size="small" @click="collapseAll">全部收起</el-button>
            </div>
          </div>

          <el-table
            ref="tableRef"
            :data="menuData"
            style="width: 100%"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            :expand-row-keys="expandedKeys"
            default-expand-all
          >
            <el-table-column prop="name" label="菜单名称" width="200">
              <template #default="{ row }">
                <div class="menu-name">
                  <el-icon v-if="row.icon"><component :is="row.icon" /></el-icon>
                  <span>{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="path" label="路由路径" />
            <el-table-column prop="component" label="组件路径" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="row.type === 'menu' ? 'primary' : 'info'" size="small">
                  {{ row.type === 'menu' ? '菜单' : '按钮' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="80" />
            <el-table-column prop="visible" label="显示状态" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.visible" @change="handleToggleVisible(row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="280" fixed="right">
              <template #default="{ row }">
                <el-link type="primary" :underline="false" @click="handleAddChild(row)">
                  新增子项
                </el-link>
                <el-divider direction="vertical" />
                <el-link type="primary" :underline="false" @click="handleEdit(row)">
                  编辑
                </el-link>
                <el-divider direction="vertical" />
                <el-link type="primary" :underline="false" @click="handleSort(row)">
                  排序
                </el-link>
                <el-divider direction="vertical" />
                <el-link type="danger" :underline="false" @click="handleDelete(row)">
                  删除
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <!-- 菜单编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="menuForm" :rules="rules" ref="menuFormRef" label-width="100px">
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="menuTreeOptions"
            :props="{ label: 'name', value: 'id' }"
            placeholder="选择上级菜单（不选则为一级菜单）"
            clearable
            check-strictly
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="menuForm.type">
            <el-radio value="menu">菜单</el-radio>
            <el-radio value="button">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="路由路径" prop="path" v-if="menuForm.type === 'menu'">
          <el-input v-model="menuForm.path" placeholder="请输入路由路径，如：/dashboard" />
        </el-form-item>
        <el-form-item label="组件路径" v-if="menuForm.type === 'menu'">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径，如：Dashboard.vue" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="menuForm.permission" placeholder="请输入权限标识，如：dashboard:view" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="menuForm.icon" placeholder="请输入图标名称">
            <template #prepend>
              <el-icon><HomeFilled /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="menuForm.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="显示状态">
          <el-switch v-model="menuForm.visible" active-text="显示" inactive-text="隐藏" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <!-- 排序对话框 -->
    <el-dialog v-model="sortDialogVisible" title="菜单拖拽排序" width="400px">
      <div class="sort-tips">
        <el-icon><InfoFilled /></el-icon>
        <span>拖动菜单项调整顺序，完成后点击确定保存</span>
      </div>
      <el-tree
        ref="sortTreeRef"
        :data="menuData"
        node-key="id"
        :props="{ label: 'name', children: 'children' }"
        draggable
        :allow-drop="allowDrop"
        @node-drop="handleNodeDrop"
      />
      <template #footer>
        <el-button @click="sortDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSort">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, InfoFilled, HomeFilled } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const sortDialogVisible = ref(false)
const menuFormRef = ref(null)
const sortTreeRef = ref(null)
const expandedKeys = ref([])

const dialogTitle = computed(() => {
  return isEdit.value ? '编辑菜单' : (isAddChild.value ? '新增子菜单' : '新增一级菜单')
})

const isEdit = ref(false)
const isAddChild = ref(false)

const menuForm = reactive({
  id: null,
  parentId: null,
  name: '',
  type: 'menu',
  path: '',
  component: '',
  permission: '',
  icon: '',
  sort: 0,
  visible: true
})

const rules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }]
}

// 模拟菜单数据
const menuData = ref([
  {
    id: 1,
    name: '首页',
    path: '/admin/dashboard',
    component: 'Dashboard.vue',
    type: 'menu',
    icon: 'HomeFilled',
    sort: 1,
    visible: true,
    children: []
  },
  {
    id: 2,
    name: '系统配置',
    path: '/admin/system',
    component: '',
    type: 'menu',
    icon: 'Setting',
    sort: 2,
    visible: true,
    children: [
      {
        id: 21,
        name: '菜单管理',
        path: '/admin/menu-management',
        component: 'MenuManagement.vue',
        type: 'menu',
        icon: '',
        sort: 1,
        visible: true,
        children: []
      },
      {
        id: 22,
        name: '用户管理',
        path: '/admin/user-management',
        component: 'UserManagement.vue',
        type: 'menu',
        icon: '',
        sort: 2,
        visible: true,
        children: []
      },
      {
        id: 23,
        name: '角色权限管理',
        path: '/admin/role-management',
        component: 'RoleManagement.vue',
        type: 'menu',
        icon: '',
        sort: 3,
        visible: true,
        children: []
      },
      {
        id: 24,
        name: '系统参数配置',
        path: '/admin/system-config',
        component: 'SystemConfig.vue',
        type: 'menu',
        icon: '',
        sort: 4,
        visible: true,
        children: []
      }
    ]
  },
  {
    id: 3,
    name: '评价项目管理',
    path: '/admin/evaluation',
    component: '',
    type: 'menu',
    icon: 'Document',
    sort: 3,
    visible: true,
    children: [
      {
        id: 31,
        name: '评价指标管理',
        path: '/admin/indicator-management',
        component: 'IndicatorManagement.vue',
        type: 'menu',
        icon: '',
        sort: 1,
        visible: true,
        children: []
      }
    ]
  },
  {
    id: 4,
    name: '评价任务管理',
    path: '/admin/task',
    component: '',
    type: 'menu',
    icon: 'List',
    sort: 4,
    visible: true,
    children: [
      {
        id: 41,
        name: '任务管理',
        path: '/admin/task-management',
        component: 'TaskManagement.vue',
        type: 'menu',
        icon: '',
        sort: 1,
        visible: true,
        children: []
      }
    ]
  },
  {
    id: 5,
    name: '数据管理',
    path: '/admin/data',
    component: '',
    type: 'menu',
    icon: 'DataLine',
    sort: 5,
    visible: true,
    children: [
      {
        id: 51,
        name: '数据管理',
        path: '/admin/data-management',
        component: 'DataManagement.vue',
        type: 'menu',
        icon: '',
        sort: 1,
        visible: true,
        children: []
      }
    ]
  },
  {
    id: 6,
    name: '统计分析',
    path: '/admin/statistics',
    component: '',
    type: 'menu',
    icon: 'TrendCharts',
    sort: 6,
    visible: true,
    children: [
      {
        id: 61,
        name: '统计分析',
        path: '/admin/statistics',
        component: 'Statistics.vue',
        type: 'menu',
        icon: '',
        sort: 1,
        visible: true,
        children: []
      }
    ]
  },
  {
    id: 7,
    name: '系统通知',
    path: '/admin/notification',
    component: '',
    type: 'menu',
    icon: 'Bell',
    sort: 7,
    visible: true,
    children: [
      {
        id: 71,
        name: '系统通知',
        path: '/admin/notification',
        component: 'Notification.vue',
        type: 'menu',
        icon: '',
        sort: 1,
        visible: true,
        children: []
      }
    ]
  }
])

const menuTreeOptions = computed(() => {
  return [
    { id: null, name: '无（一级菜单）' },
    ...menuData.value.map(item => ({
      id: item.id,
      name: item.name,
      children: item.children?.map(child => ({
        id: child.id,
        name: child.name
      }))
    }))
  ]
})

function expandAll() {
  expandedKeys.value = menuData.value.map(item => item.id)
}

function collapseAll() {
  expandedKeys.value = []
}

function handleAddTop() {
  isEdit.value = false
  isAddChild.value = false
  Object.assign(menuForm, {
    id: null,
    parentId: null,
    name: '',
    type: 'menu',
    path: '',
    component: '',
    permission: '',
    icon: '',
    sort: 0,
    visible: true
  })
  dialogVisible.value = true
}

function handleAddChild(row) {
  isEdit.value = false
  isAddChild.value = true
  Object.assign(menuForm, {
    id: null,
    parentId: row.id,
    name: '',
    type: 'menu',
    path: '',
    component: '',
    permission: '',
    icon: '',
    sort: 0,
    visible: true
  })
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  isAddChild.value = false
  Object.assign(menuForm, {
    ...row,
    visible: row.visible !== false
  })
  dialogVisible.value = true
}

function handleSave() {
  menuFormRef.value?.validate((valid) => {
    if (valid) {
      dialogVisible.value = false
      ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    }
  })
}

function handleSort(row) {
  sortDialogVisible.value = true
}

function allowDrop(draggingNode, dropNode, type) {
  if (dropNode.data.level === 1 && type === 'inner') {
    return false
  }
  return true
}

function handleNodeDrop() {
  // 拖拽完成
}

function saveSort() {
  sortDialogVisible.value = false
  ElMessage.success('排序保存成功')
}

function handleToggleVisible(row) {
  ElMessage.success(`菜单${row.visible ? '显示' : '隐藏'}成功`)
}

function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该菜单吗？删除后子菜单也会被删除。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.menu-management {
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

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
}

.tree-title {
  font-size: 14px;
  font-weight: 500;
  color: #595959;
}

.tree-actions {
  display: flex;
  gap: 8px;
}

.menu-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  color: #1890ff;
  font-size: 13px;
  margin-bottom: 16px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-table__row--level-1 .el-table__cell) {
  background: #fafafa;
}
</style>
