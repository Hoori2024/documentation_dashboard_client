import {useState, useEffect} from 'react';
import FieldShape from '../elements/FieldShape'
import FieldShapeLegend from '../elements/FieldShapeLegend'

const BLANK_STATS = [
	{
		minValue: 0,
		label: '> 0',
		value: 0,
		color: "#FFB6B6",
	},
	{
		minValue: 5,
		label: '> 5',
		value: 1,
		color: "#FF5F5F",
	},
	{
		minValue: 10,
		label: '> 10',
		value: 2,
		color: "#FF2929",
	},
];

/**
 * Cadre de visualisation de la forme du champ. Contient les composants FieldShape et FieldShapeLegend
 * @function FieldIdCard
 * @category Composant / elements
 * @param props.name {string} nom du champ
 * @param props.legend {string} phrase de la légende
 * @param props.datura {DaturaPositions} objet de position du datura
 * @param props.shape {FieldShape} objet FieldShape (pas le composant)
 */
export default function FieldIdCard(props: any) {
    require('./FieldIdCard.css');
    return (
		<div className="fieldidcard-container">
			<div className="fieldidcard-title">
				<a>{props.name}</a>
			</div>
			<div className='fieldidcard-fieldshapecontainer'>
				{props.shape && props.shape.shape.length > 0?
					<div className='fieldidcard-fieldshapegraphic'>
						<FieldShape shapeInfo={props.shape} datura={props.datura}/>
					</div>
					: <div> Visualisation Indisponible </div>
				}
 				{props.datura &&
					<div className='fieldidcard-fieldshapelegend'> <FieldShapeLegend stats={BLANK_STATS}/> </div>
				}
			</div>
			{props.datura &&
				<div className="fieldidcard-legend">
					<a>{props.legend}</a>
				</div>
			}
		</div>
    );
};