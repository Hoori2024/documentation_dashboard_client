import PlayIcon from '../../assets/image/launch.png'
import ProgramIcon from '../../assets/image/program.png'
import PauseIcon from '../../assets/image/pause.png'
import EditIcon from '../../assets/image/pencil.png'
import RefreshIcon from '../../assets/image/refresh.png'
import Stop from '../../assets/image/stop.png'
import Cancel from '../../assets/image/cancel.png'

/**
 * Bouton avec un icon prédfini et un texte en dessous.
 * @function ManageCoverBtn
 * @category Composant / buttons
 * @param props.callback {function} callback appelé lors du clic sur le bouton
 * @param props.type {string} type du
 * @param props.TextDim {integer} taille du texte (en pixel)
 * @param props.iconSize {integer} taille de l'icon (en pixel)
 */
export default function ManageCoverBtn(props: any) {
    require("./ManageCoverBtn.css");

    /**
     * Interface for classes that represent a Button.
     *
     * @interface IButton
     * 
     */
    interface IButton {
        title: string;
        icon: string;
    }

    /**
     * @type {{locales: Object.<string, {name: string, icon: object}>}}
     * */
    const dictionary = new Map<string, IButton>([
        ["LAUNCH", {title: "Lancer", icon: PlayIcon}],
        ["PROGRAM", {title: "Programmer", icon: ProgramIcon}],
        ["PAUSE", {title: "Mettre en pause", icon: PauseIcon}],
        ["RESUME", {title: "Reprendre", icon: PlayIcon}],
        ["EDIT", {title: "Modifier", icon: EditIcon}],
        ["REFRESH", {title: "Actualiser", icon: RefreshIcon}],
        ["STOP", {title: "Stopper", icon: Stop}],
        ["CANCEL", {title: "Annuler", icon: Cancel}],
    ]);

    return (
        <div>
            <button onClick={props.callBack} className='ManageCoverBtn-button'>
                <div className='ManageCoverBtn-container'>
                    <img src={dictionary.get(props.type)?.icon} width={props.IconDim}></img>
                    <div className="ManageCoverBtn-title" style={{fontSize: props.TextDim}}> {dictionary.get(props.type)?.title}</div>
                </div>
            </button>
        </div>
    )
};