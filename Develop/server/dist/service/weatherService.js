import dotenv from 'dotenv';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(city, date, description, temp, humidity, wind, uvIndex, sunrise, sunset) {
        this.city = city;
        this.date = date;
        this.description = description;
        this.temp = temp;
        this.humidity = humidity;
        this.wind = wind;
        this.uvIndex = uvIndex;
        this.sunrise = sunrise;
        this.sunset = sunset;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        // TODO: Define the baseURL, API key, and city name properties
        this.baseURL = '';
        this.apiKey = '';
        this.cityName = '';
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        const response = await fetch(query);
        const data = await response.json();
        return data;
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        const { lat, lon } = locationData;
        return { lat, lon };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        return `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        const { lat, lon } = coordinates;
        return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
        return this.destructureLocationData(locationData);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const response = await fetch(this.buildWeatherQuery(coordinates));
        const data = await response.json();
        return data;
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const { city } = response;
        const { dt, weather, main, wind, sys } = response;
        const { description } = weather[0];
        const { temp, humidity } = main;
        const { speed } = wind;
        const { sunrise, sunset } = sys;
        return new Weather(city, dt, description, temp, humidity, speed, 0, sunrise, sunset);
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData, sunrise, sunset) {
        const forecastArray = [];
        forecastArray.push(currentWeather);
        for (let i = 1; i < weatherData.length; i++) {
            const { dt, weather, temp, humidity, wind_speed, uvi } = weatherData[i];
            const { description } = weather[0];
            forecastArray.push(new Weather(this.cityName, dt, description, temp.day, humidity, wind_speed, uvi, sunrise, sunset));
        }
        return forecastArray;
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        this.cityName = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData.current);
        const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily, currentWeather.sunrise, currentWeather.sunset);
        return forecastArray;
    }
}
export default new WeatherService();
