// 模拟延迟
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 生成指定日期范围内的模拟照片数据
const generatePhotosByDate = (startDate, endDate) => {
  const photos = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const date = currentDate.toISOString().split('T')[0];
    // 每天随机1-5张照片
    const count = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < count; i++) {
      photos.push({
        id: `${date}-${i}`,
        url: `/images/${Math.floor(Math.random() * 50) + 1}.jpg`,
        date,
        timestamp: new Date(date).getTime()
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return photos;
};

// 模拟API调用 - 按天获取照片
export async function getDayPhotos(endDate, days) {
  await delay(300); // 模拟网络延迟
  const start = new Date(endDate);
  start.setDate(start.getDate() - days + 1);
  console.log("start", start, "end", endDate);
  return generatePhotosByDate(start, endDate);
}

// 模拟API调用 - 按周获取照片
export async function getWeekPhotos(endDate, weeks) {
  await delay(300);
  const start = new Date(endDate);
  start.setDate(start.getDate() - weeks * 7 + 1);
  return generatePhotosByDate(start, endDate);
}

// 模拟API调用 - 按月获取照片
export async function getMonthPhotos(endDate, months) {
  await delay(300);
  const start = new Date(endDate);
  start.setMonth(start.getMonth() - months + 1);
  return generatePhotosByDate(start, endDate);
}

// 模拟API调用 - 按年获取照片
export async function getYearPhotos(endDate, years) {
  await delay(300);
  const start = new Date(endDate);
  start.setFullYear(start.getFullYear() - years + 1);
  return generatePhotosByDate(start, endDate);
}
