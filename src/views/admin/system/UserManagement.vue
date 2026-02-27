<template>
  <div class="user-management">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">用户管理</span>
          <div class="header-actions">
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              新增用户
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true">
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="searchForm.employeeNo" placeholder="请输入工号" clearable />
          </el-form-item>
          <el-form-item label="部门">
            <el-select v-model="searchForm.department" placeholder="请选择部门" clearable>
              <el-option label="计算机学院" value="计算机学院" />
              <el-option label="数学学院" value="数学学院" />
              <el-option label="英语学院" value="英语学院" />
              <el-option label="物理学院" value="物理学院" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="启用" value="active" />
              <el-option label="禁用" value="inactive" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 用户表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="employeeNo" label="工号" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="department" label="部门" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === '管理员' ? 'danger' : 'primary'" size="small">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleEdit(row)">编辑</el-link>
            <el-divider direction="vertical" />
            <el-link type="primary" :underline="false" @click="handleResetPassword(row)">重置密码</el-link>
            <el-divider direction="vertical" />
            <el-link
              :type="row.status === '启用' ? 'warning' : 'success'"
              :underline="false"
              @click="handleToggleStatus(row)"
            >
              {{ row.status === '启用' ? '禁用' : '启用' }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 用户编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑用户' : '新增用户'"
      width="600px"
    >
      <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="100px">
        <el-form-item label="工号" prop="employeeNo">
          <el-input v-model="userForm.employeeNo" placeholder="请输入工号" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-select v-model="userForm.department" placeholder="请选择部门" style="width: 100%;">
            <el-option label="计算机学院" value="计算机学院" />
            <el-option label="数学学院" value="数学学院" />
            <el-option label="英语学院" value="英语学院" />
            <el-option label="物理学院" value="物理学院" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="userForm.role">
            <el-radio value="教师">教师</el-radio>
            <el-radio value="管理员">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" v-if="!isEdit">
          <el-input v-model="userForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const userFormRef = ref(null)

const searchForm = reactive({
  name: '',
  employeeNo: '',
  department: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const userForm = reactive({
  employeeNo: '',
  name: '',
  department: '',
  role: '教师',
  phone: '',
  email: '',
  status: 'active',
  remark: ''
})

const rules = {
  employeeNo: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  department: [{ required: true, message: '请选择部门', trigger: 'change' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }]
}

// 模拟数据
const tableData = ref([
  {
    id: 1,
    employeeNo: 'T2024001',
    name: '张老师',
    department: '计算机学院',
    role: '教师',
    phone: '13800138001',
    email: 'zhang@edu.cn',
    status: '启用',
    lastLogin: '2024-02-26 09:30'
  },
  {
    id: 2,
    employeeNo: 'T2024002',
    name: '李老师',
    department: '数学学院',
    role: '教师',
    phone: '13800138002',
    email: 'li@edu.cn',
    status: '启用',
    lastLogin: '2024-02-26 08:45'
  },
  {
    id: 3,
    employeeNo: 'T2024003',
    name: '王老师',
    department: '英语学院',
    role: '教师',
    phone: '13800138003',
    email: 'wang@edu.cn',
    status: '启用',
    lastLogin: '2024-02-25 17:30'
  },
  {
    id: 4,
    employeeNo: 'A2024001',
    name: '管理员',
    department: '教务处',
    role: '管理员',
    phone: '13800138000',
    email: 'admin@edu.cn',
    status: '启用',
    lastLogin: '2024-02-26 10:00'
  }
])

pagination.total = tableData.value.length

function handleSearch() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('查询成功')
  }, 500)
}

function handleReset() {
  Object.assign(searchForm, {
    name: '',
    employeeNo: '',
    department: '',
    status: ''
  })
}

function handleAdd() {
  isEdit.value = false
  Object.assign(userForm, {
    employeeNo: '',
    name: '',
    department: '',
    role: '教师',
    phone: '',
    email: '',
    status: 'active',
    remark: ''
  })
  dialogVisible.value = true
}

function handleEdit(row) {
  isEdit.value = true
  Object.assign(userForm, {
    ...row,
    status: row.status === '启用' ? 'active' : 'inactive'
  })
  dialogVisible.value = true
}

function handleSave() {
  userFormRef.value?.validate((valid) => {
    if (valid) {
      dialogVisible.value = false
      ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
    }
  })
}

function handleResetPassword(row) {
  ElMessageBox.confirm(`确定要重置用户 ${row.name} 的密码吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('密码重置成功，新密码为：123456')
  })
}

function handleToggleStatus(row) {
  const action = row.status === '启用' ? '禁用' : '启用'
  ElMessageBox.confirm(`确定要${action}用户 ${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = row.status === '启用' ? '禁用' : '启用'
    ElMessage.success(`${action}成功`)
  })
}
</script>

<style scoped>
.user-management {
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

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
