import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import {DronePage} from '../../screens/Drone/DronePage'

import { Link } from "react-router-dom";
import HooriLogo from './../../assets/image/HooriLogo.png';
import Modal from '@mui/material/Modal';
import CancelIcon from '@mui/icons-material/Cancel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import ContactUsModal from "../modals/ContactUsModal";
import HeaderBtn from '../buttons/HeaderBtn';
import { ProfilPage } from '../../screens/Profil/profil';
import { logout } from '../../requests/requests';
import styles from './Headers.module.css';
// import ContactUsModal from "../contactUs/ContactUsModal";
// import LoginCard from '../loginCard/LoginCard';
import Notif_Handler from '../notification/Notif';

interface Props {
  windows?: () => Window;
}

const drawerWidth = 240;

/**
 * Barre de navigation du site
 * @function Navbar
 * @category Composant / header
 * @param props {Window} objet représentant la fenetre react du navigateur
 */
export default function Navbar(props: Props) {
  // require("./Headers.css");
  const { windows } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  //Contact
  const [openContact, setOpenContact] = React.useState(false);
  const handleOpenContact = () => setOpenContact(true);
  const handleCloseContact = () => setOpenContact(false);
  //Login
  const [openLogin, setOpenLogin] = React.useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const [isActiveLogin, setisActiveLogin] = React.useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  let navigate = useNavigate();
  const container = windows !== undefined ? () => windows().document.body : undefined;

  const handleClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    navigate('/profil');
  }
  const handleAccueilClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    navigate('/');
  }

  const DroneHandleClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    navigate('/drone');
  }

  const logouthandleClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    logout(localStorage.userid);
    console.log("token : ", localStorage.token);
    window.location.replace(`https://kmydkfmxrr.eu-west-1.awsapprunner.com/`);
    // window.location.replace(`http://localhost:3000`);

  }
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };



  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', backgroundColor: '#324C40' }}>
      <Typography variant="h6" sx={{ my: 2, color: "white" }} className='navbar-item-drawerfont'>
        Menu
      </Typography>
      <Divider />
      <List sx={{ height: '100vh' }}>
      <HeaderBtn
          title='Accueil'
          onClick={handleAccueilClick} />
        <HeaderBtn
          title='Nous contacter'
          onClick={handleOpenContact} />
        <HeaderBtn
            title='Mes drones'
            onClick={DroneHandleClick} />
        <HeaderBtn
          title='Mon compte'
          onClick={handleClick} />
        <HeaderBtn
          title='Se déconnecter'
          onClick={logouthandleClick} />
      </List>
    </Box>
  );


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar sx={{ backgroundColor: '#324C40' }}>
          <div className={styles.logo}>
            <a href='/' className=''>
              <img
                className={styles.LogoHoori}
                src={HooriLogo}
                alt='Logo'
              />
            </a>
          </div>
          <Notif_Handler/>
          <Box sx={{ 
            display: { xs: 'none', lg: 'block' },
            }}>
            <HeaderBtn
              title='Accueil'
              onClick={handleAccueilClick}
               />
            <HeaderBtn
              title='Nous contacter'
              onClick={handleOpenContact} />
            <HeaderBtn
              title='Mes drones'
              onClick={DroneHandleClick} />
            <HeaderBtn
              title='Mon compte'
              onClick={handleClick} />
            <HeaderBtn
              title='Se déconnecter'
              onClick={logouthandleClick} />
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" >
        <Toolbar />
      </Box>
      <ContactUsModal
        open={openContact}
        closeCallBack={handleCloseContact}
      />
      {/*<Box sx={style}>
          <ContactUsModal open={openContact} closeCallBack={handleCloseContact} />
        </Box> */}
      <Modal
        open={openLogin}
        onClose={handleCloseLogin}
      >
        <Box sx={style}>
          {/* <LoginCard handleCloseLogin={handleCloseLogin} handleOpenRegister={handleOpenRegister} handleOpenContact={handleOpenContact}/> */}
        </Box>
      </Modal>
    </Box>
  );
}