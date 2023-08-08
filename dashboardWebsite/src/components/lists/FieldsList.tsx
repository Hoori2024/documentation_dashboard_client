import { useState, useEffect } from 'react';
import {Dayjs} from 'dayjs';

import WeatherIcon from '../elements/WeatherIcon';
import ListTools from './ListTools'
import {CoverState, Field, IWeatherForecast, EWeatherType} from '../../architecture/architecture';
import { getLastUnreadCover, getNextScheduledCover, getCoverStateForField } from '../../assets/utils';


let fieldStateStrings: string [] = ['Interrompue', 'Terminée', 'En pause', 'En cours', 'Prête à lancer', 'Programmée'];

/**
 * Liste des champs
 * @function FieldsList
 * @category Composant / lists
 * @param props.fields {Field[]} liste de tous les champs
 * @param props.isCover {boolean} true si est une couverture, false si non
 * @param props.buttons {objet[]} boutons de la barre de tri
 * @param props.onChangeSearch {function} fonction appelée quand il y a un evenement dans la barre de recherche
 * @param props.list {Field[]} liste des champs à afficher dansla liste
 * @param props.onClick {function} fonction appelée lors du clic
 * @param props.showstartDate {boolean} détermine si le composant affiche dans la liste la date de début d'une couverture
 * @param props.showWeather {boolean} détermine si le composant affiche dans la liste l'icone de situation météorologique du champ
 * @param props.showState {boolean} détermine si le composant affiche dans la liste l'état d'un champ
 */
export default function FieldsList(props: any) {
  require("./FieldsList.css");

  function getFieldById(id: string) {
    let field: Field | null | undefined = props.fields.find((f: any) => { return f.id === id });
    if (field === undefined)
        field = null;
    return field;
  }

  function getCoverState(field: Field) {
    if (props.isCover)
      return null

    return getCoverStateForField(field);
  }

  function getDisplayedWeather(weather: IWeatherForecast[]) {
    for (var i: number = 0; i < weather.length; i++) {
      var main = weather[i].main;
      var badWeather = [EWeatherType.Rain, EWeatherType.Wind,
        EWeatherType.Snow, EWeatherType.Storm, EWeatherType.Fog];
      if (badWeather.includes(main)) {
        return main;
      }
    }
    return null;
  }

  return (
    <div>
      <ListTools
        buttons={props.buttons}
        onChangeSearch={props.onChangeSearch}
      />

      <div className='fieldslist-maincontainer'>
        {props.list.map((item: any) => {
          
          let data: {
            id: string,
            name: string,
            startDate: Dayjs | null,
            weather: EWeatherType | null,
            state: CoverState | null,
            droneId: string | null | undefined,
          } = {
            id: item.id,
            name: (item.name != null ? item.name : getFieldById(item.fieldId)?.name),
            startDate: item.startDate ? item.startDate : null,
            weather: item.weather ? getDisplayedWeather(item.weather) : null,
            state: getCoverState(item),
            droneId: getFieldById(item.fieldId)?.droneId,
          };

          /* if (props.showWeather) {
            console.log(data)
          } */

          return (
            <div
              key={item.id}
              onClick={() => props.onClick(data.id)}
              className="fieldslist-fieldcontainer">

              <a className="fieldslist-address">{data.name}</a>
              { props.showstartDate && data.startDate != null &&
                  <a className="fieldslist-date">{data.startDate.format('DD/MM/YYYY - HH[h]mm')}</a>
              }
              <div className='fieldslist-weather'>
                {props.showWeather && data.weather != null
                  ? <WeatherIcon weather={data.weather} size={35} />
                  : <WeatherIcon weather={null} size={35} />
                }
              </div>
              <div>
                {
                  props.showState && !props.isCover &&
                  <a className="fieldslist-statetext"> {data.state == null ? "Aucun drone" : fieldStateStrings[data.state]} </a>
                }
              </div>
              
              
            </div>
          );
        })}
      
      </div>
    </div>
  );
};
