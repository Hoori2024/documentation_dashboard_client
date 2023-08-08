import { useState, useEffect} from 'react';

import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import FieldIdCard from '../elements/FieldIdCard';
import FieldsList from '../lists/FieldsList';
import AlertModal from '../modals/AlertModal';
import TimeInfo from '../elements/TimeInfo';
import WeatherViewer from '../elements/WeatherViewer';

import { IWeatherForecast, Field, Cover } from "../../architecture/architecture";
import { sortCoverByWeather, sortCoverByName, sortCoverByDate, isGoodTimeSlot, getRecommendedTimeSlot,
  sortFieldByName, getNamed, getCoverNamed, addDurationToDate, formatDuration, formatTimeSlot, formatTimeSlotCap,
  combineDateAndTime, containsBadWeather } from "../../assets/utils";
import { cancelScheduledCover, createScheduledCover, editScheduledCover } from '../../api/Api'; 

/**
 * Widget de planification
 * @function WidgetContentScheduler
 * @category Composant / widgets
 * @param props.fields {Field[]} tableau de champs
 * @param props.updateButtons {} ?
 * @param props.widgetState {} ?
 */
export default function WidgetContentScheduler(props: any) {
  require('./WidgetContentScheduler.css');
  require('dayjs/locale/fr');

  let buttonsSortCovers = [
    {
      title: 'Nom',
      onClick: (asc: boolean) => {
        setSortMode({idx: 0, ascend: asc});
      },
      sortFunction: sortCoverByName,
      disabled: false,
    },
    {
      title: 'Date',
      onClick: (asc: boolean) => {
        setSortMode({idx: 1, ascend: asc});
    },
    sortFunction: sortCoverByDate,
      disabled: false,
    },
    {
      title: 'Météo',
      onClick: (asc: boolean) => {
        setSortMode({idx: 2, ascend: asc});
    },
    sortFunction: sortCoverByWeather,
      disabled: false,
    },
  ];

  let buttonsSortFields = [
    {
      title: 'Nom',
      onClick: (asc: boolean) => {
        setSortMode({idx: 0, ascend: asc});
      },
      sortFunction: sortFieldByName,
      disabled: false,
    },
  ];

  // Page display
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [field, setField] = useState<Field | null>(null);
  const [fieldID, setFieldID] = useState<string | null>(null);
  const [cover, setCover] = useState<Cover | null>(null);
  const [displayedForecast, setDisplayedForecast] = useState<IWeatherForecast[] | never[]>([]);

  // Data given by user
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [selectedSlotStart, setSelectedSlotStart] = useState<Dayjs | null>(null);
  const [recommendedSlot, setRecommendedSlot] = useState<{startDate: Dayjs | null, endDate: Dayjs | null} | null>(null);
  const [finalTimeSlot, setFinalTimeSlot] = useState<{start: Dayjs, end: Dayjs} | null>(null);

  // Content data
  //const [fieldList, setFieldList] = useState<Field[] | null>(props.fields);
  const [displayedFields, setDisplayedFields] = useState<Field[] | null>(props.fields);

  const [coverList, setCoverList] = useState<Cover[]>([]);
  const [displayedCovers, setDisplayedCovers] = useState<Cover[] | null>([]);

  // Filtering and sorting
  const [searchFilter, setSearchFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] =
        useState<{idx: number, ascend: boolean}>({idx: 0, ascend: true});

  // Modals
  const [openEditDeleteModal, setOpenEditDeleteModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openBadTimeSlotModal, setOpenBadTimeSlotModal] = useState<boolean>(false);
  const [openSuccessfullyProgrammedModal, setOpenSuccessfullyProgrammedModal] = useState<boolean>(false);

  useEffect(() => {
    setSearchFilter(null);
    setSortMode({idx: 0, ascend: true});
    setSelectedDate(null);
    setSelectedTime(null);
  }, [currentPage]);

  // Filtering and sorting the lists when needed:
  useEffect(() => {
    if (currentPage == 0) {
      var filteredCoverList: Cover[] = getCoverNamed(coverList, searchFilter, props.fields);
      var sortingFunction1 = buttonsSortCovers[sortMode.idx].sortFunction;
      setDisplayedCovers(sortingFunction1(filteredCoverList, sortMode.ascend, props.fields));
    } else if (currentPage == 1) {
      var filteredFieldList: Field[] = getNamed(props.fields, searchFilter);
      var sortingFunction = buttonsSortFields[sortMode.idx].sortFunction;
      setDisplayedFields(sortingFunction(filteredFieldList, sortMode.ascend));
    }
}, [searchFilter, sortMode, props.fields]);
  
  const functionsLabels: { [K: string]: Function } = {
    setCurrentPage: setCurrentPage,
    setNewField: setNewField,
  }

  const buttonsHeader = {
    new: {
      title: 'Nouvelle programmation',
      onClick: handleClickOnNewCover,
    },
    back: {
      title: 'Retour',
      onClick: handleClickBack,
    },
    save: {
      title: 'Enregister',
      onClick: handleClickSave,
    },
  }

  // Setting the header buttons on start
  useEffect(() => {
    props.updateButtons([buttonsHeader['new']]);

    // Setting the scheduled covers to display:
    let allCovers: Cover[] = [];
    props.fields.forEach((currentField: Field) => {
      if (currentField.scheduledCovers) {
        allCovers = allCovers.concat(currentField.scheduledCovers);
      }
    });
    setCoverList(allCovers);
    setDisplayedCovers(allCovers);

    // Setting the notifications:
    /* let nbNotifsToAdd = 0;
    allCovers.forEach((cover: Cover) => {
      //console.log(cover.weather)
      if (containsBadWeather(cover.weather))
        nbNotifsToAdd++;
      });
    props.updateNotifs(nbNotifsToAdd, 'add'); */
  }, []);

  // Updating header buttons when the page changes
  useEffect(() => {
    switch (currentPage) {
      case 0:
        props.updateButtons([buttonsHeader['new']]);
        break;
      
      case 1:
        props.updateButtons([buttonsHeader['back']]);
        break;
      
      case 2:
        props.updateButtons([buttonsHeader['save'], buttonsHeader['back']]);
        break;
      
      default:
        props.updateButtons([]);
        break;
    };

    // If a cover is being modified, auto-fill the time and date
    if (cover != null) {
      setSelectedDate(cover.startDate);
      setSelectedTime(cover.startDate);
    }

  }, [currentPage]);

  useEffect(() => {
    props.widgetState.map((item: any) => {
      let functionLabel: any = functionsLabels[item.functionLabel];
      functionLabel(item.value);
    })
  }, [props.widgetState]);

  // Creating an array of the weather for the selected day remaining hours
  useEffect(() => {
    if (!field || !field.weather || !selectedDate) {

      //console.log("setting displayed forecast to empty")
      setDisplayedForecast([]);
    } else {
      //console.log("getting forecast")
      let selectedDayForecast: IWeatherForecast[] = getDateForecast(selectedDate, field.weather);
      //console.log(selectedDayForecast);
      setDisplayedForecast(selectedDayForecast);
    }
  }, [selectedDate]);

  function getDateForecast(date: Dayjs, forecast: IWeatherForecast[]) {

    function isRemainingHourOfdate(time: Dayjs, date: Dayjs) {
      let currentTime = dayjs();
      
      if (time.isBefore(date, 'day')) {
        return false;
      } else if (time.isAfter(date, 'day')) {
        return false;
      } else if (time.isSame(currentTime, 'day') && time.isBefore(currentTime, 'hour')) {
        return false;
      }
      return true
    }
        
    let selectedDayForecast: IWeatherForecast[] = [];
    forecast.forEach(element => {

      if (isRemainingHourOfdate(element.time, date)) {
        selectedDayForecast.push(Object.assign({}, element));
      }
      
    });
    return selectedDayForecast;
  }

  useEffect(() => {
    if (currentPage == 2)
      props.updateButtons([buttonsHeader['save'], buttonsHeader['back']]);
  }, [selectedDate, selectedTime]);

  // Page 0 callbacks
  function handleClickOnCover(id: string) {
    setNewCover(id);
    setOpenEditDeleteModal(true);
  }

  function handleCancelForEditDeleteModal() {
    setNewCover(null);
    setOpenEditDeleteModal(false);
  }
  
  function handleEditForEditDeleteModal() {
    setOpenEditDeleteModal(false);
    setCurrentPage(2);
  }
  
  function handleDeleteForEditDeleteModal() {
    setOpenEditDeleteModal(false);
    setOpenDeleteModal(true);
  }

  function handleCancelForDeleteModal() {
    setNewCover(null);
    setOpenDeleteModal(false);
  }

  function handleDeleteForDeleteModal() {
    if (field != null && cover != null) {
      cancelScheduledCover(field.id, cover.id).then(response => {
        setOpenDeleteModal(false);
      })
    }
    
  }

  function handleClickOnNewCover() {
    setCurrentPage(1);
  }

  // Page 1 callbacks
  function handleClickOnField(id: string) {
    setNewField(id);
    setCurrentPage(2);
  }

  // Page 2 callbacks
  function handleClickSave() {
    
    if (selectedDate == null || selectedTime == null) {
      return
    }/*  else if (!field.forecast) {

    } */

    let startDate = combineDateAndTime(selectedDate, selectedTime);
    setSelectedSlotStart(startDate);

    if (!isGoodTimeSlot(startDate, field)) { // if the weather conditions are not ok
      let recommendedTimeSlot = getRecommendedTimeSlot(selectedSlotStart, field);
      setRecommendedSlot(recommendedTimeSlot);
      setOpenBadTimeSlotModal(true);
      return;
    }

    if (!cover) { // Creating a new cover
      setOpenCreateModal(true);
    } else { // Editing a cover
      setOpenEditModal(true);
    }
  }

  function getFormattedRecommendedTimeSlot() {
    if (!field || !field.weather)
      return "Aucun créneau recommandé n'a pu être trouvé.";

    let start = recommendedSlot?.startDate;
    let end = recommendedSlot?.endDate;
    
    if (!start || !end)
      return "Aucun créneau recommandé n'a pu être trouvé.";
      
    let formatted = "Nous vous recommandons le créneau suivant :\n";
    formatted += formatTimeSlot(start, end);
    return formatted;
  }

  function getFormattedFinalSlot() {
    if (!finalTimeSlot)
      return "";
    let str = formatTimeSlot(finalTimeSlot.start, finalTimeSlot.end);
    //console.log(str);
    return str;
  }

  function getMinTime() {
    if (selectedDate?.isSame(dayjs(), 'day'))
      return dayjs();
    return undefined;
  }

  function handleClickSaveForCreateModal() {
    if (field != null && selectedSlotStart != null) {
      createScheduledCover(field.id, selectedSlotStart).then(response => {
        setOpenCreateModal(false)
        setCurrentPage(0);
      })
    }
  }

  function handleConfirmForEditModal () {
    if (field != null && cover != null && selectedSlotStart) {
      editScheduledCover(field.id, cover.id, selectedSlotStart).then(response => {
        setOpenEditModal(false);
        setCurrentPage(0);
      })
    }
  }

  function handleKeepSlotForBadWeatherModal () {
    if (!field || !selectedSlotStart)
      return

    let endDate = addDurationToDate(selectedSlotStart, field.estimatedDuration);
    if (!endDate)
      return
    let newFinalTimeSlot = {
      start: selectedSlotStart,
      end: endDate,
    };
    setFinalTimeSlot(newFinalTimeSlot);

    if (cover != null) { // If the cover is being modified
      editScheduledCover(field.id, cover.id, selectedSlotStart).then(response => {
        setOpenBadTimeSlotModal(false);
        setOpenSuccessfullyProgrammedModal(true);
      })
    } else { //  If the cover is being created
      createScheduledCover(field.id, selectedSlotStart).then(response => {
        setOpenBadTimeSlotModal(false);
        setOpenSuccessfullyProgrammedModal(true);
      })
    }
  }
  
  function handleChooseRecoForBadWeatherModal () {
    if (!(recommendedSlot && recommendedSlot.startDate && recommendedSlot.endDate)) {
      return
    }
    let newFinalTimeSlot = {
      start: recommendedSlot.startDate,
      end: recommendedSlot.endDate,
    };
    setFinalTimeSlot(newFinalTimeSlot);

    if (!field)
      return
    if (cover != null) { // If the cover is being modified
      editScheduledCover(field.id, cover.id, newFinalTimeSlot.start).then(response => {
        setOpenBadTimeSlotModal(false);
        setOpenSuccessfullyProgrammedModal(true);
      })
    } else { //  If the cover is being created
      createScheduledCover(field.id, newFinalTimeSlot.start).then(response => {
        setOpenBadTimeSlotModal(false);
        setOpenSuccessfullyProgrammedModal(true);
      })
    }  
  }

  function handleOkForSuccessfullyProgrammedModal() {
    setOpenSuccessfullyProgrammedModal(false);
    setCurrentPage(0);
  }

  function handleClickBack() {
    setNewField(null);
    setNewCover(null);
    setSelectedDate(null);
    if (currentPage == 1) {
      setCurrentPage(0);
    }
    if (currentPage == 2) {
      if (!cover) { // Creating a new cover
        setCurrentPage(1);
      } else { // Editing a cover
        setCurrentPage(0);
      }
    }
  }

  function setNewCover(id: string | null) {
    if (!id)
      setCover(null);
    let newCover: Cover | null | undefined = coverList.find((f) => { return f.id == id });
    if (newCover == undefined)
      newCover = null;
    else
      setNewField(newCover.fieldId);
    setCover(newCover);
  }

  function setNewField(id: string | null) {
    if (!props.fields)
      return;
    if (!id) {
      setField(null);
      setFieldID(null);
    }
    let newField: Field | null | undefined = props.fields.find((f: any) => { return f.id == id });
    if (newField == undefined)
      newField = null;
    setField(newField);
    setFieldID(newField ? newField.id : null);
  }

  /* function removeNotif() {
    props.updateNotifs(0, 'set')
  } */

  // Covers list page
  if (currentPage == 0)
    return (
      <div /* onClick={() => removeNotif()} */>
        <FieldsList
          list={displayedCovers}
          fields={props.fields}
          buttons={buttonsSortCovers}
          onChangeSearch={setSearchFilter}
          showstartDate
          showWeather
          isCover
          onClick={handleClickOnCover}
        />

        {/* Modify or delete cover modal */}
        {cover != null &&
          <AlertModal
            open={openEditDeleteModal}
            title="Souhaitez-vous modifier ou supprimer cette programmation ?"
            message={`${field?.name}\n${formatTimeSlotCap(cover.startDate, cover.endDate)}`}
            btnNegative={{
              title:"Retour", 
              onClick: handleCancelForEditDeleteModal
            }}
            btnNeutral={{
              title:"Supprimer", 
              onClick: handleDeleteForEditDeleteModal
            }}
            btnPositive={{
              title:"Modifier", 
              onClick: handleEditForEditDeleteModal
            }}
          />
        }
        
        {/* Confirm delete cover modal */}
        {cover != null &&
          <AlertModal
            open={openDeleteModal}
            title="Êtes-vous sûr(e) de vouloir supprimer la programmation suivante ?"
            message={`${field?.name}\n${formatTimeSlotCap(cover.startDate, cover.endDate)}`}
            btnNegative={{
              title:"Conserver", 
              onClick: handleCancelForDeleteModal
            }}
            btnPositive={{
              title:"Supprimer", 
              onClick: handleDeleteForDeleteModal
            }}
          />
        }
      </div>
    );

  // Fields list page
  if (currentPage == 1 && props.fields != null)
    return (
      <FieldsList
        list={displayedFields}
        fields={props.fields}
        buttons={buttonsSortFields}
        onClick={handleClickOnField}
        onChangeSearch={setSearchFilter}
      />
    );

  // Setup cover page
  if (currentPage == 2 && field != null) {
    return (
      <div className="widgetcontentscheduler-maincontainer">
        <FieldIdCard
          name={field.name}
          shape={field.shape}
        />

        {/* Content */}
        <div className="widgetcontentscheduler-righthalf">
          
          <div className="widgetcontentscheduler-timeinfo">
            <TimeInfo
              TextDim={25}
              IconDim={25}
              type={'TIMER'}
              text={field.estimatedDuration == null ? "" :
                formatDuration(field.estimatedDuration,
                  field.estimatedDuration.hours + field.estimatedDuration.days > 0 ? "hm" : "m")
              }
            />
          </div>

          <div className="widgetcontentscheduler-formcontrolparent">
            
              <LocalizationProvider
                dateAdapter={AdapterDayjs}>
                <div className='widgetcontentscheduler-datetimepicker'>
                  <div className='customDatePickerWidth'>
                    <DatePicker
                      disablePast
                      /* sx={{
                        
                        backgroundColor: 'red',
                      }} */
                      
                      //fullWidth
                      label="Date de la couverture"
                      value={selectedDate}
                      inputFormat="DD/MM/YYYY"
                      onChange={setSelectedDate}
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              placeholder: "jj/mm/aaa",
                            
                              
                              
                            }}
                            sx={{
                              width: '100%',
                              marginBottom: '16px',
                              //backgroundColor: 'red',
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                  <div className='customTimePickerWidth'>
                    <TimePicker
                      disabled={selectedDate == null}
                      label="Heure de départ"
                      ampm={false}
                      value={selectedTime}
                      onChange={setSelectedTime}
                      minTime={getMinTime()}
                      disableIgnoringDatePartForTimeValidation
                      renderInput={(params) => {
                        return (
                          <TextField
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              placeholder: "hh:mm"
                            }}
                            sx={{
                              width: '100%',
                              //backgroundColor: 'red',
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              </LocalizationProvider>
          </div>
          <div /* ref={ref} */ className="widgetcontentscheduler-weathercontainer">
            { selectedDate == null || ! selectedDate.isValid()
              ? <div className="widgetcontentscheduler-divnoweather">
                  <div className="widgetcontentscheduler-textnoweather">
                    Veuillez sélectionner une date afin de consulter les prévisions météorologiques
                  </div>
                </div>
              : <WeatherViewer forecast={displayedForecast} />
               
            }
          </div>
        </div>

          {/* Create cover modal */}
          <AlertModal
            open={openCreateModal}
            title="Souhaitez-vous programmer la couverture suivante ?"
            message={`${field.name}`+
            `\n${formatTimeSlotCap(selectedSlotStart, addDurationToDate(selectedSlotStart, field.estimatedDuration))} `}
            btnNegative={{
              title:"Retour", 
              onClick: () =>  setOpenCreateModal(false)
            }}
            btnPositive={{
              title:"Programmer", 
              onClick: handleClickSaveForCreateModal
            }}
          />

          {/* Edit cover modal */}
          {cover && field &&
            <AlertModal
              open={openEditModal}
              title="Souhaitez-vous confirmer ces modifications ?"
              message={`${field.name}`+
                `\nAncien créneau : ${formatTimeSlot(cover.startDate, cover.endDate)}`+
                `\nNouveau créneau : ${formatTimeSlot(selectedSlotStart, addDurationToDate(selectedSlotStart, field.estimatedDuration))} `}
              btnNegative={{
                title:"Retour", 
                onClick: () => setOpenEditModal(false)
              }}
              btnPositive={{
                title:"Confirmer", 
                onClick: handleConfirmForEditModal
              }}
            />
          }

          {/* Bad time slot because of weather modal */}
          {(selectedDate && selectedTime && field.weather && field.weather.length > 0 &&
            selectedSlotStart && !isGoodTimeSlot(selectedSlotStart, field)) &&
            <AlertModal
              open={openBadTimeSlotModal}
              title="Attention !"
              message={`Le créneau choisi comporte des prédictions météorologiques incompatibles avec l’utilisation du drone Hoori.\n${getFormattedRecommendedTimeSlot()}`}
              btnNegative={{
                title:"Conserver le créneau choisi",
                onClick: handleKeepSlotForBadWeatherModal
              }}
              btnNeutral={{
                title:"Choisir un autre créneau",
                onClick: () => setOpenBadTimeSlotModal(false)
              }}
              btnPositive={(recommendedSlot?.startDate && recommendedSlot?.endDate) ?
                {
                  title:"Choisir le créneau recommandé",
                  onClick: handleChooseRecoForBadWeatherModal
                }
                : null
              }
            />
          }

          {/* Cover successfully programmed */}
          <AlertModal
            open={openSuccessfullyProgrammedModal}
            title="Couverture programmée avec succès"
            message={`La couverture a bien été programmée sur le créneau suivant :\n${getFormattedFinalSlot()}`}
            btnPositive={{
              title:"Ok",
              onClick: handleOkForSuccessfullyProgrammedModal
            }}
          />

      </div>
        
    );
  }

  return <div/>
};