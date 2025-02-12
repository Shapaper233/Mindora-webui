<template>
  <div class="photos-container" :style="gridStyle">
    <div
      v-for="photo in photos"
      :key="photo.id"
      class="photo-item"
      :style="{ backgroundImage: `url(${photo.url})` }"
      @click="$emit('preview', photo)"
    >
      <img 
        :src="photo.url" 
        :alt="photo.id"
        loading="lazy"
        class="hidden"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props定义
const props = defineProps({
  // 照片数组
  photos: {
    type: Array,
    required: true
  },
  // 缩放级别
  zoomLevel: {
    type: Number,
    required: true
  }
});

// 事件定义
defineEmits(['preview']);

// 网格配置常量
const GRID_CONFIG = {
  MIN_COLUMNS: 2,      // 最小列数
  BASE_COLUMNS: 6,     // 基础列数
  BASE_GAP: 8         // 基础间距(px)
};

// 计算列数
const columns = computed(() => 
  Math.max(GRID_CONFIG.MIN_COLUMNS, Math.floor(GRID_CONFIG.BASE_COLUMNS * props.zoomLevel))
);

// 计算网格间距
const computedGap = computed(() => 
  Math.max(0, Math.round(GRID_CONFIG.BASE_GAP * (2 - props.zoomLevel)))
);

// 计算网格样式
const gridStyle = computed(() => ({
  '--columns': columns.value,
  '--gap': computedGap.value + 'px',
}));
</script>

<style scoped>
.photos-container {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: var(--gap);
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.photo-item {
  background-size: cover;
  background-position: center;
  cursor: pointer;
  aspect-ratio: 1;
  width: 100%;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.photo-item:hover {
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hidden {
  display: none;
}
</style>
