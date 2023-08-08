import SearchBar from './SearchBar';
import SortBtn from '../buttons/SortBtn';
import { useState, useEffect } from 'react';

/**
 * Outils interactifs de la liste (barre d'outil) permettant de trier ou rechercher.
 * @function ListTools
 * @category Composant / lists
 * @param props.buttons {objet[]} boutons de la barre de tri
 * @param props.onChangeSearch {function} fonction appelée lors d'un changement dans la barre de recherche
 */
export default function ListTools(props: any) {
  require('./ListTools.css')
    const [searchInput, setSearchInput] = useState("");
    const [params, setParams] = useState(["",0,0,0])
    const [activeButtonIdx, setActiveButtonIdx] = useState(0);
    const [activeButtonAscend, setActiveButtonAscend] = useState(true)

    return (
        <div className="ListTools-Box">
          <div className='listtools-searchbar'>
            <SearchBar
              getInput={props.onChangeSearch}
              placeholder={"Nom du champ"}
            />
          </div>
          <div className='listtools-buttons'>
            {props.buttons?.map((item: any, idx: number) => {
                return (
                  <div key={idx} className='listtools-button'>
                    <SortBtn
                      title={item.title}
                      disabled={item.disabled}
                      active={(idx == activeButtonIdx) ? 1 : 0}
                      down={(idx == activeButtonIdx && !activeButtonAscend) ? 1 : 0}
                      onClick={() => {
                        var newActiveButtonAscend = activeButtonAscend;
                        if (idx != activeButtonIdx) {
                          setActiveButtonIdx(idx);
                          newActiveButtonAscend = true;
                        }
                        else {
                          if (activeButtonAscend) {
                            newActiveButtonAscend = false;
                          } else {
                            newActiveButtonAscend = true;
                          }
                        }
                        setActiveButtonAscend(newActiveButtonAscend);
                        item.onClick(newActiveButtonAscend);
                      }}
                    />
                  </div>
                )
            })}
          </div>
        </div>
    )
}