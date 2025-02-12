/**
 * 从日期字符串中获取年份
 * @param {string} date - 日期字符串
 * @returns {number} 年份
 */
export const getYearFromDate = (date) => {
  return new Date(date).getFullYear();
};

/**
 * 格式化分组标题
 * @param {string} groupKey - 分组键值
 * @returns {string} 格式化后的标题
 */
export const formatGroupHeader = (groupKey) => {
  if (groupKey.length === 4) {
    // 年份格式: YYYY
    return `${groupKey}年`;
  } else if (groupKey.includes('-W')) {
    // 周格式: YYYY-Wxx
    const [year, weekPart] = groupKey.split('-W');
    return `${year}年 第${weekPart}周`;
  } else if (groupKey.length === 7) {
    // 月份格式: YYYY-MM
    const date = new Date(groupKey + '-01');
    const monthFormatter = new Intl.DateTimeFormat("zh-CN", { month: "long" });
    return `${date.getFullYear()}年 ${monthFormatter.format(date)}`;
  } else {
    // 日期格式: YYYY-MM-DD
    const date = new Date(groupKey);
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "long"
    });
    return `${date.getFullYear()}年 ${formatter.format(date)}`;
  }
};
