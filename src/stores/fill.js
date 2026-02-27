import { defineStore } from 'pinia'

export const useFillStore = defineStore('fill', {
    state: () => ({
        isInitialized: false,
        taskInfo: {
            id: null,
            name: '',
            period: '',
            status: 'pending',
            deadline: ''
        },
        indicators: []
    }),

    actions: {
        init(taskId) {
            if (this.isInitialized && this.taskInfo.id === taskId) {
                return; // Already initialized for this task
            }

            this.taskInfo = {
                id: taskId,
                name: '2024年春季学期综合素养评价',
                period: '2024年春季学期',
                status: 'pending',
                deadline: '2024-06-30'
            }

            this.indicators = [
                {
                    id: 1,
                    primaryName: '师德师风',
                    name: '遵纪守法',
                    score: 10,
                    scoringRule: '严格遵守国家法律法规及学校各项规章制度。无违法违纪行为得满分；有一次违纪扣5分。',
                    scoringRuleType: 'attendance',
                    materialRequirement: '年度无违纪记录证明（系统自动提取）',
                    selectedIndicator: '',
                    selectedLevel: '',
                    selfScore: null,
                    notes: '',
                    files: []
                },
                {
                    id: 2,
                    primaryName: '教育教学',
                    name: '教学设计与实施',
                    score: 20,
                    scoringRule: '教案完整、环节合理得满分。无教案扣20分；缺环节扣5分/次。',
                    scoringRuleType: 'open_class',
                    materialRequirement: '提交本学期至少一份完整的优秀教案设计文档。',
                    selectedIndicator: '',
                    selectedLevel: '',
                    selfScore: null,
                    notes: '',
                    files: []
                },
                {
                    id: 3,
                    primaryName: '教育科研',
                    name: '论文评比',
                    score: 5,
                    scoringRule: '国家级一等奖8分，二等奖7分；省级一等奖7分...',
                    scoringRuleType: 'paper',
                    materialRequirement: '提交获奖证书扫描件。',
                    selectedIndicator: '',
                    selectedLevel: '',
                    selfScore: null,
                    notes: '',
                    files: []
                }
            ]

            this.isInitialized = true
        },

        updateIndicatorFill(indicatorId, fillData) {
            const index = this.indicators.findIndex(item => item.id === parseInt(indicatorId))
            if (index !== -1) {
                this.indicators[index] = { ...this.indicators[index], ...fillData }
            }
        },

        getIndicatorById(indicatorId) {
            return this.indicators.find(item => item.id === parseInt(indicatorId))
        },

        clear() {
            this.isInitialized = false
            this.taskInfo = {
                id: null,
                name: '',
                period: '',
                status: 'pending',
                deadline: ''
            }
            this.indicators = []
        }
    }
})
