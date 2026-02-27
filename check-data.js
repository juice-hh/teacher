// 检查 localStorage 数据
console.log('=== 检查评价材料数据 ===')
const materials = localStorage.getItem('evaluationMaterials')
console.log('localStorage 数据:', materials)
if (materials) {
  const parsed = JSON.parse(materials)
  console.log('解析后数据:', parsed)
  console.log('数据条数:', parsed.length)
}
