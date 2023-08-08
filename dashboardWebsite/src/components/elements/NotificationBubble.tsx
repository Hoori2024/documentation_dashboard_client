/**
 * Bulle de nombre de notifications
 * @function NotificationBubble
 * @category Composant / elements
 * @param props.nbNotifs {integer} nombre de notifications
 */
export default function NotificationBubble(props: any) {
    require('./NotificationBubble.css')
    
    if (props.nbNotifs < 1)
      return <></>

    return (
        <div className='notificationbubble-maincontainer'>
          { props.nbNotifs > 9
            ? <a className='notificationbubble-textsmall'>9+</a>
            : <a className='notificationbubble-textnormal'>
                {props.nbNotifs}
              </a>
          }
          
        </div>
    );
}