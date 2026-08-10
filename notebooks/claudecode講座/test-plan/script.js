const LATITUDE = 33.5904;
const LONGITUDE = 130.4017;

const WEATHER_CODES = {
  0: { desc: "快晴", icon: "☀️" },
  1: { desc: "晴れ", icon: "🌤️" },
  2: { desc: "一部曇り", icon: "⛅" },
  3: { desc: "曇り", icon: "☁️" },
  45: { desc: "霧", icon: "🌫️" },
  48: { desc: "霧氷", icon: "🌫️" },
  51: { desc: "小雨", icon: "🌦️" },
  53: { desc: "小雨", icon: "🌦️" },
  55: { desc: "雨", icon: "🌧️" },
  56: { desc: "着氷性の霧雨", icon: "🌧️" },
  57: { desc: "着氷性の霧雨", icon: "🌧️" },
  61: { desc: "弱い雨", icon: "🌧️" },
  63: { desc: "雨", icon: "🌧️" },
  65: { desc: "強い雨", icon: "🌧️" },
  66: { desc: "着氷性の雨", icon: "🌧️" },
  67: { desc: "着氷性の雨", icon: "🌧️" },
  71: { desc: "弱い雪", icon: "🌨️" },
  73: { desc: "雪", icon: "🌨️" },
  75: { desc: "強い雪", icon: "❄️" },
  77: { desc: "霧雪", icon: "❄️" },
  80: { desc: "にわか雨", icon: "🌦️" },
  81: { desc: "にわか雨", icon: "🌧️" },
  82: { desc: "激しいにわか雨", icon: "⛈️" },
  85: { desc: "にわか雪", icon: "🌨️" },
  86: { desc: "激しいにわか雪", icon: "❄️" },
  95: { desc: "雷雨", icon: "⛈️" },
  96: { desc: "雷雨(雹あり)", icon: "⛈️" },
  99: { desc: "雷雨(激しい雹あり)", icon: "⛈️" },
};

const dateEl = document.getElementById("date");
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const weatherEl = document.getElementById("weather");

function formatDate(date) {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

async function fetchWeather() {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${LATITUDE}&longitude=${LONGITUDE}` +
    `&current_weather=true` +
    `&hourly=relative_humidity_2m,precipitation_probability` +
    `&daily=temperature_2m_max,temperature_2m_min` +
    `&timezone=Asia%2FTokyo`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`APIエラー: ${res.status}`);
  }
  return res.json();
}

function renderWeather(data) {
  const current = data.current_weather;
  const weatherInfo = WEATHER_CODES[current.weathercode] || {
    desc: "不明",
    icon: "❓",
  };

  document.getElementById("icon").textContent = weatherInfo.icon;
  document.getElementById("temp-now").textContent = `${Math.round(current.temperature)}°C`;
  document.getElementById("desc").textContent = weatherInfo.desc;
  document.getElementById("temp-max").textContent = `${Math.round(data.daily.temperature_2m_max[0])}°C`;
  document.getElementById("temp-min").textContent = `${Math.round(data.daily.temperature_2m_min[0])}°C`;
  document.getElementById("wind").textContent = `${current.windspeed} km/h`;

  const hourIndex = data.hourly.time.indexOf(current.time);
  const humidity = hourIndex >= 0 ? data.hourly.relative_humidity_2m[hourIndex] : null;
  const precip = hourIndex >= 0 ? data.hourly.precipitation_probability[hourIndex] : null;

  document.getElementById("humidity").textContent = humidity !== null ? `${humidity}%` : "--";
  document.getElementById("precip").textContent = precip !== null ? `${precip}%` : "--";

  loadingEl.classList.add("hidden");
  weatherEl.classList.remove("hidden");
}

function renderError(message) {
  loadingEl.classList.add("hidden");
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

dateEl.textContent = formatDate(new Date());

fetchWeather()
  .then(renderWeather)
  .catch((err) => renderError(`天気情報の取得に失敗しました: ${err.message}`));
