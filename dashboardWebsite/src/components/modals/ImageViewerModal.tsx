import React, {useState, useEffect} from 'react';
import Modal from '@mui/material/Modal';
import LeftButton from '../../assets/image/left-arrow.png'
import RightButton from '../../assets/image/right-arrow.png'
import IconTextButton from '../../components/buttons/IconTextButton'
import ImageViewerSignalModal from '../modals/ImageViewerSignalModal'
import CloseBtn from '../buttons/CloseBtn'
import {arrayBufferToBase64} from '../../assets/utils';

import { Picture } from '../../architecture/architecture';

let pictureList: Picture[] = [];

/**
 * Modale de visualisation d'images.
 * @function ImageViewerModal
 * @category Composant / modals
 * @param props.selectIndex {integer} id de l'image actuellement visible
 * @param props.isOpen {boolean} si true, la modale est ouverte
 * @param props.pictures {Picture[]} liste d'image
 * @param props.closeCallBack {function} fonction appelée lorsque la modale est fermée
 * @param props.reportAsNotDatura {function} fonction appelée pour reporté qu'une image n'est pas du datura (prend en pramètre l'id de l'image)
 */
export default function ImageViewerModal(props: any) {
    require('./ImageViewerModal.css')

	const [openSignalImageModal, setOpenSignalImageModal] = useState(false);
	const [index, setIndex] = useState(0);

	useEffect(()=>{
		setIndex(props.selectIndex);
	}, [props.isOpen])

	function changeImage(next: boolean) {
		if (next === true) {
			if (index >= pictureList.length - 1)
				setIndex(0);
			else
				setIndex(index + 1);
		}
		else {
			if (index === 0)
				setIndex(pictureList.length - 1);
			else
				setIndex(index - 1);
		}
	}

	function closeSignalImageModal() {
		setOpenSignalImageModal(false);
	}

	if (props.pictures) {
		pictureList = props.pictures;
	}

	const handleClick = () => {
		var image = new Image();
        image.src = `data:image/png;base64,${arrayBufferToBase64(pictureList[index].source)}`;
		var w = window.open("");
		if (w)
        	w.document.write(image.outerHTML);
	};

    return (
		<Modal
			open={props.isOpen}
			onClose={props.closeCallBack}
			className='ImageViewerModal-modal'>
				<div className='ImageViewerModal-maincontainer'>
					<ImageViewerSignalModal
						isOpen={openSignalImageModal}
						onClickCancel={closeSignalImageModal}
						onClickConfirm={() => {
							closeSignalImageModal();
							props.reportAsNotDatura(pictureList[index].id)
						  }}
					/>
					<div className="ImageViewerModal-closectn">
						<CloseBtn close={props.closeCallBack}/>
					</div>
					<div className='ImageViewerModal-imagenav'>
						<img
							onClick={() => changeImage(false)}
							className="imageviewer-cursor"
							src={LeftButton}
							alt="Datura"
						/>
					<div className='ImageViewerModal-alignimage'>
						<img className="ImageViewerModal-image" src={`data:image/png;base64,${arrayBufferToBase64(pictureList[index].source)}`} alt="Datura" onClick={handleClick} ></img>
						<div className='ImageViewerModal-underbar'>
							<div className='imageviewer-counter'>
								{index + 1} / {pictureList.length}
							</div>
							<IconTextButton iconSize={15} text={"Ce n’est pas du datura ?"} callback={() => {setOpenSignalImageModal(true)}}/>
						</div>
					</div>
						<img
							onClick={() => changeImage(true)}
							className="imageviewer-cursor"
							src={RightButton}
							alt="Datura"
						/>
					</div>
				</div>
		</Modal>
  	);
};
