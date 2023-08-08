import Modal from '@mui/material/Modal';

/**
 * Modale d'alerte pouvant être composée d'un titre, d'un énoncé, d'un bouton de refus, d'acceptation et de choix neutre
 * @function AlertModal
 * @category Composant / modals
 * @param props.open {boolean} détermine si la modale est ouverte (true) ou non (false)
 * @param props.close {function} fonction appelée lors d'une entrée utilisateur
 * @param props.title {string} titre de l'alerte
 * @param props.message {string} énoncée de l'alerte
 * @param props.btnNegative {objet} propriétés du bouton de choix négatif
 * @param props.btnNegative.title {string} titre du bouton
 * @param props.btnNegative.onClick {function} fonction appelée lors du clic sur le bouton
 * @param props.btnNeutral {objet} propriétés du bouton de choix négatif
 * @param props.btnNeutral.title {string} titre du bouton
 * @param props.btnNeutral.onClick {function} fonction appelée lors du clic sur le bouton
 * @param props.btnPositive {objet} propriétés du bouton de choix négatif
 * @param props.btnPositive.title {string} titre du bouton
 * @param props.btnPositive.onClick {function} fonction appelée lors du clic sur le bouton
 */
export default function AlertModal(props: any) {
    require('./AlertModal.css')
    return (
			<Modal
				open={props.open}
				onClose={props.close}
				className='alertmodal-modal'>
				<div className='alertmodal-maincontainer'>

					<a className='alertmodal-title'>{props.title}</a>
					
					<div className='alertmodal-messagediv'>
						<a className='alertmodal-message'>{props.message}</a>
					</div>

					<div className='alertmodal-btncontainer'>

						{/* Button negative */}
						{props.btnNegative ?
							<button className='alertmodal-btn alertmodal-btnnegative' onClick={props.btnNegative.onClick}>
								{props.btnNegative.title}
							</button>
							:
							<></>
						}
						
						{/* Button neutral */}
						{props.btnNeutral ?
							<button className='alertmodal-btn alertmodal-btnneutral' onClick={props.btnNeutral.onClick}>
								{props.btnNeutral.title}
							</button>
							:
							<></>
						}

						{/* Button positive */}
						{props.btnPositive ?
							<button className='alertmodal-btn alertmodal-btnpositive' onClick={props.btnPositive.onClick}>
							{props.btnPositive.title}
							</button>
							:
							<></>
						}
					</div>
					
				</div>
			</Modal>
  	);
};
