<template>
  <div class="home-view">
    <h1 class="text-gradient">Welcome Home</h1>
    <div class="content-card">
      <p>This is the main content area with subtle animations</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

/**
 * 首页视图组件
 */
onMounted(() => {
  console.log('HomeView mounted')
})
</script>

<style scoped>
.home-view {
  padding: 20px;
  height: 100%;
}

.text-gradient {
  background: linear-gradient(45deg, var(--primary-color), #67c23a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: textScale 1.5s ease-in-out infinite alternate;
}

.content-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.content-card:hover {
  transform: translateY(-5px);
}

@keyframes textScale {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}
</style>
