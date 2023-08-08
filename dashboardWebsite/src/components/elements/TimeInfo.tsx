import React from 'react';
import Timer from '../../assets/image/hourglass-2.png';
import Calendar from '../../assets/image/calendar.png';

/**
 * Affichage d'une donnée temporelle
 * @function TimeInfo
 * @category Composant / elements
 * @param props.type {string} type de l'icon ("DATE" ou "TIMER")
 * @param props.IconDim {integer} taille de l'icon
 * @param props.text {string} texte
 * @param props.TextDim {integer} taille du texte (pixel)
 */
export default function TimeInfo(props: any) {
    require('./TimeInfo.css')

	const dictionary = new Map<string, string>([
        ["DATE", Calendar],
        ["TIMER", Timer]
    ]);

    return (
			<div className='TimeInfo-container'>
				<img src={dictionary.get(props.type)} width={props.IconDim}></img>
				<a className="TimeInfo-text" style={{fontSize: props.TextDim}}> {props.text}</a>
			</div>
  	);
};

