import '@chatui/core/dist/index.css';
import { useState } from 'react';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';


import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Box, Popover, Paper} from '@mui/material';
import { baseURL, config, fieldData } from '../../requests/requests';

/**
 * Gestionnaire de notification
 * @function Notif_Handler
 * @category Composant
 */
export default function Notif_Handler(props: any) {
  const [count, setCount] = useState({nb: 0});
  const [state, setState] = useState({view: false});
  const [notif, setNotif] = useState({notif: [{id: 0, type: "", title: "", content: "", isRead: false}]});
  const [first, setFirst] = useState(true);


  require("./Notif.css")

  //////////////////////////// REQUEST NOTIF ////////////////////////////

  function requestNotif() {
    axios.get(`${baseURL}user/notification/received/get`, config).then((response) => {
      if (response && response.status === 200) {
        var notReadMSG = response.data.messages.filter((nf: any) => nf.isRead === false)
        console.log(response.data);
        setState({view: true});
        setNotif({notif: notReadMSG});
        setCount({nb: count.nb * 0 + notReadMSG.length});
      }
    });
  }

  function requestDeleteNotif(index: number) {
    axios.post(`${baseURL}user/notification/received/${localStorage.userid}/remove/${index}`, {"isRead": true}, config).then((response) => {
      if (response && response.status === 200) {
        console.log(response.data);
        var notReadMSG = response.data.messages.filter((nf: any) => nf.isRead === false)
        setNotif({notif: notReadMSG});
        setCount({nb: count.nb * 0 + notReadMSG.length});
      }
    });
  }


  if (first) {
    axios.get(`${baseURL}user/notification/received/get`, config).then((response) => {
      if (response && response.status === 200) {
        var notReadMSG = response.data.messages.filter((nf: any) => nf.isRead === false)
        console.log(response.data);
        setNotif({notif: notReadMSG});
        setCount({nb: count.nb * 0 + notReadMSG.length});
      }
    });
    setFirst(false);
  }




  //////////////////////////// DISPLAY NOTIF ////////////////////////////

  function DisplayNotifIcon() {
    return (
      <IconButton onClick={requestNotif}>
        <Badge badgeContent={count.nb} color="primary">
          <MailIcon sx={{ color: "#d5d1c6" }}/>
        </Badge>
      </IconButton>
    )
  }

  function DisplayAllNotif(){
    const notifs = notif.notif.map((nf, index)=>
      <div style={{"width": "300px"}} key={index}>
        <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={nf.type}/>
        </ListItemAvatar>
        <ListItemText
          primary={nf.title}
          secondary={
            <React.Fragment>
              {nf.content}
            </React.Fragment>
          }
          />
          <IconButton onClick={() => {requestDeleteNotif(nf.id)}}>
            <CloseIcon color="action" />
          </IconButton>
        </ListItem>
        <Divider variant="inset" component="li"/>
      </div>
    );
    return (
      <div>
        { notif.notif.length === 0 ? <div style={{"width": "300px", "textAlign": "center"}}>Pas de nouvelles notifications</div> : notifs }
      </div>
    )
  }

  function DisplayNotif(props: any) {
    return (
    <Popover open={state.view} onClose={() => {setState({view:false})}} disableScrollLock={true}
      anchorReference="anchorPosition"
      anchorPosition={{ top: 65, left: 1270}}
      
      // anchorOrigin={{
      //   vertical: 'top',
      //   horizontal: 'right',
      // }}
      // transformOrigin={{
      //   vertical: 'top',
      //   horizontal: 'left',
      // }} 
    >
      <Paper style={{maxHeight: 250, overflow: 'auto'}}>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          <DisplayAllNotif/>
        </List>
      </Paper>
    </Popover>
    )}
    
    
    return (
    <Box>
        <DisplayNotifIcon/>
        <div>
          <DisplayNotif/>
        </div>
    </Box>
  );
}