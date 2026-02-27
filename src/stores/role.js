import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRoleStore = defineStore('role', () => {
  // 从本地存储加载角色（初始化时自动加载）
  const saved = localStorage.getItem('currentRole')
  const currentRole = ref(saved || null)

  // 从本地存储加载角色
  function loadRole() {
    const saved = localStorage.getItem('currentRole')
    if (saved) {
      currentRole.value = saved
    }
  }

  // 设置角色
  function setRole(role) {
    currentRole.value = role
    localStorage.setItem('currentRole', role)
  }

  // 切换角色
  function switchRole(role) {
    setRole(role)
  }

  // 清除角色
  function clearRole() {
    currentRole.value = null
    localStorage.removeItem('currentRole')
  }

  return {
    currentRole,
    loadRole,
    setRole,
    switchRole,
    clearRole
  }
})
