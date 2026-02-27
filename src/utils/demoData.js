/**
 * 演示数据初始化工具
 * 确保所有页面在开发模式下都有演示数据
 */

import { useMaterialsStore } from '@/stores/materials'
import { useScoreStore } from '@/stores/scores'

// 强制重新初始化所有演示数据
export const initAllDemoData = () => {
  console.log('🚀 开始初始化所有演示数据...')

  // 清除所有可能存在的空数据
  localStorage.removeItem('evaluationMaterials')
  localStorage.removeItem('evaluationScores')
  localStorage.removeItem('scoreAppeals')

  // 初始化材料数据
  const materialsStore = useMaterialsStore()
  materialsStore.resetToDemoData()
  console.log('✅ 评价材料数据已初始化')

  // 初始化积分数据
  const scoreStore = useScoreStore()
  scoreStore.resetToDemoData()
  console.log('✅ 积分数据已初始化')

  console.log('🎉 所有演示数据初始化完成！')
}

// 检查并自动初始化数据
export const ensureDemoData = () => {
  const materialsStore = useMaterialsStore()
  const scoreStore = useScoreStore()

  let needsInit = false

  // 检查材料数据
  if (materialsStore.materials.length === 0) {
    console.warn('⚠️ 评价材料数据为空')
    needsInit = true
  }

  // 检查积分数据
  if (scoreStore.scores.length === 0) {
    console.warn('⚠️ 积分数据为空')
    needsInit = true
  }

  // 检查申诉数据
  if (scoreStore.appeals.length === 0) {
    console.warn('⚠️ 申诉数据为空')
    needsInit = true
  }

  if (needsInit) {
    console.log('🔄 检测到数据缺失，开始初始化...')
    initAllDemoData()
  } else {
    console.log('✅ 所有数据正常')
  }
}

// 开发模式下自动初始化
if (import.meta.env.DEV) {
  console.log('🔧 开发模式：检查数据完整性...')
  // 延迟执行，确保 store 已创建
  setTimeout(() => {
    ensureDemoData()
  }, 100)
}
