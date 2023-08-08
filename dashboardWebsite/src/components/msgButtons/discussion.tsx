import React, { useState } from 'react';
import styles from './discussion.module.css';
import { Button, Modal} from '@mui/material';
import { MsgModal } from './discussionModal';

export function MsgButton() {

    const [openChat, setOpenChat] = useState(false)
    function test() {
        setOpenChat(true);
        if (openChat)
            setOpenChat(false);
        console.log("test");
    }

    return (
        <div>
            <div className={styles.buttonPosition}>
                <Button sx={{
                    backgroundColor: "#324C40", width: { xs: "90%", md: "100%" }, color: "white", fontSize: { md: 14, sm: 14, xs: 11 }, '&:hover': {
                        backgroundColor: '#547D54',
                    }
                }} onClick={test}>
                    <p>Assistance technique</p>
                </Button>
                <div >
                    {openChat === true ? <MsgModal/> : null}
                </div>
            </div>

            {/* <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div className={styles.modalStyle}>
                    <MsgModal/>
                </div>
                </Modal> */}
        </div>
    )
}