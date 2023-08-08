import React, {useState} from 'react';

import WidgetHeader from '../../components/headers/WidgetHeader';

/**
 * Cadre du widget, contenant l'en-tête
 * @function Widget
 * @category Composant / widgets
 * @param props.title {string} titre du widget
 * @param props.children {object} ?
 */
export default function Widget(props: any) {
    require('./Widget.css')

    const [buttons, setButtons] = useState([]);
    const [nbNotifs, setNbNotifs] = useState(0);

    function updateBtns(newBtns: any) {
        setButtons(newBtns);
    }

    function updateNotifs(nb: number, mode: string) {
      if (mode === 'set')
        setNbNotifs(nb);
      if (mode === 'add')
        setNbNotifs(nbNotifs + nb);
    }

    return (
        <div className="widget-maincontainer">
            <WidgetHeader
              title={props.title}
              buttons={buttons}
              nbNotifs={nbNotifs}
            />
            <div className="widget-content">
           
              {React.cloneElement(
                props.children,
                {
                  updateButtons: updateBtns,
                  updateNotifs: updateNotifs,
                }
              )}
        
            </div>
        </div>
  );
};