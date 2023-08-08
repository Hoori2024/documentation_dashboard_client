import React,  { useState }  from 'react';
import Modal from '@mui/material/Modal';
import CloseBtn from '../buttons/CloseBtn';
import CopyIcon from '../../assets/image/copy.png'

var mail = "hoori_2024@labeip.epitech.eu"
var subjectClient = "[Question client] id: "
var subjectPublic = "[Question]"

function copyMail() {
  navigator.clipboard.writeText(mail).then(
    function(){
      alert("Adresse mail copiée."); // success 
    }).catch(
      function() {
         alert("Erreur durant la copie de l'adresse mail, veuillez la copier manuellement.");
   });
}

function mailTo() {
  let subject;

  if (localStorage.userid == null)
    subject = subjectPublic
  else
    subject = subjectClient + localStorage.userid;

  window.location.href = "mailto:" + mail + "?subject=" + subject
}

/**
 * Modale de contact.
 * @function ContactUsModal
 * @category Composant / modals
 * @param props.open {boolean} si true, la modale est affichée
 * @param props.closeCallBack {function} fonction appelée lorsque la modale est fermée
 */
export default function ContactUsModal(props: any) {
  require("./ContactUsModal.css")

  const [clientId, setClientId] = useState<any>(null);
  
  return (
      <Modal
				open={props.open}
        onClose={props.closeCallBack}
				className='ContactUsModal-modal'>
          <div className='ContactUsModal-maincontainer'>
            <div className="ContactUsModal-closectn">
              <CloseBtn close={props.closeCallBack}/>
            </div>
            <div className='ContactUsModal-upcontainer'>
              <a className='ContactUsModal-title'> UNE QUESTION ? </a>
              <div className='ContactUsModal-message'> Vous pouvez consulter notre FAQ en cliquant <a href="http://www.hoori.eu.s3-website.eu-west-3.amazonaws.com/faq" target="_blank">ici</a>.</div>
              <a className='ContactUsModal-message'> Sinon, il suffit de nous contacter :</a>
            </div>
            <div className='ContactUsModal-downcontainer'>
              <div className='ContactUsModal-btn' onClick={mailTo}>Nous contacter</div>
              <div className='ContactUsModal-bigmessage'> OU </div>
              <div className='ContactUsModal-email'> {mail} <img className="ContactUsModal-emailimg" src={CopyIcon} onClick={copyMail}></img></div>
            </div>
          </div>
			</Modal>
  );
}