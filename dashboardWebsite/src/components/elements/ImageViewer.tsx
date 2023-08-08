import React, {useState} from 'react';
import LeftButton from '../../assets/image/left-arrow.png'
import RightButton from '../../assets/image/right-arrow.png'
import IconTextButton from '../../components/buttons/IconTextButton'
import ImageViewerModal from '../modals/ImageViewerModal';
import ImageViewerSignalModal from '../modals/ImageViewerSignalModal'
import {arrayBufferToBase64} from '../../assets/utils';

import { reportPicture } from '../../api/Api';
import { Picture } from '../../architecture/architecture';

//import AWS from 'aws-sdk';
/**
 * Visualisateur d'images
 * @function ImageViewer
 * @category Composant / elements
 * @param props.fieldId {integer} id du champ
 * @param props.coverId {integer} id de la couverture
 * @param props.pictureList {Picture[]} tableau d'images
 */
// props.picture = array of images links ( Picture: { id: number, img: string } [] )
export default function ImageViewer(props: any) {
    require('./ImageViewer.css')

	const [openSignalImage, setOpenSignalImage] = useState(false);
	const [openImageViewerModal, setOpenImageViewerModal] = useState(false);

	const [index, setIndex] = useState(0);

	//var AWS = require('aws-sdk/dist/aws-sdk-react-native');

	//var ses:AWS.SES = new AWS.SES();

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

	function closeSignalImage() {
		setOpenSignalImage(false);
	}


	function closeImageViewerModal() {
		setOpenImageViewerModal(false);
	}

	function reportAsNotDatura(pictureId: string) {
		reportPicture(props.fieldId, props.coverId, pictureId).then(res => {
			closeSignalImage();
		});
	}



	let pictureList: Picture[] = [];

	if (props.pictureList)
		pictureList = props.pictureList;

	if (pictureList.length > 0) {

		return (
			<div className='imageviewer-container'>
 				<ImageViewerModal
					isOpen={openImageViewerModal}
					closeCallBack={closeImageViewerModal}
					pictures={pictureList}
					selectIndex={index}
					reportAsNotDatura={reportAsNotDatura}
				/>
				<ImageViewerSignalModal
					isOpen={openSignalImage}
					onClickCancel={closeSignalImage}
					onClickConfirm={() => reportAsNotDatura(pictureList[index].id)}
				/>
				<div className='imageviewer-subcontainer'>
					<img
						onClick={() => {changeImage(false)}}
						className="imageviewer-cursor"
						src={LeftButton}
						alt="Datura"
					/>
					<div className="imageviewer-reportbutton">
						<div className='imageviewer-alignimage'>
							<img
								className="imageviewer-image"
								onClick={() => {setOpenImageViewerModal(true)}}

								src={`data:image/png;base64,${arrayBufferToBase64(pictureList[index].source)}`}
							/>
							<div className="imageviewer-undercontainer">
								<div className='imageviewer-counter'>
									{index + 1} / {pictureList.length}
								</div>
								<div className='imageviewer-report'>
									<IconTextButton
										iconSize={15}
										text={"Ce n’est pas du datura ?"}
										callback={() => {setOpenSignalImage(true)}}
									/>
								</div>
							</div>
						</div>
					</div>
					<img
						onClick={() => {changeImage(true)}}
						className="imageviewer-cursor"
						src={RightButton}
						alt="Datura"
					/>
				</div>
			</div>
		)
	}
	else {
		return (
			<div className='imageviewer-containernodatura'>
				<div className='imageviewer-text'>Aucune image à afficher</div>
			</div>
		)
	}
};