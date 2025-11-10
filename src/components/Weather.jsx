import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [animating, setAnimating] = useState(false);
  const inputRef = useRef(null);

  const W_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (city) => {
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

  const fetchWeatherByCoords = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${W_API_KEY}`;

    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching weather data by location:', error);
      setError('Unable to get weather for your location');
    }
  };

  const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (err) => {
          console.warn('Geolocation permission denied or unavailable', err);
          fetchWeather('Edmonton');
        }
      );
    } else {
      console.warn('Geolocation not supported');
      fetchWeather('Edmonton');
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
      setShowInput(false);
    }
  };

  const handleToggle = () => {
    if (showInput) {
      setAnimating(true);
      setTimeout(() => {
        setAnimating(false);
        setShowInput(false);
      }, 250);
    } else {
      setShowInput(true);
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
        return 'bxs-cloud text-neutral-400';
      default:
        return 'bxs-cloud text-neutral-400';
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
    // fetchWeather('Edmonton');
    getCurrentLocationWeather();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setAnimating(true);
        setTimeout(() => {
          setAnimating(false);
          setShowInput(false);
        }, 250);
      }
    };

    if (showInput) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInput]);

  return (
    <div className="weather w-full h-full lg:h-[35vh] lg:max-h-[24rem] flex flex-row lg:flex-col justify-around lg:justify-center items-center gap-y-4 xl:gap-y-1 p-4 xl:p-6 rounded-xl shadow-lg bg-neutral-800 text-neutral-100">
      <div className="date font-comfortaa text-sm sm:text-base md:text-lg lg:text-base">
        <p>
          {new Date().toLocaleString('en-CA', {
            weekday: 'short',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </p>
      </div>

      {data.notFound ? (
        <div className="font-comfortaa font-bold text-lg xl:text-xl mb-12">
          Not Found 😔
        </div>
      ) : (
        <div className="weather-data flex flex-row items-center gap-x-3 lg:flex-col gap-y-1">
          <div className="location hidden lg:flex justify-center gap-x-3 lg:pb-0 xl:pb-2">
            <div className="flex">
              <i
                className="fa-solid fa-location-crosshairs xl:text-base 2xl:text-lg translate-y-1 2xl:translate-y-2 cursor-pointer"
                onClick={getCurrentLocationWeather}
                title="Use my location"
              ></i>
              {/* <i className="fa-solid fa-location-dot xl:text-base 2xl:text-lg xl:translate-y-1 2xl:translate-y-2"></i> */}
              <div className="font-comfortaa font-bold xl:text-base 2xl:text-lg pl-2">
                {data.name}
                {data.sys ? `, ${data.sys.country}` : null}
              </div>
            </div>

            <div className="search-location relative">
              <i
                className="fa-solid fa-magnifying-glass xl:text-base 2xl:text-lg xl:translate-y-0 2xl:translate-y-1 text-neutral-100/80 cursor-pointer"
                onClick={handleToggle}
                title="Search location"
              ></i>
              {showInput && (
                <div
                  ref={inputRef}
                  className={`search-input absolute lg:-right-3 lg:top-6 xl:-right-6 xl:top-8 bg-neutral-950/90 backdrop-blur-md shadow-lg rounded-xl p-2 z-10 ${
                    animating ? 'animate-fadeOutX' : 'animate-fadeInX'
                  } `}
                >
                  <input
                    type="text"
                    placeholder="Enter Location"
                    className="lg:w-42 xl:w-48 h-8 bg-transparent outline-0 lg:text-base 2xl:text-lg pl-4"
                    value={location}
                    // onFocus={(e) => (e.target.value = '')}
                    autoFocus
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              )}
            </div>
          </div>

          <i
            className={`bx ${
              data.weather &&
              data.weather[0] &&
              getWeatherIcon(data.weather[0].main)
            } text-[clamp(2.25rem,1.8rem+2.35vw,4.5rem)]`}
          ></i>

          <div className="weather-type hidden lg:block font-comfortaa xl:text-base">
            {data.weather ? data.weather[0].main : null}
          </div>

          <div className="flex flex-col items-center">
            <div className="lg:hidden font-comfortaa text-xs sm:text-sm md:text-base">
              <i
                className="fa-solid fa-location-crosshairs cursor-pointer"
                onClick={getCurrentLocationWeather}
              ></i>{' '}
              {data.name}
            </div>
            <div className="temp font-comfortaa font-bold text-base xl:text-lg 2xl:text-xl lg:pb-0 xl:pb-2">
              {data.main ? `${Math.floor(data.main.temp)}℃` : null}
            </div>
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
          </div>  */}

          <div className="search-location lg:hidden relative">
            <i
              className="fa-solid fa-magnifying-glass text-lg text-neutral-100/80 cursor-pointer"
              onClick={handleToggle}
            ></i>
            {showInput && (
              <div
                ref={inputRef}
                className={`search-input absolute right-6 top-1/2 -translate-y-1/2 bg-neutral-950/90 backdrop-blur-md shadow-lg rounded-xl p-2 z-10 ${
                  animating ? 'animate-fadeOutX' : 'animate-fadeInX'
                } `}
              >
                <input
                  type="text"
                  placeholder="Enter Location"
                  className="w-40 sm:w-54 md:w-64 h-8 bg-transparent text-base outline-0 pl-4"
                  value={location}
                  autoFocus
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}
          </div>
          <div className="extra-info hidden lg:flex gap-6">
            <div className="humidity text-xs xl:text-sm 2xl:text-base text-neutral-300">
              {data.main ? (
                <>
                  <i className="fa-solid fa-droplet"></i> {data.main.humidity}
                  <span className="text-xs xl:text-sm">%</span>
                </>
              ) : null}
            </div>
            <div className="wind text-xs xl:text-sm 2xl:text-base text-neutral-300">
              {data.wind ? (
                <>
                  <i className="fa-solid fa-wind"></i>{' '}
                  {Math.floor(data.wind.speed)}
                  <span className="text-xs xl:text-sm"> m/s </span>
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
