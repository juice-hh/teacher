<template>
  <div class="profile">
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card class="profile-card" shadow="hover">
          <div class="avatar-section">
            <el-avatar :size="100" :icon="UserFilled" />
            <h3 class="user-name">{{ userInfo.name }}</h3>
            <p class="user-title">{{ userInfo.department }} · {{ userInfo.title }}</p>
            <el-button type="primary" @click="editAvatar">更换头像</el-button>
          </div>

          <el-divider />

          <div class="info-list">
            <div class="info-item">
              <span class="info-label">工号</span>
              <span class="info-value">{{ userInfo.employeeNo }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">性别</span>
              <span class="info-value">{{ userInfo.gender }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">入职时间</span>
              <span class="info-value">{{ userInfo.joinDate }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">联系电话</span>
              <span class="info-value">{{ userInfo.phone }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮箱</span>
              <span class="info-value">{{ userInfo.email }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card class="detail-card" shadow="hover">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本信息" name="basic">
              <el-form :model="userInfo" label-width="120px" style="max-width: 500px;">
                <el-form-item label="姓名">
                  <el-input v-model="userInfo.name" />
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="userInfo.gender">
                    <el-radio value="男">男</el-radio>
                    <el-radio value="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="部门">
                  <el-select v-model="userInfo.department" style="width: 100%;">
                    <el-option label="计算机学院" value="计算机学院" />
                    <el-option label="数学学院" value="数学学院" />
                    <el-option label="英语学院" value="英语学院" />
                  </el-select>
                </el-form-item>
                <el-form-item label="职称">
                  <el-select v-model="userInfo.title" style="width: 100%;">
                    <el-option label="助教" value="助教" />
                    <el-option label="讲师" value="讲师" />
                    <el-option label="副教授" value="副教授" />
                    <el-option label="教授" value="教授" />
                  </el-select>
                </el-form-item>
                <el-form-item label="联系电话">
                  <el-input v-model="userInfo.phone" />
                </el-form-item>
                <el-form-item label="邮箱">
                  <el-input v-model="userInfo.email" />
                </el-form-item>
                <el-form-item label="个人简介">
                  <el-input v-model="userInfo.bio" type="textarea" :rows="4" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveBasic">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="修改密码" name="password">
              <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px" style="max-width: 500px;">
                <el-form-item label="原密码" prop="oldPassword">
                  <el-input v-model="passwordForm.oldPassword" type="password" show-password />
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input v-model="passwordForm.newPassword" type="password" show-password />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="changePassword">确定</el-button>
                  <el-button @click="resetPasswordForm">重置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="评价历史" name="history">
              <el-table :data="historyData" style="width: 100%">
                <el-table-column prop="period" label="评价周期" width="150" />
                <el-table-column prop="type" label="评价类型" width="120">
                  <template #default="{ row }">
                    <el-tag size="small">{{ row.type }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="score" label="得分" width="100">
                  <template #default="{ row }">
                    <el-tag :type="getScoreType(row.score)" size="small">{{ row.score }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="rank" label="排名" width="100" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.status === '已完成' ? 'success' : 'warning'" size="small">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="{ row }">
                    <el-link type="primary" :underline="false" @click="viewHistory(row)">查看</el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'

const activeTab = ref('basic')
const passwordFormRef = ref(null)

const userInfo = ref({
  name: '张老师',
  employeeNo: 'T2024001',
  gender: '男',
  department: '计算机学院',
  title: '副教授',
  joinDate: '2018-09-01',
  phone: '13800138001',
  email: 'zhang@edu.cn',
  bio: '从事计算机科学与技术教学与研究工作，主要研究方向为人工智能、机器学习等。'
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能少于8位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const historyData = ref([
  {
    id: 1,
    period: '2023年度',
    type: '年度评价',
    score: 88.5,
    rank: '15/128',
    status: '已完成'
  },
  {
    id: 2,
    period: '2023年秋季',
    type: '学期评价',
    score: 85.0,
    rank: '20/128',
    status: '已完成'
  },
  {
    id: 3,
    period: '2023年春季',
    type: '学期评价',
    score: 87.2,
    rank: '18/128',
    status: '已完成'
  }
])

function getScoreType(score) {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

function editAvatar() {
  ElMessage.info('打开头像上传')
}

function saveBasic() {
  localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  ElMessage.success('基本信息保存成功')
}

function changePassword() {
  passwordFormRef.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('密码修改成功，请重新登录')
      resetPasswordForm()
    }
  })
}

function resetPasswordForm() {
  Object.assign(passwordForm, {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
}

function viewHistory(row) {
  ElMessage.info(`查看 ${row.period} 的评价详情`)
}
</script>

<style scoped>
.profile {
  padding: 0;
}

.profile-card,
.detail-card {
  border-radius: 8px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 16px 0 4px 0;
}

.user-title {
  font-size: 14px;
  color: #8c8c8c;
  margin-bottom: 16px;
}

.info-list {
  padding: 0 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #595959;
}

.info-value {
  font-size: 14px;
  color: #1f1f1f;
  font-weight: 500;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-tabs__item) {
  font-size: 15px;
}
</style>
