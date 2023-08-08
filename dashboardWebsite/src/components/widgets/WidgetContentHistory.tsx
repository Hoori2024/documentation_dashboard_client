import { useState, useEffect } from 'react';
import FieldIdCard from '../elements/FieldIdCard';
import FieldsList from '../lists/FieldsList';
import DaturaInfo from '../elements/DaturaInfo';
import ImageViewer from '../elements/ImageViewer';

import {sortFieldByName, getNamed} from '../../assets/utils';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import {Field, Cover} from '../../architecture/architecture';

/**
 * Widget d'historique
 * @function WidgetContentHistory
 * @category Composant / widgets
 * @param props.fields {Field[]} tableau de champs
 * @param props.updateButtons {function} fonction permettant de modifier les boutons dans l'en-tête du widget
 */
export default function WidgetContentHistory(props: any) {
  require('./WidgetContentHistory.css');

  const [currentPage, setCurrentPage] = useState(0);
  //const [fieldId, setFieldId] = useState<string | null>(null);
  const [field, setField] = useState<Field | null>(null);
  const [coverId, setCoverId] = useState<string | null>(null);
  const [cover, setCover] = useState<Cover | null>(null);

  //const [fields, setFields] = useState(props.fields);
  const [displayedFields, setDisplayedFields] = useState(props.fields);

  const [searchFilter, setSearchFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] =
  useState<{idx: number, ascend: boolean}>({idx: 0, ascend: true});

  useEffect(() => {
    setSearchFilter(null);
    setSortMode({idx: 0, ascend: true});
  }, [currentPage]);

/*   useEffect(() => {
    setDisplayedFields(props.fields);
  }, [props.fields]); */

  // Filtering and sorting the list when needed:
  useEffect(() => {
    var filteredList = getNamed(props.fields, searchFilter);
    var sortingFunction = buttons[sortMode.idx].sortFunction;
    setDisplayedFields(sortingFunction(filteredList, sortMode.ascend))
  }, [searchFilter, sortMode, props.fields]);

  useEffect(() => {
    setDisplayedFields(sortFieldByName(props.fields, true));
  }, [currentPage]);

  let buttons = [
    {
      title: 'Nom',
      onClick: (asc: boolean) => {
        setSortMode({idx: 0, ascend: asc});
      },
      sortFunction: sortFieldByName,
      disabled: false,
    },
  ];

  useEffect(() => {
    if (field && field.pastCovers != null && field.pastCovers.length > 0) {
      setNewCover(field.pastCovers[0].id);
    }
  }, [field])

  function onChangeSearch(search: string) {
    setSearchFilter(search);
  }

  function handleClickOnField(id: string) {
    setNewField(id);
    setCurrentPage(1);

    if (field && field.pastCovers != null && field.pastCovers.length > 0) {
      setNewCover(field.pastCovers[0].id);
    }

    props.updateButtons([{
      title: 'Retour',
      onClick: handleClickBackBtn
    }])
  }

  function handleClickBackBtn() {
    setNewField(null);
    setCover(null);
    setCoverId(null);
    setCurrentPage(0);
    props.updateButtons([])
  }

  function setNewField(id: string | null) {
    let newField = props.fields.find((f: any) => { return f.id == id });
    if (newField == undefined) {
      newField = null;
    }
    //setFieldId(id);
    setField(newField);
  }

  function handleChooseCover(event: any, value: any) {
   // event: any, index: number, value: any
    setNewCover(value.props.value);
  }

  function setNewCover(id: string) {
    if (!field || !field.pastCovers)
      return
    let newCover: Cover | null | undefined = field.pastCovers.find((f: any) => { return f.id == id });
    if (newCover == undefined)
      newCover = null;
    setCoverId(id);
    setCover(newCover);
  }

  // Fields list page
  if (props.fields && currentPage == 0) {
    return (
        <FieldsList
          buttons={buttons}
          list={displayedFields}
          fields={props.fields}
          onChangeSearch={onChangeSearch}
          onClick={handleClickOnField}
        />
    );
  }
  // Field history page
  if (field && currentPage == 1) {
    return (
      <div className="widgetcontenthistory-maincontainer">
        { cover
          ?
          <FieldIdCard
            name={field.name}
            shape={field.shape}
            datura={cover.daturaPositions}
            defaultLegend={true}
            showDatura
          />
          :
          <FieldIdCard
            name={field.name}
            shape={field.shape}
            datura={null}
            defaultLegend={false}
            showDatura
          />
        }
        
        <div className="widgetcontenthistory-righthalf">

        {field.pastCovers == null || field.pastCovers.length == 0
          ? <div className="widgetcontenthistory-divnocover">
              <div className="widgetcontenthistory-textnocover">
                Aucune ancienne couverture à afficher pour ce champ
              </div>
            </div>
          :
          <div className="widgetcontenthistory-divcovers">
            <FormControl
              sx={{
                
                /* '& .MuiFormControl-formControl': {
                  color: 'red',
                  backgroundColor: 'blue',
                  borderRadius: '30px',
                }, */
              }}
              fullWidth>
              {/* <InputLabel
                sx={{
                  fontStyle: 'var(--hoori-font)',
                  color: 'var(--grey-font)',
                  fontWeight: 'bold',
                }}
                id="demo-simple-select-label">
                  Créneau
              </InputLabel> */}
              <Select
                className="widgetcontenthistory-select"
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                // label='Créneau'
                value={coverId != null ? coverId : ""}
                onChange={handleChooseCover}
                /* input={
                  <OutlinedInput label="Créneau" />
                } */
                sx={{
                  height: '40px',
                  paddingTop: '4px',
                  margin: '0px',
                  color: 'var(--grey-font)',
                  fontStyle: 'var(--hoori-font)',
                  fontWeight: 'bold',
                  fontSize: '12px',
                }}>
                {field.pastCovers.map((item: any) => (
                  <MenuItem
                    key={item.id != null ? item.id : ""}
                    value={item.id != null ? item.id : ""}>
                    {item.startDate.format('DD/MM/YYYY - HH[h]mm')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {cover && <div>
              <div className="widgetcontenthistory-nbdatura">
                <DaturaInfo number={cover.nbDatura}/>
              </div>
              <div className="widgetcontenthistory-imgviewer">
                <ImageViewer
                  pictureList={cover.pictures}
                  fieldId={field.id}
                  coverId={cover.id}
                />
              </div>

            </div>}
          
          </div>
        }
        </div>

      </div>
    );
  }
  return <div> error </div>
};