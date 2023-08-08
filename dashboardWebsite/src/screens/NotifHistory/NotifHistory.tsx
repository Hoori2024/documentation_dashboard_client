import {useState} from 'react';
import axios from 'axios';
import { baseURL, config } from '../../requests/requests';

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

/**
 * Page de configuration des notifications
 * @function SettingPage
 * @category Composant / screens
 */
export default function SettingPage(props: any) {
    require("./NotifHistory.css");
    const [first, setFirst] = useState(true);
    const [notif, setNotif] = useState({notif: [{id: 0, type: "", title: "", content: "", isRead: false, timestamp: 0}]});
    const [search, setSearch] = useState("");

    function requestDeleteNotif(index: number) {
        axios.post(`${baseURL}user/notification/received/${localStorage.userid}/remove/${index}`, {"isRead": false}, config).then((response) => {
          if (response && response.status === 200) {
            console.log(response.data);
            setNotif({notif: response.data.messages.reverse()});
          }
        });
    }

    // function requestDeleteAllNotif() {
    //     axios.post(`${baseURL}user/notification/received/${localStorage.userid}/remove/all`, {"isRead": false}, config).then((response) => {
    //       if (response && response.status === 200) {
    //         console.log(response.data);
    //         setNotif({notif: response.data.messages});
    //       }
    //     });
    // }

    if (first) {
        axios.get(`${baseURL}user/notification/received/get`, config).then((response) => {
            if (response && response.status === 200) {
              console.log(response.data);
              setNotif({notif: response.data.messages.reverse()});
            }
          });
        setFirst(false);
    }

    function convertTimestamp(timestamp: number) {
        var d = new Date(timestamp);
        return d.toLocaleString();
    }

    function getDay(timestamp: number) {
      var d = new Date(timestamp);
      return d.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})
    }

    function DisplayAllNotif(){
        var lastDate = "";

        const notifs = notif.notif.filter(notif => notif.title.toLowerCase().search(search) != -1).map((nf, index)=> {
            var needDate = false;
            if (getDay(nf.timestamp) !== lastDate) {
                lastDate = getDay(nf.timestamp);
                needDate = true;
            }   
                
          return <div key={index}>
            {needDate
            ? <div>
                <ListItem alignItems="flex-start">
                <ListItemText
                  primary={getDay(nf.timestamp)}
                  />
                </ListItem>
                <Divider variant="inset" component="li"/>
              </div>
            : <div></div>}
            <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={nf.type} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={nf.title}
              secondary={
                <React.Fragment>
                  {nf.content}
                </React.Fragment>
              }
              />
            <p>{convertTimestamp(nf.timestamp)}</p>
              <IconButton onClick={() => {requestDeleteNotif(nf.id)}}>
                <CloseIcon color="action" />
              </IconButton>
            </ListItem>
            <Divider variant="inset" component="li"/>
          </div>
        });
        return (
            <div>
            { notifs.length === 0 ? <div style={{"width": "100%", "textAlign": "center", "marginTop": "1%"}}>Aucune notification à afficher.</div> : notifs}
            </div>
        )
    }

    return (
        <div className="background">
            <br></br>
            <input className='filter' type="text" placeholder="Filtre" maxLength={50} onChange={e => setSearch(e.target.value.toLowerCase())}/>
            <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
                <DisplayAllNotif/>
            </List>
        </div>
    );
};