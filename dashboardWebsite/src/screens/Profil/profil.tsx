import { Avatar, Box, Button, Grid, IconButton, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import Agri from '../../images/agri.png';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { changeFirstName, changeLastName, changePhone, fieldData, getFieldId, putEmail, putFieldName, userData } from "../../requests/requests";
import { IExistingField, IExistingUser, IField, IuserData } from "../../Utils/entities";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { config, baseURL } from "../../requests/requests";
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CancelIcon from '@mui/icons-material/Cancel';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserData, updateUserFN, updateUserLN, updateUserTel, updateUserEmail } from "../../store/userSlice";
import { AppDispatch, RootState } from "../../store/store";
import { fetchUserFieldData, updateFieldName } from "../../store/userFieldSlice";


const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
};

export function ProfilPage() {
	const [fieldInformation, setFieldInformation] = useState<IExistingField[]>([])
	const userId = localStorage.userid; // Récupérer l'ID de l'utilisateur depuis le local storage
	const dispatch = useDispatch<AppDispatch>();
	const { data, isLoading, error } = useSelector((state: RootState) => state.user);
	const { fieldData } = useSelector((state: RootState) => state.field); // Accédez aux données du slice userField

	useEffect(() => {
		dispatch(fetchUserData(userId));
		dispatch(fetchUserFieldData(userId))
	}, [dispatch, userId]);

	if (isLoading) {
		return <div>Chargement en cours...</div>;
	}

	if (error) {
		return <div>Erreur : {error}</div>;
	}

	if (!data) {
		return null;
	}


	console.log(data);
	const firstname: string | undefined = data.existingUser.firstName;
	const lastname: string | undefined = data.existingUser.lastName;


	return (
		<div>
			<Box sx={{ marginTop: 0, display: 'flex' }}>
				<Box sx={{ backgroundColor: '#D5D1C6', display: 'flex', justifyContent: "center", width: { md: '15%', xs: '30%' } }}>
					<VerticalInfoComponent
						firstname={firstname}
						lastname={lastname}
					/>
				</Box>
				<Box sx={{ justifyContent: "center", width: '100%' }}>
					<Box sx={{ display: 'flex', justifyContent: "center", width: '100%', marginTop: '1%' }} >
						<PersonnalInfoComponent
							userInformation={data.existingUser}
						/>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: "center", marginTop: '2%', width: '100%' }} >
						{fieldData?.existingField !== undefined &&
						<FieldInfoComponent
							fieldInformation={fieldData?.existingField}
						/>
						}
					</Box>
					<Box sx={{ display: 'flex', justifyContent: "center", marginTop: '2%', width: '100%' }} >
					{fieldData?.existingField !== undefined &&
						<FlightdInfoComponent
							fieldInformation={fieldData?.existingField}
							/>
					}
					</Box>
				</Box>
			</Box>
		</div>
	)
}

function PersonnalInfoComponent({ userInformation }: { userInformation: IExistingUser | undefined }) {
	const [openModalevalue, setOpenModalevalue] = React.useState(false);
	const [openModaleTel, setOpenModaleTel] = React.useState(false);
	const [openModalelname, setOpenModalelname] = React.useState(false);
	const [openModalefname, setOpenModalefname] = React.useState(false);
	// const [openModaleTel, setOpenModaleTel] = React.useState(false);

	return (

		<Box sx={{ backgroundColor: '#D9D9D9', borderRadius: 5, width: '95%', paddingBottom: '3%' }}>
			<Box sx={{ fontWeight: '600', marginLeft: '2%', paddingTop: '1%' }}>
				<h2>Informations personnelles</h2>
			</Box>
			<Grid container spacing={2} sx={{ display: 'flex', marginLeft: '2%' }}>
				<Grid item xs={7} md={4.5} sm={7} sx={{}}>
					<Box sx={{ fontSize: { md: 20, xs: 14 }, fontWeight: 600, display: 'flex', flexDirection: 'row', height: 40 }}>
						<p>Nom :</p>
						<EditOutlinedIcon sx={{ marginTop: 2.5, marginLeft: 1.5 }} onClick={() => setOpenModalelname(true)} />
					</Box>
					<Box sx={{ fontSize: { md: 20, xs: 14 } }}>
						<p>{userInformation?.lastName}</p>
					</Box>
					<Modal open={openModalelname} onClose={() => setOpenModalelname(false)}>
						<Box sx={style}>
							<ModalModif title="Modifier le nom" items={["Modification du nom"]} hide={false} requestType="lname" onClose={() => setOpenModalelname(false)} />
						</Box>
					</Modal>
					<Box sx={{ fontSize: { md: 20, xs: 14 }, fontWeight: 600, display: 'flex', flexDirection: 'row', height: 40 }}>
						<p>Prénom :</p>
						<EditOutlinedIcon sx={{ marginTop: 2.5, marginLeft: 1.5 }} onClick={() => setOpenModalefname(true)} />
					</Box>
					<Modal open={openModalefname} onClose={() => setOpenModalefname(false)}>
						<Box sx={style}>
							<ModalModif title="Modifier le Prénom" items={["Modification du prénom"]} hide={false} requestType="fname" onClose={() => setOpenModalefname(false)} />
						</Box>
					</Modal>
					<Box sx={{ fontSize: { md: 20, xs: 14 } }}>
						<p>{userInformation?.firstName}</p>
					</Box>
					<Box sx={{ fontSize: { md: 20, xs: 14 }, fontWeight: 600, display: 'flex', flexDirection: 'row', height: 40 }}>
						<p>E-mail :</p>
						<EditOutlinedIcon sx={{ marginTop: 2.5, marginLeft: 1.5 }} onClick={() => setOpenModalevalue(true)} />
					</Box>
					<Modal open={openModalevalue} onClose={() => setOpenModalevalue(false)}>
						<Box sx={style}>
							<ModalModif title="Modifier l'adresse e-mail" items={["Nouvelle adresse e-mail"]} hide={false} requestType="email" onClose={() => setOpenModalevalue(false)} />
						</Box>
					</Modal>
					<Box sx={{ fontSize: { md: 20, xs: 14 } }}>
						<p>{userInformation?.email}</p>
					</Box>

				</Grid>
				<Grid item md={6} xs={10}>
					<Box sx={{ fontSize: { md: 20, xs: 14 }, fontWeight: 600, display: 'flex', flexDirection: 'row', alignItems: "center", width: '100%', height: 40 }}>
						<p>Numéro de téléphone :</p>
						<EditOutlinedIcon onClick={() => setOpenModaleTel(true)} />
					</Box>
					<Modal open={openModaleTel} onClose={() => setOpenModaleTel(false)}>
						<Box sx={style}>
							<ModalModif title="Modifier le numéro de téléphone" items={["Nouveau numéro de téléphone"]} requestType="phone" hide={false} onClose={() => setOpenModaleTel(false)} />
						</Box>
					</Modal>
					<Box sx={{ fontSize: { md: 20, xs: 14 } }}>
						<p>{userInformation?.phoneNumber}</p>
					</Box>

					<Box sx={{ fontSize: { md: 20, xs: 14 }, fontWeight: 600, }}>
						<p>Adresse du domicile :</p>
					</Box>
					<Box sx={{ fontSize: { md: 20, xs: 14 } }}>
						<p>{userInformation?.postalAddress}</p>
					</Box>

				</Grid>
			</Grid>
		</Box>
	)
}

function FieldInfoComponent({ fieldInformation }: { fieldInformation: IExistingField[] }) {
	const [openModaleField, setOpenModaleField] = React.useState(false);

	return (
		<Box sx={{ backgroundColor: '#D9D9D9', borderRadius: 5, width: '95%', paddingBottom: '3%' }}>
			<Box sx={{ fontWeight: '600', marginLeft: '2%', paddingTop: '1%' }}>
				<h2>Informations du / des champ(s)</h2>
			</Box>
			<Grid container spacing={2} sx={{ display: 'flex', marginLeft: '2%' }}>
				<Grid item md={6} xs={10} sx={{}}>
					<Box sx={{ fontSize: { md: 20, xs: 14 }, fontWeight: 600, display: 'flex', flexDirection: 'row', height: 40 }}>
						<p>nom du / des champ(s) :</p>
						<EditOutlinedIcon sx={{ marginTop: 2.5, marginLeft: 1.5 }} onClick={() => setOpenModaleField(true)} />
					</Box>
					<Modal open={openModaleField} onClose={() => setOpenModaleField(false)}>
						<Box sx={style}>
							<ModalField title="Modifier le nom du champ sélectionné" items={["Nouveau nom du champ"]} requestType="phone" hide={false} fieldInformation={fieldInformation} onClose={() => setOpenModaleField(false)} />
						</Box>
					</Modal>
					<Box sx={{ fontSize: { md: 20, xs: 14 } }}>
						<p>{fieldInformation.map((items: IExistingField, index: any) => {
							return (
								<p key={index}>{items.fieldName}</p>
							)
						})}</p>
					</Box>
				</Grid>
				<Grid item xs={6}>
					<Box sx={{ fontSize: { md: 20, xs: 14 }, fontWeight: 600 }}>
						<p>Superficie du champ :</p>
					</Box>
					<Box sx={{ fontSize: { md: 20, xs: 14 } }}>
						<p>{fieldInformation.map((items: IExistingField, index) => {
							return (
								<p key={index}>{items.fieldName} : {items.fieldSize} hectare(s)</p>
							)
						})}</p>
					</Box>
				</Grid>
			</Grid>
		</Box>
	)
}

function FlightdInfoComponent({ fieldInformation }: { fieldInformation: IExistingField[] }) {
	return (

		<Box sx={{ backgroundColor: '#D9D9D9', borderRadius: 5, width: '95%', paddingBottom: '3%' }}>
			<Box sx={{ fontWeight: '600', marginLeft: '2%', paddingTop: '1%' }}>
				<h2>Données de vol</h2>
			</Box>
			<Grid container spacing={2} sx={{ display: 'flex', marginLeft: '2%' }}>
				<Grid item md={6} xs={10} sx={{}}>
					<Box sx={{ fontSize: { md: 20, xs: 14 }, fontWeight: 600 }}>
						<p>Vol(s) effectué(s) : </p>
					</Box>
					<Box sx={{ fontSize: { md: 20, xs: 14 } }}>
						<p>{fieldInformation.map((items: IExistingField, index) => {
							return (
								<p key={index}>
									<p>{items.fieldName} : {items.coverPast.length}</p>
								</p>
							)
						})}</p>
					</Box>
					{/* <Box sx={{ fontSize: { md: 20, xs: 14 }, fontWeight: 600, marginBottom: '-3%' }}>
						<p>Temps de vol moyen : </p>
					</Box>
					<Box sx={{ fontSize: { md: 20, xs: 14 } }}>
						<p>{fieldInformation.map((items: IExistingField, index) => {
							return (
								<p>
									<p>{items.fieldAddress} : {items.coverEstimatedTime} min</p>
								</p>
							)
						})}</p>
					</Box> */}
				</Grid>
				{/* <Grid item md={6} xs={10}>
					<Box sx={{ fontSize: { md: 20, xs: 14 }, fontWeight: 600, marginBottom: '-3%', }}>
						<p>Total de datura(s) détecté(s) : 45</p>
					</Box>
				</Grid> */}
				<Grid item md={6} xs={10}>
					<Box sx={{ fontSize: { md: 20, xs: 14 }, fontWeight: 600 }}>
						<p>Temps de vol moyen : </p>
					</Box>
					<Box sx={{ fontSize: { md: 20, xs: 14 } }}>
						<p>{fieldInformation.map((items: IExistingField, index) => {
							return (
								<p key={index}>
									<p >{items.fieldName} : {items.coverEstimatedTime} min</p>
								</p>
							)
						})}</p>
					</Box>
				</Grid>
			</Grid>
		</Box>
	)
}

function VerticalInfoComponent({ firstname, lastname }: { firstname: string | undefined, lastname: string | undefined }) {
	const [activateNotification, setActivateNotification] = useState<string>("NONE");

	if (activateNotification === "NONE") {
		setActivateNotification("true");
		axios.get(`${baseURL}user/notification/`, config).then((res) => {
			setActivateNotification(String(res.data.userNotif));
		}).catch((err) => {
			console.log(err);
		});
	}

	function ActivateDesactivatesNotification() {
		axios.put(`${baseURL}user/notification/`, {
			"notification": activateNotification === "true" ? false : true,
		}, config).then((res) => {
			setActivateNotification(activateNotification === "true" ? "false" : "true");
		}).catch((err) => {
			console.log(err);
		})
	}

	let navigate = useNavigate();
	const handleClickSettings = (e: { preventDefault: () => void; }) => {
		e.preventDefault();
		navigate('/settings');
	}

	const handleClickHistory = (e: { preventDefault: () => void; }) => {
		e.preventDefault();
		navigate('/history');
	}
	

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column' }}>
			<Box sx={{ flex: 3, }}>
				<Box sx={{ marginTop: "30%", marginLeft: '2%', marginRight: '2%' }}>
					<Avatar alt="photo de profil" src={Agri} sx={{ width: '100%', height: '100%' }} />
				</Box>
				<Box sx={{ fontSize: { md: 20, xs: 14 }, display: 'flex', justifyContent: "center", fontWeight: 600 }}>
					<p>{firstname} {lastname}</p>
				</Box>
			</Box>
			<Box sx={{ position: "sticky" }}>
				<Box sx={{ display: 'flex', justifyContent: "center", marginTop: 2, marginBottom: { md: '20px', xs: '50px' } }}>
					<Button sx={{
						backgroundColor: "#769776", width: { xs: "90%", md: "100%" }, borderRadius: { md: 20, xs: 5 }, color: "white", fontSize: { md: 14, sm: 14, xs: 11 }, '&:hover': {
							backgroundColor: '#547D54',
						}}}
						onClick={handleClickSettings}
					>
						<p>Paramètre</p>
					</Button>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: "center", marginTop: 2, marginBottom: { md: '20px', xs: '50px' } }}>
					<Button sx={{
						backgroundColor: "#769776", width: { xs: "90%", md: "100%" }, borderRadius: { md: 20, xs: 5 }, color: "white", fontSize: { md: 14, sm: 14, xs: 11 }, '&:hover': {
							backgroundColor: '#547D54',
						}}}
						onClick={handleClickHistory}
					>
						<p>Historique</p>
					</Button>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: "center" }}>

					<Button sx={{
						backgroundColor: "#769776", width: { xs: "90%", md: "100%" }, borderRadius: { md: 20, xs: 5 }, color: "white", fontSize: { md: 14, sm: 14, xs: 11 }, '&:hover': {
							backgroundColor: '#547D54',
						}
					}} onClick={ActivateDesactivatesNotification}>
						{activateNotification === "true" ? <p>Desactiver les mails</p> : <p>Activer les mails</p>}
					</Button>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: "center", marginTop: 2, marginBottom: { md: '20px', xs: '50px' } }}>
					<Button sx={{
						backgroundColor: "#769776", width: { xs: "90%", md: "100%" }, borderRadius: { md: 20, xs: 5 }, color: "white", fontSize: { md: 14, sm: 14, xs: 11 }, '&:hover': {
							backgroundColor: '#547D54'
						}
					}}>
						<p>Se déconnecter</p>
					</Button>
				</Box>
				<Box sx={{ textAlign: 'center' }}>
					<p>© 2022 Hoori Tous droits réservés.</p>
				</Box>
			</Box>
		</Box>
	)
}


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

export function ModalModif(props: any) {
	require("./profil.css");
	const { data } = useSelector((state: RootState) => state.user);

	const dispatch = useDispatch();
	const handleUpdateFirstName = (newFirstName: string) => {
		if (data) {
			dispatch(updateUserFN({ firstName: newFirstName }));
		}
	};

	const handleUpdateLastName = (newLastName: string) => {
		if (data) {
			dispatch(updateUserLN({ lastName: newLastName }));
		}
	};
	const handleUpdateTel = (newTelNumber: string) => {
		if (data) {
			dispatch(updateUserTel({ phoneNumber: newTelNumber }));
		}
	};
	const handleUpdateEmail = (newEmail: string) => {
		if (data) {
			dispatch(updateUserEmail({ email: newEmail }));
		}
	};

	const [value, setValue] = useState<string>('');
	const handleChangeValue = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		// 👇 Get input value from "event"
		setValue(event.target.value);
	};
	const apiCall = () => {

		if (props.requestType === "email") {
			console.log("value=", value)
			handleUpdateEmail(value)
			putEmail(value)
		}
		else if (props.requestType === "phone") {
			console.log("value=", value)
			changePhone(value)
			handleUpdateTel(value)
			props.onClose()
		}
		else if (props.requestType === "lname") {
			console.log("value=", value)
			handleUpdateLastName(value)
			changeLastName(value)
		}
		else if (props.requestType === "fname") {
			console.log("FNvalue=", value)
			handleUpdateFirstName(value)
			changeFirstName(value)
		}
		props.onClose();
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
							<Box style={{ flexDirection: 'column', flex: 1 }}>
								{props.items.map((item: String, index: any) => (
									<div key={index} className="bloc" style={{ marginBottom: 30 }} >
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
											onChange={handleChangeValue}
										/>
										<span className="icon is-small is-right">
											<i className="fas fa-check fa-xs"></i>
										</span>
									</div>
								))}
							</Box>
							<Button onClick={apiCall} variant="contained" color="primary" className="ConnectButton" style={{ marginTop: 20 }}>
								Valider
							</Button>
						</form>
					</div>
				</div>
			</div >
		</ThemeProvider>
	);
}

export function ModalField(props: any) {
	require("./profil.css");
	const { fieldData } = useSelector((state: RootState) => state.field);
	const dispatch = useDispatch();
	const [value, setValue] = useState<string>('');
	const [selectChoice, setSelectChoice] = useState<string>('-- selectionnez une option --');
	const [fieldId, setFieldId] = useState<string>('');


	const changeSelectData = (Choice: string) => {
		setSelectChoice(Choice);
		getFieldId(Choice).then((res) => {
		setFieldId(res.FieldId)
		console.log(res.FieldId);
	})
}
	const handleChangeValue = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		// 👇 Get input value from "event"
		setValue(event.target.value);
	};
	const apiCall = () => {
		console.log("inside APICALL ")
		console.log(value, fieldId)
		try {
			dispatch(updateFieldName({ fieldId, fieldName: value }));
			putFieldName(value ,fieldId);
			console.log("dispatch called successfully");
			// props.onClose(); // Commentez temporairement cette ligne pour vérifier si le dispatch fonctionne correctement
		  } catch (error) {
			console.error('Error dispatching action:', error);
		  }
		props.onClose();
	}
	return (
		<ThemeProvider theme={theme}>
			<div className='cardBox'>
				<div className="card-headerBox">
					<h2 className="cardTitle">{props.title}</h2>
				</div>
				<div className="media-contentBox">
					<div className="cardBoxField">
						<form>
							<Box style={{ flexDirection: 'column', flex: 1 }}>
								{props.items.map((item: String, key: any) => (
									<div className="bloc" style={{ marginBottom: 30 }} key={key}>

										<select className="SelectBox"
											onChange={(event) => changeSelectData(event.target.value)}
											value={selectChoice}>
												<option> {selectChoice} </option>
											{
												fieldData?.existingField.map((items: IExistingField, index: any, ) =>
												<option key={index}>{items.fieldName}</option>)
											}
										</select>;
										<div className="labelBoxField">
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
											onChange={handleChangeValue}
										/>
										<span className="icon is-small is-right">
											<i className="fas fa-check fa-xs"></i>
										</span>
									</div>
								))}
							</Box>
							<Box className="ConnectButtonFieldPos">
								<Button onClick={apiCall} variant="contained" color="primary" className="ConnectButtonField" style={{ marginTop: 20 }}>
									Valider
								</Button>
							</Box>
						</form>
					</div>
				</div>
			</div >
		</ThemeProvider>
	);
}



	// useEffect(() => {
	// // 	userData(localStorage.userid).then((res) => {
	// // 		setpersonnalData(res.existingUser);
	// // 		console.log("userData : ", personnalData);
	// // 		console.log("localStorage.userId", localStorage.userId)

	// // 	});
	// 	fieldData(localStorage.userid).then((res) => {
	// 		setFieldInformation(res.existingField);
	// 		console.log("userData : ", fieldInformation);
	// 	});
	// 	// if (personnalData === undefined) {
	// 	// 	userData(localStorage.userid).then((res) => {
	// 	// 		setpersonnalData(res.existingUser);
	// 	// 		console.log("userData : ", personnalData);
	// 	// 	});
	// 		fieldData(localStorage.userid).then((res) => {
	// 			setFieldInformation(res.existingField);
	// 			console.log("userData : ", fieldInformation);
	// 		});
	// 	}
	// }, []);