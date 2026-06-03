const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const elements = {
  cityInput: document.getElementById('city-input'),
  searchButton: document.getElementById('search-button'),
  errorMessage: document.getElementById('error-message'),
  weatherCard: document.getElementById('weather-card'),
  forecastSection: document.getElementById('forecast-section'),
  cityName: document.getElementById('city-name'),
  weatherDescription: document.getElementById('weather-description'),
  temperature: document.getElementById('temperature'),
  feelsLike: document.getElementById('feels-like'),
  humidity: document.getElementById('humidity'),
  windSpeed: document.getElementById('wind-speed'),
  conditionMain: document.getElementById('condition-main'),
  forecastGrid: document.getElementById('forecast-grid'),
};

function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.className = 'message error';
}

function clearError() {
  elements.errorMessage.textContent = '';
  elements.errorMessage.className = 'message hidden';
}

function showWeather() {
  elements.weatherCard.classList.remove('hidden');
  elements.forecastSection.classList.remove('hidden');
}

function hideWeather() {
  elements.weatherCard.classList.add('hidden');
  elements.forecastSection.classList.add('hidden');
}

function fetchCurrentWeather(city) {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error('City not found');
    }
    return response.json();
  });
}

function fetchForecast(city) {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error('Forecast data unavailable');
    }
    return response.json();
  });
}

function displayCurrentWeather(data) {
  elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
  elements.weatherDescription.textContent = data.weather[0].description;
  elements.temperature.textContent = Math.round(data.main.temp);
  elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  elements.humidity.textContent = `${data.main.humidity}%`;
  elements.windSpeed.textContent = `${Math.round(data.wind.speed)} m/s`;
  elements.conditionMain.textContent = data.weather[0].main;
}

function buildForecastCards(forecastData) {
  const forecastItems = forecastData.list.filter((item) => item.dt_txt.includes('12:00:00'));

  return forecastItems.slice(0, 5).map((item) => {
    const date = new Date(item.dt * 1000);
    const day = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    const label = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);

    const card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = `
      <span>${day}</span>
      <strong>${label}</strong>
      <p>${item.weather[0].main}</p>
      <strong>${Math.round(item.main.temp)}°C</strong>
      <small>Humidity: ${item.main.humidity}%</small>
    `;

    return card;
  });
}

function displayForecast(data) {
  elements.forecastGrid.innerHTML = '';
  const cards = buildForecastCards(data);
  cards.forEach((card) => elements.forecastGrid.appendChild(card));
}

function searchCity() {
  const city = elements.cityInput.value.trim();
  if (!city) {
    showError('Please enter a city name.');
    hideWeather();
    return;
  }

  if (API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
    showError('Set your OpenWeatherMap API key in app.js before searching.');
    hideWeather();
    return;
  }

  clearError();

  Promise.all([fetchCurrentWeather(city), fetchForecast(city)])
    .then(([currentData, forecastData]) => {
      displayCurrentWeather(currentData);
      displayForecast(forecastData);
      showWeather();
    })
    .catch((error) => {
      showError(error.message);
      hideWeather();
    });
}

elements.searchButton.addEventListener('click', searchCity);
elements.cityInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchCity();
  }
});
