import PlusIcon from '../../assets/image/plus.png'

/**
 * Bouton d'ajout. Contient une image de +.
 * @function AddBtn
 * @category Composant / buttons
 * @param props.onClick {function} Callback appelé lors du clic sur le bouton
 */
export default function AddBtn(props: any) {
    require("./AddBtn.css");

    return (
        <button onClick={props.onClick} className='addBtnContainer'>
            <img src={PlusIcon} width={30} className='addBtnImg'></img>
        </button>
    )
};