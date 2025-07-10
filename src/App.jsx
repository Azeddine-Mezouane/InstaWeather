import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Icon } from "@iconify/react";

const WeatherApp = () => {
  const [city, setCity] = useState("Alger");
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetchWeather(); // Affiche Alger au chargement
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
          import.meta.env.VITE_API_KEY
        }&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeatherData(data);
      } else {
        throw new Error("Ville non trouvée");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const getWeatherStyle = (description) => {
    switch (description.toLowerCase()) {
      case "clear sky":
        return {
          bg: "from-orange-300 to-yellow-300",
          icon: "solar:sun-line-duotone",
        };
      case "heavy intensity rain":
        return {
          bg: "from-blue-800 to-blue-500",
          icon: "mdi:weather-pouring",
        };
      case "few clouds":
        return {
          bg: "from-blue-300 to-blue-100",
          icon: "mdi:weather-partly-cloudy",
        };
      default:
        return {
          bg: "from-slate-400 to-slate-200",
          icon: "mdi:weather-cloudy",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
     <div className="logo flex gap-2 m-6 items-center">
        <img className="w-12" src="/InstaWeather-logo.svg" alt="" />
        <h1 className="font-bold text-2xl">InstaWeather</h1>
     </div>
      <p className="text-gray-600 mb-6 text-center">
        Enter a city name and press <strong>Search</strong> or hit{" "}
        <strong>Enter</strong> to get the latest weather information.
      </p>
      <form onSubmit={handleSearch} className="relative w-full max-w-md mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // empêche le rechargement de page
              fetchWeather(); // lance la recherche météo
            }
          }}
          placeholder="Enter a city"
          className="w-full px-6 py-3 rounded-full shadow-sm outline-none focus:ring-2 ring-blue-200 text-gray-700 text-lg"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
        >
          <Search size={24} />
        </button>
      </form>

      {weatherData && (
        <div
          className={`bg-gradient-to-b ${
            getWeatherStyle(weatherData.weather[0].description).bg
          } text-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center`}
        >
          <div className="text-4xl mb-2 flex justify-center">
            <Icon
              icon={getWeatherStyle(weatherData.weather[0].description).icon}
              width="48"
            />
          </div>
          <h2 className="text-2xl font-bold">{weatherData.name}</h2>
          <p className="text-sm capitalize mb-4">
            {weatherData.weather[0].description}
          </p>
          <div className="text-5xl font-bold mb-6">
            {Math.round(weatherData.main.temp)}°C
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:water-percent" width="20" />{" "}
              {weatherData.main.humidity}%
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:weather-windy" width="20" />{" "}
              {weatherData.wind.speed} m/s
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:gauge" width="20" /> {weatherData.main.pressure}{" "}
              hPa
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:weather-cloudy" width="20" />{" "}
              {weatherData.clouds.all}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
