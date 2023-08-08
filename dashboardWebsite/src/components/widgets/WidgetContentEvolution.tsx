import { useState, useEffect} from 'react';
import dayjs, {Dayjs} from 'dayjs';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import Chart from '../elements/Chart';

import FieldIdCard from '../elements/FieldIdCard';
import FieldsList from '../lists/FieldsList';
import {Field, FieldStats, DaturaPositions, WeedType} from '../../architecture/architecture';

import {sortFieldByName, getNamed} from '../../assets/utils';

export interface Span {
  text: string,
  months: number,
};

export interface Type {
  text: string,
  type: WeedType | null,
};

const BLANK_STATS = [
  { 
    timespan: 1,
    data: [],
    positions: null,
  },
  { 
    timespan: 3,
    data: [],
    positions: null,
  },
  { 
    timespan: 6,
    data: [],
    positions: null,
  },
  { 
    timespan: 12,
    data: [],
    positions: null,
  },
]

/**
 * Widget d'évolution
 * @function WidgetContentEvolution
 * @category Composant / widgets
 * @param props.fields {Field[]} tableau de champs
 * @param props.updateButtons {function} fonction permettant de modifier les boutons dans l'en-tête du widget
 */
export default function WidgetContentEvolution(props: any) {
  require('./WidgetContentEvolution.css');

  const SPAN_OPTIONS : Span[] = [{text: '1 mois', months: 1}, {text: '3 mois', months: 3}, {text: '6 mois', months: 6}, {text: '1 an', months: 12}];
  const TYPE_OPTIONS : Type[] = [{text: 'Toutes les adventices', type: null}, {text: 'Datura', type: WeedType.DATURA}, {text: 'Ambroisie', type: WeedType.AMBROISIE}, {text: 'Type inconnu', type: WeedType.UNKNOWN}];

  const [currentPage, setCurrentPage] = useState(0);
  const [field, setField] = useState<Field | null>(null);
  
  //const [fields, setFields] = useState(props.fields);
  const [span, setSpan] = useState<Span | null>(getSpanByLabel('1 an'));
  const [weedType, setWeedType] = useState<Type | null>(getTypeByLabel('Toutes les adventices'));
  const [daturaPositions, setDaturaPositions] = useState<DaturaPositions | null>(null);
  const [fieldStats, setFieldStats] = useState<FieldStats[]>(BLANK_STATS);

  const [displayedFields, setDisplayedFields] = useState(props.fields);

  const [searchFilter, setSearchFilter] = useState<string | null>(null);
  const [sortMode, setSortMode] =
  useState<{idx: number, ascend: boolean}>({idx: 0, ascend: true});

/*   useEffect(() => {
    setDisplayedFields(props.fields)
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

  useEffect(() => {
    if (field != null) {
      let newFieldStats = generateFieldStats(field);
      setFieldStats(newFieldStats ?? BLANK_STATS);
      let newPositions = getDaturaPositions(); // TODO
      setDaturaPositions(newPositions);
    }
  }, [span, weedType, field]);
  
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

function getDaturaPositions() {
  if (field == null)
    return null;
  let stats = getDaturaByTimeSpan(fieldStats);
  if (!stats)
    return null
  return stats.positions;
}

function onChangeSearch(search: string) {
  setSearchFilter(search);
}

  function getSpanByLabel(label: string) {
    for (var i: number = 0; i < SPAN_OPTIONS.length; i++) {
      if (label == SPAN_OPTIONS[i].text) {
        return SPAN_OPTIONS[i];
      }
    }
    return null;
  }

  function getTypeByLabel(label: string) {
    for (var i: number = 0; i < TYPE_OPTIONS.length; i++) {
      if (label == TYPE_OPTIONS[i].text) {
        return TYPE_OPTIONS[i];
      }
    }
    return null;
  }

  function getStatIdxBySpan(span: Span | null) {
    if (!field || !fieldStats || !span)
      return 0
    for (var i: number = 0; i < fieldStats.length; i++) {
      if (span.months == SPAN_OPTIONS[i].months)
        return i;
    }
    return 0;
  }

  function handleChooseSpan(event: any, value: any) {
    var newSpan = getSpanByLabel(value.props.value);
    setSpan(newSpan);
  }

  function handleChooseType(event: any, value: any) {
    var newType = getTypeByLabel(value.props.value);
    setWeedType(newType);
  }

  function handleClickOnField(id: string) {
    setNewField(id);
    setCurrentPage(1);
    props.updateButtons([{
      title: 'Retour',
      onClick: handleClickBackBtn
    }]);
  }

  function handleClickBackBtn() {
    setNewField(null);
    setCurrentPage(0);
    props.updateButtons([])
  }

  function setNewField(id: string | null) {
    let newField: Field | null | undefined = props.fields.find((f: any) => { return f.id == id });
    if (newField == undefined)
      newField = null;
    setField(newField);
  }

  function getDaturaByTimeSpan(fieldStats: FieldStats[] | null) {
    if (fieldStats == null)
      return null;
    for (let i = 0; i < fieldStats.length; i++) {
      if (span && fieldStats[i].timespan == span.months) {
        if (fieldStats[i] != undefined)
          return fieldStats[i];
      }
    }
    return null;
  }

  function generateFieldStats(field: Field) {
    let pastCovers = field.pastCovers;
    if (pastCovers == null || pastCovers.length == 0)
        return null;

    let stats: FieldStats[] = [];
    let periods: number[] = [1, 3, 6, 12];

    for (let i = 0; i < periods.length; i++) {
        let newStats: FieldStats = {
            timespan: periods[i],
            data: [],
            positions: null, // TODO
        }
        stats.push(newStats);
    };

    pastCovers.forEach(cover => {
        for (let i = 0; i < periods.length; i++) {

            // If the cover is in this period:
            if (cover.startDate?.isAfter(dayjs().subtract(periods[i], 'months'))) {

                // Adding the cover to the graph:
                if (cover.nbDatura != null)
                    stats[i].data.push({date: cover.startDate, nbSprouts: cover.nbDatura});

                // Adding the positions to the map:
                if (stats[i].positions == null && pastCovers != null) { // Initializing the map if needed
                    stats[i].positions = clonePositionsBlank(pastCovers[0].daturaPositions);
                }
                if (stats[i].positions == null)
                    return;
                
                let positionsInCover = cover.daturaPositions ?? [[]];
                for (let j = 0; j < positionsInCover.length; j++)
                    for (let k = 0; k < positionsInCover[j].length; k++) {
                        let positionsInStats: DaturaPositions = stats[i].positions ?? [[]];
                        positionsInStats[j][k] += (positionsInCover[j][k] ?? 0);
                    }
            }
        };
    });

    return stats;
}

function clonePositionsBlank(array: number[][] | null) {
  if (array == null)
      return null;

  let newArray: number[][] = [];
  array.forEach(list => {
      let newList: number[] = Array(list.length).fill(0);
      newArray.push(newList);
  });
  return newArray;
}

  // Fields list page
  if (props.fields && currentPage == 0)
    return (
      <FieldsList
        buttons={buttons}
        onChangeSearch={onChangeSearch}
        list={displayedFields}
        fields={props.fields}
        onClick={handleClickOnField}
      />
    );


  // Field stats page
  if (field && currentPage == 1) {
    return (
        <div className="widgetcontentevolution-maincontainer">
            <FieldIdCard
              name={field?.name}
              shape={field.shape}
              datura={fieldStats[getStatIdxBySpan(span)].positions}
              defaultLegend
              legend={'Pousses de datura détectées sur ' + span?.text}
            />
            {!fieldStats || fieldStats.length == 0
              ? <div className="widgetcontentevolution-righthalf"> 
              <div className="widgetcontentevolution-divnocover">
                <div className="widgetcontentevolution-textnocover">
                  Aucune statistique à afficher pour ce champ
                </div>
              </div>
              </div> 
              :
                <div className="widgetcontentevolution-righthalf">
                  <div className="widgetcontentevolution-text" >
                    Évolution du nombre de pousses de datura détectées
                  </div>

                  <FormControl className="widgetcontenthistory-formcontrol"
                    sx={{
                      
                      /* '& .MuiFormControl-formControl': {
                        color: 'red',
                        backgroundColor: 'blue',
                        borderRadius: '30px',
                      }, */
                    }}
                    fullWidth>

                    <Select
                      className="widgetcontenthistory-selectleft"
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      value={span?.text}
                      onChange={handleChooseSpan}
                      sx={{
                        height: '40px',
                        paddingTop: '4px',
                        margin: '0px',
                        color: 'var(--grey-font)',
                        fontStyle: 'var(--hoori-font)',
                        fontWeight: 'bold',
                        fontSize: '12px',
                      }}>
                      {SPAN_OPTIONS.map((item) => (
                        <MenuItem
                          key={item.months}
                          value={item.text}>
                          {item.text}
                        </MenuItem>
                      ))}
                    </Select>

                    <Select
                      className="widgetcontenthistory-selectright"
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      value={weedType?.text}
                      onChange={handleChooseType}
                      sx={{
                        height: '40px',
                        paddingTop: '4px',
                        margin: '0px',
                        color: 'var(--grey-font)',
                        fontStyle: 'var(--hoori-font)',
                        fontWeight: 'bold',
                        fontSize: '12px',
                      }}>
                      {TYPE_OPTIONS.map((item) => (
                        <MenuItem
                          key={item.type}
                          value={item.text}>
                          {item.text}
                        </MenuItem>
                      ))}
                    </Select>

                  </FormControl>

                  <div className="widgetcontentevolution-chart">
                    <Chart
                      data={fieldStats[getStatIdxBySpan(span)].data}
                    />
                  </div>
                </div>
            }
        </div>
    );
  }
  return <div> </div>
};