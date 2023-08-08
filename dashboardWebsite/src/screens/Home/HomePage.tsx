import {useState, useEffect, useRef} from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Footer from '../../components/footer/Footer';
import Widget from '../../components/widgets/Widget';
import WidgetContentManage from '../../components/widgets/WidgetContentManage';
import WidgetContentScheduler from '../../components/widgets/WidgetContentScheduler';
import WidgetContentEvolution from '../../components/widgets/WidgetContentEvolution';
import WidgetContentHistory from '../../components/widgets/WidgetContentHistory';
import {createTheme} from '@mui/material/styles';
import {Field} from '../../architecture/architecture';
import {getAllFields} from '../../api/Api'
import Chatbot from '../../components/chatbot/Chatbot';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#D5D1C6',
    },
  },
});

/**
 * Page d'accueil
 * @function DronePage
 * @category Composant / screens
 */
export default function HomePage() {
  require("./HomePage.css");

  const [widgetState0, setWidgetState0] = useState([]);
  const [widgetState1, setWidgetState1] = useState([]);
  const [widgetState3, setWidgetState3] = useState([]);
  const [widgetState4, setWidgetState4] = useState([]);

  const [fields, setFields] = useState<Field[] | null>(null);
  //const [key, setKey] = useState(0);

  /* function useInterval(callback: any, delay: number) {
    const savedCallback: any = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback?.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useEffect(() => {
    const interval = setInterval((fieldsL) => {
      console.log("1 oldFields", fieldsL)
      getAllFields(fieldsL).then(response => {
        setFields(response);
        //console.log(key)
        //setKey(key + 1);

      });
    }, 5000, fields);
  }, []);  */

  useEffect(() => {
    getAllFields(null).then(response => {
      setFields(response);

    });
  }, []);

  function setWidgetState(widgetId: number, actions: any) {
    var newWidgetState0 = widgetState0;
    var newWidgetState1 = widgetState1;
  
    if (widgetId == 0) {
      newWidgetState0 = actions;
      setWidgetState0(newWidgetState0);
    } else if (widgetId == 1) {
      newWidgetState1 = actions;
      setWidgetState1(newWidgetState1);
    }
  }
  if (!fields) {
    return (
      <div className='HomePage-load'>
          <CircularProgress sx={{color: '#324C40'}} color='success'/>
      </div>
    );
  }

  return (
      <div className="background">
        <div className="widget-grid">
          <Grid container spacing={4} columns={{xs: 1, sm: 1, md: 1, lg: 1, xl: 2}}>
          <Grid item xs={1} sm={1}>
              <Widget title="Gérer mes couvertures">
                <WidgetContentManage /* key={"manage"+key} */ fields={fields} setWidgetState={setWidgetState} widgetState={widgetState0} />
              </Widget>
            </Grid>

            <Grid item xs={1} sm={1}>
              <Widget title="Programmer une couverture">
                <WidgetContentScheduler /* key={"schedule"+key} */ fields={fields} setWidgetState={setWidgetState} widgetState={widgetState1} />
              </Widget>
            </Grid>

            <Grid item xs={1} sm={1}>
              <Widget title="évolution de mes champs">
                <WidgetContentEvolution /* key={"evolution"+key} */ fields={fields}/>
              </Widget>
            </Grid>

            <Grid item xs={1} sm={1}>
              <Widget title="Historique de mes couvertures">
                <WidgetContentHistory /* key={"history"+key} */ fields={fields}/>
              </Widget>
            </Grid>
          </Grid>

        </div>

        {/* <div className="footer"> <Footer/> </div> */}
        <Chatbot/>
      </div>
  );
};