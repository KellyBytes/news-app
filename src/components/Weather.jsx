import { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');

  const fetchWeather = async (city) => {
    const W_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&APPID=${W_API_KEY}`;

    try {
      const response = await axios.get(url);
      // console.log(response.data);

      if (response.data.cod !== 200) {
        setData({ notFound: true });
      } else {
        setData(response.data);
        setLocation('');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setData({ notFound: true });
    }
  };

  const search = () => {
    if (location.trim() !== '') {
      fetchWeather(location);
    }
  };

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  const getWeatherIcon = (weatherType) => {
    switch (weatherType) {
      case 'Clear':
        return 'bxs-sun text-orange-300';
      case 'Rain':
      case 'Drizzle':
        return 'bxs-cloud-rain text-sky-300';
      case 'Thunderstorm':
        return 'bxs-cloud-lightning text-blue-800';
      case 'Snow':
        return 'bxs-cloud-snow text-cyan-300';
      case 'Clouds':
      case 'Fog':
      case 'Haze':
      case 'Mist':
        return 'bxs-cloud text-neutral-50';
      default:
        return 'bxs-cloud text-neutral-50';
    }
  };

  const getWindDirection = (degrees) => {
    const directions = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    const adjustedDegrees = (degrees + 11.25) % 360;
    const index = Math.floor(adjustedDegrees / 22.5);

    return directions[index];
  };

  useEffect(() => {
    fetchWeather('Edmonton');
  }, []);

  return (
    <div className="weather w-full lg:w-60 xl:w-72 2xl:w-94 h-full lg:h-[45%] flex flex-col justify-center items-center gap-y-4 xl:gap-y-6 2xl:gap-y-8 p-4 bg-zinc-900 rounded-xl">
      <div className="search flex flex-col gap-y-2">
        <div className="search-top flex">
          <i className="fa-solid fa-location-dot text-base 2xl:text-lg text-neutral-200 translate-y-1 xl:translate-y-2"></i>
          <div className="location font-comfortaa font-bold text-sm xl:text-lg 2xl:text-xl text-neutral-50 pl-2">
            {data.name}
            {data.sys ? `, ${data.sys.country}` : null}
          </div>
        </div>
        <div className="search-location relative">
          <input
            type="text"
            placeholder="Enter Location"
            className="w-60 lg:w-48 xl:w-54 h-10 bg-transparent outline-0 border-b-1 border-[#aaa] xl:text-lg 2xl:text-xl text-neutral-200 pl-4"
            value={location}
            onFocus={(e) => (e.target.value = '')}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <i
            className="fa-solid fa-magnifying-glass absolute top-0 translate-y-3 right-4 text-lg text-neutral-50/80"
            onClick={search}
          ></i>
        </div>
      </div>
      {data.notFound ? (
        <div className="font-comfortaa text-lg xl:text-xl text-neutral-200 mb-12">
          Not Found 😔
        </div>
      ) : (
        <div className="weather-data flex flex-col items-center">
          <i
            className={`bx ${
              data.weather &&
              data.weather[0] &&
              getWeatherIcon(data.weather[0].main)
            } text-4xl xl:text-6xl 2xl:text-7xl`}
          ></i>
          <div className="weather-type font-comfortaa text-sm xl:text-lg 2xl:text-xl text-neutral-200 mb-2">
            {data.weather ? data.weather[0].main : null}
          </div>
          <div className="temp font-comfortaa text-sm xl:text-xl 2xl:text-2xl text-neutral-200 mb-2">
            {data.main ? `${Math.floor(data.main.temp)}℃` : null}
          </div>
          {/* For max/min temperatures
        <div className="temp-minmax font-comfortaa text-[1.4rem] text-neutral-400">
          {data.main ? (
            <>
              <i className="fa-solid fa-arrow-up text-[1.2rem]" />{' '}
              {Math.floor(data.main.temp_max)}℃ /{' '}
              <i className="fa-solid fa-arrow-down text-[1.2rem]" />{' '}
              {Math.floor(data.main.temp_min)}℃
            </>
          ) : null}
        </div> */}
          <div className="extra-info flex gap-6 xl:mt-4">
            <div className="humidity text-xs xl:text-base 2xl:text-lg text-neutral-400">
              {data.main ? (
                <>
                  <i className="fa-solid fa-droplet"></i> {data.main.humidity}
                  <span className="text-xs xl:text-base">%</span>
                </>
              ) : null}
            </div>
            <div className="wind text-xs xl:text-base 2xl:text-lg text-neutral-400">
              {data.wind ? (
                <>
                  <i className="fa-solid fa-wind"></i>{' '}
                  {Math.floor(data.wind.speed)}
                  <span className="text-xs xl:text-base"> m/s </span>
                  {getWindDirection(data.wind.deg)}
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
