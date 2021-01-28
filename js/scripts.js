var searchInputEl = document.querySelector("#citysearch");
var searchBtnEl = document.querySelector("#search-btn");
var forecastContainerEL = document.querySelector("#forecast-container");
var formEl = document.querySelector("#city-search");


var getWeatherData = function(city) {
    
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=de073c425cc91c92bd56dfe7488ba727";

    //
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            console.log(response);
            response.json().then(function(data) {
                getUVIndex(data, city);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
}

var getUVIndex = function(data, city) {
    var latitude = data.coord.lat;
    var longtitude = data.coord.lon;

    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longtitude + "&appid=de073c425cc91c92bd56dfe7488ba727";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            console.log(response);
            response.json().then(function(data) {
                displayCityWeather(data, city, latitude, longtitude);
            });
        }
    });
}

var formSubmitHandler = function(event) {
    event.preventDefault(); 
    
    var cityInputValue = searchInputEl.value.trim(); 
 
    if(cityInputValue) {
         getWeatherData(cityInputValue);
 
         forecastContainerEL.textContent = "";
         searchInputEl.value = "";

 
    } 
    else {
        alert("Unable to locate " + cityInputValue + ". Please try your search again.");
     }
 };


 var displayCityWeather = function(data, city) {
    var currentDate = moment().format("L");
    city = city.charAt(0).toUpperCase() + city.slice(1);
    var cityAndDate = document.querySelector(".current-weather .card-title").textContent = city + " " + currentDate;

    //convert Kelvin to Fahrenheit
    var temp = data.main.temp;
    temp = Math.round((temp - 273.15) * (9/5) + 32);
    console.log(temp);

    // Humiditiy
    var humiditiyEl = data.main.humiditiy;
    // Wind speed
    var windSpeedEl = data.wind.speed;

    //UV


    // Display current temperature
    document.querySelector("#temp-item").innerHTML = "Temperature: " + temp + " &deg; F";
    document.querySelector("#humidity-item").innerHTML = "Humidity: " + humiditiyEl + "%";
    document.querySelector("#wind-item").innerHTML = "Wind Speed: " + windSpeedEl + " MPH";


    console.log(cityAndDate);
 }
// add event listener to form submit
formEl.addEventListener("submit", formSubmitHandler);

