import {Dayjs} from 'dayjs';

export enum CoverState {
    INTERRUPT,
    DONE,
    PAUSE,
    PROGRESS,
    READY,
    SCHEDULED,
}

// array of 4 coordinates (each is an array of 3 numbers)
export type FieldShape = {
    max_x: number;
    max_y: number;
    shape: number[][];
};
export const SECTOR_SIZE: number = 10;
export type DaturaPositions = number[][];

export interface Picture {
    id: string;
    source: string;
} 

export interface Duration {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export enum EWeatherType {
    Storm,
    Snow,
    Rain,
    Wind,
    Clouds,
    Sun,
    Fog,
};

export interface IWeatherForecast {
    time: Dayjs;
    main: EWeatherType;
    rain: number;
    wind: number;
    temperature_min: number;
    temperature_max: number;
    lastUpdate: Dayjs;
};

export interface Cover {
    id: string;
    fieldId: string;
    startDate: Dayjs | null;
    estimatedDuration: Duration | null;
    state: CoverState;
    weather: IWeatherForecast[] | null;

    // If the cover is finished or interrumpted,
    // and its results have been viewed:
    viewed: boolean | null,
    endDate: Dayjs | null;
    nbDatura: number | null;
    pictures: Picture[] | null;
    daturaPositions: DaturaPositions | null;
}

export enum WeedType {
    UNKNOWN,
    DATURA,
    AMBROISIE,
};

export interface FieldStats { 
    timespan: number; // number of months
    data: {date: Dayjs; nbSprouts: number}[];
    positions: DaturaPositions | null;
}

export interface Field {
    id: string;
    name: string;
    address: string;
    lat: number;
    lon: number;
    shape: FieldShape | null;
    droneId: string | null;
    weather: IWeatherForecast[] | null;
    estimatedDuration: Duration | null;
    currentCover: Cover | null;
    stats: FieldStats[] | null;
    pastCovers: Cover[] | null;
    scheduledCovers: Cover[] | null;
};

export enum DroneStatus {
    NOTHING,
    CHARGING,
    FLYING,
    PAUSED,
    MANUAL,
    EMERGENCY,
    MAINTENANCE,
    ISSUE,
}

export interface Drone {
    id: string;
    field: Field | null;
    status: DroneStatus;
    batteryPercentage: number | null;
    batteryMax: number; // in seconds
    batteryRemaining: number; // in seconds
    remainingChargingTime: number; // in seconds
};

export default {CoverState};