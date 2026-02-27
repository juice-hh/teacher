<template>
  <div class="role-management">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">角色权限管理</span>
          <el-button type="primary" :icon="Plus" @click="handleAdd">
            新增角色
          </el-button>
        </div>
      </template>

      <el-table :data="roleData" style="width: 100%">
        <el-table-column prop="name" label="角色名称" width="200" />
        <el-table-column prop="code" label="角色编码" width="180" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="userCount" label="用户数量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handlePermission(row)">
              权限配置
            </el-link>
            <el-divider direction="vertical" />
            <el-link type="primary" :underline="false" @click="handleEdit(row)">
              编辑
            </el-link>
            <el-divider direction="vertical" />
            <el-link type="danger" :underline="false" @click="handleDelete(row)">
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 角色编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑角色' : '新增角色'"
      width="500px"
    >
      <el-form :model="roleForm" :rules="rules" ref="roleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="roleForm.code" placeholder="请输入角色编码，如：ROLE_ADMIN" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="roleForm.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限配置对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="权限配置"
      width="700px"
    >
      <div class="permission-content">
        <el-tree
          ref="permissionTreeRef"
          :data="permissionTreeData"
          show-checkbox
          node-key="id"
          :props="{ label: 'name', children: 'children' }"
          default-expand-all
        />
      </div>
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermission">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const isEdit = ref(false)
const roleFormRef = ref(null)
const permissionTreeRef = ref(null)

const roleForm = reactive({
  name: '',
  code: '',
  description: '',
  status: 'active'
})

const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
}

const roleData = ref([
  {
    id: 1,
    name: '管理员',
    code: 'ROLE_ADMIN',
    description: '系统管理员，拥有所有权限',
    userCount: 5,
    status: '启用',
    createTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    name: '教师',
    code: 'ROLE_TEACHER',
    description: '普通教师角色，可进行自我评价和评审他人',
    userCount: 123,
    status: '启用',
    createTime: '2024-01-01 10:00:00'
  },
  {
    id: 3,
    name: '评审专家',
    code: 'ROLE_EXPERT',
    description: '评审专家角色，可参与同行评审',
    userCount: 20,
    status: '启用',
    createTime: '2024-01-01 10:00:00'
  }
])

const permissionTreeData = ref([
  {
    id: 1,
    name: '系统配置',
    children: [
      { id: 11, name: '菜单管理' },
      { id: 12, name: '用户管理' },
      { id: 13, name: '角色权限管理' },
      { id: 14, name: '系统参数配置' }
    ]
  },
  {
    id: 2,
    name: '评价项目管理',
    children: [
      { id: 21, name: '评价指标管理' }
    ]
  },
  {
    id: 3,
    name: '评价任务管理',
    children: [
      { id: 31, name: '任务管理' }
    ]
  },
  {
    id: 4,
    name: '数据管理',
    children: [
      { id: 41, name: '数据管理' }
    ]
  },
  {
    id: 5,
    name: '统计分析',
    children: [
      { id: 51, name: '统计分析' }
    ]
  },
  {
    id: 6,
    name: '系统通知',
    children: [
      { id: 61, name: '系统通知' }
    ]
  }
])

let currentRole = null

function handleAdd() {
  isEdit.value = false
  Object.assign(roleForm, {
    name: '',
    code: '',
    description: '',
    status: 'active'
  })
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  Object.assign(roleForm, { ...row })
  dialogVisible.value = true
}

function handleSave() {
  roleFormRef.value?.validate((valid) => {
    if (valid) {
      dialogVisible.value = false
      ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    }
  })
}

function handlePermission(row) {
  currentRole = row
  permissionDialogVisible.value = true
}

function savePermission() {
  const checkedKeys = permissionTreeRef.value.getCheckedKeys()
  console.log('保存权限', checkedKeys)
  permissionDialogVisible.value = false
  ElMessage.success('权限配置保存成功')
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除角色「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<style scoped>
.role-management {
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

.permission-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
