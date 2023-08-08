import React from 'react';
import HeaderBtn from '../buttons/HeaderBtn';
import NotificationBubble from '../elements/NotificationBubble';

/**
 * En-tête des widgets.
 * @function WidgetHeader
 * @category Composant / header
 * @param props.title {string} titre
 * @param props.buttons {objet[]} boutons de l'en-tête
 * @param props.nbNotifs {integer} nombre de notifications
 */
export default function WidgetHeader(props: any) {
  require("./WidgetHeader.css");

    return (
      <div className="widgetheader-background">

          <a className="widgetheader-title">{props.title}</a>

          <div className="widgetheader-btns-container">
            {props.buttons?.map((item: any) => {
              return (
                <HeaderBtn
                  key={item.title}
                  title={item.title}
                  disabled={props.disabled}
                  onClick={item.onClick}
                />
              );
            })}
          </div>

          <div className="widgetheader-notifcontainer">
            <NotificationBubble nbNotifs={props.nbNotifs} />
          </div>

      </div>
  );
};