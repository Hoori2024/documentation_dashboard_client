import axios from 'axios';
import dayjs, {Dayjs} from 'dayjs';

import {EWeatherType, FieldStats, SECTOR_SIZE, DaturaPositions, FieldShape, Field,
    IWeatherForecast, Cover, CoverState, Duration} from '../architecture/architecture';
import {getWeather5NextDays} from './WeatherApi';
import { addDurationToDate, getForecastForTimeSlot } from '../assets/utils'; 

const URL = "https://cr9r3uigtw.eu-west-1.awsapprunner.com/";
const SCALE_DOWN_FACTOR = 3;

/**
 * Requête d'obtention de tous les champs
 * @function getAllFields
 * @category Fonction / API
 * @async
 * @param oldFields {Field[] | null} anciens champs obtenus
 * @returns {Field[] | null}
 */
async function getAllFields(oldFields: Field[] | null) {
    var url = URL + "field/byowner/" + localStorage.userid;

    let header = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
          'Authorization': 'Bearer ' + localStorage.token,
        }
    };

    try {
        var response = await axios.get(url, header);
        console.log("getAllFields", response.data)
        let fields: Field[] = await getFieldsList(response.data.existingField, oldFields);
        console.log("Formatted fields", fields);
        return fields;
    } catch (e) {
        console.log("getAllFields: " +  e);
        return null
    }
} 

/**
 * Fonction de gestion d'obtention de la liste de champs
 * @function getFieldsList
 * @category Fonction / API
 * @async
 * @param rawData {any} données brutes de la liste de champ
 * @param oldFields {Field[] | null} anciens champs obtenus
 * @returns {Field[] | null}
 */
async function getFieldsList(rawData: any, oldFields: Field[] | null) {
    let fieldsList: Field[] = [];
    for (let i: number = 0; i < rawData.length; i++) {
        var newField: Field = await createField(rawData[i], oldFields);
        fieldsList.push(newField);
    }
    return fieldsList
}

/**
 * Création d'un champ
 * @function createField
 * @category Fonction / API
 * @async
 * @param rawData {any} données brutes de la liste de champ
 * @param oldFields {Field[] | null} anciens champs obtenus
 * @returns {Field}
 */
async function createField(rawField: any, oldFields: Field[] | null) {
    let minutes = rawField.coverEstimatedTime;
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    let days = Math.floor(hours / 24);
    hours = hours % 24;
    let estimatedDuration: Duration = {days: days, hours: hours, minutes: minutes, seconds: 0};

    // latitude and longitude
    let adressParsed = rawField.fieldAddress.split(" ", 2);
    let lati = parseFloat(adressParsed[0])
    let long = parseFloat(adressParsed[1])

    let field: Field = {
        id: rawField._id,
        name: rawField.fieldName,
        address: rawField.fieldAddress,
        lat: lati,
        lon: long,
        shape: getScaledFieldShape(rawField.fieldShape),
        droneId: rawField.droneActivity == 0 ? null : "a", // next sprint
        weather: null,
        estimatedDuration: estimatedDuration,
        currentCover: null,
        stats: null,
        pastCovers: null,
        scheduledCovers: getScheduledCoversList(rawField.coverScheduled, rawField, estimatedDuration),
    };

    field.pastCovers = await getPastCoversList(rawField.coverPast, field)
    //field.stats = getFieldStats(field.pastCovers);

    // Setting the current cover if there is one
    if (rawField.coverStatus != 0) {
        // /field/cover/current/list/{fieldOwner}
        // pour obtenir la liste des couvertures actuelles d'un propriétaire

        var startDate = dayjs(rawField.coverDepartureTimeCurrent);
        var newCover: Cover = {
            id: "a",
            fieldId: rawField._id,
            startDate: startDate,
            endDate: addDurationToDate(startDate, estimatedDuration),
            estimatedDuration: estimatedDuration,
            viewed: null,
            state: (rawField.coverStatus == 1 ? CoverState.PROGRESS : CoverState.PAUSE),
            nbDatura: null,
            pictures: null,
            daturaPositions: null,
            weather: null,
        };
        field.currentCover = newCover;
    }

    // Setting the forecasts for the field and its scheduled covers
    let fieldForecast = getOldFieldForecast(field.id, oldFields);
    if (fieldForecast == null) {
        let forecast: IWeatherForecast[] | undefined = await getFieldForecast(field.lat, field.lon);
        //let forecast: IWeatherForecast[] | undefined = await getFieldForecast(48.85, 2.35);
        field.weather = testWeather
        //field.weather = forecast == undefined ? null : forecast;
    } else {
        field.weather = fieldForecast;
    }
    setCoversForecasts(field);
    return field;
}

/**
 * Obtention des données météorologiques des champs déja obtenus
 * @function getOldFieldForecast
 * @category Fonction / API
 * @async
 * @param fieldId {string} données brutes de la liste de champ
 * @param oldFields {Field[] | null} anciens champs obtenus
 * @returns {IWeatherForecast[] | null}
 */
function getOldFieldForecast(fieldId: string, oldFields: Field[] | null) {
    if (oldFields == null)
        return null;

    for (let i = 0; i < oldFields.length; i++) {
        if (oldFields[i].id == fieldId) {
            return oldFields[i].weather;
        }
    }
    return null;
}

/* async function getDaturaPics(rawDaturaData: any[]) {
    let daturaPics: Picture[] = [];

    for (let i = 0; i < rawDaturaData.length; i++) {

        let entry = rawDaturaData[i];
        if (entry.length == 0)
            continue;
        
        let id = entry[0].weedPhotoId;

        let picBuffer = await fetchDaturaPicture(id);
        let formattedPic: Picture = {
            id: id,
            source: picBuffer?.image?.buffer?.data,
        };
        if (formattedPic.source && formattedPic.id)
            daturaPics.push(formattedPic);
    }

    return daturaPics;
} */

/* async function fetchDaturaPicture(photoId: string) {
    var url = URL + "field/download/" + photoId;

    let header = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
          'Authorization': 'Bearer ' + localStorage.token,
        }
    };

    try {
        var response = await axios.get(url, header);
        let picture = response.data;
        return picture;
    } catch (e) {
        console.log("getDaturaPicture: " +  e);
        return null
    }
} */

/**
 * Obtention des données météorologiques des champs déja obtenus
 * @function getScaledFieldShape
 * @category Fonction / API
 * @param rawFieldShape {number[][]} données brutes de la forme du champ
 * @returns {{max_x: getMaxColList(scaledShape, 0), max_y: getMaxColList(scaledShape, 2), shape: scaledShape}} {max_x: getMaxColList(scaledShape, 0), max_y: getMaxColList(scaledShape, 2), shape: scaledShape}
 */
function getScaledFieldShape(rawFieldShape: number[][]) {
    // Scaling the field shape
    let scaledShape: number[][] = [];
    rawFieldShape?.forEach(list => {
        let newList: number[] = [];
        list.forEach(entry => {
            newList.push(Math.ceil(entry * SCALE_DOWN_FACTOR));
        })
        scaledShape.push(newList);
    });

    return {
        max_x: getMaxColList(scaledShape, 0),
        max_y: getMaxColList(scaledShape, 2),
        shape: scaledShape,
    };
}

/**
 * Obtention de la liste des couvertures passées
 * @function getPastCoversList
 * @category Fonction / API
 * @async
 * @param rawData {any} données brutes
 * @param field {Field} anciens champs obtenus
 * @returns {Cover[]} liste des couvertures
 */
async function getPastCoversList(rawData: any, field: Field) {
    
    let coversList: Cover[] = [];
    rawData.forEach((entry: any) => {
        var newCover: Cover = {
            id: entry._id,
            fieldId: field.id,
            startDate: dayjs(entry.coverDepartureDateTime),
            endDate: dayjs(entry.coverEndedDateTime),
            estimatedDuration: field.estimatedDuration,
            viewed: entry.consulted,
            state: entry.status == true ? CoverState.INTERRUPT : CoverState.DONE,
            nbDatura: entry.fieldWeeds.length,
            pictures: null, // TODO
            daturaPositions: getDaturaPositions(entry.fieldWeeds, field.shape),
            weather: null,
        };
        coversList.push(newCover);
    });

    /* for (let i = 0; i < coversList.length; i++) {
        getDaturaPics(rawData[i].fieldWeeds).then(response => {
            console.log("all pictures fetched for this cover : ", coversList[i].id)
            coversList[i].pictures = response;
        });
    } */

    return coversList;
}

/**
 * Obtention de la liste des couvertures programmées
 * @function getScheduledCoversList
 * @category Fonction / API
 * @param rawData {any} données brutes
 * @param rawField {any} données brutes d'un champ
 * @param estimatedDuration {Duration} durée estimée de la couverture programmée
 * @returns {Cover[]} liste des couvertures
 */
function getScheduledCoversList(rawData: any, rawField: any, estimatedDuration: Duration) {
    let coversList: Cover[] = [];
    rawData.forEach((entry: any) => {
        var startDate = dayjs(entry.coverTimeStart);
        var newCover: Cover = {
            id: entry._id,
            fieldId: rawField._id,
            startDate: startDate,
            endDate: addDurationToDate(startDate, estimatedDuration),
            estimatedDuration: estimatedDuration,
            viewed: null,
            state: CoverState.SCHEDULED,
            nbDatura: null,
            pictures: null,
            daturaPositions: null,
            weather: null
        };
        coversList.push(newCover);
    });
    return coversList;
}

/* function getCoverStatus(rawField: any, rawCover: any) {
    if (!rawCover || !rawField) {
        return CoverState.READY // TODO: error case
    }

    // If it's a past cover:
    if (rawCover.coverEndedDateTime) {
        if (rawCover.status == true)
            return CoverState.INTERRUPT;
        return CoverState.DONE;
    }

    // If the cover is scheduled:
    if (dayjs(rawCover.coverTimeStart).isAfter(dayjs()))
        return CoverState.SCHEDULED;

    // If there is no drone on the field:
    if (rawField.droneActivity == 0)
        return CoverState.READY;  // TODO: error case

    // If there is a drone on the field:
    if (rawField.coverStatus == 0)
        return (CoverState.READY);
    if (rawField.coverStatus == 1)
        return (CoverState.PROGRESS);
    if (rawField.coverStatus == 2)
        return (CoverState.PAUSE);
    return CoverState.READY // TODO: error case
} */

/**
 * Obtention de la taille des sections groupés de datura
 * @function getScheduledCoversList
 * @category Fonction / API
 * @param length {number} taille
 * @returns {number}
 */
function getLengthInSectors(length: number) {
    return Math.ceil(length / SECTOR_SIZE);
}

/**
 * Obtention de la valeur maximale d'un tableau [][] sur une colomne donnée
 * @function getMaxColList
 * @category Fonction / API
 * @param list {number[][]} taille
 * @param col {number} colomnes
 * @returns {number}
 */
function getMaxColList(list: number[][], col: number) {
    if (!list)
        return -1
    var size = list.length;

    if (size == 0)
        return (-1)

    var max: number = list[0][col];
    var tmp = 0;

    for (var i = 0; i < size; i++) {
        tmp = list[i][col]
        if (tmp > max)
            max = tmp;
    }
    return (max)
}

/**
 * Obtention de la position des datura
 * @function getDaturaPositions
 * @category Fonction / API
 * @param rawDaturaList {any} données brutes de la liste de datura
 * @param fieldShape {FieldShape | null} forme du champ
 * @returns {DaturaPositions | null}
 */
function getDaturaPositions(rawDaturaList: any, fieldShape: FieldShape | null) {
    if (!rawDaturaList || !fieldShape)
        return null;
        
    // Determining the max lengths of the field
    if (fieldShape.max_x == -1 || fieldShape.max_y == -1)
        return null
        
    // Generating an empty 2d-array for the positions
    let daturaPositions: DaturaPositions = [];
    for (let i: number = 0; i < getLengthInSectors(fieldShape.max_y); i++) {
        let line: number[] = Array(getLengthInSectors(fieldShape.max_x)).fill(0);
        daturaPositions.push(line);
    }

    // Filling the 2d-array with detected datura
    rawDaturaList.forEach((entry: any) => {
        if (entry?.length >= 1) {
            let data = entry[0];
            let coordinates: any = data.weedCoordinates[0];
            let x = Math.floor(coordinates.x * SCALE_DOWN_FACTOR);
            let y = Math.floor(coordinates.y * SCALE_DOWN_FACTOR);
            let index_x = Math.floor(x / SECTOR_SIZE);
            let index_y = Math.floor(y / SECTOR_SIZE);
            (daturaPositions[index_y][index_x])++;
        }
    });
    return daturaPositions;
}

// For testing purposes:
const testWeather: IWeatherForecast[] = [
    {
        time: dayjs(),
        main: EWeatherType.Fog,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(1, 'hour'),
        main: EWeatherType.Fog,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(2, 'hour'),
        main: EWeatherType.Sun,
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
    {
        time: dayjs().add(5, 'hour'),
        main: EWeatherType.Sun,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(6, 'hour'),
        main: EWeatherType.Sun,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(7, 'hour'),
        main: EWeatherType.Sun,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(8, 'hour'),
        main: EWeatherType.Sun,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(9, 'hour'),
        main: EWeatherType.Sun,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(10, 'hour'),
        main: EWeatherType.Sun,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
    {
        time: dayjs().add(11, 'hour'),
        main: EWeatherType.Sun,
        rain: 0,
        wind: 0,
        temperature_min: 0,
        temperature_max: 10,
        lastUpdate: dayjs(),
    },
];

/* async function getFieldStats(fieldId: string) {
    let stats: FieldStats[] = [];
    let periods: number[] = [1, 3, 6, 12];
    
    for (let i = 0; i < periods.length; i++) {
        let statForPeriod = await getFieldStatsForXMonths(fieldId, periods[i]);
        if (statForPeriod)
            stats.push(statForPeriod);
    };
    return stats; 
}

async function getFieldStatsForXMonths(fieldId: string, nbMonths: number) {
    var url = URL + "field/stat/" + nbMonths + '/' + fieldId;

    let header = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
          'Authorization': 'Bearer ' + localStorage.token,
        }
    };

    try {
        var response = await axios.get(url, header);
        let stats: FieldStats = {
            timespan: nbMonths,
            data: [],
            positions: null, // TODO
        }

        console.log("getFieldStatsForXMonths", response.data)

        response.data.coverPast.forEach((entry: any) => {
            let data: {date: Dayjs; nbSprouts: number} = {
                date: dayjs(entry.coverDepartureDateTime), // TODO marche plus
                nbSprouts: entry.fieldWeeds.length,  // TODO marche plus
            };
            stats.data.push(data);
        })
        return stats;

     } catch (e) {
        console.log("getFieldStatsForXMonths: " +  e);
        return null
    }
} */

/**
 * Obtention des données météorologique d'un champ
 * @function getFieldForecast
 * @category Fonction / API
 * @async
 * @param lat {number} latitude
 * @param lon {number} longitude
 * @returns {IWeatherForecast[]}
 */
async function getFieldForecast(lat: number, lon: number) {
    //return testWeather;
    var formattedForecast: IWeatherForecast[] = [];
    return getWeather5NextDays(lat, lon).then(rawForecast => {
        if (rawForecast != null) {
            rawForecast.forEach(element => {
            for (var i = 0; i < 3; i++) {
                var addedForecast: IWeatherForecast = Object.assign({}, element);
                addedForecast.time = element.time.add(i, 'hours');
                formattedForecast.push(addedForecast);
            }
            });
            return formattedForecast;
        }
    });
}

/**
 * Définition des données météorologique d'une couverture
 * @function setCoversForecasts
 * @category Fonction / API
 * @param field {Field} Champ
 */
function setCoversForecasts(field: Field) { // Only scheduled covers
    field.scheduledCovers?.forEach(cover => {
        if (!cover.startDate || !cover.endDate) {
            cover.weather = null;
        } else {
            cover.weather = getForecastForTimeSlot(cover.startDate, cover.endDate, field.weather);
        }
    });
}

/**
 * Reporter une photo
 * @function reportPicture
 * @category Fonction / API
 * @async
 * @param fieldId {string} id du champ
 * @param coverId {string} id de la couverture
 * @param photoId {string} id de la photo
 * @returns {object | null}
 */
async function reportPicture(fieldId: string, coverId: string, photoId: string) {
    var url = URL + "field/cover/past/weeds/notdatura/" + fieldId + "/" + coverId + "/" + photoId;

    console.log('reportPicture');
    console.log(fieldId, coverId, photoId);

    let header = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
          'Authorization': 'Bearer ' + localStorage.token,
        }
    };

    return axios.get(url, header).then(response => {
        console.log("reportPicture response.data:")
        console.log(response.data);
    }).catch((error) => {
        console.log("reportPicture: " +  error);
        return null
    });
};

/**
 * Stopper une couverture
 * @function stopCover
 * @category Fonction / API
 * @async
 * @param fieldId {string} id d'un champ
 * @returns {object | null}
 */
async function stopCover(fieldId: string) {
    var url = URL + "field/cover/current/" + fieldId;

    console.log('stopCover');
    console.log(fieldId);

    let header = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
          'Authorization': 'Bearer ' + localStorage.token,
        }
    };

    return axios.delete(url, header).then(response => {
        console.log("stopCover response.data:")
        console.log(response.data);
    }).catch((error) => {
        console.log("stopCover: " +  error);
        return null
    });
}

/**
 * Annuler une couverture programmée
 * @function cancelScheduledCover
 * @category Fonction / API
 * @async
 * @param fieldId {string} id d'un champ
 * @param coverId {string} id d'une couverture
 * @returns {object | null}
 */
async function cancelScheduledCover(fieldId: string, coverId: string) {
    var url = URL + "field/cover/scheduled/" + fieldId + "/" + coverId;

    console.log('cancelScheduledCover');
    console.log(fieldId, coverId);

    let header = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
          'Authorization': 'Bearer ' + localStorage.token,
        }
    };

    return axios.delete(url, header).then(response => {
        console.log("cancelScheduledCover response.data:")
        console.log(response.data);
    }).catch((error) => {
        console.log("cancelScheduledCover: " +  error);
        return null
    });
}

/**
 * Créer une couverture programmée
 * @function createScheduledCover
 * @category Fonction / API
 * @async
 * @param fieldId {string} id d'un champ
 * @param startDate {Dayjs} date de lancement de la couverture
 */
async function createScheduledCover(fieldId: string, startDate: Dayjs) {
    var url = URL + "field/cover/scheduled/" + fieldId;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + localStorage.token);

    var raw = JSON.stringify({
        "coverTimeStart": startDate.format("YYYY-MM-DDTHH:mm:ss.sssZ")
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

/**
 * Modifier une couverture programmée
 * @function editScheduledCover
 * @category Fonction / API
 * @async
 * @param fieldId {string} id d'un champ
 * @param coverId {string} id d'une couverture
 * @param startDate {Dayjs} date de lancement de la couverture
 */
async function editScheduledCover(fieldId: string, coverId: string, startDate: Dayjs) {
    var url = URL + "field/cover/scheduled/" + fieldId + "/" + coverId;
    console.log(fieldId, coverId, startDate.format("YYYY-MM-DDTHH:mm:ss.sssZ"))

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + localStorage.token);

    var raw = JSON.stringify({
        "coverTimeStart": startDate.format("YYYY-MM-DDTHH:mm:ss.sssZ")
    });

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
    };

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

/**
 * Lancer une couverture
 * @function launchCover
 * @category Fonction / API
 * @async
 * @param fieldId {string} id d'un champ
 */
async function launchCover(fieldId: string) {
    var url = URL + "field/cover/startnow/" + fieldId;
    console.log("launchCover")
    console.log(fieldId)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + localStorage.token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

/**
 * Suspendre une couverture
 * @function pauseCover
 * @category Fonction / API
 * @async
 * @param fieldId {string} id d'un champ
 */
async function pauseCover(fieldId: string) {
    var url = URL + "field/cover/current/pause/" + fieldId;
    console.log("pauseCover")
    console.log(fieldId)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + localStorage.token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

/**
 * Reprendre une couverture
 * @function resumeCover
 * @category Fonction / API
 * @async
 * @param fieldId {string} id d'un champ
 */
async function resumeCover(fieldId: string) {
    var url = URL + "field/cover/current/resume/" + fieldId;
    console.log("resumeCover")
    console.log(fieldId)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + localStorage.token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

/**
 * Définir comme lu un rapport de couverture
 * @function setPastCoverAsRead
 * @category Fonction / API
 * @async
 * @param fieldId {string} id d'un champ
 * @param coverId {string} id d'une couverture
 */
async function setPastCoverAsRead(fieldId: string, coverId: string) {
    var url = URL + "field/cover/past/consulted/" + fieldId + "/" + coverId;
    console.log("setPastCoverAsRead")
    console.log(fieldId, coverId)

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", 'Bearer ' + localStorage.token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

export {getAllFields, reportPicture, stopCover, cancelScheduledCover, setPastCoverAsRead,
    createScheduledCover, editScheduledCover, launchCover, pauseCover, resumeCover};