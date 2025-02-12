<template>
  <div class="photo-gallery" @wheel.ctrl.prevent="handleZoom">
    <div v-for="(group, date) in photoGroups" :key="date" class="date-group">
      <h2 class="date-header">{{ formatDate(date) }}</h2>
      <div
        class="photos-container"
        :style="{
          '--columns': columns,
          '--gap': computedGap + 'px',
        }"
      >
        <div
          v-for="photo in group"
          :key="photo.id"
          class="photo-item"
          :style="{
            backgroundImage: `url(${photo.url})`,
          }"
          @click="openPreview(photo)"
        ></div>
      </div>
    </div>
  </div>

  <!-- 预览模态框 -->
  <Teleport to="body">
    <div v-if="previewPhoto" class="preview-modal" @click="closePreview">
      <img :src="previewPhoto.url" alt="Preview" />
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

// 缩放级别状态
const zoomLevel = ref(1);
const columns = computed(() => Math.max(2, Math.floor(6 * zoomLevel.value)));
const previewPhoto = ref(null);

// 生成随机日期数据
const generateDates = (count) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

// 生成照片数据
const photoGroups = ref({});

const generatePhotos = () => {
  const dates = generateDates(5);
  dates.forEach((date) => {
    photoGroups.value[date] = Array(20)
      .fill(null)
      .map((_, index) => ({
        id: `${date}-${index}`,
        url: `/public/images/${index+1}.jpg`,//使用public内的图片
        date,
      }));
  });
};

// 处理缩放
const handleZoom = (event) => {
  const delta = event.deltaY > 0 ? 0.1 : -0.1;

  // 获取鼠标相对于视口的位置
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // 获取当前滚动位置
  const beforeScrollX = window.scrollX;
  const beforeScrollY = window.scrollY;

  // 获取鼠标相对于文档的位置
  const mouseDocX = mouseX + beforeScrollX;
  const mouseDocY = mouseY + beforeScrollY;

  // 计算缩放前鼠标位置与滚动位置的比例
  const ratioX = mouseDocX / document.documentElement.scrollWidth;
  const ratioY = mouseDocY / document.documentElement.scrollHeight;

  // 更新缩放级别
  const newZoom = Math.max(0.5, Math.min(8, zoomLevel.value + delta));
  zoomLevel.value = newZoom;

  // 等待 DOM 更新
  requestAnimationFrame(() => {
    // 计算新的滚动位置
    const newWidth = document.documentElement.scrollWidth;
    const newHeight = document.documentElement.scrollHeight;
    const newScrollX = newWidth * ratioX - mouseX;
    const newScrollY = newHeight * ratioY - mouseY;

    // 设置新的滚动位置
    window.scrollTo({
      left: newScrollX,
      top: newScrollY,
      behavior: "instant", // 使用即时滚动以避免动画
    });
  });
};

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
};

// 预览功能
const openPreview = (photo) => {
  previewPhoto.value = photo;
};

const closePreview = () => {
  previewPhoto.value = null;
};

// 组件挂载时生成数据
onMounted(() => {
  generatePhotos();
});

// 添加间距计算
const computedGap = computed(() => {
  // 当缩放级别为1时间距为8px，随着缩放增加线性减小到0px
  return Math.max(0, Math.round(8 * (2 - zoomLevel.value)));
});
</script>

<style scoped>
.photo-gallery {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.date-group {
  margin-bottom: 30px;
}

.date-header {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.photos-container {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: var(--gap);
  width: 100%;
  /* 添加网格布局的过渡效果 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.photo-item {
  background-size: cover;
  background-position: center;
  cursor: pointer;
  aspect-ratio: 1;
  width: 100%;
  /* 修改过渡效果，包含 transform 和 box-shadow */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.photo-item:hover {
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
}

.preview-modal img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}

/* 禁用默认的页面缩放 */
:root {
  touch-action: none;
}
</style>
