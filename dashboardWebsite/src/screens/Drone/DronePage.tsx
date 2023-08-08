import {useState, useEffect} from 'react';
import {DroneStatus, Drone} from '../../architecture/architecture';
import DroneList from './DroneList/DroneList'

export type DroneElem = {
    id: string,
    field: string,
    state: string,
    battery: number,
};

const DRONES : Drone[] = [
    {
        id: "1f15e",
        field: {
            id: "a",
            name: "Le Crépiat",
            address: "a",
            lat: 10,
            lon: 10,
            shape: null,
            droneId: '1f15e',
            weather:  null,
            estimatedDuration: null,
            currentCover: null,
            stats: null,
            pastCovers: null,
            scheduledCovers: null,
        },
        status: DroneStatus.NOTHING,
        batteryPercentage: 100,
        batteryMax: 3600,
        batteryRemaining: 3600,
        remainingChargingTime: 0,
    },
    {
        id: "45a05",
        field: null,
        status: DroneStatus.CHARGING,
        batteryPercentage: 10,
        batteryMax: 3600,
        batteryRemaining: 360,
        remainingChargingTime: 600,
    },
    {
        id: "1e15a",
        field: {
            id: "a",
            name: "Le Bastit",
            address: "a",
            lat: 10,
            lon: 10,
            shape: null,
            droneId: '1f15e',
            weather:  null,
            estimatedDuration: null,
            currentCover: null,
            stats: null,
            pastCovers: null,
            scheduledCovers: null,
        },
        status: DroneStatus.FLYING,
        batteryPercentage: 90,
        batteryMax: 3600,
        batteryRemaining: 3600,
        remainingChargingTime: 0,
    },
    {
        id: "16d50",
        field: {
            id: "a",
            name: "La Coste (nord)",
            address: "a",
            lat: 10,
            lon: 10,
            shape: null,
            droneId: '1f15e',
            weather:  null,
            estimatedDuration: null,
            currentCover: null,
            stats: null,
            pastCovers: null,
            scheduledCovers: null,
        },
        status: DroneStatus.PAUSED,
        batteryPercentage: 65,
        batteryMax: 3600,
        batteryRemaining: 3600,
        remainingChargingTime: 0,
    },
    {
        id: "ce1ff",
        field: {
            id: "a",
            name: "La Coste (sud)",
            address: "a",
            lat: 10,
            lon: 10,
            shape: null,
            droneId: '1f15e',
            weather:  null,
            estimatedDuration: null,
            currentCover: null,
            stats: null,
            pastCovers: null,
            scheduledCovers: null,
        },
        status: DroneStatus.MANUAL,
        batteryPercentage: 48,
        batteryMax: 3600,
        batteryRemaining: 3600,
        remainingChargingTime: 0,
    },
    {
        id: "1e15f",
        field: {
            id: "a",
            name: "Laurélie",
            address: "a",
            lat: 10,
            lon: 10,
            shape: null,
            droneId: '1f15e',
            weather:  null,
            estimatedDuration: null,
            currentCover: null,
            stats: null,
            pastCovers: null,
            scheduledCovers: null,
        },
        status: DroneStatus.EMERGENCY,
        batteryPercentage: 2,
        batteryMax: 3600,
        batteryRemaining: 3600,
        remainingChargingTime: 0,
    },
    {
        id: "d5a05",
        field: null,
        status: DroneStatus.MAINTENANCE,
        batteryPercentage: 100,
        batteryMax: 3600,
        batteryRemaining: 360,
        remainingChargingTime: 600,
    },
    {
        id: "45a0e",
        field: {
            id: "a",
            name: "Belpech",
            address: "a",
            lat: 10,
            lon: 10,
            shape: null,
            droneId: '1f15e',
            weather:  null,
            estimatedDuration: null,
            currentCover: null,
            stats: null,
            pastCovers: null,
            scheduledCovers: null,
        },
        status: DroneStatus.ISSUE,
        batteryPercentage: 10,
        batteryMax: 3600,
        batteryRemaining: 360,
        remainingChargingTime: 600,
    },
]

function reportDrone(droneId: any) {
    var mail = "hoori_2024@labeip.epitech.eu"
    var subject = '[Problème drone] Client ' + localStorage.userid + ' | Drone ' + droneId;

    window.location.href = "mailto:" + mail + "?subject=" + subject
}

/**
 * Page contenant la liste de drone
 * @function DronePage
 * @category Composant / screens / DronePage
 */
require('./DronePage.css')
export function DronePage() {

  return (
    <div className='dronepage-main'>
      <div className='dronepage-legend'>
        <div className='debugo'> Identifiant </div>
        <div className='debugo'> Champ </div>
        <div className='debugo'> Statut </div>
        <div className='debugo'> Batterie </div>
        <div className='debugo'> Action </div>
      </div>
      <div className='dronepage-list'>
        <DroneList onClick={reportDrone} drones={DRONES}/>
      </div>
    </div>
  );
}

export default DronePage;