import { Box, Grid, Switch} from '@mui/material';
import {useState} from 'react';
import axios from 'axios';
import { baseURL, config } from '../../requests/requests';

export default function SettingPage(props: any) {
    require("./SettingsPage.css");
    const [first, setFirst] = useState(true);

    
    var [Notifs, setNotifs] = useState([
        {
            "type": "Champs",
            "description": "Activer les notifications d'un champ (température, humidité, etc.)",
            "value": false
        },
        {
            "type": "Drone",
            "description": "Activer les notifications sur l'état du drone",
            "value": false
        },
        {
            "type": "Messages",
            "description": "Activer les notifications lors de la réception d'un message",
            "value": false
        },
        {
            "type": "Paramètres",
            "description": "Activer les notifications lors d'un changement de paramètres",
            "value": false
        }
    ]);

    if (first) {
        axios.get(`${baseURL}user/notification/global/activated`, config).then((response) => {
        if (response && response.status === 200) {
            console.log(response.data);
            var newNotifs = JSON.parse(JSON.stringify(Notifs));
            for (var i = 0; i < response.data.userNotifActivated.length; i++) {
                for (var j = 0, end = false; !end && j < newNotifs.length; j++) {
                    if (response.data.userNotifActivated[i].type === newNotifs[j].type) {
                        newNotifs[j].value = response.data.userNotifActivated[i].value;
                        console.log(newNotifs[j].value);
                        end = true;
                    }
                }
            }
            setNotifs(newNotifs);
        }});
        setFirst(false);
    }



    function changeSwitch(index: number) {
        var newNotifs = JSON.parse(JSON.stringify(Notifs));
        newNotifs[index].value = !newNotifs[index].value;
        console.log(newNotifs);
        axios.post(`${baseURL}user/notification/global/activated/set`, newNotifs, config).then((response) => {
            if (response && response.status === 200) {
                console.log(response.data);
            }
        });
        setNotifs(newNotifs);
    }

    return (
        <div className="background">
            <Grid container direction="row" spacing={1}>
                {Notifs.map((nf, index) => (
                    <Grid item xs={80} sm={4} md={4} key={index}>
                        <Box sx={{ p: 2, borderRadius: 1 }} className='tile'>
                            <h3>{nf.type}</h3>
                            <p>{nf.description}</p>

                            <Switch checked={nf.value} onClick={() => changeSwitch(index)}/>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};