/**
 * 立即初始化所有演示数据
 * 在浏览器控制台粘贴执行此脚本
 */

(function() {
  console.log('🚀 开始强制初始化所有数据...')

  // 1. 清除所有可能的问题数据
  console.log('📋 步骤1：清除旧数据...')
  localStorage.removeItem('evaluationMaterials')
  localStorage.removeItem('evaluationScores')
  localStorage.removeItem('scoreAppeals')

  // 2. 初始化评价材料数据
  console.log('📦 步骤2：初始化评价材料...')
  const materials = [
    {
      id: 1,
      taskId: 1,
      taskName: '2024年度教师自评',
      indicatorId: 1,
      indicatorName: '备课充分',
      teacherId: 'T001',
      teacherName: '张老师',
      materialName: '教学教案-春季学期',
      materialType: 'document',
      fileUrl: '/files/teaching-plan.pdf',
      description: '包含完整的教学教案、教学日历和课件',
      uploadTime: '2024-03-05 10:30:00',
      status: 'pending',
      approveTime: null,
      approver: null,
      rejectReason: ''
    },
    {
      id: 2,
      taskId: 1,
      taskName: '2024年度教师自评',
      indicatorId: 5,
      indicatorName: '教学方法创新',
      teacherId: 'T001',
      teacherName: '张老师',
      materialName: '教学改革项目成果',
      materialType: 'document',
      fileUrl: '/files/teaching-reform.pdf',
      description: '教学方法创新项目的实施记录和成果',
      uploadTime: '2024-03-06 14:20:00',
      status: 'approved',
      approveTime: '2024-03-07 09:15:00',
      approver: '管理员',
      rejectReason: ''
    },
    {
      id: 3,
      taskId: 1,
      taskName: '2024年度教师自评',
      indicatorId: 2,
      indicatorName: '课堂管理',
      teacherId: 'T002',
      teacherName: '李老师',
      materialName: '课堂管理记录',
      materialType: 'document',
      fileUrl: '/files/class-management.pdf',
      description: '本学期课堂管理情况记录',
      uploadTime: '2024-03-04 16:45:00',
      status: 'rejected',
      approveTime: '2024-03-05 11:20:00',
      approver: '管理员',
      rejectReason: '材料不完整，缺少学生反馈记录'
    },
    {
      id: 4,
      taskId: 1,
      taskName: '2024年度教师自评',
      indicatorId: 8,
      indicatorName: '学生评价',
      teacherId: 'T003',
      teacherName: '王老师',
      materialName: '学生评教汇总报告',
      materialType: 'document',
      fileUrl: '/files/student-eval.pdf',
      description: '2024年春季学期学生评教结果汇总',
      uploadTime: '2024-03-07 09:15:00',
      status: 'pending',
      approveTime: null,
      approver: null,
      rejectReason: ''
    },
    {
      id: 5,
      taskId: 1,
      taskName: '2024年度教师自评',
      indicatorId: 11,
      indicatorName: '学术研究',
      teacherId: 'T003',
      teacherName: '王老师',
      materialName: '科研项目结题证书',
      materialType: 'document',
      fileUrl: '/files/research-cert.pdf',
      description: '2023年度省级科研项目结题材料',
      uploadTime: '2024-03-08 15:30:00',
      status: 'pending',
      approveTime: null,
      approver: null,
      rejectReason: ''
    }
  ]
  localStorage.setItem('evaluationMaterials', JSON.stringify(materials))
  console.log(`✅ 已保存 ${materials.length} 条材料数据`)

  // 3. 初始化积分数据
  console.log('📊 步骤3：初始化积分数据...')
  const scores = [
    {
      id: 1,
      teacherId: 'T001',
      teacherName: '张老师',
      department: '计算机学院',
      semester: '2024年度',
      totalScore: 92.5,
      confirmed: true,
      confirmedBy: null,
      confirmedAt: '2024-03-15 10:30:00',
      details: [
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 1, indicatorName: '备课充分', score: 5, maxScore: 5 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 5, indicatorName: '教学方法创新', score: 7, maxScore: 8 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 8, indicatorName: '学生评价', score: 9, maxScore: 10 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 11, indicatorName: '学术研究', score: 8.5, maxScore: 10 }
      ]
    },
    {
      id: 2,
      teacherId: 'T002',
      teacherName: '李老师',
      department: '数学学院',
      semester: '2024年度',
      totalScore: 87.0,
      confirmed: true,
      confirmedBy: null,
      confirmedAt: '2024-03-16 14:20:00',
      details: [
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 1, indicatorName: '备课充分', score: 4, maxScore: 5 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 5, indicatorName: '教学方法创新', score: 6, maxScore: 8 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 8, indicatorName: '学生评价', score: 8.5, maxScore: 10 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 11, indicatorName: '学术研究', score: 7.5, maxScore: 10 }
      ]
    },
    {
      id: 3,
      teacherId: 'T003',
      teacherName: '王老师',
      department: '英语学院',
      semester: '2024年度',
      totalScore: 95.0,
      confirmed: false,
      confirmedBy: null,
      confirmedAt: null,
      details: [
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 1, indicatorName: '备课充分', score: 5, maxScore: 5 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 5, indicatorName: '教学方法创新', score: 8, maxScore: 8 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 8, indicatorName: '学生评价', score: 9.5, maxScore: 10 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 11, indicatorName: '学术研究', score: 9, maxScore: 10 }
      ]
    },
    {
      id: 4,
      teacherId: 'T004',
      teacherName: '赵老师',
      department: '物理学院',
      semester: '2024年度',
      totalScore: 88.5,
      confirmed: false,
      confirmedBy: null,
      confirmedAt: null,
      details: [
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 1, indicatorName: '备课充分', score: 4.5, maxScore: 5 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 5, indicatorName: '教学方法创新', score: 6.5, maxScore: 8 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 8, indicatorName: '学生评价', score: 9, maxScore: 10 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 11, indicatorName: '学术研究', score: 8, maxScore: 10 }
      ]
    },
    {
      id: 5,
      teacherId: 'T005',
      teacherName: '陈老师',
      department: '计算机学院',
      semester: '2024年度',
      totalScore: 91.0,
      confirmed: true,
      confirmedBy: '管理员',
      confirmedAt: '2024-03-17 11:00:00',
      details: [
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 1, indicatorName: '备课充分', score: 5, maxScore: 5 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 5, indicatorName: '教学方法创新', score: 7.5, maxScore: 8 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 8, indicatorName: '学生评价', score: 8.5, maxScore: 10 },
        { taskId: 1, taskName: '2024年度教师自评', indicatorId: 11, indicatorName: '学术研究', score: 8, maxScore: 10 }
      ]
    },
    {
      id: 6,
      teacherId: 'T001',
      teacherName: '张老师',
      department: '计算机学院',
      semester: '2023年度',
      totalScore: 89.0,
      confirmed: true,
      confirmedBy: '管理员',
      confirmedAt: '2024-01-15 10:30:00',
      details: [
        { taskId: 2, taskName: '2023年度教师自评', indicatorId: 1, indicatorName: '备课充分', score: 4.5, maxScore: 5 },
        { taskId: 2, taskName: '2023年度教师自评', indicatorId: 5, indicatorName: '教学方法创新', score: 6.5, maxScore: 8 },
        { taskId: 2, taskName: '2023年度教师自评', indicatorId: 8, indicatorName: '学生评价', score: 9, maxScore: 10 },
        { taskId: 2, taskName: '2023年度教师自评', indicatorId: 11, indicatorName: '学术研究', score: 8, maxScore: 10 }
      ]
    }
  ]
  localStorage.setItem('evaluationScores', JSON.stringify(scores))
  console.log(`✅ 已保存 ${scores.length} 条积分数据`)

  // 4. 初始化申诉数据
  console.log('📝 步骤4：初始化申诉数据...')
  const appeals = [
    {
      id: 1,
      teacherId: 'T003',
      teacherName: '王老师',
      department: '英语学院',
      scoreId: 3,
      indicatorName: '教学方法创新',
      originalScore: 7,
      expectedScore: 8,
      reason: '该指标实际得分应该是8分，系统计算错误',
      status: 'pending',
      submitTime: '2024-03-20 10:15:00',
      handler: null,
      handleTime: null,
      handleResult: ''
    },
    {
      id: 2,
      teacherId: 'T001',
      teacherName: '张老师',
      department: '计算机学院',
      scoreId: 1,
      indicatorName: '学生评价',
      originalScore: 9,
      expectedScore: 10,
      reason: '学生评教分数应该更高',
      status: 'approved',
      submitTime: '2024-03-18 15:30:00',
      handler: '管理员',
      handleTime: '2024-03-19 09:20:00',
      handleResult: '经复核，同意调整为10分'
    },
    {
      id: 3,
      teacherId: 'T004',
      teacherName: '赵老师',
      department: '物理学院',
      scoreId: 4,
      indicatorName: '学术研究',
      originalScore: 7,
      expectedScore: 9,
      reason: '有一篇论文被遗漏统计',
      status: 'pending',
      submitTime: '2024-03-21 14:20:00',
      handler: null,
      handleTime: null,
      handleResult: ''
    },
    {
      id: 4,
      teacherId: 'T002',
      teacherName: '李老师',
      department: '数学学院',
      scoreId: 2,
      indicatorName: '备课充分',
      originalScore: 4,
      expectedScore: 5,
      reason: '教案完整，应得满分',
      status: 'rejected',
      submitTime: '2024-03-17 09:30:00',
      handler: '管理员',
      handleTime: '2024-03-18 10:15:00',
      handleResult: '经复核，教案确实有部分内容缺失，维持原分'
    }
  ]
  localStorage.setItem('scoreAppeals', JSON.stringify(appeals))
  console.log(`✅ 已保存 ${appeals.length} 条申诉数据`)

  console.log('')
  console.log('🎉 所有演示数据初始化完成！')
  console.log('📊 数据统计：')
  console.log(`   - 评价材料：${materials.length} 条 (待审批：${materials.filter(m => m.status === 'pending').length} 条)`)
  console.log(`   - 教师积分：${scores.length} 条 (2024年度：${scores.filter(s => s.semester === '2024年度').length} 条)`)
  console.log(`   - 申诉记录：${appeals.length} 条 (待处理：${appeals.filter(a => a.status === 'pending').length} 条)`)
  console.log('')
  console.log('🔄 页面将在 2 秒后自动刷新...')

  // 5. 自动刷新页面
  setTimeout(() => {
    console.log('♻️ 正在刷新页面...')
    location.reload()
  }, 2000)
})()
