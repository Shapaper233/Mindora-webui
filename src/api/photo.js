// 模拟延迟
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 图片元数据
const PHOTO_METADATA = {
  location: 'Unknown', // 拍摄地点
  device: 'Unknown',   // 拍摄设备
  size: 'Unknown',     // 文件大小
  resolution: 'Unknown' // 分辨率
};

// 生成指定日期范围内的模拟照片数据
const generatePhotosByDate = (startDate, endDate) => {
    const photos = [];
  // 确保日期参数正确解析
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  // 修复日期范围错误
  if (currentDate > end) {
    [currentDate, end] = [end, currentDate];
  }

  while (currentDate <= end) {
    const date = currentDate.toISOString().split('T')[0];
    // 每天随机1-5张照片
    const count = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < count; i++) {
      photos.push({
        id: `${date}-${i}`,
        url: `/images/${Math.floor(Math.random() * 50) + 1}.jpg`,
        date,
        timestamp: new Date(date).getTime(),
        metadata: {
          //...PHOTO_METADATA,
          // 随机生成一些元数据
          location: `Location ${Math.floor(Math.random() * 10) + 1}`,
          device: `Device ${Math.floor(Math.random() * 5) + 1}`,
          size: `${Math.floor(Math.random() * 10) + 1}MB`,
          resolution: `${Math.floor(Math.random() * 4000) + 1000}x${Math.floor(Math.random() * 3000) + 1000}`
        }
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return photos;
};

// 统一的照片获取函数
export async function getPhotos(endDate, days) {
  await delay(300); // 模拟网络延迟
  const start = new Date(endDate);
  start.setDate(start.getDate() - days + 1);
  return generatePhotosByDate(start, endDate);
}

// 按时间粒度获取照片
export async function getPhotosByGranularity({ granularity, endDate, days }) {
  // 使用正确的日期范围
  const adjustedEndDate = new Date(endDate);
  const allPhotos = await getPhotos(adjustedEndDate, days);
  
  // 为每张照片添加分组元数据
  const photosWithMetadata = allPhotos.map(photo => {
    const date = new Date(photo.timestamp);
    let groupKey;
    
    switch (granularity) {
      case 'year':
        groupKey = date.getFullYear();
        break;
      case 'month':
        groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'week': {
        // 添加周粒度处理
        const year = date.getFullYear();
        const onejan = new Date(year, 0, 1);
        const weekNumber = Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
        groupKey = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
        break;
      }
      case 'day':
        groupKey = photo.date;
        break;
      default:
        groupKey = 'all';
    }

    return {
      ...photo,
      metadata: {
        ...photo.metadata,
        groupKey
      }
    };
  });

  // 生成照片元数据映射
  const metadata = photosWithMetadata.reduce((acc, photo) => {
    acc[photo.id] = photo.metadata;
    return acc;
  }, {});

  return {
    photos: photosWithMetadata,
    metadata
  };
}
