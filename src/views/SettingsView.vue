<template>
  <div class="settings-view">
    <h2 class="section-title">主题设置</h2>
    <div class="color-picker-group">
      <label>主题颜色：</label>
      <input type="color" :value="themeColor" @input="updateThemeColor($event.target.value)">
    </div>

    <div class="settings-card">
      <h3 class="card-title">界面偏好</h3>
      <div class="form-item">
        <label>菜单动画速度</label>
        <select v-model="animationSpeed">
          <option value="fast">快速</option>
          <option value="normal">正常</option>
          <option value="slow">慢速</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const themeColor = ref(themeStore.primaryColor)
const animationSpeed = ref('normal')

const updateThemeColor = (color) => {
  themeStore.setPrimaryColor(color)
  themeColor.value = color
}
</script>

<style scoped>
.settings-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  color: var(--text-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
}

.settings-card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 1.5rem;
}

.card-title {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.form-item {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-picker-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  
  input[type="color"] {
    width: 40px;
    height: 40px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
  }
}

select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text-color);
}
</style>
