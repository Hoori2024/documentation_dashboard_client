import React, {useState} from 'react';
import AlertModal from './AlertModal';

/**
 * Modale de signalisation d'images.
 * @function ImageViewerSignalModal
 * @category Composant / modals
 * @param props.isOpen {boolean} si true, la modale est ouverte
 * @param props.close {function} fonction appelée lors de la fermeture de la modale
 * @param props.onClickCancel {function} fonction appelée lors de l'annulation
 * @param props.onClickConfirm {function} fonction appelée lors de la confirmation
 */
export default function ImageViewerSignalModal(props: any) {
    //require('./WidgetContentManage.css');
    return (
        <AlertModal
            open={props.isOpen}
            onClose={props.close}
            title="Signaler l’image"
            message={'Souhaitez-vous signaler cette image comme n’étant pas du Datura ?'}
            btnNegative={{title: "Annuler", onClick: props.onClickCancel}}
            btnPositive={{title: "Signaler", onClick: props.onClickConfirm}}
        />
    );
}
