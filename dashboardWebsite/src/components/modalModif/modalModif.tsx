import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { View } from 'react-native';
import { Box } from '@mui/material';


const theme = createTheme({
    palette: {
      primary: {
        main: '#9EAD84',
      },
      secondary: {
        main: '#FFFFFF',
      },
    },
  });

export default function ModalModif(props: any) {
    require("./modalModif.css");

    const apiCall = () => { 
        fetch('https://api.npms.io/v2/search?q=react')
        .then(response => response.json());
      }
    return (
        <ThemeProvider theme={theme}>
            <div className='cardBox'>
                <div className="card-headerBox">
                    <h2 className="cardTitle">{props.title}</h2>
                </div>
                <div className="media-contentBox">
                    <div className="contentBox">
                        <form>
                            <Box style={{flexDirection:'column', flex:1}}>
                                { props.items.map((item: String, key: Number) => (
                                    <div className="bloc" style={{marginBottom: 30}}>
                                        <div className="labelBox">
                                            <h3>{item} :</h3>
                                        </div>
                                        <TextField
                                            fullWidth
                                            id="outlined-required"
                                            className="input"
                                            defaultValue=""
                                            variant="filled"
                                            placeholder="..."
                                            type={props.hide ? "password" : "text"}
                                        />
                                        <span className="icon is-small is-right">
                                            <i className="fas fa-check fa-xs"></i>
                                        </span>
                                    </div>
                                ))}
                            </Box>
                            <Button onClick={apiCall} variant="contained" color="primary" className="ConnectButton" style={{marginTop: 20}}>
                                    Valider
                            </Button>
                        </form>
                    </div>
                </div>
            </div >
        </ThemeProvider>
    );
}