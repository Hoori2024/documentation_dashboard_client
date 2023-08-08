import {useState, useEffect} from 'react';
import DroneElem from "../DronePage"
import { DroneStatus, Field } from '../../../architecture/architecture';

/**
 * Liste de drones
 * @function DroneList
 * @category Composant / screens / DronePage
 * @param props.drones {Drone[]} tableau de drones
 * @param props.onClick {function} fonction appelée lors d'un clic sur l'élément
 */
require('./DroneList.css')
export function DroneList(props: any) {

  function getStatusAsStr(status: DroneStatus) {
    switch (status) {
      case DroneStatus.NOTHING: return 'Inactif';
      case DroneStatus.CHARGING: return 'En charge';
      case DroneStatus.FLYING: return 'En vol';
      case DroneStatus.PAUSED: return 'En pause';
      case DroneStatus.MANUAL: return 'En mode manuel';
      case DroneStatus.EMERGENCY: return "En arrêt d'urgence";
      case DroneStatus.MAINTENANCE: return 'En maintenance';
      case DroneStatus.ISSUE: return 'Problème rencontré';
      default: return "Inconnu";
    }
  }

  function getFieldName(field: Field) {
    if (field != null)
      return field.name
    return "Aucun";
  }

  return (
    <div className='dronelist-main'>
      {
        props.drones.map((item: any) => {
          return (
            <div key={item.id} className='dronelist-elem'>
              <div className='debugo'> {item.id} </div>
              <div className='debugo'> {getFieldName(item.field)} </div>
              <div className='debugo'> {getStatusAsStr(item.status)} </div>
              <div className='debugo'> {item.batteryPercentage}% </div>
              <div className='debugo'>
                <button
                  onClick={() => {
                      props.onClick(item.id)
                    }
                  }
                  className='dronelist-reportbutton'>
                    Signaler un problème
                </button>
              </div>
            </div>
          )
        }
      )}
    </div>
  );
}

export default DroneList;