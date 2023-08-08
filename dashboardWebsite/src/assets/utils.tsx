import dayjs, { Dayjs } from 'dayjs';

import {Cover, Field, EWeatherType, Duration, IWeatherForecast,
  CoverState} from '../architecture/architecture';

export function combineDateAndTime(selectedDate: Dayjs, selectedTime: Dayjs) {
  let formattedDate = selectedDate.format("YYYY-MM-DD");
  let formattedTime = selectedTime.format("HH:mm:ss");
  let combinedDate = dayjs(formattedDate + ' ' + formattedTime);
  return combinedDate;
}

export function arrayBufferToBase64(buffer : any) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++)
     binary += String.fromCharCode( bytes[ i ] );
  return window.btoa(binary);
}

export function getRecommendedTimeSlot(baseStartDate: Dayjs | null, field: Field | null) {
  let recommendedTimeSlot: {startDate: Dayjs | null, endDate: Dayjs | null} = {
    startDate: null,
    endDate: null,
  }

  if (!field || !field.estimatedDuration)
    return null;

  if (!baseStartDate)
    baseStartDate = dayjs();

  let forecast = field.weather;

  if (!forecast)
    return null
  for (let i: number = 0; i < forecast.length; i++) {
    if (baseStartDate.isBefore(forecast[i].time) &&
      isGoodTimeSlot(forecast[i].time, field)) {
        recommendedTimeSlot.startDate = forecast[i].time;
        recommendedTimeSlot.endDate = addDurationToDate(forecast[i].time, field.estimatedDuration);
          return recommendedTimeSlot;
      }
    
  }
  return null;
}

export function isBadWeather(weather: EWeatherType) {
  let badWeather = [EWeatherType.Storm, EWeatherType.Snow, EWeatherType.Rain, EWeatherType.Wind, EWeatherType.Fog];
  return badWeather.includes(weather);
}

export function isGoodTimeSlot(startDate: Dayjs, field: Field | null) {
  if (!field)
    return false;
    
  let endDate = addDurationToDate(startDate, field.estimatedDuration);

  let forecast = field.weather;

  if (!forecast)
    return true;

  for (let i: number = 0; i < forecast.length; i++) {
    if (startDate.isSame(forecast[i].time, 'hour') || (startDate.isBefore(forecast[i].time) && endDate?.isAfter(forecast[i].time))) {
      if (isBadWeather(forecast[i].main)) {
        return false
      }
    }
  }
  return true
}

export function formatDuration(duration: Duration | null, format: string) {
  // param format: to express what the return value should contain
  // d: day, h: hour, m: minutes, s: seconds
  // ex: 'hm' -> 2h 34min

  if (duration == null)
    return 'Aucune estimation de durée disponible';

  let formatted: string = "";

  if (format.includes("d"))
    formatted += (duration.days + "j ");
  if (format.includes("h")) {
    let nbHours = duration.hours;
    nbHours += (!format.includes("d") && duration.days > 0 ? duration.days * 24 : 0);
    formatted += (nbHours + "h ");
  }
  if (format.includes("m"))
    formatted += (duration.minutes + "m ");
  if (format.includes("s"))
    formatted += (duration.seconds + "s");

  return formatted;
}

export function formatTimeSlot(start: Dayjs | null, end: Dayjs | null) {
  if (!start || !end)
    return ""

  let formatted = "";
  if (start.isSame(end, 'day')) {
    formatted += start.format("[le ]DD/MM/YYYY[ de ]HH[h]mm[ à ]");
    formatted += end.format('HH[h]mm');
  } else {
    formatted += start.format("[du ]DD/MM/YYYY[ à ]HH[h]mm[ au ]");
    formatted += end.format('DD/MM/YYYY[ à ]HH[h]mm');
  }
  return formatted;
}

export function formatTimeSlotCap(startDate: Dayjs | null, endDate: Dayjs | null) {
  if (startDate == null || endDate == null)
    return "";
    
  let formatted: string = "";
  if (startDate.isSame(endDate, 'day')) {
    formatted += startDate.format('[Le ]DD/MM/YYYY[ de ]HH[h]mm');
    formatted += endDate.format('[ à ]HH[h]mm');
  } else {
    formatted += startDate.format('[Du ]DD/MM/YYYY[ à ]HH[h]mm[ au ]');
    formatted += endDate.format('DD/MM/YYYY[ à ]HH[h]mm');
  }
  
  return formatted;
}

export function formatTimeSlotShort(startDate: Dayjs | null, endDate: Dayjs | null) {
  if (startDate == null || endDate == null)
    return "";
    
  let formatted: string = "";
  if (startDate.isSame(endDate, 'day')) {
    formatted += startDate.format('DD/MM/YYYY[ ]HH[h]mm');
    formatted += endDate.format('[ - ]HH[h]mm');
  } else {
    formatted += startDate.format('DD/MM/YYYY[ ]HH[h]mm[ - ]');
    formatted += endDate.format('DD/MM/YYYY[ ]HH[h]mm');
  }
  
  return formatted;
}

export function getWeatherOfCover(cover: Cover | null) {
    if (!cover || !cover.weather)
        return null;

    var weathers: EWeatherType[] = [];
    cover.weather.forEach(element => {
        weathers.push(element.main);
    });
    return Math.max(...weathers);
}

export function getFieldById(id: string, fieldsList: Field[] | null) {
    if (!fieldsList)
      return null;
    let field: Field | null | undefined = fieldsList.find((f: any) => { return f.id === id });
    if (field === undefined)
        field = null;
    return field;
}

export function sortCoverByName(list: Cover[] | null, ascendingOrder: boolean, fieldsList: Field[] | null) {
    if (!list)
        return null;

    var newList = [...list];
    newList.sort((a: any, b: any) => {
      var fieldA = getFieldById(a.fieldId, fieldsList);
      var fieldB = getFieldById(b.fieldId, fieldsList);
      if (!fieldA || !fieldB)
        return 1
      return (fieldA.name >= fieldB.name ? 1 : -1)
    });
    if (!ascendingOrder)
      newList.reverse();
    return newList;
}

export function sortFieldByName(list: Field[] | null, ascendingOrder: boolean) {
    if (!list)
        return null;
    var newList = [...list];
    newList.sort((a: Field, b: Field) => {
      return (a.name >= b.name ? 1 : -1)
    });
    if (!ascendingOrder)
      newList.reverse();
    return newList;
}

export function sortCoverByDate(list: Cover[] | null, ascendingOrder: boolean) {
    if (!list)
        return null;
    
    var newList = [...list];
    if (!ascendingOrder) {
      newList.sort((a: any, b: any) => {
        return (a.startDate.isBefore(b.startDate) ? 1: -1)
      })
    } else {
      newList.sort((a: any, b: any) => {
        return (a.startDate.isBefore(b.startDate) ? -1: 1)
      }) 
    }
    return newList;
}

export function sortFieldbyState(list: Field[], ascendingOrder: boolean) {
    var newList = [...list];

    newList.sort((a: any, b: any) => {
      let stateA = getCoverStateForField(a);
      let stateB = getCoverStateForField(b);
      if (stateA == null) // no drone
        return -1
      if (stateB == null) // no drone
        return 1
      return (stateA >= stateB ? 1 : -1)
    });

    if (!ascendingOrder)
      newList.reverse();
    return newList;
    // state no drone à ajouter
}

export function sortCoverByWeather(list: Cover[] | null, ascendingOrder: boolean) {
    if (!list)
        return null;

    var newList = [...list];
    newList.sort((a: any, b: any) => {
      var weatherCoverA = getWeatherOfCover(a);
      var weatherCoverB = getWeatherOfCover(b);
      if (!weatherCoverA || !weatherCoverB)
        return 1
      return (weatherCoverA >= weatherCoverB ? 1 : -1)
    });
    if (!ascendingOrder)
      newList.reverse();
    return newList;
}

export function getNamed(list: any, searchValue: string | null) {
    let newList = [...list];
    if (searchValue != null && searchValue !== "") {
      newList = newList.filter((obj: any) => {
          let objValue = obj.name.toLowerCase();
          var newSearchValue = searchValue?.toLowerCase();
            return (objValue.includes(newSearchValue))
        });
    }
    return newList;
}

export function getCoverNamed(list: any, searchValue: string | null, fieldsList: Field[] | null) {
    let newList = [...list];
    
    if (searchValue != null && searchValue !== "") {
      newList = newList.filter((obj: any) => {
          var field = getFieldById(obj.fieldId, fieldsList);
          if (!field)
            return false;
          var objValue = field.name.toLowerCase();
          var newSearchValue = searchValue?.toLowerCase();
            return (objValue.includes(newSearchValue))
        });
    }
    return newList;
}

export function addDurationToDate(date: Dayjs | null, duration: Duration | null) {
  if (!duration || !date)
    return date;
  let newDate = date;
  newDate = newDate.add(duration.days, 'days');
  newDate = newDate.add(duration.hours, 'hours');
  newDate = newDate.add(duration.minutes, 'minutes');
  newDate = newDate.add(duration.seconds, 'seconds');
  return newDate;
}

export function getTimeDifference(startDate: Dayjs, endDate: Dayjs) {

  let seconds = Math.abs(startDate.diff(endDate, 'seconds'));
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  let days = Math.floor(hours / 24);
  hours = hours % 24;

  let timeDiff: Duration = {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };

  return timeDiff
}

export function isInTimeSlot(date: Dayjs, timeSlotStart: Dayjs, timeSlotEnd: Dayjs) {
  
  
  if (date.isBefore(timeSlotStart)) {
    return false;
  } else if (date.isAfter(timeSlotEnd)) {
    return false;
  }
  return true;
}

export function getForecastForTimeSlot(startDate: Dayjs, endDate: Dayjs, forecast: IWeatherForecast[] | null) {
  if (!forecast || forecast.length == 0)
    return null

  let timeSlotForecast: IWeatherForecast[] = [];
  for (var i: number = 0; i < forecast.length; i++) {
    if (startDate.add(1, 'hour').isAfter(endDate)) { // If the time slot is less than an hour
     if (isInTimeSlot(startDate, forecast[i].time, forecast[i].time.add(59, 'minutes')) ||
        isInTimeSlot(endDate, forecast[i].time, forecast[i].time.add(59, 'minutes'))) 
        timeSlotForecast.push(Object.assign({}, forecast[i]));
      }
    if (isInTimeSlot(forecast[i].time, startDate, endDate) ||
        isInTimeSlot(forecast[i].time.add(59, 'minutes'), startDate, endDate)) {
      
    }
  }
  return timeSlotForecast;
}

export function getLastUnreadCover(coverList: Cover[] | null) {
  if (!coverList)
    return null;
  for (let i: number = 0; i < coverList.length; i++) {
    if (coverList[i].viewed == false)
      return coverList[i];
  }
  return null;
}

export function getNextScheduledCover(coverList: Cover[] | null) {
  if (!coverList || coverList.length < 1)
    return null;
  return coverList[0];
}

export function getCoverStateForField(field: Field) {
  // If a past cover is unread:
  if (field.pastCovers) {
    let lastUnreadCover = getLastUnreadCover(field.pastCovers);
    if (lastUnreadCover)
      return lastUnreadCover.state;
  }

  // If a cover is ongoing:
  if (field.currentCover) {
    return field.currentCover.state;
  }

  // If there is a scheduled cover:
  if (field.scheduledCovers) {
    let nextScheduledCover = getNextScheduledCover(field.scheduledCovers);
    if (nextScheduledCover)
      return nextScheduledCover.state;
  }

  // If there is no drone:
  if (!field.droneId) { 
    return null;
  }

  // Otherwise the drone is ready to be launched:
  return CoverState.READY;
}

export function containsBadWeather(forecast: IWeatherForecast[] | null) {
  if (forecast == null)
    return false;

  var badWeather = [EWeatherType.Rain, EWeatherType.Wind,
    EWeatherType.Snow, EWeatherType.Storm];

  for (var i: number = 0; i < forecast.length; i++) {
    if (badWeather.includes(forecast[i].main)) {
      return true;
    }
  }
  return false;
}

export default {}