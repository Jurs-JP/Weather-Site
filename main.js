let searchNum = 0;
window.scrollTo(0,0)

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

// const hourlyObject = {
//     1: {
//         time: 0,
//         temp: 0
//         },  
//     2: {
//         time: 0,
//         temp: 0
//         }

// }


let searchCity = (e) => {
    const input = document.querySelector("#cityName");
    const inputValue = input.value;

    getWeather(inputValue)

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

    // city.textContent = data.res.data
    // console.log(res)
}

const getWeather = async (id) => {
    
    try 
        {
        const config = {headers: {Accept: 'application/json'}}
        const res = await axios.get(`https://api.weatherapi.com/v1/current.json?key=6fbc8dc19ff14d33862222621240906&q=${id}`, config);
        
        let latitude = (res.data.location.lat)
        let longitude = (res.data.location.lon)
        console.log(res)
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
                                
    console.log(res2)


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
    
    }  
    catch {
    console.log("Geolocation Error!")
    console.log(latitude)
    console.log(longitude)
    }
}



