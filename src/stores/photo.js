import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getPhotosByGranularity } from '../api/photo';
import { formatGroupKey } from '../utils/dateFormatter';

// 常量定义
export const GROUP_BY = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

// 加载配置
const LOAD_DAYS = {
  [GROUP_BY.DAY]: 7,      // 一周
  [GROUP_BY.WEEK]: 30,    // 一个月
  [GROUP_BY.MONTH]: 90,   // 三个月
  [GROUP_BY.YEAR]: 365,   // 一年
};

export const usePhotoStore = defineStore('photo', () => {
  // 状态
  const photos = ref([]);              
  const currentDate = ref(new Date());
  const hasMore = ref(true);          
  const groupingMethod = ref(GROUP_BY.DAY);
  const loading = ref(false);         
  const loadedDates = ref(new Set()); // 新增已加载日期记录

  // 日期工具函数
  const dateUtils = {
    generateDates(endDate, days) {
      const dates = [];
      const start = new Date(endDate);
      start.setDate(start.getDate() - days + 1);
      
      for (let d = new Date(start); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
      }
      return dates;
    }
  };

  // Actions
  const resetLoadState = () => {
    currentDate.value = new Date();
    hasMore.value = true;
    loading.value = false;
    photos.value = [];
    loadedDates.value.clear(); // 重置时清空已加载记录
  };
  const fetchPhotos = async (isInitial = false) => {
    if (loading.value || !hasMore.value) return;
    
    loading.value = true;
    try {
      const days = LOAD_DAYS[groupingMethod.value];
      // 生成当前请求的日期范围
      const datesToLoad = dateUtils.generateDates(
        currentDate.value, 
        days
      ).filter(date => !loadedDates.value.has(date)); // 过滤已加载日期
      
      if (datesToLoad.length === 0) {
        hasMore.value = false;
        return;
      }

      const { photos: newPhotos, metadata } = await getPhotosByGranularity({
        granularity: groupingMethod.value,
        endDate: currentDate.value,
        days
      });

      // 记录已加载的日期
      datesToLoad.forEach(date => loadedDates.value.add(date));

      // 处理元数据
      photos.value = isInitial 
        ? newPhotos.map(photo => ({
            ...photo,
            timestamp: new Date(photo.date).getTime(),
            metadata: metadata[photo.id] || {}
          }))
        : [
            ...photos.value,
            ...newPhotos.map(photo => ({
              ...photo,
              timestamp: new Date(photo.originalDate || photo.date).getTime(),
              metadata: metadata[photo.id] || {}
            }))
          ].sort((a, b) => a.timestamp - b.timestamp);

      // 更新当前日期
      if (newPhotos.length > 0) {
        const lastDate = new Date(currentDate.value);
        
        // 根据时间粒度和配置天数递减日期
        const daysToSubtract = LOAD_DAYS[groupingMethod.value];
        switch(groupingMethod.value) {
          case GROUP_BY.DAY:
            lastDate.setDate(lastDate.getDate() - daysToSubtract);
            break;
          case GROUP_BY.WEEK:
            lastDate.setDate(lastDate.getDate() - daysToSubtract);
            break;
          case GROUP_BY.MONTH:
            lastDate.setMonth(lastDate.getMonth() - Math.floor(daysToSubtract/30));
            break;
          case GROUP_BY.YEAR:
            lastDate.setFullYear(lastDate.getFullYear() - Math.floor(daysToSubtract/365));
            break;
          default:
            lastDate.setDate(lastDate.getDate() - 1);
        }
        
        currentDate.value = lastDate;
      } else {
        hasMore.value = false;
      }
    } finally {
      loading.value = false;
    }
  };

  const setGroupingMethod = (method) => {
    if (Object.values(GROUP_BY).includes(method)) {
      groupingMethod.value = method;
    }
  };

  const getGroupedPhotos = () => {
    // 使用API返回的分组元数据
    const groups = {};
    
    photos.value.forEach(photo => {
      // Ensure groupKey is a valid string
      let groupKey = photo.metadata.groupKey;
      if (typeof groupKey !== 'string') {
        groupKey = String(groupKey || '');
      }
      
      // Use default groupKey if empty
      if (!groupKey) {
        groupKey = '未分类';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          period: groupKey,
          photos: [],
          metadata: {
            count: 0,
            firstPhoto: null,
            lastPhoto: null
          }
        };
      }
      
      groups[groupKey].photos.push(photo);
      groups[groupKey].metadata.count++;
      
      if (!groups[groupKey].metadata.firstPhoto || 
          photo.timestamp < groups[groupKey].metadata.firstPhoto.timestamp) {
        groups[groupKey].metadata.firstPhoto = photo;
      }
      
      if (!groups[groupKey].metadata.lastPhoto || 
          photo.timestamp > groups[groupKey].metadata.lastPhoto.timestamp) {
        groups[groupKey].metadata.lastPhoto = photo;
      }
    });
    
    return Object.values(groups).sort((a, b) => 
      a.metadata.firstPhoto.timestamp - b.metadata.firstPhoto.timestamp
    );
  };

  return {
    photos,
    hasMore,
    loading,
    groupingMethod,
    fetchPhotos,
    setGroupingMethod,
    getGroupedPhotos,
    resetLoadState,
  };
});
