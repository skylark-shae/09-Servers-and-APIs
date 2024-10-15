import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
    latitude: number;
    longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;

    constructor(temperature: number, description: string, humidity: number, windSpeed: number) {
        this.temperature = temperature;
        this.description = description;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
    }
}

// TODO: Complete the WeatherService class
class WeatherService {
    // TODO: Define the baseURL, API key, and city name properties
    baseURL: string;
    apiKey: string;
    cityName: string;

    constructor() {
        this.baseURL = 'http://api.openweathermap.org/data/2.5';
        this.apiKey = process.env.API_KEY || ''; // Use your actual API key here
        this.cityName = '';
    }

    // TODO: Create fetchLocationData method
    private async fetchLocationData(query: string): Promise<any> {
        const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
        return response.json();
    }

    // TODO: Create destructureLocationData method
    private destructureLocationData(locationData: any): Coordinates {
        const { lat, lon } = locationData[0];
        return { latitude: lat, longitude: lon };
    }

    // TODO: Create buildGeocodeQuery method
    private buildGeocodeQuery(): string {
        return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
    }

    // TODO: Create buildWeatherQuery method
    private buildWeatherQuery(coordinates: Coordinates): string {
        return `${this.baseURL}/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=metric`;
    }

    // TODO: Create fetchAndDestructureLocationData method
    private async fetchAndDestructureLocationData(): Promise<Coordinates> {
        const locationData = await this.fetchLocationData(this.cityName);
        return this.destructureLocationData(locationData);
    }

    // TODO: Create fetchWeatherData method
    private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
        const response = await fetch(this.buildWeatherQuery(coordinates));
        return response.json();
    }

    // TODO: Build parseCurrentWeather method
    private parseCurrentWeather(response: any): Weather {
        const { main, weather, wind } = response;
        return new Weather(main.temp, weather[0].description, main.humidity, wind.speed);
    }

    // TODO: Complete buildForecastArray method
    private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
        return weatherData.map((data: any) => this.parseCurrentWeather(data));
    }

    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city: string): Promise<Weather> {
        this.cityName = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        const weatherData = await this.fetchWeatherData(coordinates);
        return this.parseCurrentWeather(weatherData);
    }
}

export default new WeatherService();
