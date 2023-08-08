import Chat, { Bubble, useMessages} from '@chatui/core';
import axios from 'axios';
import '@chatui/core/dist/index.css';
import { useState } from 'react';
import { IconButton, Button} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function Chatbot(props: any) {
    const { messages, appendMsg, setTyping } = useMessages([]);
    const [state, setState] = useState({view: 0});

    require("./Chatbot.css")

  function handleSend(type: any, val: any) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });
      
      setTyping(true);
      
      
      axios.get('https://hoori.loca.lt/client?sentences="' + val + '"', { headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': '1'
      }}).then((response) => {
        appendMsg({
          type: 'text',
          content: { text: response.data },
        })
      }).catch((error) => {
        appendMsg({
          type: 'text',
          content: { text: "Chatbot is disable :(" },
        })
      });
    }
  }

  function renderMessageContent(msg: any) {
    const { content } = msg;
    return <Bubble content={content.text} />;
  }

  // create color with rgb
  const theme = createTheme({
    palette: {
      primary: {
        main: '#9EAD84',
      },
    },
  });

  return (

    <div>
      {state.view === 0 ? 
        <div className="chatbotButton">
          <ThemeProvider theme={theme}>
            <Button
              disabled={false}
              variant="contained"
              size="large"
              onClick={() => setState({view: 1})}
              color='primary'
            >Chatbot</Button>
          </ThemeProvider>
        </div>
      :
      <div className="chatbot"><Chat
        navbar={{ title: 'Assistant' }}
        messages={messages}
        renderMessageContent={renderMessageContent}
        onSend={handleSend}
        placeholder="Ici pour les questions!"
        locale='fr-FR'
        />
        <IconButton className='closeButton' onClick={() => setState({view: 0})}><CloseIcon/></IconButton>
      </div>
      }
    </div>
  );
}