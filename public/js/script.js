const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit('location', { latitude, longitude });
    },
    (error) => {
      console.error('Error getting location:', error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
} else {
  alert('Geolocation not supported');
}

const map = L.map('map').setView([0, 0], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'OpenStreetMap',
}).addTo(map);

const markers = {};

socket.on('location', (data) => {
  console.log('Location update received:', data);
  const { id, latitude, longitude } = data;

  if (id === socket.id) {
    map.setView([latitude, longitude], 13);
  }

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    const marker = L.marker([latitude, longitude]).addTo(map);
    markers[id] = marker;
  }
});

socket.on('user-disconnected', (data) => {
  if (data && data.id && markers[data.id]) {
    map.removeLayer(markers[data.id]);
    delete markers[data.id];
  }
});

// let lat = 25.4517168;
// let lng = 85.0525801;
// setInterval(() => {
//   lat += (Math.random() - 0.5) * 0.001;
//   lng += (Math.random() - 0.5) * 0.001;
//   socket.emit('location', { latitude: lat, longitude: lng });
// }, 5000);
