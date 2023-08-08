/**
 * Barre de recherche.
 * @function SearchBar
 * @category Composant / lists
 * @param props.placeholder {string} Texte affiché par défaut
 * @param props.getInput {function} fonction appelée lors d'une entrée utilisateur
 */
export default function SearchBar(props: any) {
    require('./SearchBar.css');
    return (
        <input className="SearchBar-input" type="text" placeholder={props.placeholder} maxLength={50}
        onChange={e => {props.getInput(e.target.value)}}/>
    );
}