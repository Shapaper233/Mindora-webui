import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getDayPhotos, getWeekPhotos, getMonthPhotos, getYearPhotos } from '../api/photo';

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
    },

    getWeekKey(date) {
      const d = new Date(date);
      const yearStart = new Date(d.getFullYear(), 0, 1);
      const weekNumber = Math.ceil(((d - yearStart) / 86400000 + yearStart.getDay() + 1) / 7);
      return `${d.getFullYear()}-W${weekNumber}`;
    },

    getMonthKey(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    },

    getYearKey(date) {
      const d = new Date(date);
      return `${d.getFullYear()}`;
    },

    // 获取日期键值的时间戳（用于排序）
    getKeyTimestamp(key, groupBy) {
      switch (groupBy) {
        case GROUP_BY.DAY:
          return new Date(key).getTime();
        case GROUP_BY.WEEK:
          const [year, week] = key.split('-W');
          const timestamp = new Date(year);
          timestamp.setDate(timestamp.getDate() + (week - 1) * 7);
          return timestamp.getTime();
        case GROUP_BY.MONTH:
          return new Date(key + '-01').getTime();
        case GROUP_BY.YEAR:
          return new Date(key + '-01-01').getTime();
        default:
          return 0;
      }
    }
  };

  // Actions
  const resetLoadState = () => {
    currentDate.value = new Date();
    hasMore.value = true;
    loading.value = false;
    photos.value = [];
  };
  const fetchPhotos = async (isInitial = false) => {
    if (loading.value || !hasMore.value) return;
    
    loading.value = true;
    try {
      let newPhotos;
      const params = isInitial ? 1 : Math.ceil(LOAD_DAYS[groupingMethod.value] / 30);

      switch (groupingMethod.value) {
        case GROUP_BY.DAY:
          newPhotos = await getDayPhotos(currentDate.value, LOAD_DAYS[GROUP_BY.DAY]);
          break;
        case GROUP_BY.WEEK:
          newPhotos = await getWeekPhotos(currentDate.value, params);
          break;
        case GROUP_BY.MONTH:
          newPhotos = await getMonthPhotos(currentDate.value, params);
          break;
        case GROUP_BY.YEAR:
          newPhotos = await getYearPhotos(currentDate.value, params);
          break;
        default:
          newPhotos = await getDayPhotos(currentDate.value, LOAD_DAYS[GROUP_BY.DAY]);
      }

      photos.value = isInitial 
        ? newPhotos
        : [...photos.value, ...newPhotos].sort((a, b) => a.timestamp - b.timestamp);

      // Update current date based on loaded photos
      const oldestPhoto = [...newPhotos].sort((a, b) => a.timestamp - b.timestamp)[0];
      if (oldestPhoto) {
        currentDate.value = new Date(oldestPhoto.date);
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
    const grouped = {};
    
    // 按分组方式对照片进行分组
    photos.value.forEach(photo => {
      let key;
      switch (groupingMethod.value) {
        case GROUP_BY.WEEK:
          key = dateUtils.getWeekKey(photo.date);
          break;
        case GROUP_BY.MONTH:
          key = dateUtils.getMonthKey(photo.date);
          break;
        case GROUP_BY.YEAR:
          key = dateUtils.getYearKey(photo.date);
          break;
        default: // GROUP_BY.DAY
          key = photo.date;
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(photo);
    });

    // 确保每个分组内的照片按时间戳正序排列
    Object.values(grouped).forEach(group => {
      group.sort((a, b) => a.timestamp - b.timestamp);
    });

    // 将分组按日期键值倒序排列
    const sortedGrouped = Object.fromEntries(
      Object.entries(grouped).sort(([keyA], [keyB]) => {
        const timestampA = dateUtils.getKeyTimestamp(keyA, groupingMethod.value);
        const timestampB = dateUtils.getKeyTimestamp(keyB, groupingMethod.value);
        return timestampA - timestampB;
      })
    );

    return sortedGrouped;
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
