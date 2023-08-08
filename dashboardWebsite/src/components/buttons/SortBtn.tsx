import DownArrow from '../../assets/image/down-arrow.png';

/**
 * Bouton trieur avec un icon qui change entre le logo v (décroissant) et ^ (croissant). Utilisé pour régler l'ordre d'affichage dans une liste (tri).
 * @function SortBtn
 * @category Composant / buttons
 * @param props.disabled {boolean} true : bouton désactivé, false : bouton activé
 * @param props.title {string} titre du trieur
 * @param props.down {boolean} si le logo est vers le bas (décroissant)
 * @param props.active {boolean} si c'est le (seul!) trieur activé
 * @param props.onClick {function} action lors du clic
 */
export default function SortBtn(props: any) {
  require("./SortBtn.css");

  return (
    <button
      {...props}
      className={props.disabled ? 'sortbtn-containerdisabled' : 'sortbtn-container'}>
      <a className='sortbtn-title'>{props.title}</a>
      {props.active ?
        <img
          src={DownArrow}
          width={13}
          className={props.down ? 'sortbtn-icondown' : 'sortbtn-iconup'}
        />
        : <div> </div>
      }
    </button>
    )
};