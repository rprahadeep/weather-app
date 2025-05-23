import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import searchicon from '../assets/search.png'
import clear from '../assets/clear.png'
import cloud from '../assets/cloud.png'
import drizzle from '../assets/drizzle.png'
import humidity from '../assets/humidity.png'
import rain from '../assets/rain.png'
import snow from '../assets/snow.png'
import wind from '../assets/wind.png'


function Weather() {

  const inputRef = useRef()
  const [weatherData, setWeatherData] = useState(false)

  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13m": snow
  }

  const geocode = async (city) => {
    if(city===""){alert("Enter City Name"); return;}
    try{
      const url=`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${1}&appid=${import.meta.env.VITE_APP_ID}`
      const response = await fetch(url)
      const data = await response.json()
      const {lat, lon} = data[0]
      weather(lat, lon, city);
    } catch(error){
      console.error("Failed to fetch geolocation", error);
    }
  }

  const weather = async (lat, lon, city) => {
    try{
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      const icon = allIcons[data.weather[0].icon] || clear
      console.log(data)
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: city || data.name,
        icon: icon
      })

    } catch (error) {
      console.error("Failed to fetch city weather", error)
    }

  }

  useEffect(()=>{
    geocode("London")
  },[])

  return (
    <div className='weather'>
      <div className='searchbar'>
        <input ref={inputRef} type='text' placeholder='Search'></input>
        <img src={searchicon} alt="search icon" onClick={()=>{geocode(inputRef.current.value)}}></img>
      </div>
      <img src={weatherData.icon} alt="weather image" className='wearher-icon'></img>
      <p className='temperature'>{weatherData.temperature}°C</p>
      <p className='location'>{weatherData.location}</p>
      <div className="weather-data">
        <div className="col">
          <img src={humidity} alt="humidity-icon"></img>
          <div>
            <p>{weatherData.humidity}%</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className="col">
          <img src={wind} alt="wind-icon"></img>
          <div>
            <p>{weatherData.windSpeed} Km/h</p>
            <span>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather