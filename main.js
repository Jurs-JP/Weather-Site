let searchNum = 0;
window.scrollTo(0,0)

const pageBody = document.querySelector("body")

const cityInput = document.querySelector("#cityName");
const city = document.querySelector("#city");
const dateNow = document.querySelector("#dateNow")
const weatherIcon = document.querySelector("#weatherIcon");
const temp = document.querySelector("#temp");
const conditionText = document.querySelector("#conditionText")
const feelsLike = document.querySelector("#feelsLike")

const wind = document.querySelector("#windValue")
const pressure = document.querySelector("#pressureValue")
const precipitation = document.querySelector("#precipitationValue")
const humidity = document.querySelector("#humidityValue")
const cloud = document.querySelector("#cloudValue")

const hourlyArr = document.querySelectorAll("#todayHourlyWeather > *")
const hourlyTempText = document.querySelectorAll("#todayHourlyWeather > * > *:first-child > *:first-child")
const hourlyTempGraph = document.querySelectorAll("#todayHourlyWeather > * > *:first-child > *:last-child")
const hourlyTime = document.querySelectorAll("#todayHourlyWeather > * > *:last-child")

const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

cityInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
      event.preventDefault();
      document.querySelector("#searchCity").click();
    }
  });

let searchCity = (e) => {

    const inputValue = cityInput.value;

    getWeather(inputValue)

    if(searchNum == 0) {
        const searchBox = document.querySelector("#searchBox");
        searchBox.style.transform = "translateY(0%)"
        setTimeout(() => {
            const contentBox = document.querySelector("#contentBox");
            contentBox.style.visibility = "visible"
        }, 1000)
    }

    searchNum++
}

const getWeather = async (id) => {
    
    try 
        {
        const config = {headers: {Accept: 'application/json'}}
        const res = await axios.get(`https://api.weatherapi.com/v1/current.json?key=6fbc8dc19ff14d33862222621240906&q=${id}`, config);

        let latitude = (res.data.location.lat)
        let longitude = (res.data.location.lon)
        
        weatherToday(latitude, longitude)
        
        let cityResult = (res.data.location.region)
        let countryResult = (res.data.location.country)
        let dateResult = (res.data.location.localtime)
        let iconResult = (res.data.current.condition.icon)
        let tempResult = (res.data.current.temp_c)
        let feelsResult = (res.data.current.feelslike_c)
       
        let windResult = (res.data.current.wind_kph)
        let atmResult = (res.data.current.pressure_mb)
        let precipitationResult = (res.data.current.precip_mm)
        let humidityResult = (res.data.current.humidity)
        let cloudResult = (res.data.current.cloud)
        
        let conditionResult = (res.data.current.condition.text)

        city.innerHTML = `${cityResult}, ${countryResult}`
        temp.innerHTML = `${tempResult}°C`
        dateNow.innerHTML = dateResult.slice(11)
        conditionText.innerHTML = conditionResult
        feelsLike.innerHTML = `Feels like ${feelsResult}°`
        weatherIcon.style.backgroundImage = `url("${iconResult}")`;
    
        wind.innerHTML = `${windResult} km/h`
        pressure.innerHTML = `${atmResult} mb`
        precipitation.innerHTML = `${precipitationResult} mm`
        humidity.innerHTML = `${humidityResult}%`
        cloud.innerHTML = cloudResult


        let timeNow = (dateResult.slice(11, 13).match(/(\d+)/)[0])
        console.log(timeNow)

        if (timeNow > 19 || timeNow < 4) {
            pageBody.style.background = `linear-gradient(2deg, rgba(37,56,93,0.85) 20%, rgba(37,56,93,0.90) 50%, rgba(37,56,93,1) 85%)`
            
        } 
        else if (timeNow >= 4 && timeNow < 6) {
            pageBody.style.background = `linear-gradient(2deg, rgba(219, 216, 216, 0.65) 0%, rgba(142,47,167,0.45) 40%, rgba(57, 100, 185, 0.85) 75%)`

        }
        else if (timeNow >= 6 && timeNow < 11) {
            pageBody.style.background = `linear-gradient(2deg, rgba(176,168,59,1) 0%, rgba(253,29,29,0.6) 40%,  rgba(57, 100, 185, 0.85) 75%)`

        }
        else if (timeNow >= 11 && timeNow < 13) {
            pageBody.style.background = `linear-gradient(2deg, rgba(179,172,83,1) 0%, rgba(253,29,29,0.72) 50%, rgba(69,109,189,0.85) 90%)`

        }
        else if (timeNow >= 13 && timeNow < 17) {
            pageBody.style.background = `linear-gradient(2deg, rgba(179,172,83,0.8) 5%, rgba(253,29,29,0.7) 60%, rgba(69,109,189,0.6) 99%)`
        } 
        else {
            pageBody.style.background = `linear-gradient(2deg, rgba(253,117,29,0.75) 20%, rgba(179,172,83,0.8) 50%, rgba(69,109,189,0.6) 85%)`
        }
    }
    catch(e)
        {
        dateNow.innerHTML = "--:--:--"
        console.log("ERROR!", e)
    }
};


const weatherToday = async (latitude, longitude) => {
    try {
        const config2 = {headers: {Accept: 'application/json'}}
        const res2 = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=be513ddf6e7ac5604545cdad8706134f`, config2);                        

        for(let i = 0; i < hourlyArr.length; i++) {
            
            if (res2.data.list[i].dt_txt.slice(11,13) >= 12) {
                if (res2.data.list[i].dt_txt.slice(11,13) > 12) {
                    hourlyTime[i].innerHTML = `${res2.data.list[i].dt_txt.slice(11,13)-12} PM`
                } else { hourlyTime[i].innerHTML = `${res2.data.list[i].dt_txt.slice(11,13)} PM` }
            } else {
                if (res2.data.list[i].dt_txt.slice(11,13) == 0) {
                    hourlyTime[i].innerHTML= `12 AM`
                } else {
                    hourlyTime[i].innerHTML= `${res2.data.list[i].dt_txt.slice(12,13)} AM`
                }
            }
            
            hourlyTempText[i].innerHTML = `${((res2.data.list[i].main.temp)-273.15).toFixed(1)}°`
            hourlyTempGraph[i].style.height = `${(((res2.data.list[i].main.temp)-273.15).toFixed(1))*2}%`
            hourlyTempGraph[i].style.backgroundColor = `rgba(${((res2.data.list[i].main.temp)-273.15).toFixed(1)*5},0,${255 - (((res2.data.list[i].main.temp)-273.15).toFixed(1)*5)}, 0.6)`
        }
       
        const futureWeather = document.querySelector("#futureWeather")

        if (futureWeather.childNodes.length < 4) {
            for (let i = 0; i < 4; i++) {
                const futureDaysForecast = document.createElement("div")
              
                document.querySelector("#futureWeather").appendChild(futureDaysForecast)
            }
        }

       const futureDays = document.querySelectorAll("#futureWeather > * ")
      
       
       for (let i = 0; i < futureDays.length; i++) {

            const birthday = new Date(res2.data.list[(i+1)*8].dt_txt);
            const day1 = birthday.getDay();

            futureDays[i].innerHTML = `${dayOfWeek[day1]} ${res2.data.list[(i+1)*8].dt_txt.slice(8, 10)} <div><div></div><div><div></div><div></div></div></div>`
           
            const futureDaysMaxTemp = document.querySelectorAll("#futureWeather > * > * > *:last-child > *:first-child")
            const futureDaysMinTemp = document.querySelectorAll("#futureWeather > * > * > *:last-child > *:last-child")
            
            let tempArray = []

            for(let e = 0; e <=4; e++) {
                tempArray.push((res2.data.list[((i+1)*8)+e].main.temp))
            }
            
            futureDaysMaxTemp[i].innerHTML = `${((Math.max(...tempArray))-273.15).toFixed(1)}°`
            futureDaysMinTemp[i].innerHTML = `${((Math.min(...tempArray))-273.15).toFixed(1)}°`
            
            futureWeatherIcon(res2.data.list[(i+1)*8].weather[0].icon, i)
       }

       
       
    }  
    catch {
        console.log("Geolocation Error!")
        console.log(latitude)
        console.log(longitude)
    }
}

const futureWeatherIcon = async (icon, num) => {
    try{
        const config3 = {headers: {Accept: 'application/json'}}
        const res3 = await axios.get(`https://openweathermap.org/img/wn/${icon}@2x.png`, config3);
        
        const futureDays = document.querySelectorAll("#futureWeather > * ")
        const futureDaysIcon = document.querySelectorAll("#futureWeather > * > * > *:first-child")

       for (let i = 0; i < futureDays.length; i++) {
            futureDaysIcon[num].style.backgroundImage = `url(${res3.config.url})`
       }
    } 
    catch {
        console.log("Future Weather Not Available")
    }
}


