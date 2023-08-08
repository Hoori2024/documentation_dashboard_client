import React from 'react';

/**
 * Barre de progression
 * @function ProgressBar
 * @category Composant / elements
 * @param props.value {integer} pourcentage d'avancement
 * @param props.text {string} texte
 * @param props.textSize {integer} taille du texte (pixel)
 */
export default function ProgressBar(props: any) {
    require('./ProgressBar.css')
	var intValue = props.value.toString();
	var strValue = intValue.concat("%");
    return (
			<div className='progressbar-container'>
				<a className='progressbar-text' style={{fontSize: props.textSize}}> {props.text} </a>
				<div className='progressbar-frame'>
					<div className='progressbar-line' style={{width: strValue}}> </div>
				</div>
			</div>
  	);
};