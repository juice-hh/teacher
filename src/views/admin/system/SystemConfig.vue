<template>
  <div class="system-config">
    <el-card class="page-card" shadow="hover">
      <template #header>
        <span class="card-title">系统参数配置</span>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本设置" name="basic">
          <el-form :model="basicConfig" label-width="150px" style="max-width: 600px;">
            <el-form-item label="系统名称">
              <el-input v-model="basicConfig.systemName" />
            </el-form-item>
            <el-form-item label="系统简称">
              <el-input v-model="basicConfig.systemShortName" />
            </el-form-item>
            <el-form-item label="系统LOGO">
              <el-upload
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                class="logo-upload"
              >
                <img v-if="basicConfig.logo" :src="basicConfig.logo" class="logo-img" />
                <el-icon v-else class="logo-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="版权信息">
              <el-input v-model="basicConfig.copyright" type="textarea" :rows="2" />
            </el-form-item>
            <el-form-item label="备案号">
              <el-input v-model="basicConfig.icp" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBasic">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="评价设置" name="evaluation">
          <el-form :model="evaluationConfig" label-width="180px" style="max-width: 600px;">
            <el-form-item label="评价周期">
              <el-select v-model="evaluationConfig.period">
                <el-option label="年度评价" value="yearly" />
                <el-option label="学期评价" value="semester" />
                <el-option label="季度评价" value="quarterly" />
              </el-select>
            </el-form-item>
            <el-form-item label="自评时长限制（天）">
              <el-input-number v-model="evaluationConfig.selfDays" :min="1" :max="365" />
            </el-form-item>
            <el-form-item label="互评时长限制（天）">
              <el-input-number v-model="evaluationConfig.peerDays" :min="1" :max="365" />
            </el-form-item>
            <el-form-item label="允许修改已提交评价">
              <el-switch v-model="evaluationConfig.allowModify" />
            </el-form-item>
            <el-form-item label="评价截止自动提醒">
              <el-switch v-model="evaluationConfig.autoRemind" />
            </el-form-item>
            <el-form-item label="提醒时间（天）">
              <el-input-number v-model="evaluationConfig.remindDays" :min="1" :max="30" :disabled="!evaluationConfig.autoRemind" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveEvaluation">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="安全设置" name="security">
          <el-form :model="securityConfig" label-width="180px" style="max-width: 600px;">
            <el-form-item label="密码最小长度">
              <el-input-number v-model="securityConfig.minPasswordLength" :min="6" :max="20" />
            </el-form-item>
            <el-form-item label="密码复杂度要求">
              <el-checkbox-group v-model="securityConfig.passwordComplexity">
                <el-checkbox value="uppercase">包含大写字母</el-checkbox>
                <el-checkbox value="lowercase">包含小写字母</el-checkbox>
                <el-checkbox value="number">包含数字</el-checkbox>
                <el-checkbox value="special">包含特殊字符</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="登录失败锁定次数">
              <el-input-number v-model="securityConfig.maxLoginAttempts" :min="3" :max="10" />
            </el-form-item>
            <el-form-item label="锁定时间（分钟）">
              <el-input-number v-model="securityConfig.lockoutDuration" :min="5" :max="120" />
            </el-form-item>
            <el-form-item label="会话超时时间（分钟）">
              <el-input-number v-model="securityConfig.sessionTimeout" :min="30" :max="480" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSecurity">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="通知设置" name="notification">
          <el-form :model="notificationConfig" label-width="180px" style="max-width: 600px;">
            <el-form-item label="系统通知">
              <el-switch v-model="notificationConfig.systemEnabled" />
            </el-form-item>
            <el-form-item label="邮件通知">
              <el-switch v-model="notificationConfig.emailEnabled" />
            </el-form-item>
            <el-form-item label="短信通知">
              <el-switch v-model="notificationConfig.smsEnabled" />
            </el-form-item>
            <el-form-item label="SMTP服务器">
              <el-input v-model="notificationConfig.smtpHost" :disabled="!notificationConfig.emailEnabled" />
            </el-form-item>
            <el-form-item label="SMTP端口">
              <el-input-number v-model="notificationConfig.smtpPort" :disabled="!notificationConfig.emailEnabled" />
            </el-form-item>
            <el-form-item label="发件人邮箱">
              <el-input v-model="notificationConfig.fromEmail" :disabled="!notificationConfig.emailEnabled" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveNotification">保存</el-button>
              <el-button @click="testEmail">发送测试邮件</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const activeTab = ref('basic')

const basicConfig = reactive({
  systemName: '教师评价管理系统',
  systemShortName: '评价系统',
  logo: '',
  copyright: '© 2024 教师评价管理系统 版权所有',
  icp: ''
})

const evaluationConfig = reactive({
  period: 'yearly',
  selfDays: 30,
  peerDays: 15,
  allowModify: false,
  autoRemind: true,
  remindDays: 3
})

const securityConfig = reactive({
  minPasswordLength: 8,
  passwordComplexity: ['lowercase', 'number'],
  maxLoginAttempts: 5,
  lockoutDuration: 30,
  sessionTimeout: 120
})

const notificationConfig = reactive({
  systemEnabled: true,
  emailEnabled: true,
  smsEnabled: false,
  smtpHost: 'smtp.example.com',
  smtpPort: 465,
  fromEmail: 'noreply@example.com'
})

function saveBasic() {
  localStorage.setItem('basicConfig', JSON.stringify(basicConfig))
  ElMessage.success('基本设置保存成功')
}

function saveEvaluation() {
  localStorage.setItem('evaluationConfig', JSON.stringify(evaluationConfig))
  ElMessage.success('评价设置保存成功')
}

function saveSecurity() {
  localStorage.setItem('securityConfig', JSON.stringify(securityConfig))
  ElMessage.success('安全设置保存成功')
}

function saveNotification() {
  localStorage.setItem('notificationConfig', JSON.stringify(notificationConfig))
  ElMessage.success('通知设置保存成功')
}

function testEmail() {
  ElMessage.success('测试邮件已发送')
}
</script>

<style scoped>
.system-config {
  padding: 0;
}

.page-card {
  border-radius: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
}

.logo-upload {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-upload:hover {
  border-color: #1890ff;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-icon {
  font-size: 28px;
  color: #8c8c8c;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

:deep(.el-card__body) {
  padding: 20px;
}
</style>
