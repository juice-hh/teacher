import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMaterialsStore = defineStore('materials', () => {
  // 评价材料数据
  const materials = ref([])

  // 演示数据
  const demoMaterials = [
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

  // 计算属性
  const pendingMaterials = computed(() => {
    return materials.value.filter(m => m.status === 'pending')
  })

  const processedMaterials = computed(() => {
    return materials.value.filter(m => m.status === 'approved' || m.status === 'rejected')
  })

  // 方法
  const initMaterials = () => {
    const stored = localStorage.getItem('evaluationMaterials')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // 只有当localStorage中有有效数据时才使用，否则使用演示数据
        materials.value = parsed && parsed.length > 0 ? parsed : [...demoMaterials]
      } catch (e) {
        materials.value = [...demoMaterials]
      }
    } else {
      materials.value = [...demoMaterials]
    }
    saveMaterials()
  }

  const saveMaterials = () => {
    localStorage.setItem('evaluationMaterials', JSON.stringify(materials.value))
  }

  const getMaterialsByTeacher = (teacherId) => {
    return materials.value.filter(m => m.teacherId === teacherId)
  }

  const getMaterialById = (id) => {
    return materials.value.find(m => m.id === id)
  }

  const approveMaterial = (id, approver) => {
    const material = getMaterialById(id)
    if (material) {
      material.status = 'approved'
      material.approveTime = new Date().toLocaleString('zh-CN')
      material.approver = approver
      material.rejectReason = ''
      saveMaterials()
      return true
    }
    return false
  }

  const rejectMaterial = (id, approver, reason) => {
    const material = getMaterialById(id)
    if (material) {
      material.status = 'rejected'
      material.approveTime = new Date().toLocaleString('zh-CN')
      material.approver = approver
      material.rejectReason = reason
      saveMaterials()
      return true
    }
    return false
  }

  const uploadMaterial = (materialData) => {
    const newMaterial = {
      id: Date.now(),
      ...materialData,
      uploadTime: new Date().toLocaleString('zh-CN'),
      status: 'pending',
      approveTime: null,
      approver: null,
      rejectReason: ''
    }
    materials.value.push(newMaterial)
    saveMaterials()
    return newMaterial
  }

  const deleteMaterial = (id) => {
    const index = materials.value.findIndex(m => m.id === id)
    if (index !== -1) {
      materials.value.splice(index, 1)
      saveMaterials()
      return true
    }
    return false
  }

  const resetMaterials = () => {
    materials.value = [...demoMaterials]
    saveMaterials()
  }

  // 初始化
  initMaterials()

  return {
    materials,
    pendingMaterials,
    processedMaterials,
    getMaterialsByTeacher,
    getMaterialById,
    approveMaterial,
    rejectMaterial,
    uploadMaterial,
    deleteMaterial,
    saveMaterials,
    resetMaterials
  }
})
