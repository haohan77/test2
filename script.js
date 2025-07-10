// Clock functionality
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

// Weather data (mock data for demonstration)
const weatherData = {
  temperature: [28, 29, 31, 30, 29, 27, 28],
  humidity: [70, 75, 65, 80, 85, 78, 72],
  rainfall: [5, 10, 0, 20, 15, 8, 12],
  days: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
};

// Feature messages
const featureMessages = {
  weather: 'Đang tải thông tin thời tiết địa phương...\n\n📍 Vị trí: Đà Nẵng\n🌡️ Nhiệt độ: 28°C\n💧 Độ ẩm: 75%\n💨 Gió: 15 km/h',
  plants: '🌱 GỢI Ý CÂY TRỒNG THEO THỜI TIẾT:\n\n☀️ Thời tiết nắng ấm (28°C):\n• Cà chua 🍅\n• Dưa chuột 🥒\n• Rau muống 🥬\n• Hoa hướng dương 🌻\n\n💡 Lưu ý: Tưới nước vào buổi sáng sớm',
  alerts: '⚠️ CẢNH BÁO THỜI TIẾT:\n\n🌧️ Dự báo mưa lớn trong 2 ngày tới\n🌪️ Gió mạnh cấp 6-7\n🌊 Nguy cơ ngập úng ở vùng trũng\n\n📋 Khuyến nghị:\n• Hạn chế ra ngoài\n• Chuẩn bị đồ dự phòng\n• Theo dõi tin tức'
};

// 🚨 SOS EMERGENCY SYSTEM - Hệ thống SOS khẩn cấp
const sosEmergencySystem = {
  emergencyContacts: [
    { name: 'Cảnh sát 113', number: '113', type: 'police', icon: 'ri-police-car-line', description: 'Emergency Services' },
    { name: 'Cứu hỏa 114', number: '114', type: 'fire', icon: 'ri-fire-line', description: 'Fire Department' },
    { name: 'Cấp cứu 115', number: '115', type: 'medical', icon: 'ri-heart-pulse-line', description: 'Medical Emergency' },
    { name: 'Trung tâm cứu hộ', number: '1900-1234', type: 'rescue', icon: 'ri-lifebuoy-line', description: 'Rescue Center' },
    { name: 'Cứu hộ giao thông', number: '1900-5678', type: 'traffic', icon: 'ri-roadster-line', description: 'Traffic Rescue' },
    { name: 'Bệnh viện Chợ Rẫy', number: '028-3855-4269', type: 'hospital', icon: 'ri-hospital-line', description: 'Cho Ray Hospital' },
    { name: 'Bệnh viện Bạch Mai', number: '024-3869-3731', type: 'hospital', icon: 'ri-hospital-line', description: 'Bach Mai Hospital' },
    { name: 'Nguyễn Văn A', number: '+84 981 234 567', type: 'family', icon: 'ri-user-heart-line', description: 'Family Member' },
    { name: 'Trần Thị B', number: '+84 987 654 321', type: 'family', icon: 'ri-user-heart-line', description: 'Emergency Contact' },
    { name: 'Công ty bảo hiểm', number: '1900-9999', type: 'insurance', icon: 'ri-shield-check-line', description: 'Insurance Company' }
  ],
  currentLocation: null,
  isEmergencyActive: false
};

// 🔴 DISASTER WARNING SYSTEM - Hệ thống cảnh báo thiên tai
const disasterWarningSystem = {
  // Dữ liệu mẫu cho hệ thống cảnh báo
  currentAlerts: [],
  riskAssessment: {
    overall: 57,
    risks: [
      { name: 'Flood', level: 70, color: 'red' },
      { name: 'Storm', level: 60, color: 'orange' },
      { name: 'Thunderstorm', level: 80, color: 'red' },
      { name: 'Heavy Rain', level: 85, color: 'red' },
      { name: 'Landslide', level: 65, color: 'yellow' },
      { name: 'Heat Wave', level: 30, color: 'green' },
      { name: 'Drought', level: 10, color: 'blue' }
    ]
  },
  disasterHistory: [],
  
  // Hướng dẫn ứng phó khẩn cấp
  emergencyGuides: {
    flood: [
      'Di chuyển đến cao hơn',
      'Tránh xa dòng nước chảy',
      'Chuẩn bị đồ dùng khẩn cấp',
      'Theo dõi thông tin cảnh báo'
    ],
    storm: [
      'Gia cố nhà cửa',
      'Dự trữ thực phẩm và nước',
      'Tránh ra ngoài khi bão đổ bộ',
      'Chuẩn bị đèn pin và pin dự phòng'
    ],
    landslide: [
      'Tránh xa khu vực dốc',
      'Quan sát các dấu hiệu bất thường',
      'Di tản khi có cảnh báo',
      'Không xây dựng gần sườn núi'
    ]
  }
};

// Initialize charts
function initializeCharts() {
  // Temperature Chart
  const temperatureChart = echarts.init(document.getElementById("temperatureChart"));
  temperatureChart.setOption({
    tooltip: { 
      trigger: "axis",
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#2563eb',
      textStyle: { color: '#1e293b' }
    },
    xAxis: { 
      type: "category", 
      data: weatherData.days,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b' }
    },
    yAxis: { 
      type: "value",
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    series: [{
      name: "Nhiệt độ (°C)",
      type: "line",
      data: weatherData.temperature,
      smooth: true,
      lineStyle: { color: "#FF6347", width: 3 },
      areaStyle: { 
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 99, 71, 0.3)' },
            { offset: 1, color: 'rgba(255, 99, 71, 0.1)' }
          ]
        }
      },
      itemStyle: { color: '#FF6347' },
      emphasis: { focus: 'series' }
    }]
  });

  // Humidity Chart
  const humidityChart = echarts.init(document.getElementById("humidityChart"));
  humidityChart.setOption({
    tooltip: { 
      trigger: "axis",
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#1E90FF',
      textStyle: { color: '#1e293b' }
    },
    xAxis: { 
      type: "category", 
      data: weatherData.days,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b' }
    },
    yAxis: { 
      type: "value",
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
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
        }
      },
      emphasis: { focus: 'series' }
    }]
  });

  // Rainfall Chart
  const rainfallChart = echarts.init(document.getElementById("rainfallChart"));
  rainfallChart.setOption({
    tooltip: { 
      trigger: "axis",
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#32CD32',
      textStyle: { color: '#1e293b' }
    },
    xAxis: { 
      type: "category", 
      data: weatherData.days,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b' }
    },
    yAxis: { 
      type: "value",
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { color: '#f1f5f9' } }
    },
    series: [{
      name: "Lượng mưa (mm)",
      type: "bar",
      data: weatherData.rainfall,
      itemStyle: { 
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#32CD32' },
            { offset: 1, color: '#98FB98' }
          ]
        }
      },
      emphasis: { focus: 'series' }
    }]
  });

  // Make charts responsive
  window.addEventListener('resize', () => {
    temperatureChart.resize();
    humidityChart.resize();
    rainfallChart.resize();
  });
}

// Initialize map
function initializeMap() {
  const map = L.map('map').setView([16.0471, 108.2062], 6);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Biến lưu trữ vị trí hiện tại và marker
  let currentLocationMarker = null;
  let currentPosition = null;
  let watchId = null;

  // Add some weather markers
  const weatherMarkers = [
    { lat: 21.0285, lng: 105.8542, city: 'Hà Nội', temp: '26°C', weather: '☁️' },
    { lat: 10.8231, lng: 106.6297, city: 'TP.HCM', temp: '30°C', weather: '☀️' },
    { lat: 16.0471, lng: 108.2062, city: 'Đà Nẵng', temp: '28°C', weather: '🌤️' },
    { lat: 10.0452, lng: 105.7469, city: 'Cần Thơ', temp: '29°C', weather: '🌧️' }
  ];

  weatherMarkers.forEach(marker => {
    L.marker([marker.lat, marker.lng])
      .addTo(map)
      .bindPopup(`
        <div class="text-center">
          <h3 class="font-bold text-lg">${marker.city}</h3>
          <p class="text-2xl">${marker.weather}</p>
          <p class="text-xl font-semibold text-blue-600">${marker.temp}</p>
        </div>
      `);
  });

  // Thêm nút điều khiển vị trí
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

  // Xử lý sự kiện nút định vị
  document.addEventListener('click', function(e) {
    if (e.target.closest('#locateBtn')) {
      locateCurrentPosition();
    }
    if (e.target.closest('#returnBtn')) {
      returnToCurrentLocation();
    }
  });

  // Hàm định vị vị trí hiện tại
  function locateCurrentPosition() {
    const locateBtn = document.getElementById('locateBtn');
    const returnBtn = document.getElementById('returnBtn');
    
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS');
      return;
    }

    // Hiển thị trạng thái đang tìm
    locateBtn.innerHTML = '<i class="ri-loader-4-line text-lg animate-spin"></i>';
    locateBtn.disabled = true;

    // Thử lấy vị trí với độ chính xác cao trước
    const highAccuracyOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0 // Không sử dụng cache cũ
    };

    // Thử lấy vị trí nhiều lần để có độ chính xác tốt hơn
    let attempts = 0;
    let bestPosition = null;
    let bestAccuracy = Infinity;

    function tryGetLocation() {
      attempts++;
      
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const accuracy = position.coords.accuracy;
          
          // Lưu vị trí có độ chính xác tốt nhất
          if (accuracy < bestAccuracy) {
            bestAccuracy = accuracy;
            bestPosition = position;
          }
          
          // Nếu độ chính xác đủ tốt (< 50m) hoặc đã thử 3 lần, sử dụng kết quả tốt nhất
          if (accuracy < 50 || attempts >= 3) {
            processLocationResult(bestPosition);
          } else {
            // Thử lại sau 1 giây
            setTimeout(tryGetLocation, 1000);
          }
        },
        function(error) {
          if (attempts < 3) {
            // Thử lại với độ chính xác thấp hơn
            setTimeout(() => {
              navigator.geolocation.getCurrentPosition(
                processLocationResult,
                handleLocationError,
                {
                  enableHighAccuracy: false,
                  timeout: 10000,
                  maximumAge: 30000
                }
              );
            }, 1000);
          } else {
            handleLocationError(error);
          }
        },
        highAccuracyOptions
      );
    }

    function processLocationResult(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy;
      
      currentPosition = { lat, lng };
      
      // Xóa marker cũ nếu có
      if (currentLocationMarker) {
        map.removeLayer(currentLocationMarker);
      }
      
      // Tạo marker mới cho vị trí hiện tại với màu sắc theo độ chính xác
      let markerColor = 'bg-blue-500';
      let accuracyText = 'Tốt';
      
      if (accuracy > 100) {
        markerColor = 'bg-red-500';
        accuracyText = 'Kém';
      } else if (accuracy > 50) {
        markerColor = 'bg-yellow-500';
        accuracyText = 'Trung bình';
      } else if (accuracy <= 20) {
        markerColor = 'bg-green-500';
        accuracyText = 'Rất tốt';
      }
      
      currentLocationMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: 'current-location-marker',
          html: `<div class="${markerColor} w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      }).addTo(map);
      
      // Thêm vòng tròn hiển thị độ chính xác
      const accuracyCircle = L.circle([lat, lng], {
        radius: accuracy,
        fillColor: markerColor.replace('bg-', '').replace('-500', ''),
        fillOpacity: 0.1,
        color: markerColor.replace('bg-', '').replace('-500', ''),
        weight: 1,
        opacity: 0.3
      }).addTo(map);
      
      // Lưu circle để có thể xóa sau
      currentLocationMarker.accuracyCircle = accuracyCircle;
      
      // Lấy thông tin địa phương
      getLocationInfo(lat, lng).then(locationInfo => {
        currentLocationMarker.bindPopup(`
          <div class="text-center p-2">
            <h3 class="font-bold text-lg text-blue-600">📍 Vị trí của bạn</h3>
            <p class="text-sm text-gray-600 mt-1">${locationInfo}</p>
            <div class="mt-2 p-2 bg-gray-50 rounded">
              <p class="text-xs text-gray-600">Độ chính xác: ${Math.round(accuracy)}m (${accuracyText})</p>
              <p class="text-xs text-gray-500">Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
              <p class="text-xs text-gray-400">${new Date().toLocaleString('vi-VN')}</p>
            </div>
            <button onclick="recalibrateLocation()" class="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
              🔄 Hiệu chỉnh lại
            </button>
          </div>
        `).openPopup();
      });
      
      // Di chuyển bản đồ đến vị trí với zoom phù hợp theo độ chính xác
      let zoomLevel = 15;
      if (accuracy > 100) zoomLevel = 13;
      else if (accuracy > 50) zoomLevel = 14;
      else if (accuracy <= 20) zoomLevel = 16;
      
      map.setView([lat, lng], zoomLevel);
      
      // Khôi phục nút và hiển thị nút quay về
      locateBtn.innerHTML = '<i class="ri-map-pin-line text-lg"></i>';
      locateBtn.disabled = false;
      returnBtn.style.display = 'block';
      
      // Bắt đầu theo dõi vị trí
      startLocationTracking();
    }

    function handleLocationError(error) {
      let errorMessage = 'Không thể xác định vị trí của bạn';
      let suggestion = '';
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Bạn đã từ chối quyền truy cập vị trí';
          suggestion = 'Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Thông tin vị trí không khả dụng';
          suggestion = 'Hãy thử di chuyển ra ngoài trời hoặc gần cửa sổ';
          break;
        case error.TIMEOUT:
          errorMessage = 'Yêu cầu định vị đã hết thời gian';
          suggestion = 'Hãy thử lại sau ít phút';
          break;
      }
      
      alert(`${errorMessage}\n\n💡 Gợi ý: ${suggestion}`);
      locateBtn.innerHTML = '<i class="ri-map-pin-line text-lg"></i>';
      locateBtn.disabled = false;
    }
    // Bắt đầu quá trình định vị
    tryGetLocation();
  }

  // Hàm quay về vị trí hiện tại
  function returnToCurrentLocation() {
    if (currentPosition && currentLocationMarker) {
      map.setView([currentPosition.lat, currentPosition.lng], 15);
      currentLocationMarker.openPopup();
    }
  }

  // Hàm theo dõi vị trí liên tục
  function startLocationTracking() {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
    
    watchId = navigator.geolocation.watchPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        // Cập nhật vị trí hiện tại
        currentPosition = { lat, lng };
        
        // Cập nhật marker
        if (currentLocationMarker) {
          currentLocationMarker.setLatLng([lat, lng]);
          
          // Cập nhật vòng tròn độ chính xác
          if (currentLocationMarker.accuracyCircle) {
            map.removeLayer(currentLocationMarker.accuracyCircle);
          }
          
          currentLocationMarker.accuracyCircle = L.circle([lat, lng], {
            radius: accuracy,
            fillColor: accuracy <= 50 ? 'blue' : accuracy <= 100 ? 'yellow' : 'red',
            fillOpacity: 0.1,
            color: accuracy <= 50 ? 'blue' : accuracy <= 100 ? 'yellow' : 'red',
            weight: 1,
            opacity: 0.3
          }).addTo(map);
          
          // Cập nhật thông tin popup
          getLocationInfo(lat, lng).then(locationInfo => {
            const accuracyText = accuracy <= 20 ? 'Rất tốt' : accuracy <= 50 ? 'Tốt' : accuracy <= 100 ? 'Trung bình' : 'Kém';
            currentLocationMarker.setPopupContent(`
              <div class="text-center p-2">
                <h3 class="font-bold text-lg text-blue-600">📍 Vị trí của bạn</h3>
                <p class="text-sm text-gray-600 mt-1">${locationInfo}</p>
                <div class="mt-2 p-2 bg-gray-50 rounded">
                  <p class="text-xs text-gray-600">Độ chính xác: ${Math.round(accuracy)}m (${accuracyText})</p>
                  <p class="text-xs text-gray-500">Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                  <p class="text-xs text-gray-400">${new Date().toLocaleString('vi-VN')}</p>
                  <p class="text-xs text-green-500">🔄 Đang cập nhật...</p>
                </div>
                <button onclick="recalibrateLocation()" class="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                  🔄 Hiệu chỉnh lại
                </button>
              </div>
            `);
          });
        }
      },
      function(error) {
        console.log('Lỗi theo dõi vị trí:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000
      }
    );
  }

  // Hàm lấy thông tin địa phương từ tọa độ
  async function getLocationInfo(lat, lng) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`);
      const data = await response.json();
      
      if (data && data.display_name) {
        // Lấy thông tin địa phương từ kết quả
        const address = data.address || {};
        const parts = [];
        
        if (address.road) parts.push(address.road);
        if (address.suburb || address.neighbourhood) parts.push(address.suburb || address.neighbourhood);
        if (address.city || address.town || address.village) parts.push(address.city || address.town || address.village);
        if (address.state) parts.push(address.state);
        if (address.country) parts.push(address.country);
        
        return parts.length > 0 ? parts.join(', ') : data.display_name;
      }
      
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.log('Lỗi lấy thông tin địa phương:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  }

  // Dọn dẹp khi trang được đóng
  window.addEventListener('beforeunload', function() {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  });
  return map;
  // Hàm hiệu chỉnh lại vị trí (có thể gọi từ popup)
  window.recalibrateLocation = function() {
    locateCurrentPosition();
  };
}

// Locate user function
function locateUser() {
  // Sử dụng hàm định vị mới
  const locateBtn = document.getElementById('locateBtn');
  if (locateBtn) {
    locateBtn.click();
  } else {
    // Fallback cho trường hợp nút chưa được tạo
    setTimeout(() => {
      const btn = document.getElementById('locateBtn');
      if (btn) btn.click();
    }, 1000);
  }
}

// Handle feature button clicks
function handleFeatureClick(feature) {
  if (feature === 'sos') {
    openSOSModal();
  } else {
    const message = featureMessages[feature];
    if (message) {
      alert(message);
    }
  }
}

// Search functionality
function handleLocationSearch() {
  const searchInput = document.getElementById('locationSearch');
  const query = searchInput.value.trim();
  
  if (query) {
    // Mock search functionality
    alert(`🔍 Đang tìm kiếm thời tiết cho: "${query}"\n\nKết quả sẽ được hiển thị trên bản đồ.`);
    searchInput.value = '';
  }
}

// Smooth scrolling for navigation links
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
      }
    });
  });
}

// Add fade-in animation to elements
function addFadeInAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  });

  document.querySelectorAll('.weather-card').forEach(card => {
    observer.observe(card);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Start clock
  setInterval(updateClock, 1000);
  updateClock();

  // Initialize charts
  initializeCharts();

  // Initialize map
  window.weatherMap = initializeMap();

  // Add event listeners for feature buttons
  document.querySelectorAll('.feature-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const feature = btn.getAttribute('data-feature');
      handleFeatureClick(feature);
    });
  });

  // Add search functionality
  const searchInput = document.getElementById('locationSearch');
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleLocationSearch();
    }
  });

  // Initialize smooth scrolling
  initializeSmoothScrolling();

  // Add fade-in animations
  addFadeInAnimation();

  // Make locateUser function globally available
  window.locateUser = locateUser;
});

// Handle window resize for responsive charts
window.addEventListener('resize', () => {
  // Charts will auto-resize due to the resize listeners in initializeCharts
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
  // Add hover effects to navigation
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(0)';
    });
  });

  // Add click effect to weather cards
  document.querySelectorAll('.weather-card').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
  });
});

// 🚨 SOS EMERGENCY FUNCTIONS - Các hàm SOS khẩn cấp

// Mở modal SOS
function openSOSModal() {
  const modal = document.getElementById('sosModal');
  if (!modal) {
    createSOSModal();
    return;
  }
  
  // Hiển thị modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Cập nhật vị trí hiện tại
  updateCurrentLocation();
  
  // Bắt đầu đếm ngược nếu chưa có
  if (!sosEmergencySystem.isEmergencyActive) {
    startEmergencyCountdown();
  }
}

// Đóng modal SOS
function closeSOSModal() {
  const modal = document.getElementById('sosModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
  
  // Dừng đếm ngược nếu đang chạy
  if (sosEmergencySystem.countdownInterval) {
    clearInterval(sosEmergencySystem.countdownInterval);
    sosEmergencySystem.countdownInterval = null;
  }
  sosEmergencySystem.isEmergencyActive = false;
}

// Tạo modal SOS
function createSOSModal() {
  const modalHTML = `
    <div id="sosModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <i class="ri-alarm-warning-line text-2xl"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">Cảnh báo khẩn cấp</h2>
                  <p class="text-red-100 text-sm">Nhấn và giữ để kích hoạt SOS</p>
                </div>
              </div>
              <button onclick="closeSOSModal()" class="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors">
                <i class="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- SOS Button Section -->
              <div class="text-center">
                <div class="mb-6">
                  <button id="sosButton" class="w-48 h-48 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 mx-auto flex items-center justify-center flex-col" 
                          onmousedown="startSOSActivation()" onmouseup="cancelSOSActivation()" onmouseleave="cancelSOSActivation()"
                          ontouchstart="startSOSActivation()" ontouchend="cancelSOSActivation()">
                    <i class="ri-shield-line text-6xl mb-2"></i>
                    <span class="text-2xl font-bold">SOS</span>
                  </button>
                  <p class="text-gray-600 mt-4">Nhấn và giữ để kích hoạt tín hiệu SOS</p>
                  <div id="sosCountdown" class="mt-2 text-red-600 font-bold text-lg hidden"></div>
                </div>
                
                <!-- Vị trí hiện tại -->
                <div class="bg-blue-50 rounded-xl p-4">
                  <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <i class="ri-map-pin-line text-blue-600"></i>
                    Vị trí hiện tại
                  </h3>
                  <div id="currentLocationInfo" class="text-sm text-gray-600">
                    <p>Đang xác định vị trí...</p>
                  </div>
                  <div class="mt-3 flex gap-2">
                    <button onclick="shareLocation()" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <i class="ri-share-line"></i>
                      Chia sẻ
                    </button>
                    <button onclick="openInMaps()" class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <i class="ri-map-line"></i>
                      Bản đồ
                    </button>
                  </div>
                </div>
              </div>

              <!-- Emergency Contacts -->
              <div>
                <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i class="ri-phone-line text-green-600"></i>
                  Danh bạ khẩn cấp
                </h3>
                <div class="space-y-3">
                  ${sosEmergencySystem.emergencyContacts.map(contact => `
                    <div class="contact-card bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-${getContactColor(contact.type)}-500 rounded-full flex items-center justify-center text-white shadow-md">
                          <i class="${contact.icon}"></i>
                        </div>
                        <div>
                          <h4 class="font-semibold text-gray-800">${contact.name}</h4>
                          <p class="text-gray-500 text-xs">${contact.description}</p>
                          <p class="text-gray-700 text-sm font-mono">${contact.number}</p>
                        </div>
                      </div>
                      <button onclick="callEmergency('${contact.number}', '${contact.name}')" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-md">
                        <i class="ri-phone-line"></i>
                        Gọi
                      </button>
                    </div>
                  `).join('')}
                </div>
                
                <div class="mt-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div class="flex items-center gap-2">
                    <i class="ri-information-line text-yellow-600"></i>
                    <p class="text-sm text-yellow-800">
                      <strong>Lưu ý:</strong> Trong trường hợp khẩn cấp, hãy gọi ngay số điện thoại cứu hộ quốc gia 113, 114, 115.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Mở modal sau khi tạo
  setTimeout(() => openSOSModal(), 100);
}

// Lấy màu sắc cho từng loại liên hệ
function getContactColor(type) {
  const colors = {
    police: 'blue',
    fire: 'red',
    medical: 'green',
    rescue: 'orange',
    traffic: 'purple',
    hospital: 'teal',
    family: 'pink',
    insurance: 'indigo'
  };
  return colors[type] || 'gray';
}

// Bắt đầu kích hoạt SOS
function startSOSActivation() {
  if (sosEmergencySystem.isEmergencyActive) return;
  
  sosEmergencySystem.isEmergencyActive = true;
  let countdown = 5;
  
  const countdownElement = document.getElementById('sosCountdown');
  const sosButton = document.getElementById('sosButton');
  
  if (countdownElement && sosButton) {
    countdownElement.classList.remove('hidden');
    sosButton.classList.add('animate-pulse');
    
    sosEmergencySystem.countdownInterval = setInterval(() => {
      countdownElement.textContent = `Kích hoạt SOS trong ${countdown}s`;
      countdown--;
      
      if (countdown < 0) {
        activateEmergency();
      }
    }, 1000);
  }
}

// Hủy kích hoạt SOS
function cancelSOSActivation() {
  if (sosEmergencySystem.countdownInterval) {
    clearInterval(sosEmergencySystem.countdownInterval);
    sosEmergencySystem.countdownInterval = null;
  }
  
  const countdownElement = document.getElementById('sosCountdown');
  const sosButton = document.getElementById('sosButton');
  
  if (countdownElement) {
    countdownElement.classList.add('hidden');
  }
  
  if (sosButton) {
    sosButton.classList.remove('animate-pulse');
  }
  
  sosEmergencySystem.isEmergencyActive = false;
}

// Kích hoạt tình trạng khẩn cấp
function activateEmergency() {
  cancelSOSActivation();
  
  // Hiển thị thông báo khẩn cấp
  showNotification('🚨 TÌNH TRẠNG KHẨN CẤP ĐÃ ĐƯỢC KÍCH HOẠT!', 'error');
  
  // Gửi tín hiệu SOS (giả lập)
  sendSOSSignal();
  
  // Đóng modal và hiển thị trạng thái khẩn cấp
  closeSOSModal();
  showEmergencyStatus();
}

// Gửi tín hiệu SOS
function sendSOSSignal() {
  const location = sosEmergencySystem.currentLocation;
  const timestamp = new Date().toLocaleString('vi-VN');
  
  // Giả lập gửi tín hiệu đến các dịch vụ cứu hộ
  console.log('🚨 SOS Signal Sent:', {
    timestamp,
    location,
    contacts: sosEmergencySystem.emergencyContacts
  });
  
  // Thông báo cho người dùng
  alert(`🚨 TÍN HIỆU SOS ĐÃ ĐƯỢC GỬI!\n\n📍 Vị trí: ${location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Không xác định'}\n⏰ Thời gian: ${timestamp}\n📞 Đang thông báo đến các dịch vụ cứu hộ...`);
}

// Hiển thị trạng thái khẩn cấp
function showEmergencyStatus() {
  const statusHTML = `
    <div id="emergencyStatus" class="fixed top-20 left-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-40 animate-pulse">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <i class="ri-alarm-warning-line text-2xl"></i>
          <div>
            <h3 class="font-bold">TÌNH TRẠNG KHẨN CẤP</h3>
            <p class="text-sm">Tín hiệu SOS đã được gửi - Đang chờ cứu hộ</p>
          </div>
        </div>
        <button onclick="cancelEmergency()" class="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded transition-colors">
          Hủy
        </button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', statusHTML);
}

// Hủy tình trạng khẩn cấp
function cancelEmergency() {
  const statusElement = document.getElementById('emergencyStatus');
  if (statusElement) {
    statusElement.remove();
  }
  showNotification('Đã hủy tình trạng khẩn cấp', 'info');
}

// Cập nhật vị trí hiện tại
function updateCurrentLocation() {
  const locationInfo = document.getElementById('currentLocationInfo');
  if (!locationInfo) return;
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        sosEmergencySystem.currentLocation = { lat, lng, accuracy };
        
        locationInfo.innerHTML = `
          <div class="space-y-2">
            <p><strong>Tọa độ GPS:</strong></p>
            <p class="font-mono text-xs bg-gray-100 p-2 rounded">
              Vĩ độ: ${lat.toFixed(6)}<br>
              Kinh độ: ${lng.toFixed(6)}
            </p>
            <p class="text-xs text-gray-500">Độ chính xác: ${Math.round(accuracy)}m</p>
            <p class="text-xs text-gray-500">Cập nhật: ${new Date().toLocaleTimeString('vi-VN')}</p>
          </div>
        `;
        
        // Lấy thông tin địa chỉ
        getLocationAddress(lat, lng);
      },
      function(error) {
        locationInfo.innerHTML = `
          <div class="text-red-600">
            <p>⚠️ Không thể xác định vị trí</p>
            <p class="text-xs mt-1">Vui lòng cho phép truy cập vị trí</p>
          </div>
        `;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  } else {
    locationInfo.innerHTML = `
      <div class="text-red-600">
        <p>⚠️ Trình duyệt không hỗ trợ GPS</p>
      </div>
    `;
  }
}

// Lấy địa chỉ từ tọa độ
async function getLocationAddress(lat, lng) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`);
    const data = await response.json();
    
    if (data && data.display_name) {
      const locationInfo = document.getElementById('currentLocationInfo');
      if (locationInfo) {
        const currentContent = locationInfo.innerHTML;
        locationInfo.innerHTML = `
          <div class="space-y-2">
            <p><strong>Địa chỉ:</strong></p>
            <p class="text-sm">${data.display_name}</p>
            ${currentContent}
          </div>
        `;
      }
    }
  } catch (error) {
    console.log('Lỗi lấy địa chỉ:', error);
  }
}

// Gọi số khẩn cấp
function callEmergency(number, name) {
  if (confirm(`Bạn có chắc chắn muốn gọi ${name} (${number})?`)) {
    // Mở ứng dụng điện thoại
    window.location.href = `tel:${number}`;
    
    // Hiển thị thông báo
    showNotification(`Đang gọi ${name}...`, 'info');
    
    // Log cuộc gọi khẩn cấp
    logEmergencyCall(number, name);
  }
}

// Ghi log cuộc gọi khẩn cấp
function logEmergencyCall(number, name) {
  const callLog = {
    timestamp: new Date().toISOString(),
    name: name,
    number: number,
    location: sosEmergencySystem.currentLocation
  };
  
  // Lưu vào localStorage để theo dõi
  const existingLogs = JSON.parse(localStorage.getItem('emergencyCallLogs') || '[]');
  existingLogs.push(callLog);
  localStorage.setItem('emergencyCallLogs', JSON.stringify(existingLogs));
  
  console.log('Emergency call logged:', callLog);
}

// Chia sẻ vị trí
function shareLocation() {
  const location = sosEmergencySystem.currentLocation;
  if (!location) {
    showNotification('Chưa xác định được vị trí', 'warning');
    return;
  }
  
  const shareText = `🚨 KHẨN CẤP - Vị trí của tôi:\nVĩ độ: ${location.lat.toFixed(6)}\nKinh độ: ${location.lng.toFixed(6)}\nGoogle Maps: https://maps.google.com/?q=${location.lat},${location.lng}\nThời gian: ${new Date().toLocaleString('vi-VN')}`;
  
  if (navigator.share) {
    navigator.share({
      title: 'Vị trí khẩn cấp',
      text: shareText
    }).then(() => {
      showNotification('Đã chia sẻ vị trí thành công!', 'success');
    }).catch(() => {
      fallbackShareLocation(shareText);
    });
  } else {
    fallbackShareLocation(shareText);
  }
}

// Chia sẻ vị trí dự phòng
function fallbackShareLocation(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Đã sao chép thông tin vị trí vào clipboard!', 'success');
  }).catch(() => {
    alert(text);
  });
}

// Mở trong Google Maps
function openInMaps() {
  const location = sosEmergencySystem.currentLocation;
  if (!location) {
    showNotification('Chưa xác định được vị trí', 'warning');
    return;
  }
  
  const mapsUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
  window.open(mapsUrl, '_blank');
}

// Đóng modal SOS khi click bên ngoài
document.addEventListener('click', function(e) {
  const sosModal = document.getElementById('sosModal');
  if (sosModal && e.target === sosModal) {
    closeSOSModal();
  }
});

// 🔴 DISASTER WARNING FUNCTIONS - Các hàm cảnh báo thiên tai

// Mở modal cảnh báo thiên tai
function openDisasterWarningModal() {
  const modal = document.getElementById('disasterModal');
  const updateTime = document.getElementById('updateTime');
  
  // Cập nhật thời gian
  updateTime.textContent = new Date().toLocaleString('vi-VN');
  
  // Hiển thị modal
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  
  // Tải dữ liệu cảnh báo
  loadDisasterData();
}

// Đóng modal cảnh báo thiên tai
function closeDisasterWarningModal() {
  const modal = document.getElementById('disasterModal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Tải dữ liệu cảnh báo
function loadDisasterData() {
  // Cập nhật cảnh báo hiện tại
  updateCurrentAlerts();
  
  // Cập nhật đánh giá rủi ro
  updateRiskAssessment();
  
  // Cập nhật lịch sử thiên tai
  updateDisasterHistory();
}

// Cập nhật cảnh báo hiện tại
function updateCurrentAlerts() {
  const alertsContainer = document.getElementById('currentAlerts');
  const alertCount = document.querySelector('h3:contains("Cảnh báo hiện tại")');
  
  if (disasterWarningSystem.currentAlerts.length === 0) {
    alertsContainer.innerHTML = `
      <i class="ri-shield-check-line text-green-500 text-4xl mb-3"></i>
      <p class="text-gray-600 text-lg">Không có cảnh báo nào</p>
      <p class="text-gray-500 text-sm mt-2">Khu vực của bạn hiện tại an toàn</p>
    `;
  } else {
    // Hiển thị các cảnh báo nếu có
    let alertsHTML = '';
    disasterWarningSystem.currentAlerts.forEach(alert => {
      alertsHTML += `
        <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-3 rounded">
          <div class="flex items-center">
            <i class="ri-alarm-warning-line text-red-500 text-xl mr-3"></i>
            <div>
              <h4 class="font-bold text-red-800">${alert.title}</h4>
              <p class="text-red-600 text-sm">${alert.description}</p>
              <p class="text-red-500 text-xs mt-1">${alert.time}</p>
            </div>
          </div>
        </div>
      `;
    });
    alertsContainer.innerHTML = alertsHTML;
  }
}

// Cập nhật đánh giá rủi ro
function updateRiskAssessment() {
  // Cập nhật điểm số tổng thể
  const overallScore = document.querySelector('.w-24.h-24 span');
  if (overallScore) {
    overallScore.textContent = disasterWarningSystem.riskAssessment.overall;
  }
  
  // Cập nhật các thanh tiến trình rủi ro (đã có trong HTML)
}

// Cập nhật lịch sử thiên tai
function updateDisasterHistory() {
  // Hiện tại không có sự kiện nào trong 30 ngày qua
  // Có thể mở rộng để hiển thị lịch sử thực tế
}

// Làm mới cảnh báo
function refreshAlerts() {
  const button = event.target.closest('button');
  const originalHTML = button.innerHTML;
  
  // Hiển thị trạng thái loading
  button.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Đang tải...';
  button.disabled = true;
  
  // Giả lập việc tải dữ liệu
  setTimeout(() => {
    // Cập nhật thời gian
    document.getElementById('updateTime').textContent = new Date().toLocaleString('vi-VN');
    
    // Tải lại dữ liệu
    loadDisasterData();
    
    // Khôi phục nút
    button.innerHTML = originalHTML;
    button.disabled = false;
    
    // Hiển thị thông báo thành công
    showNotification('Đã cập nhật cảnh báo mới nhất!', 'success');
  }, 2000);
}

// Đăng ký thông báo
function subscribeAlerts() {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      showNotification('Bạn đã đăng ký nhận thông báo cảnh báo thiên tai!', 'success');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showNotification('Đã bật thông báo cảnh báo thiên tai!', 'success');
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

// Chia sẻ cảnh báo
function shareAlerts() {
  const shareData = {
    title: 'Cảnh báo thiên tai - Weather & Life',
    text: 'Theo dõi tình hình thiên tai và cảnh báo kịp thời tại khu vực của bạn',
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

// Chia sẻ dự phòng
function fallbackShare() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showNotification('Đã sao chép link vào clipboard!', 'success');
  }).catch(() => {
    showNotification('Không thể chia sẻ. Vui lòng sao chép link thủ công!', 'warning');
  });
}

// Hiển thị thông báo
function showNotification(message, type = 'info') {
  // Tạo element thông báo
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
  
  // Màu sắc theo loại thông báo
  const colors = {
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };
  
  notification.className += ` ${colors[type] || colors.info}`;
  
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <i class="ri-${type === 'success' ? 'check' : type === 'warning' ? 'alert' : type === 'error' ? 'close' : 'information'}-line text-xl"></i>
      <p class="flex-1">${message}</p>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded">
        <i class="ri-close-line"></i>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Hiển thị với animation
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Tự động ẩn sau 5 giây
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

// Đóng modal khi click bên ngoài
document.addEventListener('click', function(e) {
  const modal = document.getElementById('disasterModal');
  if (e.target === modal) {
    closeDisasterWarningModal();
  }
});

// Đóng modal khi nhấn ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('disasterModal');
    if (!modal.classList.contains('hidden')) {
      closeDisasterWarningModal();
    }
  }
});
