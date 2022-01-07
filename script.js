const input = document.querySelector("input")
const button = document.querySelector("button")
const cityName = document.querySelector(".cityName")
const countryName = document.querySelector(".countryName")
const date = document.querySelector(".date")
const temp = document.querySelector(".temperature")
const weatherStatus = document.querySelector(".weatherStatus")
const weatherImg = document.querySelector(".weatherPhoto")
const sunrise = document.querySelector(".sunrise")
const sunset = document.querySelector(".sunset")
const pressure = document.querySelector(".pressure")
const humidity = document.querySelector(".humidity")
const wind = document.querySelector(".wind")
const windDirection = document.querySelector(".windDirection")

const LINK = "https://api.openweathermap.org/data/2.5/weather?q="
const KEY = `&appid=7154d3d306542812b538e821b485e4ea`
const UNITS = `&units=metric`
const LANG = `&lang=pl`

const popupError = document.querySelector(".popupError")
const closePopup = document.querySelector(".fa-times")
const blockClick = document.querySelector(".main")

const nowDate = new Date()

const nextDay = document.querySelectorAll(".nextDay")
const dayOfWeek = document.querySelectorAll(".DOW")
const tempDOW = document.querySelectorAll(".tempDOW")
const iconDOW = document.querySelectorAll(".iconDOW")
const descriptionDOW = document.querySelectorAll(".descriptionDOW")

const checkWeather = () =>
{
    const city = input.value || "Warszawa"
    const URL = LINK + city + KEY + UNITS + LANG;
    axios.get(URL)
    .then(res =>
    {
        popupError.style.display = "none"
        const icon = res.data.weather[0].icon
        sun(res)
        cityName.textContent = res.data.name
        countryName.textContent = `(${res.data.sys.country})`
        temp.textContent = `${Math.floor(res.data.main.temp)}°C`
        weatherStatus.textContent = res.data.weather[0].description
        weatherImg.setAttribute("src",`https://openweathermap.org/img/wn/${icon}@2x.png`)
        pressure.textContent = `${res.data.main.pressure} hPa`
        humidity.textContent = `${res.data.main.humidity} %`
        convertSpeed(res)
        windDirectionDeg(res)
        gettingDate()
        nextDaysToGet(res.data.coord)
        
    }).catch(error => openPopup(error))
}

const sun = (res) =>
{
    const unixSunrise = res.data.sys.sunrise
    const unixSunset = res.data.sys.sunset
    const dateSunrise = new Date(unixSunrise * 1000)
    const dateSunset = new Date(unixSunset * 1000)
    const hoursSunrise = dateSunrise.getHours()
    const minuteSunrise = dateSunrise.getMinutes()
    const hoursSunset = dateSunset.getHours()
    const minuteSunset = dateSunset.getMinutes()
    sunrise.textContent = `${hoursSunrise}:${minuteSunrise}`
    sunset.textContent = `${hoursSunset}:${minuteSunset}`
}

const gettingDate = () =>
{
    let today = new Date()
    let day = today.getDate()
    let month = today.getMonth() + 1
    const year = today.getFullYear()
    if (day<10) day = `0${day}`
    if(month === 13) month = 1
    if (month<10) month = `0${month}`
    today = `${day}.${month}.${year}`
    date.textContent = today
}
const convertSpeed = (res) =>
{
    const windSpeed = res.data.wind.speed * 3.6
    wind.textContent = `${Math.floor(windSpeed)} km/h`
}
const windDirectionDeg = (res) =>
{
    const direction = res.data.wind.deg
    windDirection.style.transform = `rotate(${direction + 180}deg)`
}
const pressEnter = (e) =>
{
    if(e.key == "Enter")
    {
        checkWeather()
    }
}

const closePopupToClick = () =>
{
    popupError.style.display = "none"
}
const openPopup = () =>
{
    popupError.style.display = "block"
}
const nextDaysToGet = (coord) =>
{
    const lon = coord.lon
    const lat = coord.lat
    const URL2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}` + LANG + KEY + UNITS
    axios.get(URL2)
        .then(res => 
            {
                for(let i=0;i<=4;i++){
                    getWeekDayByName(i)
                    tempDOW[i].textContent = `${Math.floor(res.data.daily[i+1].temp.day)}°C`
                    iconDOW[i].setAttribute("src",`https://openweathermap.org/img/wn/${res.data.daily[i+1].weather[0].icon}@2x.png`)
                    descriptionDOW[i].textContent = res.data.daily[i+1].weather[0].description
                }

            })
        .catch(error => openPopup(error))
}


const getWeekDayByName = (i) => 
{
    let weekDay = nowDate.getDay()
    let weekNameDay

    weekDay = weekDay + i + 1
    if(weekDay > 6) weekDay-=7

    if(weekDay == 0) weekNameDay = "Niedziela"
    if(weekDay == 1) weekNameDay = "Poniedziałek"
    if(weekDay == 2) weekNameDay = "Wtorek"
    if(weekDay == 3) weekNameDay = "Środa"
    if(weekDay == 4) weekNameDay = "Czwartek"
    if(weekDay == 5) weekNameDay = "Piątek"
    if(weekDay == 6) weekNameDay = "Sobota"
    
    dayOfWeek[i].textContent = weekNameDay
}


checkWeather()


input.addEventListener("keyup",pressEnter)
button.addEventListener("click",checkWeather)
closePopup.addEventListener("click",closePopupToClick)

