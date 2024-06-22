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
    pageBody.style.backgroundImage = `linear-gradient(10deg, rgb(4, 99, 202), rgb(4, 135, 226))`

    if(searchNum == 0) {
        const searchBox = document.querySelector("#searchBox");
        document.querySelector("#worldMap").style.opacity = "0"
        searchBox.style.transform = "translateY(0%)"
        setTimeout(() => {
            const contentBox = document.querySelector("#contentBox");
            contentBox.style.visibility = "visible"
            document.querySelector("#worldMap").remove()
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
            hourlyTempGraph[i].style.backgroundColor = `rgb(${((res2.data.list[i].main.temp)-273.15).toFixed(1)*5},0,${255 - (((res2.data.list[i].main.temp)-273.15).toFixed(1)*5)})`
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


