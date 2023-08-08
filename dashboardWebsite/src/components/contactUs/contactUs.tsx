import React,  { useState }  from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

export default function ContactUs(props: any) {
  require("./contactUs.css");

  const [emailAddress, setEmailAddress] = useState<string | null>('');
  const [messageContent, setMmessageContent] = useState<string | null>('');

  function isCorrectEmail(email: string) {
    /* let expr = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return expr.test(email); */
  }

  function updateEmailAddress(newEmailAddress: string) {
    setEmailAddress(newEmailAddress);
  }

  function handleClickOnSend() {
    /* if (isCorrectEmail(emailAddress) && messageContent != null && messageContent !== "") {
      // TODO
      console.log('ok')
    } else {
      // TODO
      console.log(' notok')
    } */
  }
  return (
    <ThemeProvider theme={theme}>
      <div className='cardBox'>
        <div className="card-headerBox">
          <h2 className="cardTitle">Nous Contacter</h2>
        </div>
        <div className="media-contentBox">
          <div className="contentBox">
            <form>
              <div className="bloc">
                <div className="labelBox">
                  <h3>Email :</h3>
                </div>
                <TextField
                  fullWidth
                  id="outlined-required"
                  label="Email"
                  className="input"
                  type="email"
                  defaultValue=""
                  placeholder="exemple@hoori.com"
                  variant="filled"
                  //onChange={setEmailAddress}
                />
                <span className="icon is-small is-right">
                  <i className="fas fa-check fa-xs"></i>
                </span>
              </div>
              <div className="blocMessage">
                <label className="labelBox"> 
                  <h3>Message :</h3>
                </label>
                <TextField
                  fullWidth
                  id="filled-multiline-flexible"
                  label="Message"
                  multiline
                  rows={10}
                  className="inputMessage"
                  type="message"
                  defaultValue=""
                  placeholder="Message"
                  variant="filled"
                />
                <span className="icon is-small is-right">
                  <i className="fas fa-check fa-xs"></i>
                </span>
              </div>
              <Button
                variant="contained"
                color="primary"
                className="ConnectButton"
                //onClick={handleClickOnSend}
                >
                Envoyer
              </Button>
            </form>
          </div>
        </div>
      </div >
    </ThemeProvider>
  );
}