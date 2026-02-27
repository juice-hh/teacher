import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRulesStore = defineStore('rules', () => {
  // 评价规则数据
  const rules = ref([
    {
      id: 1,
      name: '考勤',
      type: 'attendance',
      description: '日常考勤扣分标准',
      createdAt: '2024-01-15',
      scoringItems: [
        { id: 1, indicator: '迟到', level: '', score: -0.5 },
        { id: 2, indicator: '早退', level: '', score: -0.5 },
        { id: 3, indicator: '缺勤', level: '', score: -2 }
      ]
    },
    {
      id: 2,
      name: '公开课',
      type: 'open_class',
      description: '各级别公开课赋分标准',
      createdAt: '2024-01-20',
      scoringItems: [
        { id: 4, indicator: '级部', level: '', score: 1 },
        { id: 5, indicator: '学科组', level: '', score: 1 },
        { id: 6, indicator: '教研组', level: '', score: 1 }
      ]
    },
    {
      id: 3,
      name: '培训',
      type: 'training',
      description: '校级/市级培训赋分标准',
      createdAt: '2024-01-25',
      scoringItems: [
        { id: 7, indicator: '校级', level: '', score: 1 },
        { id: 8, indicator: '市级', level: '', score: 1 }
      ]
    },
    {
      id: 4,
      name: '基本功比赛',
      type: 'basic_skills',
      description: '各级基本功比赛获奖评分标准',
      createdAt: '2024-02-01',
      scoringItems: [
        { id: 9, indicator: '国家级', level: '一等奖', score: 8 },
        { id: 10, indicator: '国家级', level: '二等奖', score: 7 },
        { id: 11, indicator: '国家级', level: '三等奖', score: 5 },
        { id: 12, indicator: '省级', level: '一等奖', score: 7 },
        { id: 13, indicator: '省级', level: '二等奖', score: 6 },
        { id: 14, indicator: '省级', level: '三等奖', score: 5 },
        { id: 15, indicator: '校级', level: '一等奖', score: 6 },
        { id: 16, indicator: '校级', level: '二等奖', score: 5 },
        { id: 17, indicator: '校级', level: '三等奖', score: 4 }
      ]
    },
    {
      id: 5,
      name: '论文评比',
      type: 'paper',
      description: '各级论文评比获奖评分标准',
      createdAt: '2024-02-01',
      scoringItems: [
        { id: 18, indicator: '国家级', level: '一等奖', score: 8 },
        { id: 19, indicator: '国家级', level: '二等奖', score: 7 },
        { id: 20, indicator: '国家级', level: '三等奖', score: 5 },
        { id: 21, indicator: '省级', level: '一等奖', score: 7 },
        { id: 22, indicator: '省级', level: '二等奖', score: 6 },
        { id: 23, indicator: '省级', level: '三等奖', score: 5 },
        { id: 24, indicator: '校级', level: '一等奖', score: 6 },
        { id: 25, indicator: '校级', level: '二等奖', score: 5 },
        { id: 26, indicator: '校级', level: '三等奖', score: 4 }
      ]
    },
    {
      id: 6,
      name: '学术著作',
      type: 'academic_work',
      description: '学术著作作者排序评分标准',
      createdAt: '2024-02-01',
      scoringItems: [
        { id: 27, indicator: '单独作者', level: '', score: 10 },
        { id: 28, indicator: '多作者', level: '一作', score: 6 },
        { id: 29, indicator: '多作者', level: '二作', score: 4 },
        { id: 30, indicator: '多作者', level: '三作', score: 2 },
        { id: 31, indicator: '多作者', level: '其他', score: 0.5 }
      ]
    }
  ])

  // 评价规则类型选项
  const ruleTypes = ref([
    { label: '考勤', value: 'attendance', icon: 'Clock' },
    { label: '公开课', value: 'open_class', icon: 'VideoCamera' },
    { label: '培训', value: 'training', icon: 'Reading' },
    { label: '基本功比赛', value: 'basic_skills', icon: 'Trophy' },
    { label: '论文评比', value: 'paper', icon: 'Document' },
    { label: '学术著作', value: 'academic_work', icon: 'Collection' }
  ])

  // 根据类型获取规则
  const getRulesByType = (type) => {
    return rules.value.filter(rule => rule.type === type)
  }

  // 根据ID获取规则
  const getRuleById = (id) => {
    return rules.value.find(rule => rule.id === id)
  }

  // 添加新规则
  const addRule = (ruleData) => {
    // 如果是全新类型，也将其加入 ruleTypes 字典中
    const typeExists = ruleTypes.value.some(t => t.value === ruleData.type)
    if (!typeExists) {
      ruleTypes.value.push({
        label: ruleData.type,
        value: ruleData.type,
        icon: 'Document'
      })
      // 同步保存类型(如果需要完全持久化，还可以将 ruleTypes 存在 localStorage 中，这里暂存内存演示)
    }

    const newRule = {
      id: Date.now(),
      name: ruleData.name,
      type: ruleData.type,
      description: ruleData.description || '',
      createdAt: new Date().toISOString().split('T')[0],
      scoringItems: ruleData.scoringItems || []
    }
    rules.value.push(newRule)
    saveToStorage()
    return newRule
  }

  // 更新规则
  const updateRule = (id, ruleData) => {
    // 检查是否存在新类型
    const typeExists = ruleTypes.value.some(t => t.value === ruleData.type)
    if (!typeExists) {
      ruleTypes.value.push({
        label: ruleData.type,
        value: ruleData.type,
        icon: 'Document'
      })
    }
    const index = rules.value.findIndex(rule => rule.id === id)
    if (index !== -1) {
      rules.value[index] = {
        ...rules.value[index],
        ...ruleData
      }
      saveToStorage()
      return true
    }
    return false
  }

  // 删除规则
  const deleteRule = (id) => {
    const index = rules.value.findIndex(rule => rule.id === id)
    if (index !== -1) {
      rules.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  // 添加评分项
  const addScoringItem = (ruleId, item) => {
    const rule = getRuleById(ruleId)
    if (rule) {
      const newItem = {
        id: Date.now(),
        indicator: item.indicator,
        level: item.level,
        score: item.score
      }
      rule.scoringItems.push(newItem)
      saveToStorage()
      return newItem
    }
    return null
  }

  // 更新评分项
  const updateScoringItem = (ruleId, itemId, itemData) => {
    const rule = getRuleById(ruleId)
    if (rule) {
      const itemIndex = rule.scoringItems.findIndex(item => item.id === itemId)
      if (itemIndex !== -1) {
        rule.scoringItems[itemIndex] = {
          ...rule.scoringItems[itemIndex],
          ...itemData
        }
        saveToStorage()
        return true
      }
    }
    return false
  }

  // 删除评分项
  const deleteScoringItem = (ruleId, itemId) => {
    const rule = getRuleById(ruleId)
    if (rule) {
      const itemIndex = rule.scoringItems.findIndex(item => item.id === itemId)
      if (itemIndex !== -1) {
        rule.scoringItems.splice(itemIndex, 1)
        saveToStorage()
        return true
      }
    }
    return false
  }

  // 保存到本地存储
  const saveToStorage = () => {
    localStorage.setItem('evaluationRules', JSON.stringify(rules.value))
    localStorage.setItem('evaluationRuleTypes', JSON.stringify(ruleTypes.value))
  }

  // 从本地存储加载
  const loadFromStorage = () => {
    const storedTypes = localStorage.getItem('evaluationRuleTypes')
    if (storedTypes) {
      try {
        ruleTypes.value = JSON.parse(storedTypes)
      } catch (e) {
        console.error('加载评价规则类型失败:', e)
      }
    }

    const stored = localStorage.getItem('evaluationRules')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Check if old schema exists (has authorOrder) to force overwrite with new schema
        const isOldSchema = parsed.length > 0 && parsed[0].scoringItems && parsed[0].scoringItems.length > 0 && parsed[0].scoringItems[0].authorOrder !== undefined
        if (isOldSchema) {
          localStorage.removeItem('evaluationRules')
          saveToStorage()
        } else {
          rules.value = parsed
        }
      } catch (e) {
        console.error('加载评价规则失败:', e)
      }
    } else {
      saveToStorage()
    }
  }

  // 初始化时加载数据
  loadFromStorage()

  return {
    rules,
    ruleTypes,
    getRulesByType,
    getRuleById,
    addRule,
    updateRule,
    deleteRule,
    addScoringItem,
    updateScoringItem,
    deleteScoringItem,
    saveToStorage,
    loadFromStorage
  }
})
