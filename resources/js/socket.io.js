import axios from 'axios';
import {socket} from './chat.js'
import { init } from 'emailjs-com';
import emailjs from 'emailjs-com';

init("user_pPrLRdzZbCZzzOvdUCiaT");

let inactive = document.querySelector('.inactive');
let isActive = document.querySelector('.is-active');
let emailForm = document.querySelector('.email-form');
let emailBtn = document.querySelector('.emailBtn');
let progressBar = document.querySelector('.progress');
const uuid = document.querySelector('.uuid').innerText;

socket.emit('join', uuid); //join a private room
socket.emit('amSender', uuid);

socket.on('isActive', () => {
  isActive.style.color = "#4BB543";
  inactive.style.display = 'none';
  document.querySelector('.chat-btn').style.display = "block"; //display the chat
});

//function to run when copy button is pressed
function copyLink() {
  let text = document.querySelector('.copy-link');
  text.style.background = "#aff32a";
  text.select();
  document.execCommand('copy');
  setTimeout(() => {
    text.style.background = "black";
  }, 5000);
}

let copyBtn = document.querySelector('#execCopy');
copyBtn.onclick = copyLink;

//sending more file
let sendMoreBtn = document.querySelector('.upload-more-btn');
let moreForm= document.querySelector('.upload-more-form');
sendMoreBtn.onclick = event => {
  event.preventDefault();
  moreForm.firstElementChild.click();
}

moreForm.firstElementChild.onchange = () => {
  progressBar.style.opacity = "1"; //display the progress bar
  socket.emit('moreFiles', {uuid, number : moreForm.firstElementChild.files.length});  //send msg to receiver that new files are coming
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/file-upload/send-more-files');
  let formData = new FormData(moreForm);
  formData.append('uuid', uuid);
  xhr.send(formData);
  xhr.onload = () => {
    let res = xhr.response;
    progressBar.firstElementChild.style.width = "90%";

    //perform cleanups
    progressBar.style.opacity = 0;
    setTimeout(() => {
      progressBar.firstElementChild.style.width = "1%";
    }, 2500);
    socket.emit('moreReceived', uuid);
  }
}

//display the email-Btn
emailBtn.style.display = "block";

//sending the email
let emailSendBtn = document.querySelector('.send-email-btn')
emailSendBtn.onclick = event => {
  event.preventDefault();

  //send ajax request to the Server
  let payload = {
    uuid,
    emailFrom : emailForm.firstElementChild.value,
    emailTo : emailForm.children[1].value,
  }
  emailSendBtn.style.background = "yellow";

  axios.post('/files/sendLink', payload).then(res => {
    let {emailTo, emailFrom, downloadLink} = res.data;
    emailjs.send("service_44q9cmr","template_a8zisyn",{
      emailFrom,
      emailTo,
      downloadLink,
}).then(res => {
     mailMsg("Email sent", 'success');
     emailSendBtn.style.background = "";   //peform cleanups
   }).catch(err => {
     mailMsg('Email not sent. Possible reason could be invalid gmail. Try again.', 'error');
     emailSendBtn.style.background = "";   //peform cleanups
   });
 }).catch((err) => {
   throw err;
   mailMsg("Sorry something went wrong.", 'error');
 });
}

//function to display mail success or error
function mailMsg(msg, status) {
  let div = document.createElement('div');
  div.innerText = msg;
  div.classList.add('mail-msg');
  if(status == "error") div.classList.add("mail-error-msg");
  else div.classList.add("mail-success-msg");
  document.body.append(div);
  setTimeout(() => div.remove(), 5000);
}
