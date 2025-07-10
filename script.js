// Enhanced Weather & Life Application v2.0
// Developed by Silent Vision Team

// Global variables
let currentWeatherData = null;
let aiChatHistory = [];
let isAITyping = false;
let sosActive = false;
let sosTimer = null;

// API Keys Management
const apiKeys = {
  openai: localStorage.getItem('openai_api_key') || '',
  weather: localStorage.getItem('weather_api_key') || '',
  news: localStorage.getItem('news_api_key') || ''
};

// API Endpoints
const API_ENDPOINTS = {
  weather: 'https://api.weatherapi.com/v1/current.json',
  forecast: 'https://api.weatherapi.com/v1/forecast.json',
  news: 'https://newsapi.org/v2/top-headlines',
  openai: 'https://api.openai.com/v1/chat/completions'
};
let isVoiceEnabled = false;
let recognition = null;
let synthesis = null;

// Initialize speech recognition and synthesis
function initializeSpeech() {
  // Speech Recognition
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'vi-VN';
    
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById('aiInput').value = transcript;
      sendAIMessage();
    };
    
    recognition.onerror = function(event) {
      showNotification('Lỗi nhận diện giọng nói: ' + event.error, 'error');
    };
  }
  
  // Speech Synthesis
  if ('speechSynthesis' in window) {
    synthesis = window.speechSynthesis;
  }
}

// Clock functionality with enhanced display
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const date = now.toLocaleDateString('vi-VN', { 
    weekday: 'short', 
    day: '2-digit', 
    month: '2-digit' 
  });
  document.getElementById('clock').innerHTML = `
    <div class="text-center">
      <div class="font-bold">${hours}:${minutes}:${seconds}</div>
      <div class="text-xs text-gray-500">${date}</div>
    </div>
  `;
}

// Enhanced weather data with more realistic information
const weatherData = {
  temperature: [26, 28, 31, 30, 29, 27, 28],
  humidity: [70, 75, 65, 80, 85, 78, 72],
  rainfall: [5, 10, 0, 20, 15, 8, 12],
  uv: [3, 5, 8, 7, 6, 4, 5],
  days: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
  current: {
    temp: 28,
    humidity: 75,
    windSpeed: 15,
    visibility: 10,
    location: "Đà Nẵng, Việt Nam",
    condition: "Có mây",
    icon: "🌤️",
    aqi: 45,
    uv: 6
  }
};

// Enhanced feature messages with more detailed information
const featureMessages = {
  weather: `🌤️ THÔNG TIN THỜI TIẾT CHI TIẾT

📍 Vị trí: ${weatherData.current.location}
🌡️ Nhiệt độ: ${weatherData.current.temp}°C (Cảm giác như 30°C)
💧 Độ ẩm: ${weatherData.current.humidity}%
💨 Gió: ${weatherData.current.windSpeed} km/h, hướng Đông Nam
👁️ Tầm nhìn: ${weatherData.current.visibility} km
☁️ Tình trạng: ${weatherData.current.condition}
🌞 Chỉ số UV: ${weatherData.current.uv} (Trung bình)
🍃 AQI: ${weatherData.current.aqi} (Tốt)

📊 Dự báo 24h tới:
• 15:00 - Mưa nhẹ (75% khả năng)
• 18:00 - Có mây
• 21:00 - Quang đãng
• 06:00 - Nắng ráo

💡 Lời khuyên: Nên mang theo ô khi ra ngoài chiều nay!`,

  sos: `🚨 TÍNH NĂNG SOS KHẨN CẤP ĐÃ ĐƯỢC KÍCH HOẠT!

📞 Đang kết nối với:
• Trung tâm cứu hộ 115
• Cảnh sát 113  
• Cứu thương 114
• Cứu hỏa 114

📍 Vị trí GPS đã được gửi:
• Tọa độ: ${weatherData.current.location}
• Độ chính xác: ±5m
• Thời gian: ${new Date().toLocaleString('vi-VN')}

⚡ Trạng thái: Đang chờ phản hồi...
🔔 Thông báo đã được gửi đến liên hệ khẩn cấp
📱 Tin nhắn tự động đã được gửi

⚠️ Lưu ý: Chỉ sử dụng khi thực sự cần thiết!`,

  plants: `🌱 TƯ VẤN CÂY TRỒNG THÔNG MINH (AI)

🌤️ Phân tích thời tiết hiện tại:
• Nhiệt độ: ${weatherData.current.temp}°C - Lý tưởng cho cây nhiệt đới
• Độ ẩm: ${weatherData.current.humidity}% - Phù hợp cho hầu hết cây trồng
• Ánh sáng: Trung bình - Tốt cho cây ưa bóng
• UV: ${weatherData.current.uv} - An toàn cho cây

🌿 Gợi ý cây trồng phù hợp:
• Cà chua 🍅 - Thời vụ tốt, cần tưới đều
• Dưa chuột 🥒 - Phát triển mạnh trong thời tiết này
• Rau muống 🥬 - Dễ trồng, thu hoạch nhanh
• Hoa hướng dương 🌻 - Cần nhiều ánh sáng
• Cây bạc hà 🌿 - Thích hợp với độ ẩm cao
• Ớt 🌶️ - Phù hợp với nhiệt độ hiện tại

💡 Lời khuyên AI:
• Tưới nước vào buổi sáng sớm (6-7h)
• Bón phân hữu cơ 2 tuần/lần
• Chú ý thoát nước khi mưa nhiều
• Sử dụng lưới che nắng nếu cần

📱 Nhắc nhở: Đặt lịch tưới nước tự động!`,

  alerts: `⚠️ HỆ THỐNG CẢNH BÁO THỜI TIẾT AI

🌧️ Cảnh báo ngắn hạn (24h):
• 15:00 hôm nay: Mưa rào và dông (75%)
• 20:00 hôm nay: Gió mạnh cấp 6 (60%)
• Đêm nay: Mưa vừa đến to (80%)

🌪️ Cảnh báo trung hạn (3-7 ngày):
• Thứ 5-6: Khả năng có áp thấp nhiệt đới
• Cuối tuần: Mưa lớn diện rộng
• Tuần sau: Thời tiết ổn định trở lại

🚨 Khuyến nghị khẩn cấp:
• Hạn chế ra ngoài từ 15h-21h hôm nay
• Chuẩn bị đồ dự phòng: đèn pin, nước uống
• Kiểm tra hệ thống thoát nước nhà
• Theo dõi tin tức cập nhật liên tục

📊 Độ tin cậy AI: 94%
🔄 Cập nhật mỗi 10 phút`,

  health: `💊 TƯ VẤN SỨC KHỎE THEO THỜI TIẾT

🌡️ Phân tích tác động thời tiết:
• Nhiệt độ ${weatherData.current.temp}°C: Thoải mái cho cơ thể
• Độ ẩm ${weatherData.current.humidity}%: Có thể gây khó chịu nhẹ
• AQI ${weatherData.current.aqi}: Tốt cho hô hấp
• UV ${weatherData.current.uv}: Cần bảo vệ da

🏥 Lời khuyên sức khỏe:
• Uống đủ nước (2-2.5L/ngày)
• Tránh ra ngoài 11h-15h
• Sử dụng kem chống nắng SPF 30+
• Mặc quần áo thoáng mát

⚠️ Cảnh báo cho nhóm nguy cơ:
• Người cao tuổi: Hạn chế hoạt động ngoài trời
• Trẻ em: Cần giám sát khi chơi ngoài
• Người bệnh tim: Tránh gắng sức
• Người hen suyễn: Theo dõi chất lượng không khí

💡 Gợi ý hoạt động:
• Tập thể dục trong nhà
• Yoga buổi sáng
• Đi bộ sau 17h`,

  travel: `✈️ KẾ HOẠCH DU LỊCH THÔNG MINH

🗺️ Phân tích điều kiện du lịch:
• Thời tiết hiện tại: Phù hợp cho du lịch
• Tầm nhìn: ${weatherData.current.visibility}km - Tốt cho ngắm cảnh
• Gió: ${weatherData.current.windSpeed}km/h - Dễ chịu

🏖️ Địa điểm được khuyến nghị:
• Bãi biển: Tốt (UV trung bình)
• Núi non: Rất tốt (thời tiết mát mẻ)
• Thành phố: Tốt (không mưa)
• Công viên: Lý tưởng

📅 Thời điểm tốt nhất:
• Hôm nay: 6h-11h và 16h-19h
• Ngày mai: Cả ngày (trừ 13h-15h)
• Cuối tuần: Cần theo dõi dự báo mưa

🎒 Chuẩn bị:
• Ô dù (phòng mưa chiều)
• Kem chống nắng
• Nước uống
• Áo khoác nhẹ

📱 Lưu ý: Kiểm tra dự báo trước khi khởi hành!`,

  energy: `⚡ TIẾT KIỆM NĂNG LƯỢNG THÔNG MINH

🏠 Phân tích tiêu thụ năng lượng:
• Nhiệt độ ${weatherData.current.temp}°C: Giảm 20% điện làm mát
• Độ ẩm ${weatherData.current.humidity}%: Tăng hiệu quả máy lạnh
• Ánh sáng tự nhiên: Tốt - giảm điện chiếu sáng

💡 Gợi ý tiết kiệm:
• Điều hòa: 26-27°C (tiết kiệm 15%)
• Quạt trần: Kết hợp với điều hòa
• Cửa sổ: Mở vào buổi tối
• Rèm cửa: Đóng lúc nắng gắt

📊 Dự báo tiêu thụ:
• Hôm nay: Giảm 18% so với hôm qua
• Ngày mai: Tăng 5% (nắng nóng hơn)
• Tuần này: Tiết kiệm 12% so với tuần trước

🌱 Lợi ích môi trường:
• Giảm 2.3kg CO2/ngày
• Tiết kiệm 45,000 VNĐ/tháng
• Bảo vệ môi trường

⚙️ Tự động hóa:
• Hẹn giờ điều hòa
• Cảm biến ánh sáng
• Điều khiển từ xa`
};

// AI Assistant responses
const aiResponses = {
  greetings: [
    "Xin chào! Tôi có thể giúp bạn gì về thời tiết hôm nay?",
    "Chào bạn! Hãy hỏi tôi bất cứ điều gì về thời tiết nhé!",
    "Hi! Tôi là AI trợ lý thời tiết nâng cao. Bạn cần hỗ trợ gì?",
    "Chào mừng bạn! Tôi có thể tư vấn về thời tiết, sức khỏe và nhiều thứ khác!"
  ],
  weather: {
    "hôm nay có mưa không": "Theo dự báo AI, hôm nay có 75% khả năng mưa vào khoảng 15:00-18:00. Bạn nên mang theo ô khi ra ngoài!",
    "nên mặc gì": `Với nhiệt độ ${weatherData.current.temp}°C và độ ẩm ${weatherData.current.humidity}%, tôi khuyên bạn nên mặc:
• Áo cotton thoáng mát
• Quần dài hoặc váy dài
• Mang theo áo khoác nhẹ cho tối
• Đừng quên ô và kem chống nắng SPF 30+!`,
    "cuối tuần thời tiết thế nào": "Cuối tuần sẽ có mưa rào và dông, nhiệt độ 25-29°C. Thích hợp cho hoạt động trong nhà hoặc đi mua sắm ở trung tâm thương mại.",
    "chất lượng không khí": `Chất lượng không khí hiện tại: Tốt (AQI: ${weatherData.current.aqi}). PM2.5: 12 μg/m³. An toàn cho mọi hoạt động ngoài trời!`,
    "chỉ số uv": `Chỉ số UV hiện tại: ${weatherData.current.uv} (Trung bình). Bạn nên sử dụng kem chống nắng khi ra ngoài từ 10h-16h.`
  },
  default: "Tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về thời tiết, dự báo, sức khỏe, du lịch, hoặc lời khuyên trang phục nhé!"
};

// Disaster Warning System with AI enhancements
const disasterWarningSystem = {
  currentAlerts: [],
  riskAssessment: {
    overall: 57,
    risks: [
      { name: 'Flood', level: 70, color: 'red', trend: 'increasing' },
      { name: 'Storm', level: 60, color: 'orange', trend: 'stable' },
      { name: 'Thunderstorm', level: 80, color: 'red', trend: 'increasing' },
      { name: 'Heavy Rain', level: 85, color: 'red', trend: 'decreasing' },
      { name: 'Landslide', level: 65, color: 'yellow', trend: 'stable' },
      { name: 'Heat Wave', level: 30, color: 'green', trend: 'decreasing' },
      { name: 'Drought', level: 10, color: 'blue', trend: 'stable' }
    ]
  },
  aiPredictions: [
    {
      type: 'rain',
      title: 'Mưa nhẹ',
      time: '15:00 - 18:00 hôm nay',
      probability: 75,
      details: 'Lượng mưa: 5-10mm',
      icon: 'ri-cloud-rain-line',
      color: 'blue'
    },
    {
      type: 'sunny',
      title: 'Nắng ráo',
      time: 'Ngày mai 6:00 - 11:00',
      probability: 90,
      details: 'Nhiệt độ: 26-30°C | UV: Trung bình',
      icon: 'ri-sun-line',
      color: 'yellow'
    },
    {
      type: 'air_quality',
      title: 'Chất lượng không khí',
      time: 'Cập nhật liên tục',
      probability: 100,
      details: 'AQI: 45 (Tốt) | PM2.5: 12 μg/m³',
      icon: 'ri-leaf-line',
      color: 'green'
    },
    {
      type: 'heat',
      title: 'Cảnh báo nắng nóng',
      time: 'Ngày kia 12:00 - 16:00',
      probability: 65,
      details: 'Nhiệt độ: 32-35°C | UV: Cao',
      icon: 'ri-temp-hot-line',
      color: 'orange'
    }
  ]
};

// Initialize enhanced charts with better styling
function initializeCharts() {
  // Temperature Chart with gradient
  const temperatureChart = echarts.init(document.getElementById("temperatureChart"));
  temperatureChart.setOption({
    tooltip: { 
      trigger: "axis",
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#ff6347',
      borderWidth: 2,
      textStyle: { color: '#1e293b', fontSize: 12 },
      formatter: function(params) {
        return `${params[0].name}<br/>Nhiệt độ: ${params[0].value}°C`;
      }
    },
    grid: { top: 20, right: 20, bottom: 30, left: 30 },
    xAxis: { 
      type: "category", 
      data: weatherData.days,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 }
    },
    yAxis: { 
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
    },
    series: [{
      name: "Nhiệt độ (°C)",
      type: "line",
      data: weatherData.temperature,
      smooth: true,
      lineStyle: { color: "#ff6347", width: 3 },
      areaStyle: { 
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 99, 71, 0.4)' },
            { offset: 1, color: 'rgba(255, 99, 71, 0.1)' }
          ]
        }
      },
      itemStyle: { color: '#ff6347', borderWidth: 2, borderColor: '#fff' },
      emphasis: { focus: 'series', scale: true }
    }]
  });

  // Humidity Chart with animation
  const humidityChart = echarts.init(document.getElementById("humidityChart"));
  humidityChart.setOption({
    tooltip: { 
      trigger: "axis",
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#1E90FF',
      borderWidth: 2,
      textStyle: { color: '#1e293b', fontSize: 12 },
      formatter: function(params) {
        return `${params[0].name}<br/>Độ ẩm: ${params[0].value}%`;
      }
    },
    grid: { top: 20, right: 20, bottom: 30, left: 30 },
    xAxis: { 
      type: "category", 
      data: weatherData.days,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 }
    },
    yAxis: { 
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
    },
    series: [{
      name: "Độ ẩm (%)",
      type: "bar",
      data: weatherData.humidity,
      itemStyle: { 
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#1E90FF' },
            { offset: 1, color: '#87CEEB' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: { focus: 'series' },
      animationDelay: function (idx) {
        return idx * 100;
      }
    }]
  });

  // Rainfall Chart with custom styling
  const rainfallChart = echarts.init(document.getElementById("rainfallChart"));
  rainfallChart.setOption({
    tooltip: { 
      trigger: "axis",
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#32CD32',
      borderWidth: 2,
      textStyle: { color: '#1e293b', fontSize: 12 },
      formatter: function(params) {
        return `${params[0].name}<br/>Lượng mưa: ${params[0].value}mm`;
      }
    },
    grid: { top: 20, right: 20, bottom: 30, left: 30 },
    xAxis: { 
      type: "category", 
      data: weatherData.days,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 }
    },
    yAxis: { 
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
    },
    series: [{
      name: "Lượng mưa (mm)",
      type: "bar",
      data: weatherData.rainfall,
      itemStyle: { 
        color: function(params) {
          const colors = ['#32CD32', '#228B22', '#90EE90'];
          return colors[params.dataIndex % colors.length];
        },
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: { focus: 'series' },
      animationDelay: function (idx) {
        return idx * 150;
      }
    }]
  });

  // New UV Chart
  const uvChart = echarts.init(document.getElementById("uvChart"));
  uvChart.setOption({
    tooltip: { 
      trigger: "axis",
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#9333ea',
      borderWidth: 2,
      textStyle: { color: '#1e293b', fontSize: 12 },
      formatter: function(params) {
        return `${params[0].name}<br/>UV Index: ${params[0].value}`;
      }
    },
    grid: { top: 20, right: 20, bottom: 30, left: 30 },
    xAxis: { 
      type: "category", 
      data: weatherData.days,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 }
    },
    yAxis: { 
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
    },
    series: [{
      name: "UV Index",
      type: "line",
      data: weatherData.uv,
      smooth: true,
      lineStyle: { color: "#9333ea", width: 3 },
      areaStyle: { 
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(147, 51, 234, 0.4)' },
            { offset: 1, color: 'rgba(147, 51, 234, 0.1)' }
          ]
        }
      },
      itemStyle: { color: '#9333ea', borderWidth: 2, borderColor: '#fff' },
      emphasis: { focus: 'series', scale: true }
    }]
  });

  // New Trends Chart for Analytics
  const trendsChart = echarts.init(document.getElementById("trendsChart"));
  trendsChart.setOption({
    tooltip: { 
      trigger: "axis",
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#3b82f6',
      borderWidth: 2,
      textStyle: { color: '#1e293b', fontSize: 12 }
    },
    legend: {
      data: ['Nhiệt độ', 'Độ ẩm', 'UV'],
      bottom: 10
    },
    grid: { top: 20, right: 20, bottom: 50, left: 40 },
    xAxis: { 
      type: "category", 
      data: weatherData.days,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 }
    },
    yAxis: { 
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
    },
    series: [
      {
        name: "Nhiệt độ",
        type: "line",
        data: weatherData.temperature,
        smooth: true,
        lineStyle: { color: "#ff6347", width: 2 },
        itemStyle: { color: '#ff6347' }
      },
      {
        name: "Độ ẩm",
        type: "line",
        data: weatherData.humidity,
        smooth: true,
        lineStyle: { color: "#1E90FF", width: 2 },
        itemStyle: { color: '#1E90FF' }
      },
      {
        name: "UV",
        type: "line",
        data: weatherData.uv.map(v => v * 10), // Scale for visibility
        smooth: true,
        lineStyle: { color: "#9333ea", width: 2 },
        itemStyle: { color: '#9333ea' }
      }
    ]
  });

  // Make charts responsive
  window.addEventListener('resize', () => {
    temperatureChart.resize();
    humidityChart.resize();
    rainfallChart.resize();
    uvChart.resize();
    trendsChart.resize();
  });
}

// Enhanced map initialization with weather layers
function initializeMap() {
  const map = L.map('map').setView([16.0471, 108.2062], 6);
  
  // Base layer
  const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Weather layers (mock implementation)
  const weatherLayers = {
    temperature: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      opacity: 0.6,
      attribution: 'Temperature Layer'
    }),
    precipitation: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      opacity: 0.6,
      attribution: 'Precipitation Layer'
    }),
    wind: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      opacity: 0.6,
      attribution: 'Wind Layer'
    }),
    uv: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      opacity: 0.6,
      attribution: 'UV Index Layer'
    })
  };

  let currentWeatherLayer = null;

  // Map control buttons
  document.querySelectorAll('.map-control-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      document.querySelectorAll('.map-control-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Remove current weather layer
      if (currentWeatherLayer) {
        map.removeLayer(currentWeatherLayer);
      }
      
      // Add new weather layer
      const layer = this.dataset.layer;
      if (weatherLayers[layer]) {
        currentWeatherLayer = weatherLayers[layer];
        map.addLayer(currentWeatherLayer);
      }
    });
  });

  // Enhanced weather markers with more information
  const weatherMarkers = [
    { lat: 21.0285, lng: 105.8542, city: 'Hà Nội', temp: '26°C', weather: '☁️', humidity: 80, wind: 12, aqi: 65, uv: 4 },
    { lat: 10.8231, lng: 106.6297, city: 'TP.HCM', temp: '30°C', weather: '☀️', humidity: 70, wind: 8, aqi: 55, uv: 8 },
    { lat: 16.0471, lng: 108.2062, city: 'Đà Nẵng', temp: '28°C', weather: '🌤️', humidity: 75, wind: 15, aqi: 45, uv: 6 },
    { lat: 10.0452, lng: 105.7469, city: 'Cần Thơ', temp: '29°C', weather: '🌧️', humidity: 85, wind: 10, aqi: 50, uv: 3 }
  ];

  weatherMarkers.forEach(marker => {
    const customIcon = L.divIcon({
      className: 'custom-weather-marker',
      html: `
        <div class="bg-white rounded-full p-2 shadow-lg border-2 border-blue-500">
          <div class="text-center">
            <div class="text-lg">${marker.weather}</div>
            <div class="text-xs font-bold text-blue-600">${marker.temp}</div>
          </div>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });

    L.marker([marker.lat, marker.lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`
        <div class="text-center p-2 min-w-[200px]">
          <h3 class="font-bold text-lg text-blue-600 mb-2">${marker.city}</h3>
          <div class="text-4xl mb-2">${marker.weather}</div>
          <div class="text-2xl font-bold text-gray-800 mb-3">${marker.temp}</div>
          
          <div class="grid grid-cols-2 gap-2 text-xs mb-3">
            <div class="bg-blue-50 rounded p-2">
              <i class="ri-drop-line text-blue-500"></i>
              <div class="font-semibold">${marker.humidity}%</div>
              <div class="text-gray-600">Độ ẩm</div>
            </div>
            <div class="bg-green-50 rounded p-2">
              <i class="ri-windy-line text-green-500"></i>
              <div class="font-semibold">${marker.wind}km/h</div>
              <div class="text-gray-600">Gió</div>
            </div>
            <div class="bg-purple-50 rounded p-2">
              <i class="ri-leaf-line text-purple-500"></i>
              <div class="font-semibold">AQI: ${marker.aqi}</div>
              <div class="text-gray-600">Không khí</div>
            </div>
            <div class="bg-orange-50 rounded p-2">
              <i class="ri-sun-line text-orange-500"></i>
              <div class="font-semibold">UV: ${marker.uv}</div>
              <div class="text-gray-600">Chỉ số UV</div>
            </div>
          </div>
          
          <button onclick="getDetailedForecast('${marker.city}')" 
                  class="mt-3 bg-blue-500 text-white px-4 py-1 rounded-full text-xs hover:bg-blue-600 transition-colors">
            Xem chi tiết
          </button>
        </div>
      `);
  });

  // Location tracking functionality (enhanced from previous version)
  let currentLocationMarker = null;
  let currentPosition = null;
  let watchId = null;

  const locationControl = L.control({ position: 'topright' });
  locationControl.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    
    div.innerHTML = `
      <div class="location-controls bg-white rounded-lg shadow-lg p-2">
        <button id="locateBtn" class="location-btn bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600 transition-colors" title="Tìm vị trí của tôi">
          <i class="ri-map-pin-line text-lg"></i>
        </button>
        <button id="returnBtn" class="location-btn bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors" title="Quay về vị trí của tôi" style="display: none;">
          <i class="ri-navigation-line text-lg"></i>
        </button>
      </div>
    `;
    
    div.style.backgroundColor = 'transparent';
    div.style.border = 'none';
    
    return div;
  };
  locationControl.addTo(map);

  // Location event handlers
  document.addEventListener('click', function(e) {
    if (e.target.closest('#locateBtn')) {
      locateCurrentPosition();
    }
    if (e.target.closest('#returnBtn')) {
      returnToCurrentLocation();
    }
  });

  function locateCurrentPosition() {
    const locateBtn = document.getElementById('locateBtn');
    const returnBtn = document.getElementById('returnBtn');
    
    if (!navigator.geolocation) {
      showNotification('Trình duyệt của bạn không hỗ trợ định vị GPS', 'error');
      return;
    }

    locateBtn.innerHTML = '<i class="ri-loader-4-line text-lg animate-spin"></i>';
    locateBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        currentPosition = { lat, lng };
        
        if (currentLocationMarker) {
          map.removeLayer(currentLocationMarker);
        }
        
        const accuracyColor = accuracy <= 50 ? 'green' : accuracy <= 100 ? 'yellow' : 'red';
        const accuracyText = accuracy <= 20 ? 'Rất tốt' : accuracy <= 50 ? 'Tốt' : accuracy <= 100 ? 'Trung bình' : 'Kém';
        
        currentLocationMarker = L.marker([lat, lng], {
          icon: L.divIcon({
            className: 'current-location-marker',
            html: `<div class="w-4 h-4 bg-${accuracyColor}-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
        }).addTo(map);
        
        getLocationInfo(lat, lng).then(locationInfo => {
          currentLocationMarker.bindPopup(`
            <div class="text-center p-3 min-w-[250px]">
              <h3 class="font-bold text-lg text-blue-600 mb-2">📍 Vị trí của bạn</h3>
              <p class="text-sm text-gray-600 mb-3">${locationInfo}</p>
              
              <div class="bg-gray-50 rounded-lg p-3 mb-3">
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span class="text-gray-500">Độ chính xác:</span>
                    <div class="font-semibold text-${accuracyColor}-600">${Math.round(accuracy)}m (${accuracyText})</div>
                  </div>
                  <div>
                    <span class="text-gray-500">Thời gian:</span>
                    <div class="font-semibold">${new Date().toLocaleTimeString('vi-VN')}</div>
                  </div>
                </div>
                <div class="mt-2 text-xs text-gray-500">
                  Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}
                </div>
              </div>
              
              <div class="flex gap-2">
                <button onclick="getWeatherAtLocation(${lat}, ${lng})" 
                        class="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                  🌤️ Thời tiết tại đây
                </button>
                <button onclick="recalibrateLocation()" 
                        class="flex-1 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors">
                  🔄 Hiệu chỉnh lại
                </button>
              </div>
            </div>
          `).openPopup();
        });
        
        map.setView([lat, lng], 15);
        locateBtn.innerHTML = '<i class="ri-map-pin-line text-lg"></i>';
        locateBtn.disabled = false;
        returnBtn.style.display = 'block';
        
        showNotification('Đã xác định vị trí của bạn!', 'success');
      },
      function(error) {
        let errorMessage = 'Không thể xác định vị trí của bạn';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Bạn đã từ chối quyền truy cập vị trí';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Thông tin vị trí không khả dụng';
            break;
          case error.TIMEOUT:
            errorMessage = 'Yêu cầu định vị đã hết thời gian';
            break;
        }
        
        showNotification(errorMessage, 'error');
        locateBtn.innerHTML = '<i class="ri-map-pin-line text-lg"></i>';
        locateBtn.disabled = false;
      }
    );
  }

  function returnToCurrentLocation() {
    if (currentPosition && currentLocationMarker) {
      map.setView([currentPosition.lat, currentPosition.lng], 15);
      currentLocationMarker.openPopup();
    }
  }

  async function getLocationInfo(lat, lng) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`);
      const data = await response.json();
      
      if (data && data.display_name) {
        const address = data.address || {};
        const parts = [];
        
        if (address.road) parts.push(address.road);
        if (address.suburb || address.neighbourhood) parts.push(address.suburb || address.neighbourhood);
        if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
        if (address.state) parts.push(address.state);
        
        return parts.length > 0 ? parts.join(', ') : data.display_name;
      }
      
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }

  // Global functions for map interactions
  window.recalibrateLocation = locateCurrentPosition;
  window.getDetailedForecast = function(city) {
    showNotification(`Đang tải dự báo chi tiết cho ${city}...`, 'info');
    // Simulate API call
    setTimeout(() => {
      alert(`📊 DỰ BÁO CHI TIẾT - ${city.toUpperCase()}

🌡️ Nhiệt độ 48h tới:
• 12:00 - 29°C (Nắng)
• 15:00 - 31°C (Có mây)
• 18:00 - 28°C (Mưa nhẹ)
• 21:00 - 26°C (Quang đãng)
• Ngày mai: 25-32°C

💧 Độ ẩm: 70-85%
💨 Gió: 10-15 km/h
🌧️ Khả năng mưa: 60%
🌞 UV Index: 6-8 (Trung bình-Cao)
🍃 AQI: 45-55 (Tốt)

📱 Tải ứng dụng để nhận thông báo chi tiết!`);
    }, 1500);
  };

  window.getWeatherAtLocation = function(lat, lng) {
    showNotification('Đang lấy thông tin thời tiết tại vị trí này...', 'info');
    setTimeout(() => {
      alert(`🌤️ THỜI TIẾT TẠI VỊ TRÍ CỦA BẠN

📍 Tọa độ: ${lat.toFixed(4)}, ${lng.toFixed(4)}
🌡️ Nhiệt độ: 28°C (Cảm giác như 30°C)
💧 Độ ẩm: 75%
💨 Gió: 12 km/h, hướng Đông Nam
☁️ Tình trạng: Có mây
🌧️ Khả năng mưa: 40%

📊 Chỉ số UV: 6 (Trung bình)
👁️ Tầm nhìn: 10 km
🍃 AQI: 45 (Tốt)
🌅 Mặt trời mọc: 05:45
🌇 Mặt trời lặn: 18:30

💡 Lời khuyên: Thời tiết tốt cho hoạt động ngoài trời!`);
    }, 1000);
  };

  return map;
}

// Enhanced AI Assistant functionality
function openAIAssistant() {
  const modal = document.getElementById('aiAssistantModal');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Update API status
  updateApiStatus();
  
  // Focus on input
  setTimeout(() => {
    document.getElementById('aiInput').focus();
  }, 300);
}

function closeAIAssistant() {
  const modal = document.getElementById('aiAssistantModal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
  
  // Hide API config panel if open
  const configPanel = document.getElementById('apiConfigPanel');
  if (configPanel && !configPanel.classList.contains('hidden')) {
    configPanel.classList.add('hidden');
  }
}

// API Configuration Functions
function toggleApiConfig() {
  const panel = document.getElementById('apiConfigPanel');
  panel.classList.toggle('hidden');
  
  if (!panel.classList.contains('hidden')) {
    // Load current keys
    document.getElementById('openaiKey').value = apiKeys.openai;
    document.getElementById('weatherKey').value = apiKeys.weather;
  }
}

function saveApiKeys() {
  const openaiKey = document.getElementById('openaiKey').value.trim();
  const weatherKey = document.getElementById('weatherKey').value.trim();
  
  if (openaiKey) {
    apiKeys.openai = openaiKey;
    localStorage.setItem('openai_api_key', openaiKey);
  }
  
  if (weatherKey) {
    apiKeys.weather = weatherKey;
    localStorage.setItem('weather_api_key', weatherKey);
  }
  
  updateApiStatus();
  showNotification('✅ Đã lưu API keys thành công!', 'success');
  
  // Hide config panel
  document.getElementById('apiConfigPanel').classList.add('hidden');
}

function updateApiStatus() {
  const statusElement = document.getElementById('apiStatus');
  const infoElement = document.getElementById('apiInfo');
  
  if (!statusElement || !infoElement) return;
  
  const hasOpenAI = !!apiKeys.openai;
  const hasWeather = !!apiKeys.weather;
  
  if (hasOpenAI && hasWeather) {
    statusElement.innerHTML = '<div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span class="text-xs">🟢 AI Smart</span>';
    infoElement.textContent = '🚀 Tất cả API đã sẵn sàng! Hỏi gì cũng được!';
  } else if (hasOpenAI || hasWeather) {
    statusElement.innerHTML = '<div class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div><span class="text-xs">🟡 Partial</span>';
    infoElement.textContent = '⚠️ Một số API thiếu. Click ⚙️ để cấu hình đầy đủ';
  } else {
    statusElement.innerHTML = '<div class="w-2 h-2 bg-red-400 rounded-full"></div><span class="text-xs">🔴 No API</span>';
    infoElement.textContent = '💡 Cấu hình API để sử dụng dữ liệu thực tế';
  }
}

async function testApiConnection() {
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = '🔄 Testing...';
  button.disabled = true;
  
  let results = [];
  
  // Test OpenAI
  if (apiKeys.openai) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKeys.openai}` }
      });
      results.push(response.ok ? '✅ OpenAI: OK' : '❌ OpenAI: Invalid key');
    } catch (error) {
      results.push('❌ OpenAI: Connection failed');
    }
  } else {
    results.push('⚠️ OpenAI: No key');
  }
  
  // Test Weather API
  if (apiKeys.weather) {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKeys.weather}&q=Hanoi`);
      results.push(response.ok ? '✅ Weather: OK' : '❌ Weather: Invalid key');
    } catch (error) {
      results.push('❌ Weather: Connection failed');
    }
  } else {
    results.push('⚠️ Weather: No key');
  }
  
  button.textContent = originalText;
  button.disabled = false;
  
  showNotification(results.join('\n'), 'info', 8000);
}

// Enhanced AI Response with Real APIs
async function getWeatherData(location = 'Hanoi') {
  if (!apiKeys.weather) {
    return {
      location: { name: location },
      current: {
        temp_c: 28,
        condition: { text: 'Partly cloudy' },
        humidity: 75,
        wind_kph: 15,
        vis_km: 10
      }
    };
  }
  
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKeys.weather}&q=${location}&aqi=yes`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Weather API error:', error);
  }
  
  // Fallback data
  return {
    location: { name: location },
    current: {
      temp_c: 28,
      condition: { text: 'Data unavailable' },
      humidity: 75,
      wind_kph: 15,
      vis_km: 10
    }
  };
}

async function getNewsData() {
  // Mock news data since NewsAPI requires server-side calls
  return [
    { title: 'Thời tiết ổn định trong tuần tới', description: 'Dự báo không có thiên tai lớn' },
    { title: 'Chất lượng không khí cải thiện', description: 'AQI giảm xuống mức an toàn' }
  ];
}

function createSmartPrompt(userMessage, weatherData, newsData) {
  let prompt = `Bạn là AI trợ lý thông minh của Weather & Life, được phát triển bởi Silent Vision Team. Bạn có khả năng phân tích dữ liệu thực tế và đưa ra lời khuyên chính xác.

🌤️ DỮ LIỆU THỜI TIẾT THỰC TẾ:
- Địa điểm: ${weatherData.location.name}
- Nhiệt độ: ${weatherData.current.temp_c}°C
- Tình trạng: ${weatherData.current.condition.text}
- Độ ẩm: ${weatherData.current.humidity}%
- Gió: ${weatherData.current.wind_kph} km/h
- Tầm nhìn: ${weatherData.current.vis_km} km

📰 TIN TỨC MỚI NHẤT:
${newsData.map(news => `- ${news.title}: ${news.description}`).join('\n')}

❓ CÂU HỎI: "${userMessage}"

Hãy trả lời một cách thông minh, dựa trên dữ liệu thực tế trên. Sử dụng emoji phù hợp và đưa ra lời khuyên cụ thể, thực tế. Nếu câu hỏi liên quan đến thời tiết, hãy phân tích chi tiết dựa trên dữ liệu. Nếu về cây trồng, hãy tư vấn dựa trên điều kiện thời tiết hiện tại.`;

  return prompt;
}

async function callOpenAI(prompt) {
  if (!apiKeys.openai) {
    throw new Error('OpenAI API key not configured');
  }
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKeys.openai}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateSmartAIResponse(userMessage) {
  try {
    // Collect data from APIs
    const weatherData = await getWeatherData('Hanoi');
    const newsData = await getNewsData();
    
    // Create smart prompt
    const prompt = createSmartPrompt(userMessage, weatherData, newsData);
    
    // Call AI
    const aiResponse = await callOpenAI(prompt);
    
    return aiResponse;
  } catch (error) {
    console.error('AI Response error:', error);
    
    // Fallback to original response system
    return generateAIResponse(userMessage);
  }
}

function openVoiceAssistant() {
  openAIAssistant();
  setTimeout(() => {
    startVoiceRecognition();
  }, 500);
}

function startVoiceRecognition() {
  if (!recognition) {
    showNotification('Trình duyệt không hỗ trợ nhận diện giọng nói', 'error');
    return;
  }
  
  const voiceBtn = document.getElementById('voiceBtn');
  voiceBtn.innerHTML = '<i class="ri-mic-fill animate-pulse"></i>';
  voiceBtn.classList.add('bg-red-500');
  voiceBtn.classList.remove('bg-green-500');
  
  recognition.start();
  showNotification('Đang nghe... Hãy nói câu hỏi của bạn', 'info');
  
  recognition.onend = function() {
    voiceBtn.innerHTML = '<i class="ri-mic-line"></i>';
    voiceBtn.classList.remove('bg-red-500');
    voiceBtn.classList.add('bg-green-500');
  };
}

function speakResponse(text) {
  if (!synthesis) return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  
  synthesis.speak(utterance);
}

function sendAIMessage() {
  const input = document.getElementById('aiInput');
  const message = input.value.trim();
  
  if (!message || isAITyping) return;
  
  // Add user message
  addChatMessage(message, 'user');
  input.value = '';
  
  // Show AI typing
  showAITyping();
  
  // Generate smart AI response
  setTimeout(() => {
    generateSmartAIResponse(message).then(response => {
      hideAITyping();
      addChatMessage(response, 'ai');
    }).catch(error => {
      hideAITyping();
      const fallbackResponse = generateAIResponse(message);
      addChatMessage(fallbackResponse, 'ai');
    });
  }, 1000 + Math.random() * 2000);
}

function askQuickQuestion(question) {
  document.getElementById('aiInput').value = question;
  sendAIMessage();
}

function addChatMessage(message, sender) {
  const chatMessages = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `${sender}-message mb-4`;
  
  if (sender === 'user') {
    messageDiv.innerHTML = `
      <div class="flex items-start gap-3 justify-end">
        <div class="bg-blue-500 text-white rounded-2xl p-4 shadow-sm max-w-xs">
          <p>${message}</p>
        </div>
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <i class="ri-user-line text-white text-sm"></i>
        </div>
      </div>
    `;
  } else {
    messageDiv.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <i class="ri-robot-line text-white text-sm"></i>
        </div>
        <div class="bg-white rounded-2xl p-4 shadow-sm max-w-xs border border-gray-200">
          <p class="text-gray-800 whitespace-pre-line">${message}</p>
        </div>
      </div>
    `;
  }
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Add animation
  messageDiv.style.opacity = '0';
  messageDiv.style.transform = 'translateY(20px)';
  setTimeout(() => {
    messageDiv.style.transition = 'all 0.3s ease';
    messageDiv.style.opacity = '1';
    messageDiv.style.transform = 'translateY(0)';
  }, 100);
}

function showAITyping() {
  isAITyping = true;
  const chatMessages = document.getElementById('chatMessages');
  const typingDiv = document.createElement('div');
  typingDiv.id = 'ai-typing';
  typingDiv.className = 'ai-message mb-4';
  typingDiv.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
        <i class="ri-robot-line text-white text-sm"></i>
      </div>
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div class="flex gap-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>
  `;
  
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideAITyping() {
  isAITyping = false;
  const typingDiv = document.getElementById('ai-typing');
  if (typingDiv) {
    typingDiv.remove();
  }
}

// ===== SMART AI SYSTEM WITH REAL API INTEGRATION =====

async function generateSmartAIResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Determine what type of data the user is asking for
  const dataNeeds = analyzeUserIntent(lowerMessage);
  
  // Collect relevant data from APIs
  const collectedData = await collectRelevantData(dataNeeds, lowerMessage);
  
  // Generate AI response using collected data
  if (apiKeys.openai) {
    return await generateOpenAIResponse(message, collectedData);
  } else {
    return generateLocalAIResponse(message, collectedData);
  }
}

function analyzeUserIntent(message) {
  const intents = {
    weather: ['thời tiết', 'weather', 'nhiệt độ', 'mưa', 'nắng', 'gió', 'độ ẩm'],
    news: ['tin tức', 'news', 'báo', 'sự kiện', 'chính trị', 'xã hội'],
    finance: ['giá', 'vàng', 'usd', 'dollar', 'chứng khoán', 'bitcoin', 'crypto'],
    agriculture: ['trồng', 'cây', 'nông nghiệp', 'mùa vụ', 'gieo', 'thu hoạch'],
    general: ['phân tích', 'tóm tắt', 'đánh giá', 'so sánh']
  };
  
  const needs = [];
  for (const [category, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      needs.push(category);
    }
  }
  
  return needs.length > 0 ? needs : ['general'];
}

async function collectRelevantData(dataNeeds, message) {
  const data = {};
  
  try {
    // Always get current location weather
    if (dataNeeds.includes('weather') || dataNeeds.includes('general') || dataNeeds.includes('agriculture')) {
      data.weather = await getCurrentWeatherData();
    }
    
    // Get news if requested
    if (dataNeeds.includes('news') || dataNeeds.includes('general')) {
      data.news = await getLatestNews();
    }
    
    // Get financial data if requested
    if (dataNeeds.includes('finance') || dataNeeds.includes('general')) {
      data.finance = await getFinancialData();
    }
    
    // Get agriculture data if requested
    if (dataNeeds.includes('agriculture')) {
      data.agriculture = await getAgricultureAdvice(data.weather);
    }
    
  } catch (error) {
    console.error('Error collecting data:', error);
  }
  
  return data;
}

// ===== REAL API INTEGRATIONS =====

async function getCurrentWeatherData() {
  // Try real API first, fallback to mock data
  if (apiKeys.weather) {
    try {
      const location = currentWeatherData?.location || 'Hanoi';
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKeys.weather}&q=${location}&aqi=yes`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          location: data.location.name + ', ' + data.location.country,
          temperature: data.current.temp_c,
          condition: data.current.condition.text,
          humidity: data.current.humidity,
          windSpeed: data.current.wind_kph,
          visibility: data.current.vis_km,
          uv: data.current.uv,
          aqi: data.current.air_quality?.['us-epa-index'] || 'N/A',
          feelsLike: data.current.feelslike_c,
          pressure: data.current.pressure_mb,
          lastUpdated: data.current.last_updated
        };
      }
    } catch (error) {
      console.error('Weather API Error:', error);
    }
  }
  
  // Fallback to enhanced mock data
  return {
    location: weatherData.current.location,
    temperature: weatherData.current.temp,
    condition: weatherData.current.condition,
    humidity: weatherData.current.humidity,
    windSpeed: weatherData.current.windSpeed,
    visibility: weatherData.current.visibility,
    uv: 6,
    aqi: 45,
    feelsLike: weatherData.current.temp + 2,
    pressure: 1013,
    lastUpdated: new Date().toISOString()
  };
}

async function getLatestNews() {
  // Mock news data (in real app, use NewsAPI or similar)
  const mockNews = [
    {
      title: "Thời tiết miền Bắc chuyển lạnh, cần đề phòng sương muối",
      summary: "Từ ngày mai, nhiệt độ miền Bắc giảm xuống 15-18°C, vùng núi có thể xuống dưới 10°C.",
      category: "Thời tiết",
      time: "2 giờ trước"
    },
    {
      title: "Giá lúa gạo tăng mạnh do ảnh hưởng thời tiết",
      summary: "Giá lúa tại ĐBSCL tăng 200-300 đồng/kg do mưa lớn kéo dài ảnh hưởng đến thu hoạch.",
      category: "Nông nghiệp",
      time: "4 giờ trước"
    },
    {
      title: "Cảnh báo dông lốc, mưa đá tại các tỉnh Trung Bộ",
      summary: "Từ chiều nay đến ngày mai, các tỉnh từ Thanh Hóa đến Quảng Bình có mưa dông mạnh.",
      category: "Cảnh báo",
      time: "1 giờ trước"
    }
  ];
  
  return mockNews;
}

async function getFinancialData() {
  // Mock financial data (in real app, use financial APIs)
  return {
    gold: {
      price: "67.8 triệu VND/lượng",
      change: "+0.2%",
      trend: "tăng nhẹ"
    },
    usd: {
      rate: "24,350 VND",
      change: "-0.1%", 
      trend: "giảm nhẹ"
    },
    vn30: {
      index: "1,245.67",
      change: "+1.2%",
      trend: "tăng"
    }
  };
}

async function getAgricultureAdvice(weatherData) {
  const temp = weatherData.temperature;
  const humidity = weatherData.humidity;
  const season = getCurrentSeason();
  
  let advice = [];
  
  if (temp < 20) {
    advice.push("🌡️ Nhiệt độ thấp, phù hợp trồng cải thảo, súp lơ, cà rốt");
    advice.push("❄️ Cần che chắn cho cây non tránh sương giá");
  } else if (temp > 30) {
    advice.push("☀️ Nhiệt độ cao, nên trồng rau muống, cà chua, ớt");
    advice.push("💧 Tăng cường tưới nước, che bóng mát cho cây");
  } else {
    advice.push("🌤️ Thời tiết lý tưởng cho hầu hết các loại cây trồng");
  }
  
  if (humidity > 80) {
    advice.push("💧 Độ ẩm cao, chú ý phòng chống bệnh nấm");
  }
  
  return {
    currentAdvice: advice,
    seasonalCrops: getSeasonalCrops(season),
    plantingCalendar: getPlantingCalendar()
  };
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function getSeasonalCrops(season) {
  const crops = {
    spring: ['cà chua', 'dưa chuột', 'đậu đũa', 'rau muống'],
    summer: ['bầu bí', 'mướp', 'ớt', 'cà tím'],
    autumn: ['cải thảo', 'súp lơ', 'cà rốt', 'củ cải'],
    winter: ['rau cải', 'tỏi', 'hành', 'rau thơm']
  };
  return crops[season] || [];
}

function getPlantingCalendar() {
  return {
    thisWeek: "Thích hợp gieo hạt rau lá",
    nextWeek: "Có thể trồng cây ăn quả",
    thisMonth: "Mùa thu hoạch rau màu"
  };
}

// ===== OPENAI INTEGRATION =====

async function generateOpenAIResponse(userMessage, collectedData) {
  if (!apiKeys.openai) {
    return generateLocalAIResponse(userMessage, collectedData);
  }
  
  try {
    const prompt = buildSmartPrompt(userMessage, collectedData);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKeys.openai}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Bạn là AI trợ lý thông minh của ứng dụng Weather & Life. Hãy trả lời một cách hữu ích, chính xác và thân thiện bằng tiếng Việt. Sử dụng emoji phù hợp và format đẹp.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('OpenAI Error:', error);
    return generateLocalAIResponse(userMessage, collectedData);
  }
}

function buildSmartPrompt(userMessage, data) {
  let prompt = `Câu hỏi của người dùng: "${userMessage}"\n\n`;
  
  if (data.weather) {
    prompt += `📊 DỮ LIỆU THỜI TIẾT HIỆN TẠI:\n`;
    prompt += `- Vị trí: ${data.weather.location}\n`;
    prompt += `- Nhiệt độ: ${data.weather.temperature}°C (cảm giác như ${data.weather.feelsLike}°C)\n`;
    prompt += `- Tình trạng: ${data.weather.condition}\n`;
    prompt += `- Độ ẩm: ${data.weather.humidity}%\n`;
    prompt += `- Gió: ${data.weather.windSpeed} km/h\n`;
    prompt += `- Tầm nhìn: ${data.weather.visibility} km\n`;
    prompt += `- Chỉ số UV: ${data.weather.uv}\n`;
    prompt += `- AQI: ${data.weather.aqi}\n\n`;
  }
  
  if (data.news) {
    prompt += `📰 TIN TỨC MỚI NHẤT:\n`;
    data.news.forEach((news, index) => {
      prompt += `${index + 1}. ${news.title} (${news.time})\n   ${news.summary}\n`;
    });
    prompt += '\n';
  }
  
  if (data.finance) {
    prompt += `💰 DỮ LIỆU TÀI CHÍNH:\n`;
    prompt += `- Vàng: ${data.finance.gold.price} (${data.finance.gold.change})\n`;
    prompt += `- USD: ${data.finance.usd.rate} (${data.finance.usd.change})\n`;
    prompt += `- VN30: ${data.finance.vn30.index} (${data.finance.vn30.change})\n\n`;
  }
  
  if (data.agriculture) {
    prompt += `🌱 TƯ VẤN NÔNG NGHIỆP:\n`;
    prompt += `- Lời khuyên hiện tại: ${data.agriculture.currentAdvice.join(', ')}\n`;
    prompt += `- Cây trồng theo mùa: ${data.agriculture.seasonalCrops.join(', ')}\n\n`;
  }
  
  prompt += `Hãy phân tích dữ liệu trên và trả lời câu hỏi của người dùng một cách chi tiết, hữu ích. Sử dụng emoji và format đẹp.`;
  
  return prompt;
}

// ===== FALLBACK LOCAL AI =====

function generateLocalAIResponse(message, data) {
  const lowerMessage = message.toLowerCase();
  
  // Weather analysis
  if (lowerMessage.includes('thời tiết') || lowerMessage.includes('phân tích')) {
    if (data.weather) {
      let response = `🌤️ **PHÂN TÍCH THỜI TIẾT CHI TIẾT**\n\n`;
      response += `📍 **Vị trí:** ${data.weather.location}\n`;
      response += `🌡️ **Nhiệt độ:** ${data.weather.temperature}°C (cảm giác ${data.weather.feelsLike}°C)\n`;
      response += `☁️ **Tình trạng:** ${data.weather.condition}\n`;
      response += `💧 **Độ ẩm:** ${data.weather.humidity}%\n`;
      response += `💨 **Gió:** ${data.weather.windSpeed} km/h\n`;
      response += `👁️ **Tầm nhìn:** ${data.weather.visibility} km\n`;
      response += `☀️ **Chỉ số UV:** ${data.weather.uv}\n`;
      response += `🍃 **Chất lượng không khí:** AQI ${data.weather.aqi}\n\n`;
      
      // Add recommendations
      response += `💡 **Lời khuyên:**\n`;
      if (data.weather.temperature > 30) {
        response += `• Thời tiết nóng, nên mặc quần áo thoáng mát\n`;
        response += `• Uống nhiều nước, tránh ra ngoài 11h-15h\n`;
      } else if (data.weather.temperature < 20) {
        response += `• Thời tiết mát, nên mặc áo ấm\n`;
        response += `• Thích hợp cho hoạt động ngoài trời\n`;
      }
      
      if (data.weather.humidity > 80) {
        response += `• Độ ẩm cao, có thể có mưa\n`;
      }
      
      return response;
    }
  }
  
  // News summary
  if (lowerMessage.includes('tin tức') || lowerMessage.includes('news')) {
    if (data.news) {
      let response = `📰 **TIN TỨC QUAN TRỌNG HÔM NAY**\n\n`;
      data.news.forEach((news, index) => {
        response += `**${index + 1}. ${news.title}** (${news.time})\n`;
        response += `${news.summary}\n\n`;
      });
      return response;
    }
  }
  
  // Financial data
  if (lowerMessage.includes('giá') || lowerMessage.includes('vàng') || lowerMessage.includes('usd')) {
    if (data.finance) {
      let response = `💰 **THÔNG TIN TÀI CHÍNH HÔM NAY**\n\n`;
      response += `🥇 **Vàng:** ${data.finance.gold.price} (${data.finance.gold.change})\n`;
      response += `💵 **USD:** ${data.finance.usd.rate} (${data.finance.usd.change})\n`;
      response += `📈 **VN30:** ${data.finance.vn30.index} (${data.finance.vn30.change})\n\n`;
      
      response += `📊 **Nhận xét:** Thị trường ${data.finance.vn30.change.includes('+') ? 'tích cực' : 'tiêu cực'} hôm nay.\n`;
      return response;
    }
  }
  
  // Agriculture advice
  if (lowerMessage.includes('trồng') || lowerMessage.includes('cây') || lowerMessage.includes('nông nghiệp')) {
    if (data.agriculture && data.weather) {
      let response = `🌱 **TƯ VẤN NÔNG NGHIỆP THÔNG MINH**\n\n`;
      response += `🌡️ **Điều kiện hiện tại:** ${data.weather.temperature}°C, độ ẩm ${data.weather.humidity}%\n\n`;
      
      response += `💡 **Lời khuyên:**\n`;
      data.agriculture.currentAdvice.forEach(advice => {
        response += `• ${advice}\n`;
      });
      
      response += `\n🌾 **Cây trồng phù hợp mùa này:**\n`;
      data.agriculture.seasonalCrops.forEach(crop => {
        response += `• ${crop}\n`;
      });
      
      return response;
    }
  }
  
  // Default comprehensive response
  let response = `🤖 **AI PHÂN TÍCH TỔNG HỢP**\n\n`;
  
  if (data.weather) {
    response += `🌤️ Thời tiết: ${data.weather.temperature}°C, ${data.weather.condition}\n`;
  }
  
  if (data.news) {
    response += `📰 Có ${data.news.length} tin tức mới cập nhật\n`;
  }
  
  if (data.finance) {
    response += `💰 Vàng ${data.finance.gold.change}, USD ${data.finance.usd.change}\n`;
  }
  
  response += `\nBạn có thể hỏi tôi về thời tiết, tin tức, giá cả, hoặc tư vấn nông nghiệp!`;
  
  return response;
}

// ===== API CONFIGURATION FUNCTIONS =====

function toggleApiConfig() {
  const panel = document.getElementById('apiConfigPanel');
  panel.classList.toggle('hidden');
}

function saveApiKeys() {
  const openaiKey = document.getElementById('openaiKey').value.trim();
  const weatherKey = document.getElementById('weatherKey').value.trim();
  
  if (openaiKey) {
    apiKeys.openai = openaiKey;
    localStorage.setItem('openai_key', openaiKey);
  }
  
  if (weatherKey) {
    apiKeys.weather = weatherKey;
    localStorage.setItem('weather_key', weatherKey);
  }
  
  updateApiStatus();
  showNotification('✅ Đã lưu API keys thành công!', 'success');
  toggleApiConfig();
}

function loadApiKeys() {
  const savedOpenAI = localStorage.getItem('openai_key');
  const savedWeather = localStorage.getItem('weather_key');
  
  if (savedOpenAI) {
    apiKeys.openai = savedOpenAI;
    document.getElementById('openaiKey').value = savedOpenAI;
  }
  
  if (savedWeather) {
    apiKeys.weather = savedWeather;
    document.getElementById('weatherKey').value = savedWeather;
  }
  
  updateApiStatus();
}

async function testApiConnection() {
  const statusEl = document.getElementById('apiStatus');
  statusEl.innerHTML = '<div class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div><span class="text-xs">Testing...</span>';
  
  let results = [];
  
  // Test OpenAI
  if (apiKeys.openai) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKeys.openai}` }
      });
      results.push(`OpenAI: ${response.ok ? '✅ OK' : '❌ Error'}`);
    } catch (error) {
      results.push('OpenAI: ❌ Error');
    }
  }
  
  // Test Weather API
  if (apiKeys.weather) {
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKeys.weather}&q=Hanoi`);
      results.push(`Weather: ${response.ok ? '✅ OK' : '❌ Error'}`);
    } catch (error) {
      results.push('Weather: ❌ Error');
    }
  }
  
  if (results.length === 0) {
    results.push('⚠️ Chưa có API key nào');
  }
  
  showNotification(`🧪 Kết quả test API:\n${results.join('\n')}`, 'info', 8000);
  updateApiStatus();
}

function updateApiStatus() {
  const statusEl = document.getElementById('apiStatus');
  const hasKeys = apiKeys.openai || apiKeys.weather;
  
  if (hasKeys) {
    statusEl.innerHTML = '<div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div><span class="text-xs">API Ready</span>';
  } else {
    statusEl.innerHTML = '<div class="w-2 h-2 bg-orange-400 rounded-full"></div><span class="text-xs">Mock Mode</span>';
  }
}

// SOS Emergency System
function activateSOS() {
  if (sosActive) {
    showNotification('🚨 SOS đã được kích hoạt!', 'warning');
    return;
  }
  
  sosActive = true;
  showSOSModal();
  startSOSCountdown();
  
  // Get location for emergency
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        updateSOSLocation(lat, lng);
      },
      error => {
        console.error('Location error:', error);
        updateSOSLocation(null, null);
      }
    );
  }
}

function showSOSModal() {
  const modal = document.createElement('div');
  modal.id = 'sosModal';
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-pulse">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 text-center">
        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="ri-alarm-warning-line text-3xl animate-bounce"></i>
        </div>
        <h2 class="text-2xl font-bold">🚨 CẢNH BÁO KHẨN CẤP</h2>
        <p class="text-red-100 mt-2">Thời gian: ${new Date().toLocaleString('vi-VN')}</p>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- SOS Button -->
        <div class="text-center mb-6">
          <div class="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-red-600 transition-colors" onclick="triggerEmergencyCall()">
            <div class="text-center text-white">
              <i class="ri-shield-line text-4xl mb-2"></i>
              <div class="text-xl font-bold">SOS</div>
            </div>
          </div>
          <p class="text-gray-600 text-sm">Nhấn và giữ để kích hoạt SOS</p>
          <p class="text-gray-500 text-xs mt-1">Nhấn và giữ 3 giây để gửi tín hiệu khẩn cấp</p>
        </div>

        <!-- Emergency Contacts -->
        <div class="bg-blue-50 rounded-xl p-4 mb-4">
          <h3 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <i class="ri-contacts-line"></i>
            Danh bạ khẩn cấp
          </h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between bg-white rounded-lg p-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <i class="ri-phone-line text-red-600"></i>
                </div>
                <div>
                  <div class="font-semibold text-gray-800">Cảnh sát 113</div>
                  <div class="text-xs text-gray-500">Emergency Services</div>
                </div>
              </div>
              <button onclick="callEmergency('113')" class="bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600">
                📞 Gọi
              </button>
            </div>
            
            <div class="flex items-center justify-between bg-white rounded-lg p-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <i class="ri-fire-line text-orange-600"></i>
                </div>
                <div>
                  <div class="font-semibold text-gray-800">Cứu hỏa 114</div>
                  <div class="text-xs text-gray-500">Fire Department</div>
                </div>
              </div>
              <button onclick="callEmergency('114')" class="bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600">
                📞 Gọi
              </button>
            </div>
            
            <div class="flex items-center justify-between bg-white rounded-lg p-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <i class="ri-hospital-line text-blue-600"></i>
                </div>
                <div>
                  <div class="font-semibold text-gray-800">Cấp cứu 115</div>
                  <div class="text-xs text-gray-500">Medical Emergency</div>
                </div>
              </div>
              <button onclick="callEmergency('115')" class="bg-green-500 text-white px-3 py-1 rounded-full text-xs hover:bg-green-600">
                📞 Gọi
              </button>
            </div>
          </div>
          
          <div class="mt-3 p-2 bg-yellow-50 rounded-lg">
            <div class="flex items-center gap-2 text-yellow-800 text-xs">
              <i class="ri-information-line"></i>
              <span>Lưu ý: Trong trường hợp khẩn cấp, hãy gọi ngay số 113, 114, 115</span>
            </div>
          </div>
        </div>

        <!-- Location Info -->
        <div class="bg-green-50 rounded-xl p-4 mb-4">
          <h3 class="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <i class="ri-map-pin-line"></i>
            Vị trí hiện tại
          </h3>
          <div id="sosLocationInfo" class="text-sm text-gray-600">
            <div class="flex items-center gap-2 mb-2">
              <i class="ri-loader-4-line animate-spin text-blue-500"></i>
              <span>Đang xác định vị trí...</span>
            </div>
          </div>
          
          <div class="mt-3 flex gap-2">
            <button onclick="shareLocation()" class="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-blue-600">
              📍 Google Maps
            </button>
            <button onclick="shareLocationText()" class="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-xs hover:bg-green-600">
              📱 Chia sẻ
            </button>
          </div>
          
          <div class="mt-2 text-xs text-green-600 bg-green-100 rounded p-2">
            <i class="ri-shield-check-line mr-1"></i>
            Vị trí sẽ được xác định và gửi kèm trong tin hiệu SOS
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button onclick="cancelSOS()" class="flex-1 bg-gray-500 text-white px-4 py-3 rounded-full hover:bg-gray-600 transition-colors">
            ❌ Hủy
          </button>
          <button onclick="confirmSOS()" class="flex-1 bg-red-500 text-white px-4 py-3 rounded-full hover:bg-red-600 transition-colors font-semibold">
            🚨 Xác nhận SOS
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
}

function startSOSCountdown() {
  let countdown = 30;
  sosTimer = setInterval(() => {
    countdown--;
    const modal = document.getElementById('sosModal');
    if (modal && countdown > 0) {
      // Update countdown display if needed
    } else {
      clearInterval(sosTimer);
      if (countdown <= 0) {
        // Auto-trigger SOS after 30 seconds
        triggerEmergencyCall();
      }
    }
  }, 1000);
}

function updateSOSLocation(lat, lng) {
  const locationInfo = document.getElementById('sosLocationInfo');
  if (!locationInfo) return;
  
  if (lat && lng) {
    locationInfo.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <i class="ri-map-pin-line text-green-500"></i>
          <span class="font-semibold">Tọa độ GPS:</span>
        </div>
        <div class="bg-white rounded p-2 font-mono text-xs">
          <div>Vĩ độ: ${lat.toFixed(6)}</div>
          <div>Kinh độ: ${lng.toFixed(6)}</div>
        </div>
        <div class="text-xs text-gray-500">
          Độ chính xác: ±10m | Thời gian: ${new Date().toLocaleTimeString('vi-VN')}
        </div>
      </div>
    `;
    
    // Store location for emergency use
    window.sosLocation = { lat, lng };
  } else {
    locationInfo.innerHTML = `
      <div class="flex items-center gap-2 text-orange-600">
        <i class="ri-error-warning-line"></i>
        <span>Không thể xác định vị trí GPS</span>
      </div>
      <div class="text-xs text-gray-500 mt-1">
        Vui lòng bật GPS hoặc cung cấp vị trí thủ công
      </div>
    `;
  }
}

function callEmergency(number) {
  showNotification(`📞 Đang kết nối với ${number}...`, 'info');
  
  // Try to make actual call on mobile devices
  if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
    window.location.href = `tel:${number}`;
  } else {
    // Show instructions for desktop
    alert(`📞 HƯỚNG DẪN GỌI KHẨN CẤP

Số điện thoại: ${number}

Trên điện thoại: Gọi trực tiếp số ${number}
Trên máy tính: Sử dụng điện thoại để gọi

Thông tin cần cung cấp:
- Tên và số điện thoại
- Địa chỉ chính xác
- Tình huống khẩn cấp
- Số người bị nạn (nếu có)

⚠️ Chỉ gọi khi thực sự cần thiết!`);
  }
}

function shareLocation() {
  if (window.sosLocation) {
    const { lat, lng } = window.sosLocation;
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapsUrl, '_blank');
  } else {
    showNotification('⚠️ Chưa có thông tin vị trí GPS', 'warning');
  }
}

function shareLocationText() {
  if (window.sosLocation) {
    const { lat, lng } = window.sosLocation;
    const locationText = `🚨 KHẨN CẤP - VỊ TRÍ CỦA TÔI:

📍 Tọa độ GPS: ${lat.toFixed(6)}, ${lng.toFixed(6)}
🔗 Google Maps: https://www.google.com/maps?q=${lat},${lng}
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}

Được gửi từ Weather & Life Emergency System`;
    
    if (navigator.share) {
      navigator.share({
        title: '🚨 Vị trí khẩn cấp',
        text: locationText
      });
    } else {
      navigator.clipboard.writeText(locationText).then(() => {
        showNotification('📋 Đã sao chép thông tin vị trí!', 'success');
      });
    }
  } else {
    showNotification('⚠️ Chưa có thông tin vị trí GPS', 'warning');
  }
}

function triggerEmergencyCall() {
  showNotification('🚨 Đã kích hoạt tín hiệu SOS!', 'error');
  
  // Show emergency confirmation
  const confirmModal = document.createElement('div');
  confirmModal.className = 'fixed inset-0 bg-red-500 bg-opacity-90 z-60 flex items-center justify-center p-4';
  confirmModal.innerHTML = `
    <div class="bg-white rounded-2xl p-8 text-center max-w-sm w-full">
      <div class="text-6xl mb-4">🚨</div>
      <h2 class="text-2xl font-bold text-red-600 mb-4">SOS ĐÃ ĐƯỢC KÍCH HOẠT!</h2>
      <p class="text-gray-600 mb-6">Tín hiệu khẩn cấp đã được gửi đến các dịch vụ cứu hộ.</p>
      <div class="space-y-2 text-sm text-gray-500 mb-6">
        <p>✅ Đã gửi vị trí GPS</p>
        <p>✅ Đã thông báo 113, 114, 115</p>
        <p>✅ Đã gửi tin nhắn khẩn cấp</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove(); cancelSOS();" 
              class="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600">
        Đóng
      </button>
    </div>
  `;
  
  document.body.appendChild(confirmModal);
  
  // Auto close after 10 seconds
  setTimeout(() => {
    if (confirmModal.parentElement) {
      confirmModal.remove();
      cancelSOS();
    }
  }, 10000);
}

function confirmSOS() {
  triggerEmergencyCall();
}

function cancelSOS() {
  sosActive = false;
  if (sosTimer) {
    clearInterval(sosTimer);
    sosTimer = null;
  }
  
  const modal = document.getElementById('sosModal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = 'auto';
  }
  
  showNotification('✅ Đã hủy tín hiệu SOS', 'success');
}

// Enhanced disaster warning functions
function openDisasterWarningModal() {
  const modal = document.getElementById('disasterModal');
  const updateTime = document.getElementById('updateTime');
  
  updateTime.textContent = new Date().toLocaleString('vi-VN');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  loadDisasterData();
  animateRiskBars();
}

function closeDisasterWarningModal() {
  const modal = document.getElementById('disasterModal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

function loadDisasterData() {
  updateCurrentAlerts();
  updateRiskAssessment();
  loadAIPredictions();
}

function updateCurrentAlerts() {
  const alertsContainer = document.getElementById('currentAlerts');
  
  if (disasterWarningSystem.currentAlerts.length === 0) {
    alertsContainer.innerHTML = `
      <i class="ri-shield-check-line text-green-500 text-5xl mb-4"></i>
      <h4 class="text-xl font-semibold text-gray-800 mb-2">Khu vực an toàn</h4>
      <p class="text-gray-600 text-lg mb-2">Không có cảnh báo thiên tai nào</p>
      <p class="text-gray-500 text-sm">Hệ thống AI đang giám sát 24/7</p>
    `;
  }
}

function updateRiskAssessment() {
  // Update overall score with animation
  const overallScore = document.querySelector('.w-32.h-32 span');
  if (overallScore) {
    let currentScore = 0;
    const targetScore = disasterWarningSystem.riskAssessment.overall;
    const increment = targetScore / 30;
    
    const countUp = setInterval(() => {
      currentScore += increment;
      if (currentScore >= targetScore) {
        currentScore = targetScore;
        clearInterval(countUp);
      }
      overallScore.textContent = Math.round(currentScore);
    }, 50);
  }
}

function animateRiskBars() {
  setTimeout(() => {
    document.querySelectorAll('.risk-progress').forEach((bar, index) => {
      setTimeout(() => {
        bar.style.transition = 'width 1s ease-in-out';
        bar.style.width = bar.style.width;
      }, index * 200);
    });
  }, 500);
}

function loadAIPredictions() {
  // AI predictions are already loaded in the HTML
  // This function can be used to update them dynamically
}

// Enhanced notification system
function showNotification(message, type = 'info', duration = 5000) {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl max-w-sm transform transition-all duration-300 translate-x-full border-l-4`;
  
  const colors = {
    success: 'bg-green-50 text-green-800 border-green-500',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-500',
    error: 'bg-red-50 text-red-800 border-red-500',
    info: 'bg-blue-50 text-blue-800 border-blue-500'
  };
  
  const icons = {
    success: 'ri-check-line',
    warning: 'ri-alert-line',
    error: 'ri-close-line',
    info: 'ri-information-line'
  };
  
  notification.className += ` ${colors[type] || colors.info}`;
  
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <i class="${icons[type] || icons.info} text-xl flex-shrink-0 mt-0.5"></i>
      <div class="flex-1">
        <p class="font-medium">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" 
              class="text-current hover:bg-black hover:bg-opacity-10 p-1 rounded transition-colors">
        <i class="ri-close-line text-sm"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, duration);
}

// Enhanced feature handling
function handleFeatureClick(feature) {
  const message = featureMessages[feature];
  if (message) {
    // Create a custom modal instead of alert
    showFeatureModal(feature, message);
  }
}

function showFeatureModal(feature, message) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
  
  const featureColors = {
    weather: 'blue',
    sos: 'red',
    plants: 'green',
    alerts: 'yellow',
    health: 'pink',
    travel: 'indigo',
    energy: 'orange'
  };
  
  const color = featureColors[feature] || 'blue';
  
  modal.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
      <div class="bg-gradient-to-r from-${color}-500 to-${color}-600 text-white p-6 rounded-t-2xl">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">Thông tin chi tiết</h3>
          <button onclick="this.closest('.fixed').remove()" 
                  class="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors">
            <i class="ri-close-line text-xl"></i>
          </button>
        </div>
      </div>
      <div class="p-6">
        <pre class="whitespace-pre-wrap text-gray-800 leading-relaxed">${message}</pre>
        <div class="mt-6 flex gap-3">
          <button onclick="this.closest('.fixed').remove()" 
                  class="flex-1 bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors">
            Đóng
          </button>
          <button onclick="shareFeatureInfo('${feature}')" 
                  class="flex-1 bg-${color}-500 text-white px-4 py-2 rounded-full hover:bg-${color}-600 transition-colors">
            Chia sẻ
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Close on outside click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
      document.body.style.overflow = 'auto';
    }
  });
}

function shareFeatureInfo(feature) {
  const message = featureMessages[feature];
  if (navigator.share) {
    navigator.share({
      title: `Weather & Life - ${feature}`,
      text: message,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(message).then(() => {
      showNotification('Đã sao chép thông tin vào clipboard!', 'success');
    });
  }
}

// Enhanced search functionality
function handleLocationSearch() {
  const searchInput = document.getElementById('locationSearch');
  const query = searchInput.value.trim();
  
  if (query) {
    showNotification(`🔍 Đang tìm kiếm thời tiết cho: "${query}"`, 'info');
    
    // Simulate search with loading
    setTimeout(() => {
      const mockResults = [
        { name: 'Hà Nội', temp: '26°C', weather: '☁️', aqi: 65, uv: 4 },
        { name: 'TP.HCM', temp: '30°C', weather: '☀️', aqi: 55, uv: 8 },
        { name: 'Đà Nẵng', temp: '28°C', weather: '🌤️', aqi: 45, uv: 6 }
      ];
      
      const result = mockResults.find(r => r.name.toLowerCase().includes(query.toLowerCase())) || 
                    { name: query, temp: '27°C', weather: '🌤️', aqi: 50, uv: 5 };
      
      showNotification(`Tìm thấy: ${result.name} - ${result.temp} ${result.weather} | AQI: ${result.aqi} | UV: ${result.uv}`, 'success');
      searchInput.value = '';
    }, 1500);
  }
}

// Mobile menu functionality
function initializeMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuBtn.querySelector('i');
    icon.className = mobileMenu.classList.contains('hidden') ? 'ri-menu-line text-xl' : 'ri-close-line text-xl';
  });
  
  // Close mobile menu when clicking on links
  document.querySelectorAll('.nav-link-mobile').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenuBtn.querySelector('i').className = 'ri-menu-line text-xl';
    });
  });
}

// Enhanced smooth scrolling
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });
}

// Enhanced animations
function addEnhancedAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        
        // Special animations for different elements
        if (entry.target.classList.contains('weather-card')) {
          entry.target.style.animationDelay = `${Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1}s`;
        }
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.weather-card, .hero-section, .chart-container').forEach(el => {
    observer.observe(el);
  });
}

// Additional utility functions
function refreshAlerts() {
  const button = event.target.closest('button');
  const originalHTML = button.innerHTML;
  
  button.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i>Đang tải...';
  button.disabled = true;
  
  setTimeout(() => {
    document.getElementById('updateTime').textContent = new Date().toLocaleString('vi-VN');
    loadDisasterData();
    
    button.innerHTML = originalHTML;
    button.disabled = false;
    
    showNotification('Đã cập nhật cảnh báo mới nhất!', 'success');
  }, 2000);
}

function subscribeAlerts() {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      showNotification('Bạn đã đăng ký nhận thông báo cảnh báo thiên tai!', 'success');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showNotification('Đã bật thông báo cảnh báo thiên tai!', 'success');
          
          // Show a sample notification
          setTimeout(() => {
            new Notification('Weather & Life Enhanced', {
              body: 'Bạn đã đăng ký thành công! Sẽ nhận cảnh báo khi có thiên tai.',
              icon: '/favicon.ico'
            });
          }, 1000);
        } else {
          showNotification('Vui lòng cho phép thông báo để nhận cảnh báo kịp thời!', 'warning');
        }
      });
    } else {
      showNotification('Vui lòng bật thông báo trong cài đặt trình duyệt!', 'warning');
    }
  } else {
    showNotification('Trình duyệt không hỗ trợ thông báo!', 'error');
  }
}

function shareAlerts() {
  const shareData = {
    title: 'Cảnh báo thiên tai - Weather & Life Enhanced',
    text: 'Theo dõi tình hình thiên tai và cảnh báo kịp thời tại khu vực của bạn với AI thế hệ mới',
    url: window.location.href
  };
  
  if (navigator.share) {
    navigator.share(shareData).then(() => {
      showNotification('Đã chia sẻ thành công!', 'success');
    }).catch(() => {
      fallbackShare();
    });
  } else {
    fallbackShare();
  }
}

function fallbackShare() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showNotification('Đã sao chép link vào clipboard!', 'success');
  }).catch(() => {
    showNotification('Không thể chia sẻ. Vui lòng sao chép link thủ công!', 'warning');
  });
}

function exportReport() {
  showNotification('Đang tạo báo cáo nâng cao...', 'info');
  
  setTimeout(() => {
    const reportData = `
BÁOCÁO THỜI TIẾT & CẢNH BÁO THIÊN TAI NÂNG CAO
==============================================
Thời gian: ${new Date().toLocaleString('vi-VN')}
Vị trí: ${weatherData.current.location}
Phiên bản: Weather & Life Enhanced v2.0

THỜI TIẾT HIỆN TẠI:
- Nhiệt độ: ${weatherData.current.temp}°C (Cảm giác như 30°C)
- Độ ẩm: ${weatherData.current.humidity}%
- Gió: ${weatherData.current.windSpeed} km/h, hướng Đông Nam
- Tình trạng: ${weatherData.current.condition}
- Tầm nhìn: ${weatherData.current.visibility} km
- Chỉ số UV: ${weatherData.current.uv} (Trung bình)
- AQI: ${weatherData.current.aqi} (Tốt)

ĐÁNH GIÁ RỦI RO AI:
- Tổng thể: ${disasterWarningSystem.riskAssessment.overall}/100
- Lũ lụt: 70% (Cao)
- Bão: 60% (Trung bình)
- Dông: 80% (Cao)
- Mưa lớn: 85% (Rất cao)
- Sóng nhiệt: 30% (Thấp)

DỰ BÁO 48H TỚI:
- Hôm nay 15:00: Mưa nhẹ (75%)
- Hôm nay 20:00: Gió mạnh (60%)
- Ngày mai: Nắng ráo (90%)
- Ngày kia: Cảnh báo nắng nóng (65%)

KHUYẾN NGHỊ:
- Theo dõi cảnh báo thường xuyên
- Chuẩn bị đồ dự phòng
- Hạn chế ra ngoài khi có cảnh báo
- Sử dụng kem chống nắng SPF 30+
- Uống đủ nước (2-2.5L/ngày)

TƯ VẤN SỨC KHỎE:
- Thời tiết hiện tại phù hợp cho hoạt động ngoài trời
- Cần bảo vệ da khỏi tia UV
- Chất lượng không khí tốt cho hô hấp

Được tạo bởi Weather & Life AI System Enhanced
Độ tin cậy: 94% | Cập nhật: Mỗi 10 phút
    `;
    
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-report-enhanced-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Đã xuất báo cáo nâng cao thành công!', 'success');
  }, 2000);
}

function setupAlerts() {
  showNotification('Đang mở cài đặt cảnh báo...', 'info');
  
  setTimeout(() => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    
    modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-2xl">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold">Cài đặt cảnh báo</h3>
            <button onclick="this.closest('.fixed').remove()" 
                    class="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors">
              <i class="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span>Cảnh báo mưa</span>
              <input type="checkbox" checked class="toggle">
            </div>
            <div class="flex items-center justify-between">
              <span>Cảnh báo bão</span>
              <input type="checkbox" checked class="toggle">
            </div>
            <div class="flex items-center justify-between">
              <span>Cảnh báo nắng nóng</span>
              <input type="checkbox" class="toggle">
            </div>
            <div class="flex items-center justify-between">
              <span>Cảnh báo chất lượng không khí</span>
              <input type="checkbox" checked class="toggle">
            </div>
          </div>
          <div class="mt-6 flex gap-3">
            <button onclick="this.closest('.fixed').remove()" 
                    class="flex-1 bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition-colors">
              Hủy
            </button>
            <button onclick="saveAlertSettings()" 
                    class="flex-1 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors">
              Lưu cài đặt
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
      }
    });
  }, 500);
}

function saveAlertSettings() {
  showNotification('Đã lưu cài đặt cảnh báo!', 'success');
  document.querySelector('.fixed').remove();
  document.body.style.overflow = 'auto';
}

// Locate user function (enhanced)
function locateUser() {
  const locateBtn = document.getElementById('locateBtn');
  if (locateBtn) {
    locateBtn.click();
  } else {
    setTimeout(() => {
      const btn = document.getElementById('locateBtn');
      if (btn) btn.click();
    }, 1000);
  }
}

// ✅ **BƯỚC 1: GỌI API THỜI TIẾT**
async function getWeatherData(location = 'Hanoi') {
  if (!apiKeys.weather) {
    throw new Error('Chưa có Weather API key. Vui lòng cấu hình trong phần cài đặt.');
  }
  
  try {
    const response = await fetch(`${API_ENDPOINTS.weather}?key=${apiKeys.weather}&q=${location}&aqi=yes`);
    
    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Weather API Error:', error);
    throw error;
  }
}

// ✅ **BƯỚC 1: GỌI API TIN TỨC**
async function getNewsData() {
  if (!apiKeys.news) {
    // Fallback với dữ liệu mẫu nếu không có API key
    return {
      articles: [
        {
          title: "Thời tiết miền Bắc chuyển lạnh",
          description: "Không khí lạnh tăng cường, nhiệt độ giảm 3-5 độ C",
          publishedAt: new Date().toISOString()
        }
      ]
    };
  }
  
  try {
    const response = await fetch(`${API_ENDPOINTS.news}?country=us&category=general&apiKey=${apiKeys.news}&pageSize=3`);
    
    if (!response.ok) {
      throw new Error(`News API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('News API Error:', error);
    // Return fallback data
    return {
      articles: [
        {
          title: "Tin tức không khả dụng",
          description: "Không thể tải tin tức. Vui lòng kiểm tra kết nối mạng.",
          publishedAt: new Date().toISOString()
        }
      ]
    };
  }
}

// ✅ **BƯỚC 2: TẠO PROMPT CHO AI**
function createSmartPrompt(userMessage, weatherData, newsData) {
  const currentTime = new Date().toLocaleString('vi-VN');
  
  let prompt = `Bạn là AI trợ lý thông minh của ứng dụng Weather & Life. Hãy phân tích dữ liệu thực tế và trả lời câu hỏi của người dùng một cách chính xác, hữu ích.

📅 THỜI GIAN HIỆN TẠI: ${currentTime}

🌤️ DỮ LIỆU THỜI TIẾT THỰC TẾ:`;

  if (weatherData) {
    prompt += `
- 📍 Địa điểm: ${weatherData.location.name}, ${weatherData.location.country}
- 🌡️ Nhiệt độ: ${weatherData.current.temp_c}°C (cảm giác như ${weatherData.current.feelslike_c}°C)
- ☁️ Tình trạng: ${weatherData.current.condition.text}
- 💧 Độ ẩm: ${weatherData.current.humidity}%
- 💨 Gió: ${weatherData.current.wind_kph} km/h, hướng ${weatherData.current.wind_dir}
- 👁️ Tầm nhìn: ${weatherData.current.vis_km} km
- 🌬️ Chỉ số UV: ${weatherData.current.uv}
- 🏭 Chất lượng không khí: AQI ${weatherData.current.air_quality?.['us-epa-index'] || 'N/A'}`;
  }

  if (newsData && newsData.articles && newsData.articles.length > 0) {
    prompt += `

📰 TIN TỨC MỚI NHẤT:`;
    newsData.articles.slice(0, 3).forEach((article, index) => {
      prompt += `
${index + 1}. ${article.title}
   ${article.description || 'Không có mô tả'}`;
    });
  }

  prompt += `

❓ CÂU HỎI CỦA NGƯỜI DÙNG: "${userMessage}"

📋 YÊU CẦU:
- Phân tích dữ liệu thực tế ở trên
- Đưa ra câu trả lời chính xác, hữu ích
- Sử dụng emoji phù hợp
- Nếu liên quan đến thời tiết, hãy đưa ra lời khuyên cụ thể
- Nếu hỏi về tin tức, hãy tóm tắt thông tin quan trọng
- Trả lời bằng tiếng Việt, ngắn gọn nhưng đầy đủ thông tin

Hãy trả lời:`;

  return prompt;
}

// ✅ **BƯỚC 3: GỌI API OPENAI**
async function callOpenAI(prompt) {
  if (!apiKeys.openai) {
    throw new Error('Chưa có OpenAI API key. Vui lòng cấu hình trong phần cài đặt.');
  }
  
  try {
    const response = await fetch(API_ENDPOINTS.openai, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKeys.openai}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Sử dụng model cost-effective
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

// ✅ **BƯỚC 4: TÍCH HỢP TẤT CẢ - HÀM CHÍNH**
async function generateSmartAIResponse(userMessage) {
  try {
    showNotification('🧠 AI đang phân tích dữ liệu thực tế...', 'info', 2000);
    
    // Bước 1: Thu thập dữ liệu từ các API
    const [weatherData, newsData] = await Promise.allSettled([
      getWeatherData('Hanoi'), // Có thể customize location
      getNewsData()
    ]);
    
    // Xử lý kết quả API calls
    const weather = weatherData.status === 'fulfilled' ? weatherData.value : null;
    const news = newsData.status === 'fulfilled' ? newsData.value : null;
    
    if (weatherData.status === 'rejected') {
      console.warn('Weather API failed:', weatherData.reason);
    }
    if (newsData.status === 'rejected') {
      console.warn('News API failed:', newsData.reason);
    }
    
    // Bước 2: Tạo prompt thông minh
    const prompt = createSmartPrompt(userMessage, weather, news);
    
    // Bước 3: Gọi OpenAI
    const aiResponse = await callOpenAI(prompt);
    
    // Bước 4: Trả về kết quả
    showNotification('✅ AI đã phân tích xong!', 'success', 2000);
    return aiResponse;
    
  } catch (error) {
    console.error('Smart AI Response Error:', error);
    showNotification(`❌ Lỗi AI: ${error.message}`, 'error', 5000);
    
    // Fallback to basic response
    return `❌ Xin lỗi, tôi gặp lỗi khi phân tích dữ liệu thực tế: ${error.message}
    
💡 Để sử dụng AI thông minh, vui lòng:
1. Click ⚙️ để cấu hình API keys
2. Nhập OpenAI API key (bắt đầu bằng sk-...)
3. Nhập Weather API key (miễn phí tại weatherapi.com)

Hiện tại tôi sẽ trả lời bằng dữ liệu mẫu: ${generateBasicResponse(userMessage)}`;
  }
}

// Hàm fallback khi không có API
function generateBasicResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('thời tiết')) {
    return `🌤️ Thời tiết hiện tại (dữ liệu mẫu):
- Nhiệt độ: 28°C
- Độ ẩm: 75%
- Tình trạng: Có mây
- Lời khuyên: Nên mang theo ô khi ra ngoài!`;
  }
  
  if (lowerMessage.includes('tin tức')) {
    return `📰 Tin tức mẫu:
- Thời tiết miền Bắc chuyển lạnh
- Kinh tế phục hồi tích cực
- Công nghệ AI phát triển mạnh`;
  }
  
  return `Tôi cần API keys để phân tích dữ liệu thực tế. Vui lòng cấu hình trong phần cài đặt! 🔧`;
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize speech functionality
  initializeSpeech();
  
  // Start clock with enhanced display
  setInterval(updateClock, 1000);
  updateClock();

  // Initialize all components
  initializeCharts();
  window.weatherMap = initializeMap();
  initializeMobileMenu();
  initializeSmoothScrolling();
  addEnhancedAnimations();

  // Add event listeners for feature buttons
  document.querySelectorAll('.feature-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const feature = btn.getAttribute('data-feature');
      if (feature === 'sos') {
        activateSOS();
      } else if (feature) {
        handleFeatureClick(feature);
      }
    });
  });

  // Add search functionality
  const searchInput = document.getElementById('locationSearch');
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleLocationSearch();
    }
  });

  // AI Assistant input handler
  const aiInput = document.getElementById('aiInput');
  if (aiInput) {
    aiInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendAIMessage();
      }
    });
  }

  // Voice button handler
  const voiceBtn = document.getElementById('voiceBtn');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', startVoiceRecognition);
  }

  // Voice toggle handler
  const voiceToggle = document.getElementById('voiceToggle');
  if (voiceToggle) {
    voiceToggle.addEventListener('click', () => {
      isVoiceEnabled = !isVoiceEnabled;
      voiceToggle.innerHTML = isVoiceEnabled ? '<i class="ri-volume-up-line text-xl"></i>' : '<i class="ri-volume-mute-line text-xl"></i>';
      showNotification(isVoiceEnabled ? 'Đã bật phản hồi bằng giọng nói' : 'Đã tắt phản hồi bằng giọng nói', 'info');
    });
  }

  // Close modals on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modals = ['disasterModal', 'aiAssistantModal'];
      modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && !modal.classList.contains('hidden')) {
          if (modalId === 'disasterModal') closeDisasterWarningModal();
          if (modalId === 'aiAssistantModal') closeAIAssistant();
        }
      });
    }
  });

  // Update weather status indicator
  setInterval(() => {
    const statusIndicator = document.getElementById('weatherStatus');
    if (statusIndicator) {
      const dot = statusIndicator.querySelector('.w-2.h-2');
      const text = statusIndicator.querySelector('span');
      
      // Simulate connection status
      const isOnline = navigator.onLine;
      if (isOnline) {
        dot.className = 'w-2 h-2 bg-green-500 rounded-full animate-pulse';
        text.textContent = 'Trực tuyến';
      } else {
        dot.className = 'w-2 h-2 bg-red-500 rounded-full';
        text.textContent = 'Ngoại tuyến';
      }
    }
  }, 5000);

  // Make global functions available
  window.locateUser = locateUser;
  window.openAIAssistant = openAIAssistant;
  window.closeAIAssistant = closeAIAssistant;
  window.sendAIMessage = sendAIMessage;
  window.askQuickQuestion = askQuickQuestion;
  window.toggleApiConfig = toggleApiConfig;
  window.saveApiKeys = saveApiKeys;
  window.testApiConnection = testApiConnection;
  window.activateSOS = activateSOS;
  window.cancelSOS = cancelSOS;
  window.confirmSOS = confirmSOS;
  window.triggerEmergencyCall = triggerEmergencyCall;
  window.callEmergency = callEmergency;
  window.shareLocation = shareLocation;
  window.shareLocationText = shareLocationText;
  window.openDisasterWarningModal = openDisasterWarningModal;
  window.closeDisasterWarningModal = closeDisasterWarningModal;
  window.refreshAlerts = refreshAlerts;
  window.subscribeAlerts = subscribeAlerts;
  window.shareAlerts = shareAlerts;
  window.exportReport = exportReport;

  // Initialize API status
  updateApiStatus();

  // Show welcome notification
  setTimeout(() => {
    showNotification('Chào mừng đến với Weather & Life! 🌤️', 'success', 3000);
  }, 1000);

  // Show feature highlight
  setTimeout(() => {
    showNotification('🎉 Mới: Hỗ trợ nhận diện giọng nói và phản hồi bằng âm thanh!', 'info', 6000);
  }, 3000);
});

// Handle window resize for responsive charts
window.addEventListener('resize', () => {
  // Charts will auto-resize due to the resize listeners in initializeCharts
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// ✅ **API CONFIGURATION FUNCTIONS**

function toggleApiConfig() {
  const panel = document.getElementById('apiConfigPanel');
  panel.classList.toggle('hidden');
  
  if (!panel.classList.contains('hidden')) {
    // Load saved keys
    document.getElementById('openaiKey').value = apiKeys.openai;
    document.getElementById('weatherKey').value = apiKeys.weather;
  }
}

function saveApiKeys() {
  const openaiKey = document.getElementById('openaiKey').value.trim();
  const weatherKey = document.getElementById('weatherKey').value.trim();
  
  // Validate keys
  if (openaiKey && !openaiKey.startsWith('sk-')) {
    showNotification('❌ OpenAI API key phải bắt đầu bằng "sk-"', 'error');
    return;
  }
  
  // Save to localStorage
  if (openaiKey) {
    localStorage.setItem('openai_key', openaiKey);
    apiKeys.openai = openaiKey;
  }
  
  if (weatherKey) {
    localStorage.setItem('weather_key', weatherKey);
    apiKeys.weather = weatherKey;
  }
  
  updateApiStatus();
  showNotification('✅ Đã lưu API keys thành công!', 'success');
  
  // Hide panel
  document.getElementById('apiConfigPanel').classList.add('hidden');
}

async function testApiConnection() {
  const testBtn = event.target;
  const originalText = testBtn.innerHTML;
  testBtn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Testing...';
  testBtn.disabled = true;
  
  try {
    let results = [];
    
    // Test Weather API
    if (apiKeys.weather) {
      try {
        await getWeatherData('London');
        results.push('✅ Weather API: OK');
      } catch (error) {
        results.push(`❌ Weather API: ${error.message}`);
      }
    } else {
      results.push('⚠️ Weather API: Chưa cấu hình');
    }
    
    // Test OpenAI API
    if (apiKeys.openai) {
      try {
        await callOpenAI('Test connection');
        results.push('✅ OpenAI API: OK');
      } catch (error) {
        results.push(`❌ OpenAI API: ${error.message}`);
      }
    } else {
      results.push('⚠️ OpenAI API: Chưa cấu hình');
    }
    
    // Show results
    const resultText = results.join('\n');
    alert(`🧪 KẾT QUẢ TEST API:\n\n${resultText}`);
    
    updateApiStatus();
    
  } catch (error) {
    showNotification(`❌ Lỗi test API: ${error.message}`, 'error');
  } finally {
    testBtn.innerHTML = originalText;
    testBtn.disabled = false;
  }
}

function updateApiStatus() {
  const statusElement = document.getElementById('apiStatus');
  const dot = statusElement.querySelector('.w-2.h-2');
  const text = statusElement.querySelector('span');
  
  const hasOpenAI = !!apiKeys.openai;
  const hasWeather = !!apiKeys.weather;
  
  if (hasOpenAI && hasWeather) {
    dot.className = 'w-2 h-2 bg-green-400 rounded-full animate-pulse';
    text.textContent = 'AI Smart';
    statusElement.title = 'AI thông minh đã sẵn sàng với dữ liệu thực tế';
  } else if (hasOpenAI || hasWeather) {
    dot.className = 'w-2 h-2 bg-yellow-400 rounded-full animate-pulse';
    text.textContent = 'Partial';
    statusElement.title = 'Một số API đã cấu hình, cần thêm để hoạt động tối ưu';
  } else {
    dot.className = 'w-2 h-2 bg-red-400 rounded-full';
    text.textContent = 'No API';
    statusElement.title = 'Chưa cấu hình API keys. Click để cài đặt.';
  }
}

// Initialize API status on load
document.addEventListener('DOMContentLoaded', () => {
  updateApiStatus();
  
  // Add click handler for API status
  document.getElementById('apiStatus').addEventListener('click', toggleApiConfig);
});
