import { fontFamily } from '@mui/system';
import FlagIcon from '../../assets/image/flag-2.png'

// icon iconSize text textSize borderHeigth borderWidth callback
/**
 * Bouton de flag avec un icon et un texte en dessous.
 * @function IconTextButton
 * @category Composant / buttons
 * @param props.callback {function} callback appelé lors du clic sur le bouton
 * @param props.text {string} texte affiché sous l'icon
 * @param props.TextDim {integer} taille du texte (en pixel)
 * @param props.iconSize {integer} taille de l'icon (en pixel)
 */
export default function IconTextButton(props: any) {
    require("./IconTextButton.css");

    return (
        <div>
            <button onClick={props.callback} className='IconTextButton-button'>
                <div className='IconTextButton-container'>
                    <img src={FlagIcon} width={props.iconSize}></img>
                    <a className="IconTextButton-text" style={{fontSize: props.TextDim}}> {props.text}</a>
                </div>
            </button>
        </div>
    )
};