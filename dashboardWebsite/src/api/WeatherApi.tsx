import axios from 'axios';
import dayjs, {Dayjs} from 'dayjs';

import {EWeatherType, IWeatherForecast, Cover} from '../architecture/architecture';

const WEATHER_API_KEY = "eecd015b52c0c85be365948980ac420f";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/forecast";

const WEATHER_UNITS = "metric";

const MAX_WIND = 40;
const MAX_RAIN = 50;
const MIN_TEMP = 10;
const MAX_TEMP = 40;

/**
 * Détermination de l'indicatif météo à partir des données
 * @function getMainWeather
 * @category Fonction / API / Weather
 * @param main {number} données brutes de la liste de datura
 * @param rain {number} forme du champ
 * @param wind {number} forme du champ
 * @returns {EWeatherType}
 */
function getMainWeather(main: number, rain: number, wind: number) {

    //return EWeatherType.Fog;
    if (wind > MAX_WIND)
        return EWeatherType.Wind;

    if (main == 800)
        return EWeatherType.Sun;
    if (Math.trunc(main / 10) == 80)
        return EWeatherType.Clouds;
    if (Math.trunc(main / 100) == 7)
        return EWeatherType.Fog;
    if (Math.trunc(main / 100) == 6)
        return EWeatherType.Snow;
    if (Math.trunc(main / 100) == 5)
        return EWeatherType.Rain;
    if (Math.trunc(main / 100) == 3)
        return EWeatherType.Rain;
    if (Math.trunc(main / 100) == 2)
        return EWeatherType.Storm;
    return EWeatherType.Sun;
}

/**
 * Obtention des données météorologiques des 5 derniers jours
 * @function getWeather5NextDays
 * @category Fonction / API / Weather
 * @param latitude {number} latitude
 * @param longitude {number} longitude
 * @returns {EWeatherType}
 */
async function getWeather5NextDays(latitude: number, longitude: number) {

    let request = (WEATHER_API_URL + "?" + "appid="
    + WEATHER_API_KEY + "&units=" + WEATHER_UNITS
    + "&lat=" + latitude + "&lon=" + longitude);
    
    try {
        var response = await axios.get(request);
        //console.log("weather", response.data);
        
        let weather: IWeatherForecast[] = [];

        response.data.list.forEach((result: any) => {
            let timeForecast: IWeatherForecast = {
                time: dayjs.unix(result.dt),
                main: getMainWeather(result.weather[0].id, result.pop, result.wind.speed),
                rain: result.pop,
                wind: result.wind.speed,
                temperature_min: result.main.temp_min,
                temperature_max: result.main.temp_max,
                lastUpdate: dayjs(),
            }
            weather.push(timeForecast);
        });
        
        return weather;

    } catch (e) {
        console.log("getWeather5NextDays: " +  e);
        return null
    }
}

export {getWeather5NextDays};