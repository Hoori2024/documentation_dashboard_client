import RainIcon from '../../assets/image/rain.png';
import WindIcon from '../../assets/image/wind.png';
import SnowIcon from '../../assets/image/snow.png';
import FogIcon from '../../assets/image/fog.png';
import ThunderstormIcon from '../../assets/image/thunderstorm.png';
import SunIcon from '../../assets/image/sunny.png';
import CloudIcon from '../../assets/image/cloudy.png';
import {EWeatherType} from '../../architecture/architecture';

/**
 * Affichage d'un icon météorologique
 * @function WeatherIcon
 * @category Composant / elements
 * @param props.weather {EWeatherType} type de l'icon
 * @param props.size {integer} taille de l'icon
 */
export default function WeatherIcon(props: any /* {weather: EWeatherType, size: number} */) {
	require("./WeatherIcon.css");

	function EmptyWeatherIcon() {
		return (
			<div style={{width: props.size, height: props.size}}>
				<a> </a>
			</div>
		);
	}

	if (props.weather == null)
		return <EmptyWeatherIcon/>;
	if (props.weather == EWeatherType.Rain)
			return <img src={RainIcon} width={props.size} style={{marginBottom: -4}}></img>
	if (props.weather == EWeatherType.Wind)
			return <img src={WindIcon} width={props.size}></img>
	if (props.weather == EWeatherType.Snow)
			return <img src={SnowIcon} width={props.size}></img>
	if (props.weather == EWeatherType.Storm)
			return <img src={ThunderstormIcon} width={props.size}></img>
	if (props.weather == EWeatherType.Sun)
			return <img src={SunIcon} width={props.size}></img>
	if (props.weather == EWeatherType.Clouds)
			return <img src={CloudIcon} width={props.size}></img>
	if (props.weather == EWeatherType.Fog)
			return <img src={FogIcon} width={props.size}></img>
	return <EmptyWeatherIcon />;
}