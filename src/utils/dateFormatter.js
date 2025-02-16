export function formatGroupKey(dateString, granularity) {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };

  // 获取中国时区配置
  const zhOptions = { timeZone: 'Asia/Shanghai', ...options };

  switch(granularity) {
    case 'day':
      return date.toLocaleDateString('zh-CN', zhOptions);
    case 'week': {
      const year = date.getFullYear();
      const firstDayOfYear = new Date(year, 0, 1);
      const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
      const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
      return `${year}年 第${weekNumber}周`;
    }
    case 'month':
      return date.toLocaleDateString('zh-CN', { 
        ...zhOptions, 
        month: 'long', 
        day: undefined 
      }).replace('日', '');
    case 'year':
      return `${date.getFullYear()}年`;
    default:
      return date.toLocaleDateString('zh-CN', zhOptions);
  }
}
