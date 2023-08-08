import React from 'react';

/**
 * Descriptif des pousses de datura détectées.
 * @function DaturaInfo
 * @category Composant / elements
 * @param props.number {interger} nombre affiché
 * @param props.textSize {integer} taille du texte (en pixel)
 */
export default function DaturaInfo(props: any) {
    require('./DaturaInfo.css')

	var text;

	if (props.number == null) {
		text = "erreur";
	} else if (props.number <= 1) {
		text = "pousse de datura détectée";
	} else {
		text = "pousses de datura détectées";
	}

    return (
		<div className='DaturaInfo-container'>
			<a className='DaturaInfo-number' style={{fontSize: props.textSize}}> {props.number}</a>
			<a className="DaturaInfo-text" style={{fontSize: props.textSize}}> {text}</a>
		</div>
  	);
};

