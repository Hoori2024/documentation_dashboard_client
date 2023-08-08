import dayjs from 'dayjs';

import {Field, Cover, CoverState, Picture, FieldStats, EWeatherType,
        IWeatherForecast} from './architecture';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const field_1_past_cover_pictures : Picture[] = [
    {
        id: "1",
        source: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sacred_Datura_%28Datura_inoxia%29_%2811710359934%29.jpg/1200px-Sacred_Datura_%28Datura_inoxia%29_%2811710359934%29.jpg",    
    },
    {
        id: "2",
        source: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp9pMyW0i55wacTDtJ8825tfp50zl_miknkXzcTYapa5d4J8JnoWg48yYFPnYsdj896_0&usqp=CAU",    
    },
    {
        id: "3",
        source: "https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/c/a/3/ca33c587aa_50148543_datura-stramonium-kcyuki-inaturalist.jpg",    
    },
];

const good_weather_4h: IWeatherForecast[] = [
    {
        time: dayjs().add(1, 'hour'),
        main: EWeatherType.Sun,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(2, 'hour'),
        main: EWeatherType.Clouds,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(3, 'hour'),
        main: EWeatherType.Sun,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(4, 'hour'),
        main: EWeatherType.Sun,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
];

const bad_weather_4h: IWeatherForecast[] = [
    {
        time: dayjs().add(1, 'hour'),
        main: EWeatherType.Rain,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(2, 'hour'),
        main: EWeatherType.Storm,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(3, 'hour'),
        main: EWeatherType.Rain,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(4, 'hour'),
        main: EWeatherType.Rain,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
];

export const field_1_current_cover : Cover = {
    id: "c1",
    fieldId: "f1",
    startDate: dayjs(),
    endDate: dayjs(),
    estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
    state: CoverState.DONE,
    nbDatura: 42,
    pictures: field_1_past_cover_pictures,
    daturaPositions: null,
    weather: good_weather_4h,
    viewed: false,
};

const field_1_scheduled_covers: Cover[] = [
    {
        id: "sc1f1",
        fieldId: "f1",
        startDate: dayjs().add(1, 'days'),
        endDate: null,
        estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
        state: CoverState.SCHEDULED,
        nbDatura: null,
        pictures: null,
        daturaPositions: null,
        weather: good_weather_4h,
        viewed: null,
    },
    {
        id: "sc2f1",
        fieldId: "f1",
        startDate: dayjs().add(4, 'days'),
        endDate: null,
        estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
        state: CoverState.SCHEDULED,
        nbDatura: null,
        pictures: null,
        daturaPositions: null,
        weather: bad_weather_4h,
        viewed: null,
    },
    {
        id: "sc3f1",
        fieldId: "f1",
        startDate: dayjs().add(8, 'days'),
        endDate: null,
        estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
        state: CoverState.SCHEDULED,
        nbDatura: null,
        pictures: null,
        daturaPositions: null,
        weather: good_weather_4h,
        viewed: null,
    },
];

const field_1 : Field = {
    id: 'f1',
    name: "field 1",
    address: "cb3 chemin du mont",
    lat: 37.56,
    lon: 126.97,
    shape: null,
    droneId: "d3",
    weather: null,
    estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
    currentCover : field_1_current_cover,
    stats: null,
    pastCovers: [field_1_current_cover],
    scheduledCovers: field_1_scheduled_covers,
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const field_2_current_cover: Cover = {
    id: "c1",
    fieldId: "f2",
    startDate: dayjs(),
    endDate: null,
    estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
    state: CoverState.SCHEDULED,
    nbDatura: null,
    pictures: null,
    daturaPositions: null, //[[-1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, -1, 0, 0], [0, 0, 0, 2, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 3, 2, 0, 0, 1, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, -1, -1, -1, -1]],
    weather: good_weather_4h,
    viewed: null,
};

const field_2_scheduled_covers: Cover[] = [
    {
        id: "sc1f2",
        fieldId: "f2",
        startDate: dayjs().add(2, 'days'),
        endDate: null,
        estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
        state: CoverState.SCHEDULED,
        nbDatura: null,
        pictures: null,
        daturaPositions: null,
        weather: good_weather_4h,
        viewed: null,
    },
    {
        id: "sc2f2",
        fieldId: "f2",
        startDate: dayjs().add(3, 'days'),
        endDate: null,
        estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
        state: CoverState.SCHEDULED,
        nbDatura: null,
        pictures: null,
        daturaPositions: null,
        weather: good_weather_4h,
        viewed: null,
    },
    {
        id: "sc3f2",
        fieldId: "f2",
        startDate: dayjs().add(7, 'days'),
        endDate: null,
        estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
        state: CoverState.SCHEDULED,
        nbDatura: null,
        pictures: null,
        daturaPositions: null,
        weather: bad_weather_4h,
        viewed: null,
    },
];

const field_2: Field = {
    id: 'f2',
    name: "field 2",
    address: "aLe crépiat",
    lat: 43.55,
    lon: 1.46,
    shape: null,
    droneId: "d42",
    weather: null,
    estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
    currentCover: field_2_current_cover,
    stats: null,
    pastCovers: null,
    scheduledCovers: field_2_scheduled_covers,
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const field_3_current_cover: Cover = {
    id: "c1",
    fieldId: "f3",
    startDate: dayjs(),
    endDate: dayjs(),
    estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
    state: CoverState.INTERRUPT,
    nbDatura: 42,
    pictures: null,
    daturaPositions: null,
    weather: good_weather_4h,
    viewed: false,
};

const field_3_scheduled_covers: Cover[] = [
    {
        id: "sc1f3",
        fieldId: "f3",
        startDate: dayjs().add(5, 'hours'),
        endDate: null,
        estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
        state: CoverState.SCHEDULED,
        nbDatura: null,
        pictures: null,
        daturaPositions: null,
        weather: bad_weather_4h,
        viewed: null,
    },
    {
        id: "sc2f3",
        fieldId: "f3",
        startDate: dayjs().add(6, 'days'),
        endDate: null,
        estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
        state: CoverState.SCHEDULED,
        nbDatura: null,
        pictures: null,
        daturaPositions: null,
        weather: good_weather_4h,
        viewed: null,
    },
    {
        id: "sc3f3",
        fieldId: "f3",
        startDate: dayjs().add(12, 'days'),
        endDate: null,
        estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
        state: CoverState.SCHEDULED,
        nbDatura: null,
        pictures: null,
        daturaPositions: null,
        weather: bad_weather_4h,
        viewed: null,
    },
];

const field_3 : Field = {
    id: 'f3',
    name: "field 3",
    address: "ca16 impasse des ansannes",
    lat: 48.85,
    lon: 2.35,
    shape: null,
    droneId: "d1",
    weather: null,
    estimatedDuration: {days: 0, hours: 3, minutes: 44, seconds: 5},
    currentCover: field_3_current_cover,
    stats: null,
    pastCovers: null,
    scheduledCovers: field_3_scheduled_covers,
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const FIELDS = [
    field_1,
    field_2,
    field_3,
];

export const FIELDS1 = [
    field_1,
    field_2,
];

export const FIELDS2 = [
    field_3,
];

export const SCHEDULED_COVERS = field_1_scheduled_covers.concat(field_2_scheduled_covers).concat(field_3_scheduled_covers);

export default FIELDS