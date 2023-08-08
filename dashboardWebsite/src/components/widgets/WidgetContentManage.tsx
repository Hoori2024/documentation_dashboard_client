import { useState, useEffect } from 'react';

import dayjs, {Dayjs} from 'dayjs';

import {CoverState, Duration, Field, Cover} from '../../architecture/architecture';
import {getTimeDifference, isGoodTimeSlot, getRecommendedTimeSlot, formatTimeSlot,
  sortFieldByName, sortFieldbyState, getNamed, formatDuration, 
  formatTimeSlotShort, getFieldById, getLastUnreadCover, getNextScheduledCover} from '../../assets/utils';
import { stopCover, cancelScheduledCover, createScheduledCover, launchCover,
  pauseCover, resumeCover, setPastCoverAsRead } from '../../api/Api';

import ManageCoverBtn from '../buttons/ManageCoverBtn';
import FieldIdCard from '../elements/FieldIdCard';
import TimeInfo from '../elements/TimeInfo';
import ProgressBar from '../elements/ProgressBar';
import ImageViewer from '../elements/ImageViewer';
import AlertModal from '../modals/AlertModal';
import DaturaInfo from '../elements/DaturaInfo';
import FieldsList from '../lists/FieldsList';

/**
 * Widget de gestion de couverture
 * @function WidgetContentManage
 * @category Composant / widgets
 * @param props.fields {Field[]} tableau de champs
 * @param props.updateButtons {} ?
 * @param props.widgetState {} ?
 */
export default function WidgetContentManage(props: any) {
  require('./WidgetContentManage.css');

  let buttons = [
    {
      title: 'Nom',
      onClick: (asc: boolean) => {setSortMode({idx: 0, ascend: asc})},
      sortFunction: sortFieldByName,
      disabled: false,
    },
    {
      title: 'Statut',
      onClick: (asc: boolean) => {setSortMode({idx: 1, ascend: asc})},
    sortFunction: sortFieldbyState,
      disabled: false,
    },
  ];

  const buttonsHeader = {
    finish: {
      title: 'Terminer',
      onClick: handleClickOnFinish,
    },
    back: {
      title: 'Retour',
      onClick: handleClickOnBack,
    },
  }

  // Display
  const [currentPage, setCurrentPage] = useState(0);
  const [currentField, setCurrentField] = useState<any>(null);
  const [displayedCover, setDisplayedCover] = useState<any>(null);
  const [displayedFields, setDisplayedFields] = useState(props.fields);
  const [recommendedSlot, setRecommendedSlot] = useState<{startDate: Dayjs | null, endDate: Dayjs | null} | null>(null);

  // Modals
  const [modalInterrupt, setModalInterrupt] = useState(false);
  const [modalBadMeteoAlert, setModalBadMeteoAlert] = useState(false);
  const [modalSuccessProgram, setModalSuccessProgram] = useState(false);
  const [cancelConfirmModal, setCancelConfirmModal] = useState(false);

  // Filtering and sorting
  const [searchFilter, setSearchFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] =
    useState<{idx: number, ascend: boolean}>({idx: 0, ascend: true});

  useEffect(() => {
    setSearchFilter(null);
    setSortMode({idx: 0, ascend: true});
  }, []);

  useEffect(() => {
    // Setting the new cover to display
    let newCover = getCoverToDisplay(currentField);
    setDisplayedCover(newCover);    
  }, [currentField]);

  // Filtering and sorting the list when needed:
  useEffect(() => {
    var filteredList = getNamed(props.fields, searchFilter);
    var sortingFunction = buttons[sortMode.idx].sortFunction;
    setDisplayedFields(sortingFunction(filteredList, sortMode.ascend))
  }, [searchFilter, sortMode, props.fields]);

  const functionsLabels: { [K: string]: Function } = {
    setCurrentPage: setCurrentPage,
    /* setNewField: setNewField, */
  }

  useEffect(() => {
    if (currentPage == 0) {
      setCurrentField(null);
      props.updateButtons([]);
    } else if (!displayedCover) {
      props.updateButtons([buttonsHeader['back']]);
    } else {
      if (displayedCover.state == CoverState.DONE ||
        displayedCover.state == CoverState.INTERRUPT) {
          props.updateButtons([buttonsHeader['finish'], buttonsHeader['back']]);
      } else {
        props.updateButtons([buttonsHeader['back']]);
      }
    }
    
  }, [currentPage]);

  useEffect(() => {
    if (displayedCover?.state == CoverState.DONE ||
      displayedCover?.state == CoverState.INTERRUPT) {
        props.updateButtons([buttonsHeader['finish'], buttonsHeader['back']]);
    }
  }, [displayedCover]);

  // oublié
  useEffect(() => {
    props.widgetState.map((item: any) => {
      let functionLabel: any = functionsLabels[item.functionLabel];
      functionLabel(eval(item.value));
    })
  }, [props.widgetState]);

  function getCoverToDisplay(field: Field) {
    if (!field)
      return null;

    // If there is an unread cover:
    if (field.pastCovers && field.pastCovers.length > 0) {
      let lastUnreadCover = getLastUnreadCover(field.pastCovers);
      if (lastUnreadCover)
        return lastUnreadCover;
    }

    // If there is an ongoing cover:
    if (field.currentCover)
      return field.currentCover;
    
    // If there is a scheduled cover:
    if (field.scheduledCovers && field.scheduledCovers.length > 0) {
      let nextScheduledCover = getNextScheduledCover(field.scheduledCovers);
      if (nextScheduledCover)
        return nextScheduledCover;
    }

    return null;
  }

  function onChangeSearch(search: string) {
    setSearchFilter(search);
  }

  function updateState(newState: any) { // TODO: remove ?
    let currentFieldCopy = currentField;

    /* if (newState == CoverState.DONE ||
        newState == CoverState.INTERRUPT) {
            props.updateButtons([buttonsHeader['finish'], buttonsHeader['back']]);
    } else {
        props.updateButtons([buttonsHeader['back']]);
    } */
  }

  function handleClickOnCancel() {
    setCancelConfirmModal(true);
  }

  function handleClickOnLaunch() {
    if (!isGoodTimeSlot(dayjs(), currentField)) { // if the weather conditions are not ok
      let recommendedTimeSlot = getRecommendedTimeSlot(null, currentField);
      setRecommendedSlot(recommendedTimeSlot);
      setModalBadMeteoAlert(true);
    } else
      launchCover(currentField.id).then(response => {});
  }

  function handleClickOnProgram() {
    props.setWidgetState(1, [
        {functionLabel: 'setNewField', value: currentField!['id']},
        {functionLabel: 'setCurrentPage', value: 2}
    ]);
  }

  function handleClickOnEdit() {
    props.setWidgetState(1, [
        {functionLabel: 'setNewField', value: currentField!['id']},
        {functionLabel: 'setCurrentPage', value: 2}
    ]);
  }

  function handleClickOnBack() {
    setCurrentPage(0);
  }

  function cancelScheduled() {
    cancelScheduledCover(displayedCover.fieldId, displayedCover.id).then(response => {
      console.log("cancelScheduledCover");
      console.log(response);
      setDisplayedCover(getCoverToDisplay(currentField));
  });
  }
  
  function handleClickOnPause() {
    //displayedCover.state = CoverState.PAUSE;
    pauseCover(currentField.id).then(response => {
        console.log("pauseCover");
        console.log(response);
    });
  }

  function handleClickOnStop() {
    //displayedCover.state = CoverState.INTERRUPT;
    setModalInterrupt(true);
  }
  
  function handleClickOnConfirmForModalInterrupt() {
    stopCover(currentField.id).then(response => {
        console.log("stopCover");
        console.log(response);
        setModalInterrupt(false);
    });
  }

  function handleClickOnResume() {
    //displayedCover.state = CoverState.PROGRESS;
    resumeCover(currentField.id).then(response => {
        console.log("resumeCover");
        console.log(response);
    });
  }

  function handleClickOnFinish() {
    setPastCoverAsRead(displayedCover.fieldId, displayedCover.id).then(response => {
      console.log("handleClickOnFinish");
      console.log(response);
      setDisplayedCover(getCoverToDisplay(currentField));
  }); 
  }


  function handleClickOnRefresh() {
    //setOpenNoDroneModal(false);
    setDisplayedCover(getCoverToDisplay(currentField));
  }

  function handleClickOnField(id: string) {
    let tmpfield = getFieldById(id, props.fields);
    setCurrentField(tmpfield);
    /* if (tmpfield?.currentCover != null) {
        updateState(tmpfield?.currentCover.state);
    } else if (tmpfield?.pastCovers != null) {
        let size = tmpfield?.pastCovers?.length;
        if (size > 0) {
            updateState(tmpfield.pastCovers.at(size - 1));
        }
    } */
    setCurrentPage(1);
  }

  function getFormattedRecommendedTimeSlot() {
    if (!currentField || !currentField.weather)
      return "Aucun créneau recommandé n'a pu être trouvé.";

    let start = recommendedSlot?.startDate;
    let end = recommendedSlot?.endDate;
    
    if (!start || !end)
      return "Aucun créneau recommandé n'a pu être trouvé.";
      
    let formatted = "Nous vous recommandons le créneau suivant :\n";
    formatted += formatTimeSlot(start, end);
    return formatted;
  }

  let cancelConfirm =
    <AlertModal
      open={cancelConfirmModal}
      close={() => {setCancelConfirmModal(false)}}
      title="Êtes-vous sur(e) de vouloir annuler la couverture programmée ?"
      message={""}
      btnNegative={{title: "Retour", onClick: () => {setCancelConfirmModal(false)}}}
      btnPositive={{title: "Confirmer", onClick: () => {setCancelConfirmModal(false); cancelScheduled();}}}
    />

  let interruption = 
    <AlertModal
      open={modalInterrupt}
      close={() => {setModalInterrupt(false)}}
      title="Êtes-vous sur(e) de vouloir stopper la couverture en cours ?"
      message={''}
      btnNegative={{title: "Retour", onClick: () => setModalInterrupt(false)}}
      btnPositive={{title: "Confirmer", onClick: handleClickOnConfirmForModalInterrupt}}
    />

  function handleLaunchOnBadTimeSlot() {
    launchCover(currentField.id).then(response => {
        setModalBadMeteoAlert(false);
    });
  }

  function handleProgramRecommendedTimeSlot() {
    if (!recommendedSlot || !recommendedSlot.startDate)
      return;
    createScheduledCover(currentField.id, recommendedSlot.startDate).then(response => {
        setModalBadMeteoAlert(false);
        setModalSuccessProgram(true);
    });
  }

  function getDurationPercentage(startDate: Dayjs, endDate: Dayjs) {
    let totalDuration = Math.abs(startDate.diff(endDate));
    let currentProgress = Math.abs(startDate.diff(dayjs()));

    if (totalDuration <= 0 || currentProgress <= 0)
      return (0);

    if (currentProgress > totalDuration)
      return (90);

    let percentage = (currentProgress / totalDuration) * 100;

    return percentage;
  }

  function getFormattedTimeProgress(startDate: Dayjs, duration: Duration) {
    function formatDur(dur: Duration) {
      let str: string = "";
      if (dur.hours > 0 || dur.days > 0) { // {1day, 1h, 1m, 1s} -> 25h2m
        str += ((dur.hours + dur.days * 24) + "h");
        if (dur.minutes > 0 || dur.seconds > 0)
          str += (dur.minutes + (dur.seconds != 0 ? 1 : 0) + 'm');
      } else { // {0day, 0h, 1m, 1s} -> 2m
        //if (dur.minutes > 0)
          str += (dur.minutes + (dur.seconds != 0 ? 1 : 0) + "m");
      }
      return str;
    }

    let currentProgress: Duration = getTimeDifference(startDate, dayjs());
    let formatted: string = (formatDur(currentProgress) + ' / ' + formatDur(duration));
    return formatted;

  }

  function BadWeatherModal(props: any) {
    return (
      <AlertModal
        open={modalBadMeteoAlert}
        close={() => {setModalBadMeteoAlert(false)}}
        title="Attention !"
        message={`Le créneau choisi comporte des prédictions météorologiques incompatibles avec l’utilisation du drone Hoori.\n${getFormattedRecommendedTimeSlot()}`}
        btnNegative={{title: "Annuler", onClick: () => {setModalBadMeteoAlert(false)}}}
        btnNeutral={{title: "Conserver le créneau choisi", onClick: handleLaunchOnBadTimeSlot}}
        btnPositive={(recommendedSlot?.startDate && recommendedSlot?.endDate) ?
          {title: "Choisir le créneau recommandé", onClick: handleProgramRecommendedTimeSlot}
          : null}
      />
    );
  }    

  let successfullyProgrammed = (recommendedSlot ? 
    <AlertModal
      open={modalSuccessProgram}
      title="Couverture programmée avec succès"
      message={`La couverture a bien été programmée sur le créneau suivant :\n${formatTimeSlot(recommendedSlot.startDate, recommendedSlot.endDate)}`}
      btnPositive={{
        title:"Ok",
        onClick: () => setModalSuccessProgram(false)
      }}
    />
    : null)

  function ReadyToLaunch() {
    require('./WidgetContentReady.css')
    return (
      <div className="widgetcontentready-righthalf">
        <BadWeatherModal/>
        {successfullyProgrammed}
        <div className="widgetcontentready-infoscontainer">
          <a> PRÊTE À LANCER </a>
          <TimeInfo
            TextDim={22}
            IconDim={22}
            type={'TIMER'}
            text={formatDuration(currentField.estimatedDuration,
              currentField.estimatedDuration.hours + currentField.estimatedDuration.days > 0 ? "hm" : "m")}
          />
        </div>
        <div className='widgetcontentready-btnscontainer'>
          <ManageCoverBtn
            type={'LAUNCH'}
            TextDim={18}
            IconDim={100}
            callBack={() => handleClickOnLaunch()}
          />
          <ManageCoverBtn
            type={'PROGRAM'}
            TextDim={18}
            IconDim={100}
            callBack={() => handleClickOnProgram()}
          />
        </div>
      </div>
    );
  }

  function Content(props: any) {

    if (!currentField)
      return <></>

    if (currentField.droneId == null) {
      require('./WidgetContentNoDrone.css')
      return (
        <div className="WidgetContentNoDrone-righthalf">
            <div className="WidgetContentNoDrone-container">
              <a> AUCUN DRONE DÉTECTÉ </a>
              <div className="imageviewer-containertextnodatura">
                <div className="WidgetContentNoDrone-text"> Pour lancer une couverture sur ce champ, veuillez installer le drone sur sa base. </div>
              </div>
            </div>
            {/* <div className='WidgetContentNoDrone-refresh'>
              <ManageCoverBtn type={'REFRESH'} TextDim={20} IconDim={80} callBack={() => handleClickOnRefresh()}/>
            </div> */}
        </div>
      );
    }

    if (!displayedCover) {
      //console.log("no cover to display");
      return <ReadyToLaunch/>;
    }

    if (displayedCover.state == CoverState.SCHEDULED) {
      require('./WidgetContentProgram.css')
      return (
        <div className="widgetcontentprogram-righthalf">
          {successfullyProgrammed}
          <BadWeatherModal/>
          <div className="widgetcontentprogram-infoscontainer">
            <a className='widgetcontentprogram-infotitle'>PROGRAMMÉE</a>
            <div className="widgetcontentprogram-infosubcontainer">
              <TimeInfo
                TextDim={22}
                IconDim={22}
                type={'DATE'}
                text={formatTimeSlotShort(displayedCover.startDate, displayedCover.endDate)}
              />
              <TimeInfo
                TextDim={22}
                IconDim={22}
                type={'TIMER'}
                text={formatDuration(currentField.estimatedDuration,
                  currentField.estimatedDuration.hours + currentField.estimatedDuration.days > 0 ? "hm" : "m")}
              />
            </div>
          </div>
          <div className='widgetcontentprogram-btnscontainer'>
            {cancelConfirm}
            <ManageCoverBtn type={'LAUNCH'} TextDim={17} IconDim={100} callBack={handleClickOnLaunch}/>
            <ManageCoverBtn type={'EDIT'} TextDim={17} IconDim={100} callBack={handleClickOnEdit}/>
            <ManageCoverBtn type={'CANCEL'} TextDim={17} IconDim={100} callBack={handleClickOnCancel}/>
          </div>
        </div>
      );
    }

    if (displayedCover.state == CoverState.PROGRESS) {
      require('./WidgetContentProgress.css')
      return (
        <div className="widgetcontentprogress-righthalf">
          {interruption}
          <div className="widgetcontentprogress-infoscontainer">
            <a>EN COURS</a>
          </div>
          <div className='widgetcontentprogress-pb'>
            <ProgressBar
              text={getFormattedTimeProgress(displayedCover.startDate, displayedCover.estimatedDuration)}
              textSize={20}
              value={getDurationPercentage(displayedCover.startDate, displayedCover.endDate)}
            />
          </div>
          <div className='widgetcontentprogress-btnscontainer'>
            <ManageCoverBtn type={'PAUSE'} TextDim={20} IconDim={90} callBack={() => handleClickOnPause()}/>
            <ManageCoverBtn
              type={'STOP'}
              TextDim={20} IconDim={90}
              callBack={() => handleClickOnStop()}
              />
          </div>
        </div>
      );
    }

    if (displayedCover.state == CoverState.PAUSE) {
      require('./WidgetContentPause.css')
      return (
        <div className="widgetcontentpause-righthalf">
          {interruption}
          <div className="widgetcontentpause-infoscontainer">
            <a>EN PAUSE</a>
          </div>
          <div className='widgetcontentpause-pb'>
            <ProgressBar
              text={getFormattedTimeProgress(displayedCover.startDate, displayedCover.estimatedDuration)}
              textSize={20}
              value={getDurationPercentage(displayedCover.startDate, displayedCover.endDate)}
            />
          </div>
          <div className='widgetcontentpause-btnscontainer'>
            <ManageCoverBtn type={'RESUME'} TextDim={20} IconDim={90} callBack={() => handleClickOnResume()}/>
            <ManageCoverBtn type={'STOP'} TextDim={20} IconDim={90} callBack={() => handleClickOnStop()}/>
          </div>
        </div>
      );
    }

    if (displayedCover.state == CoverState.DONE) {
      require('./WidgetContentFinish.css')
      return (
        <div className="widgetcontentfinish-righthalf">
          <div className="widgetcontentfinish-infoscontainer">
            <a>DÉTECTION TERMINÉE</a>
            <div className='widgetcontentfinish-resultcontainer'>
              <DaturaInfo number={displayedCover.nbDatura}/>
            </div>
          </div>
          <ImageViewer
            pictureList={displayedCover.pictures}
            fieldId={currentField.id}
            coverId={displayedCover.id}
          />
        </div>
      );
    }

    if (displayedCover.state == CoverState.INTERRUPT) {
      require('./WidgetContentFinish.css')
      return (
        <div className="widgetcontentfinish-righthalf">
          <div className="widgetcontentfinish-infoscontainer">
            <a>DÉTECTION INTERROMPUE</a>
            <div className='widgetcontentfinish-resultcontainer'>
              <DaturaInfo number={displayedCover.nbDatura}/>
            </div>
          </div>
          <ImageViewer
            pictureList={currentField!['pictures']}
            fieldId={currentField.id}
            coverId={displayedCover.id}
          />
        </div>
      );
    }

    if (displayedCover.state = CoverState.READY) {
      console.log('Error: cover state is READY')
      return <ReadyToLaunch/>;
    }
    return <></>;
  }

  if (currentPage == 0) {
    return (
      <div className="widgetcontentready-infoscontainer">
        <FieldsList
          list={displayedFields}
          fields={props.fields}
          buttons={buttons}
          onChangeSearch={onChangeSearch}
          showState
          onClick={handleClickOnField}
        />
      </div>
    )
  }
  
  let datura = null;
  let legend = false;

  if (displayedCover &&
  (displayedCover.state === CoverState.DONE || displayedCover.state === CoverState.INTERRUPT))
    legend = true;
  if (displayedCover)
    datura = displayedCover.daturaPositions;

  return (
    <div className="widgetcontentmanage-maincontainer">
      <FieldIdCard
        name={currentField.name}
        shape={currentField.shape}
        datura={datura}
        defaultLegend={legend}
      />
      <Content updateButtons={props.updateButtons}/>
    </div>
  );
};