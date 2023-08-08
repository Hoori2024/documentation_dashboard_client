import React, { useState } from 'react';
import styles from './discussion.module.css';
import { Button } from '@mui/material';
import SendIcon from "../../assets/image/sendIcon.svg";


export function MsgModal() {

    const user = "user";
    const [value, setValue] = useState<string>('');

    function test() {
        
        console.log(value);
    }
    const handleChangeValue = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		// 👇 Get input value from "event"
		setValue(event.target.value);
	};
    return (
        <div>
            <div className={styles.chatBox}>
                {/* {user === "user" */}
                {/* ? */}
                <div className={styles.userTextPosition}>
                    <p className={styles.userTextColor}>Bonjour, je souhaiterais avoir une information</p>
                </div>
                {/* : */}
                <div className={styles.adminTextPosition}>
                    <p className={styles.adminTextColor}>Bonjour, je m'appelle Richard comment puis-je vous aider ?</p>

                </div>
                <div className={styles.userTextPosition}>
                    <p className={styles.userTextColor}>Je souhaiterais modifier mon adresse postale</p>
                </div>
                {/* : */}
                <div className={styles.adminTextPosition}>
                    <p className={styles.adminTextColor}>Très bien, regardons ça ensemble</p>

                </div>
            </div>
            <div className={styles.inputPosition}>
                <input 
                    type="text" 
                    placeholder="  Écrivez ici!" 
                    onChange={handleChangeValue}
                    className={styles.inputStyle} />
                <Button sx={{
                    backgroundColor: "#324C40", color: "white", fontSize: { md: 14, sm: 14, xs: 11 }, '&:hover': {
                        backgroundColor: '#547D54',
                    }
                }} onClick={test}>
                    <img src={SendIcon}/>
                </Button>
            </div>
        </div>
    )
}