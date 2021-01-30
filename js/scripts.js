var searchInputEl = document.querySelector("#citysearch");
var searchBtnEl = document.querySelector("#search-btn");
var forecastContainerEL = document.querySelector("#forecast-container");
var formEl = document.querySelector("#city-search");
var historyListEl = document.querySelector("#history-list");
var historyItem = document.querySelector(".history-item");
var alertBox = document.querySelector("#alert-box");
var weatherImg = document.querySelector(".weatherimg");
var uvItem = document.querySelector("#uv-item");
var cityHistoryArray = [];

var getWeatherData = function(city) {
    
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=de073c425cc91c92bd56dfe7488ba727";

    //
    alertBox.classList.add("hide");
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            console.log(response);
            response.json().then(function(data) {
                getUVIndex(data, city);
            });
            cityHistory(city);
        } else {

            alertBox.classList.add("alert-danger");
            alertBox.classList.remove("hide")
            alertBox.innerHTML = '<strong>Error:</strong> '+ city + " " + response.statusText + ". Please try your search again."; 
        }
    });
    
}


var getUVIndex = function(data, city) {
    
    var latitude = data.coord.lat;
    var longitude = data.coord.lon;
    var temp = data.main.temp;
    temp = Math.round(temp);
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var currentWeather = data.weather.main;

    
    
    
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly,alerts&appid=de073c425cc91c92bd56dfe7488ba727";

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            console.log(response);      
            response.json().then(function(forecastData) {
                var uvi = forecastData.current.uvi;  
                
                displayCityWeather(data, city, latitude, longitude, temp, humidity, windSpeed, uvi, currentWeather);
                dailyForeCast(forecastData);
                
            });

            
        }
    })
}
 var dailyForeCast = function(forecastData) {
    // var uvi = forecastData.current.uvi;
    
     for(i=0; i < 5; i++) {

        var dailyTemp = forecastData.daily[i].temp.day;
        var weatherForecast = forecastData.daily[i].weather[0].main;
    

        switch (weatherForecast) {
            case 'Thunderstorm':

                var icon= "11d";
                break;
            case 'Drizzle':

                var icon= "09d";
                break;
            case 'Rain':

                var icon= "10d";
                break;
            case 'Snow':

                var icon= "13d";
                break;
            case 'Clear':

                var icon= "01d";
                break;
            case 'Clouds':

                var icon= "02d";
                break;
            case 'Mist':
            case 'Smoke':
            case 'Haze':
            case 'Dust':
            case 'Fog':
            case 'Sand':
            case 'Ash':
            case 'Squall':
            case 'Tornado':  

                var icon= "50d@2x.png";
                break;
            default:

        }
        
        var dailyHumidity = forecastData.daily[i].humidity;

        dailyTemp = Math.round(dailyTemp);

        var new_date = moment().add(i, "d").format("L");
        var weatherIconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        var forecastCol = document.createElement("div");
        forecastCol.classList = "col";
        forecastCol.innerHTML = '<div class="card text-white bg-primary mb-3 forecast"><div class="card-header">' + new_date + '</div><div class="card-body "><img class="weatherimg" src="'+weatherIconUrl+'"><div class="list-group"><span class="list-item">Tempurate: ' + dailyTemp + '</span><span class="list-item"> Humidity: ' + dailyHumidity + '</span></div></div></div>';
        
        
        document.querySelector("#forecast-container").appendChild(forecastCol);
//        document.querySelector('.weatherimg').setAttribute("src", weatherIconUrl);



     }

 }

 ////////////////////////////////////////////////////////////
 // End dailyForeCast Function
 ////////////////////////////////////////////////////////////

var formSubmitHandler = function(event) {
    event.preventDefault(); 
    
    var cityInputValue = searchInputEl.value.trim(); 
 
    if(cityInputValue) {
         getWeatherData(cityInputValue);
 
         forecastContainerEL.textContent = "";
         searchInputEl.value = "";

 
    } 
    else {
        alertBox.classList.add("alert-danger");
        alertBox.classList.remove("hide")
        alertBox.textContent = "Unable to locate " + cityInputValue + ". Please try your search again.";
     }
 }

 ////////////////////////////////////////////////////////////
 // End formSubmitHandler Function
 ////////////////////////////////////////////////////////////

 var displayCityWeather = function(data, city, latitude, longitude, temp, humidity, windSpeed, uvi) {
    // console.log(data);
    // console.log("City: " + city);
    // console.log("Latitude: " + latitude);
    // console.log("Longitude: " + longitude);
    // console.log("Temperature: " + temp);
    // console.log("Humidity: " + humidity);
    // console.log("Wind Speed: " + windSpeed);
    var uvIndex = document.querySelector(".badge");
    if(uvIndex) {
        uvIndex.remove();
    }
    


    var currentDate = moment().format("L");
    city = city.toLowerCase();
    city = city.charAt(0).toUpperCase() + city.slice(1);
    var cityAndDate = document.querySelector(".current-weather .card-title").textContent = city + " " + currentDate;



    // Display current temperature
    document.querySelector("#temp-item").innerHTML = "Temperature: " + temp + " &deg; F";
    document.querySelector("#humidity-item").innerHTML = "Humidity: " + humidity + "%";
    document.querySelector("#wind-item").innerHTML = "Wind Speed: " + windSpeed + " MPH";

    var uvBadge = document.createElement("span");
    if(uvi <= 2) {
        uvBadge.classList = "badge bg-success"; 
    }
    else if(uvi > 2 && uvi <= 5) {
        uvBadge.classList = "badge bg-warning"; 
    }
    else if(uvi > 5 && uvi <= 7) {
        uvBadge.classList = "badge bg-danger"; 
    }
    else if(uvi > 7 && uvi <= 10) {
        uvBadge.classList = "badge bg-high"; 
    }
    else if (uvi > 10) {
        uvBadge.classList = "badge bg-extreme"; 
    }
    
    uvBadge.innerHTML = uvi;
    document.querySelector("#uv-item").append(uvBadge);
    


    console.log(cityAndDate);
 }

 ////////////////////////////////////////////////////////////
 // End displayCityWeather Function
 ////////////////////////////////////////////////////////////

 var cityHistory = function(city) {

        if(cityHistoryArray.indexOf(city) !== -1) {
            console.log(city + " is already in the history");
        }
        else {
        var historyEL = document.createElement("a");
        historyEL.classList = "list-item history-item";
        historyEL.setAttribute("href", city + "/weatherdata");
        city = city.toLowerCase();
        city = city.charAt(0).toUpperCase() + city.slice(1);
        historyEL.textContent = city;
    
        document.querySelector(".list-group").appendChild(historyEL);

        cityHistoryArray.push(city);
        }
        console.log(cityHistoryArray);

        // if history list too long(8) remove the oldest entry
        if(cityHistoryArray.length >= 8) {
            document.querySelector("#history-list .list-item:first-child").remove();
            cityHistoryArray.shift();
            console.log(cityHistoryArray);
        }

    
}
 ////////////////////////////////////////////////////////////
 // End cityHistory Function
 ////////////////////////////////////////////////////////////

var reloadCityHandler = function(events) {
    event.preventDefault();
    var reloadCity = event.target.textContent;

    if(reloadCity) {
        getWeatherData(reloadCity);
    }
}


 historyListEl.addEventListener("click", reloadCityHandler);
// add event listener to form submit
formEl.addEventListener("submit", formSubmitHandler);

