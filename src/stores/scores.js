import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useScoreStore = defineStore('score', () => {
  // 积分数据
  const scores = ref([])
  // 申诉数据
  const appeals = ref([])

  // 演示数据
  const demoScores = [
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

  const demoAppeals = [
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

  // 计算属性
  const semesters = computed(() => {
    const semesterSet = new Set()
    scores.value.forEach(score => semesterSet.add(score.semester))
    return Array.from(semesterSet).sort().reverse()
  })

  const pendingAppeals = computed(() => {
    return appeals.value.filter(appeal => appeal.status === 'pending')
  })

  // 方法
  const initScores = () => {
    const storedScores = localStorage.getItem('evaluationScores')
    const storedAppeals = localStorage.getItem('scoreAppeals')

    if (storedScores) {
      try {
        const parsed = JSON.parse(storedScores)
        // 只有当localStorage中有有效数据时才使用，否则使用演示数据
        scores.value = parsed && parsed.length > 0 ? parsed : [...demoScores]
      } catch (e) {
        scores.value = [...demoScores]
      }
    } else {
      scores.value = [...demoScores]
    }

    if (storedAppeals) {
      try {
        const parsed = JSON.parse(storedAppeals)
        // 只有当localStorage中有有效数据时才使用，否则使用演示数据
        appeals.value = parsed && parsed.length > 0 ? parsed : [...demoAppeals]
      } catch (e) {
        appeals.value = [...demoAppeals]
      }
    } else {
      appeals.value = [...demoAppeals]
    }

    saveScores()
  }

  const saveScores = () => {
    localStorage.setItem('evaluationScores', JSON.stringify(scores.value))
    localStorage.setItem('scoreAppeals', JSON.stringify(appeals.value))
  }

  const getScoresBySemester = (semester) => {
    return scores.value.filter(score => score.semester === semester)
  }

  const getSemesterStats = (semester) => {
    const semesterScores = getScoresBySemester(semester)
    if (semesterScores.length === 0) {
      return { total: 0, confirmed: 0, unconfirmed: 0, avgScore: 0, maxScore: 0, minScore: 0 }
    }
    return {
      total: semesterScores.length,
      confirmed: semesterScores.filter(s => s.confirmed).length,
      unconfirmed: semesterScores.filter(s => !s.confirmed).length,
      avgScore: semesterScores.reduce((sum, s) => sum + s.totalScore, 0) / semesterScores.length,
      maxScore: Math.max(...semesterScores.map(s => s.totalScore)),
      minScore: Math.min(...semesterScores.map(s => s.totalScore))
    }
  }

  const confirmScore = (scoreId, confirmer) => {
    const score = scores.value.find(s => s.id === scoreId)
    if (score) {
      score.confirmed = true
      score.confirmedBy = confirmer
      score.confirmedAt = new Date().toLocaleString('zh-CN')
      saveScores()
      return true
    }
    return false
  }

  const batchConfirmScores = (semester, confirmer) => {
    const semesterScores = getScoresBySemester(semester)
    let count = 0
    semesterScores.forEach(score => {
      if (!score.confirmed) {
        score.confirmed = true
        score.confirmedBy = confirmer
        score.confirmedAt = new Date().toLocaleString('zh-CN')
        count++
      }
    })
    saveScores()
    return count
  }

  const handleAppeal = (appealId, handler, result, status) => {
    const appeal = appeals.value.find(a => a.id === appealId)
    if (appeal) {
      appeal.handler = handler
      appeal.handleTime = new Date().toLocaleString('zh-CN')
      appeal.handleResult = result
      appeal.status = status
      saveScores()
      return true
    }
    return false
  }

  const submitAppeal = (appealData) => {
    const newAppeal = {
      id: Date.now(),
      ...appealData,
      status: 'pending',
      submitTime: new Date().toLocaleString('zh-CN'),
      handler: null,
      handleTime: null,
      handleResult: ''
    }
    appeals.value.push(newAppeal)
    saveScores()
    return newAppeal
  }

  const resetScores = () => {
    scores.value = [...demoScores]
    appeals.value = [...demoAppeals]
    saveScores()
  }

  // 获取教师的积分
  const getTeacherScores = (teacherId) => {
    return scores.value.filter(score => score.teacherId === teacherId)
  }

  // 获取教师的申诉
  const getTeacherAppeals = (teacherId) => {
    return appeals.value.filter(appeal => appeal.teacherId === teacherId)
  }

  // 初始化
  initScores()

  return {
    scores,
    appeals,
    semesters,
    pendingAppeals,
    getScoresBySemester,
    getSemesterStats,
    getTeacherScores,
    getTeacherAppeals,
    confirmScore,
    batchConfirmScores,
    handleAppeal,
    submitAppeal,
    saveScores,
    resetScores
  }
})
