import React from 'react';

/**
 * Légende de l'affichage du champ
 * @function FieldShapeLegend
 * @category Composant / elements
 * @param props.stats {string} phrase de la légende
 */
export default function FieldShapeLegend(props: any) {
	require('./FieldShapeLegend.css')
	let stats = props.stats;

    return (
		<div>
			{ stats ?
				<div className='FieldShapeLegend-generalcontainer'>
					{stats.map((item: any) => {
						return (
							<div key={item.label} className= 'FieldShapeLegend-container'>
								<div className='FieldShapeLegend-square' style={{backgroundColor: item.color}} ></div>
								<div className='FieldShapeLegend-text'> {item.label} </div>
							</div>
						)
					})}
				</div>
				: <div> </div>
			}
		</div>
  	);
};