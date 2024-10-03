import { fetchWeather } from './weatherAPI.js';

class WeatherApp {
    constructor() {
        this.searchBtn = document.getElementById('search-btn');
        this.cityInput = document.getElementById('city-input');
        this.weatherContainer = document.getElementById('weather-container');
        this.historyList = document.getElementById('history-list');
        this.searchHistory = [];

        this.init();
    }

    init() {
        // TODO: Add event listeners
        // TODO: Check for city in URL parameters
        this.searchBtn.addEventListener("click", (event)=>this.handleSearch());
        this.cityInput.addEventListener("keypress", (event)=>{
            if(event.key === "Enter")
                this.handleSearch();
        })

    

    }

    handleSearch() {
        const city = this.cityInput.value.trim();
        if(city){
            fetchWeather(city)
                .then(weatherData => {
                    this.displayWeather(weatherData);
                    this.addToHistory(city);
                    this.updateURL(city)

                }).catch(error =>{
                    
                    console.error("Error in handleSearch: ", error);
                    this.weatherContainer.innerHTML = "<p>An erroe occured. Please try again. </p>";

                });
        }

    }

    displayWeather(data) {
        if(data.code === "404"){
            this.weatherContainer.innerHTML = "<p>City not found. Please try again.</p>";
            return;
        }

        const weatherHTML = `
            <h2>${data.name},${data.sys.country}</h2>
            <p>Temperature : ${Math.round(data.main.temp-273.15)}°C</p>
            <p>Humidity : ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed}  m/s</p>
        `;

        this.weatherContainer.innerHTML = weatherHTML;
    }

    addToHistory(city) {
        if(!this.searchHistory.includes(city)){
            this.searchHistory.unshift(city);
            if(this.searchHistory.length > 5){
                this.searchHistory.pop();
            }

            this.updateHistoryList();
        }
    }

    updateHistoryList() {
        this.historyList.innerHTML = this.searchHistory
        .map(city => `<li>${city}</li>`)
        .join('');
    }

    handleHistoryClick(e) {
        if(e.target.tagName === "LI"){
            this.cityInput.value = e.target.textContent;
            this.handleSearch()
        }
    }

    updateURL(city) {
        const url = new URL(window.location);
        url.searchParams.set("city", city);
        window.history.pushState({},'',url);
    }
}

const app = new WeatherApp();