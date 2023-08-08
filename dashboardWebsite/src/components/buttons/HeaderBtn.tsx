/**
 * Bouton de header.
 * @function HeaderBtn
 * @category Composant / buttons
 * @param props.title {string} nom du bouton affiché
 * @param props.onClick {function} callback appelé lors du clic sur le bouton
 * @param props.disabled {boolean} si true : bouton grisé et désactivé (pas d'interraction possible), si false : bouton actif
 */
export default function HeaderBtn(props: any) {
    require("./HeaderBtn.css");
    return (
        <button
            disabled={props.disabled}
            onClick={props.onClick}
            className='headerBtn'>
            {props.title}
        </button>
    )
};
