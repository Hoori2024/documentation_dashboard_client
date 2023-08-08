import {useState, useEffect} from 'react';

import WeatherIcon from './WeatherIcon';
import LeftButton from '../../assets/image/left-arrow.png';
import RightButton from '../../assets/image/right-arrow.png';

/**
 * Affichage d'un icon météorologique
 * @function WeatherViewer
 * @category Composant / elements
 * @param props.forecast {IWeatherForecast[]} tableau de IWeatherForecast (information météorologique)
 */
export default function WeatherViewer(props: any) {
  require("./WeatherViewer.css");

  let indexStep = 3;
  let [hourIndex, setHourIndex] = useState(0);

  useEffect(() => {
    setHourIndex(0);
  }, [props.forecast]);

  function changeHour(forward: boolean) {
    let newIndex = 0;

    if (forward) {
      if (hourIndex >= maxIndex - (indexStep - 1))
        return
      else if (hourIndex + indexStep > maxIndex - (indexStep - 1)) {
        newIndex = maxIndex - (indexStep - 1);
      }
      else
        newIndex = hourIndex + indexStep;
    } else {
      if (hourIndex == minIndex)
          return
      else if (hourIndex == minIndex + 1 || hourIndex == minIndex + 2)
        newIndex = minIndex;
      else
      newIndex = hourIndex - indexStep;
    }
    setHourIndex(newIndex);
  }

  function canGoLeft() {
    if (props.forecast.length <= indexStep || hourIndex <= minIndex)
      return false
    return true
  }

  function canGoRight() {
    if (props.forecast.length <= indexStep
          || hourIndex >= maxIndex - (indexStep - 1))
      return false
    return true
  }

  if (props.forecast.length == 0) {
    return (
      <div className="weatherviewer-divnoweather">
        <div className="weatherviewer-textnoweather">
          Aucune prévision météorologique disponible pour cette date
        </div>
      </div>
    );
  }

  let minIndex = 0;
  let maxIndex = props.forecast.at(-1).time.hour() - props.forecast[0].time.hour();

	return (
    <div className='weatherviewer-weatherView'>

    <button
      className="weatherviewer-button"
      disabled={!canGoLeft()}>
      <img
        onClick={() => changeHour(false)}
        className={canGoLeft() ? "weatherviewer-arrows" : "weatherviewer-arrowsdisabled"}
        src={LeftButton}
        alt="image précédente"
      />
    </button>

      {props.forecast.slice(hourIndex, hourIndex + 3).map((item: any) => {
        return (
          <div key={item.time} className='weatherviewer-weatherelem'>
            <a className='weatherviewer-weatherHour'>
              {item.time.hour() + 'h'}
            </a>
            <WeatherIcon weather={item.main} size={40} />
          </div>
        )
      })}

      <button
        className="weatherviewer-button"
        disabled={!canGoRight()}>
        <img
          onClick={() => changeHour(true)}
          className={canGoRight() ?
            "weatherviewer-arrows" : "weatherviewer-arrowsdisabled"}
          src={RightButton}
          alt="image suivante"
        />
      </button>

    </div>
  );
}
