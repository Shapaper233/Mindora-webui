<template>
  <div class="timeline-container">
    <!-- 时间轴导航 -->
    <div class="timeline-nav">
      <!-- 缩放控制区 -->
      <div class="zoom-controls">
        <span class="zoom-level">{{ currentGrouping }}</span>
      </div>
    </div>

    <!-- 照片展示区 -->
    <div class="gallery-container">
      <div
        ref="galleryRef"
        class="photo-gallery"
        @wheel.ctrl.prevent="handleZoom"
        @scroll="throttledHandleScroll"
      >
        <!-- 加载指示器 -->
        <div v-if="loading" class="loading">加载中...</div>

        <!-- 按日期分组的照片列表 -->
        <div v-for="(group, groupKey) in groupedPhotos" :key="groupKey" class="date-group">
          <h2 class="date-header">{{ formatGroupHeader(groupKey) }}</h2>
          <PhotoGrid
            :photos="group"
            :zoom-level="zoomLevel"
            @preview="openPreview"
          />
        </div>

        <!-- 底部提示 -->
        <div v-if="!hasMore" class="end-message">没有更多照片了</div>
      </div>
    </div>
  </div>

  <!-- 照片预览模态框 -->
  <Teleport to="body">
    <div v-if="previewPhoto" class="preview-modal" @click="closePreview">
      <img :src="previewPhoto.url" alt="Preview" />
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { usePhotoStore, GROUP_BY } from '../stores/photo';
import { throttle } from 'lodash-es';
import PhotoGrid from '../components/PhotoGrid.vue';
import { formatGroupHeader } from '../utils/dateFormatter';

// 缩放配置常量
const ZOOM_CONFIG = {
  MIN: 0.5,       // 最小缩放级别
  MAX: 8,         // 最大缩放级别
  STEP: 0.1,      // 缩放步长
  DEFAULT: 1      // 默认缩放级别
};

// 状态管理
const zoomLevel = ref(ZOOM_CONFIG.DEFAULT);
const previewPhoto = ref(null);
const galleryRef = ref(null);

// Store相关
const photoStore = usePhotoStore();
const { photos, fetchPhotos, hasMore, loading, setGroupingMethod } = photoStore;

const currentGrouping = computed(() => {
  // 根据缩放级别返回中文分组方式
  if (zoomLevel.value <= 2) return '按天';
  if (zoomLevel.value <= 3) return '按周';
  if (zoomLevel.value <= 5) return '按月';
  return '按年';
});

// 监听缩放级别变化以更新分组方式
watch(zoomLevel, (newZoom) => {
  if (newZoom <= 2) {
    setGroupingMethod(GROUP_BY.DAY);
  } else if (newZoom <= 3) {
    setGroupingMethod(GROUP_BY.WEEK);
  } else if (newZoom <= 5) {
    setGroupingMethod(GROUP_BY.MONTH);
  } else {
    setGroupingMethod(GROUP_BY.YEAR);
  }
});

// 获取分组后的照片数据
const groupedPhotos = computed(() => {
  return photoStore.getGroupedPhotos();
});

// 缩放处理
const handleZoom = (event) => {
  const delta = event.deltaY > 0 ? ZOOM_CONFIG.STEP : -ZOOM_CONFIG.STEP;
  const gallery = galleryRef.value;
  const mousePos = {
    x: event.clientX,
    y: event.clientY - gallery.offsetTop
  };
  const scrollPos = {
    x: gallery.scrollLeft,
    y: gallery.scrollTop
  };
  const containerSize = {
    width: gallery.scrollWidth,
    height: gallery.scrollHeight
  };

  // 计算位置比例
  const ratio = {
    x: (mousePos.x + scrollPos.x) / containerSize.width,
    y: (mousePos.y + scrollPos.y) / containerSize.height
  };

  // 更新缩放级别
  zoomLevel.value = Math.max(
    ZOOM_CONFIG.MIN,
    Math.min(ZOOM_CONFIG.MAX, zoomLevel.value + delta)
  );

  // 在DOM更新后调整滚动位置
  nextTick(() => {
    const newSize = {
      width: gallery.scrollWidth,
      height: gallery.scrollHeight
    };
    
    gallery.scrollTo({
      left: newSize.width * ratio.x - mousePos.x,
      top: newSize.height * ratio.y - mousePos.y,
      behavior: "instant"
    });
  });
};

// 照片预览相关方法
const openPreview = (photo) => {
  previewPhoto.value = photo;
};

const closePreview = () => {
  previewPhoto.value = null;
};

// 滚动加载处理
const handleScroll = async (e) => {
  if (!galleryRef.value) return;
  
  const gallery = galleryRef.value;
  const scrollTop = gallery.scrollTop;
  const scrollHeight = gallery.scrollHeight;
  const clientHeight = gallery.clientHeight;
  // 当滚动到顶部100px范围内时加载更多照片
  if (scrollTop < 100 && !loading && hasMore) {
    console.log('loading more photos...');
    await fetchPhotos();
    // 防止滚动位置跳动
    await nextTick();
    const heightDiff = gallery.scrollHeight - scrollHeight;
    if (heightDiff > 0) {
      gallery.scrollTop = scrollTop + heightDiff;
    }
  }
};

const throttledHandleScroll = throttle(handleScroll, 200);

// 生命周期钩子
onMounted(async () => {
  await fetchPhotos(true);
  // 等待DOM更新后滚动到底部
  await nextTick();
  if (galleryRef.value) {
    galleryRef.value.scrollTop = galleryRef.value.scrollHeight;
  }
  // 初始化后立即手动触发一次滚动检查，以防初始内容不足以出现滚动条
  handleScroll({ target: galleryRef.value });
});

// 监听分组方式变化
watch(
  () => photoStore.groupingMethod,
  async (newMethod) => {
  photoStore.resetLoadState();
  await fetchPhotos(true);
  // 重置后也需要检查一次滚动状态
  handleScroll({ target: galleryRef.value });
});
</script>

<style scoped>
.timeline-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.timeline-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
}

.zoom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-level {
  font-size: 14px;
  color: #666;
  padding: 4px 12px;
  border-radius: 4px;
  background: #f5f5f5;
}

.gallery-container {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.photo-gallery {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.date-group {
  margin-bottom: 30px;
}

.date-header {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
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

.loading {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 1000;
}

.end-message {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

:root {
  touch-action: none;
}
</style>
