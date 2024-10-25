// Cargar el sonido de la alarma
const alarmaSonido = new Audio('alarma.mp3');

// Función para actualizar el reloj y la fecha
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
  document.getElementById('date').textContent = `Día: ${day}/${month}/${year}`;
}

// Actualizar el reloj y la fecha cada segundo
setInterval(updateClock, 1000);

// Manejo de alarmas
const alarmForm = document.getElementById('alarmForm');
const alarmList = document.getElementById('alarmList');
let alarmaMensaje; // Elemento para mostrar el mensaje de alarma
let alarms = [];

// Agregar alarma
alarmForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const alarmTime = document.getElementById('alarmTime').value;
  if (alarmTime) {
    const alarmDate = new Date();
    const [hour, minute] = alarmTime.split(':');
    alarmDate.setHours(hour, minute, 0, 0);

    alarms.push({ time: alarmTime, date: alarmDate });
    displayAlarms();
    document.getElementById('alarmTime').value = '';
  }
});

// Mostrar alarmas en pantalla
function displayAlarms() {
  alarmList.innerHTML = '<h3>Alarmas:</h3>' + 
    alarms.map((alarm, index) => `
      <div id="alarm-${index}">
        <p>${alarm.time}</p>
        <p id="countdown-${index}">Tiempo restante: Calculando...</p>
      </div>
    `).join('');
}

// Actualizar el temporizador de cuenta regresiva para cada alarma
function updateCountdowns() {
  const now = new Date();
  alarms.forEach((alarm, index) => {
    const countdownElement = document.getElementById(`countdown-${index}`);
    const timeDiff = alarm.date - now;

    if (timeDiff > 0) {
      const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDiff / 1000) % 60);
      countdownElement.textContent = `Tiempo restante: ${hours}h ${minutes}m ${seconds}s`;
    } else {
      countdownElement.textContent = '¡Alarma activa!';
    }
  });
}

// Verificar las alarmas y reproducir el sonido cuando coincide la hora
setInterval(() => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  alarms.forEach((alarm, index) => {
    if (currentTime === alarm.time) {
      alarmaSonido.play(); // Reproducir sonido

      // Crear y mostrar el mensaje de alarma
      alarmaMensaje = document.createElement('div');
      alarmaMensaje.textContent = `¡Alarma! Son las ${alarm.time}`;
      alarmaMensaje.className = 'alarm-message';
      alarmaMensaje.onclick = () => {
        alarmaSonido.pause(); // Detener el sonido
        alarmaMensaje.remove(); // Eliminar el mensaje
      };

      document.body.appendChild(alarmaMensaje);
      alarms.splice(index, 1); // Quitar la alarma después de sonar
      displayAlarms();
    }
  });
}, 1000);

// Actualizar cuenta regresiva cada segundo
setInterval(updateCountdowns, 1000);
