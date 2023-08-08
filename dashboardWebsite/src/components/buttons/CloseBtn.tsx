import CloseIcon from '../../assets/image/close.png';

/**
 * Bouton de fermeture. Contient une image de x.
 * @function CloseBtn
 * @category Composant / buttons
 * @param props.close {function} Callback appelé lors du clic sur le bouton
 */
export default function CloseBtn(props: any) {
    require("./CloseBtn.css");

    return (
        <div className="CloseBtn-closectn">
            <img className="CloseBtn-closebutton" onClick={props.close} src={CloseIcon}></img>
        </div>
    );
}