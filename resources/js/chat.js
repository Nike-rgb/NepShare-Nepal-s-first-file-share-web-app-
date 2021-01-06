import io from 'socket.io-client';
export const socket = io();

const uuid = document.querySelector('.uuid').innerText;
let chatShown = false;
let newMsgsCount = 0;
let chatBtn = document.querySelector('.chat-btn');
let chatMsgs = document.querySelector('.chatMsgs');

chatBtn.firstElementChild.onclick = event => {
  let chatBox = document.querySelector('.chat-box');

  //making sure only clicks on button are handled
  if(! (event.currentTarget == event.target) ) return;

  if(!chatShown) {
    let newMsgCounter = document.querySelector('.newMsgsCount');
    newMsgsCount = 0;
    newMsgCounter.style.display = "none";

    chatBtn.firstElementChild.style.color = "";
    chatBtn.firstElementChild.style.animation = "none";
    chatBtn.style.transform = "translateX(300px)";
    chatBox.style.opacity = "1";
    chatShown = true;
  } else {
    chatBtn.style.transform = "translate(0)";
    chatBox.style.opacity = "0";
    chatShown = false;
  }
}

//handling socket msgs
socket.on('newMsg', msg => {
  console.log('new');
  let div = document.createElement('div');
  div.classList.add('msg');
  div.classList.add('hisMsg');
  div.innerText = msg;
  chatMsgs.append(div);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;

  //show newMsg alert if the chatBox is not shown
  if(!chatShown) {
    let newMsgCounter = document.querySelector('.newMsgsCount');
    newMsgsCount ++;
    newMsgCounter.style.display = 'block';
    newMsgCounter.innerText = newMsgsCount;
    chatBtn.firstElementChild.style.color = "#2014daab";
    chatBtn.firstElementChild.style.animation = "shake 3s ease";
  }
});

socket.on('notActive', () => {
  let isActive = document.querySelector('.is-active');
  let inactive = document.querySelector('.inactive');
  isActive.style.color = "red";
  inactive.style.display = "block";
});

let form = document.querySelector('.msg-form');
form.onsubmit = event => {
  event.preventDefault();
  let msg = document.querySelector('.msg-field').value;
  socket.emit('newMsg', {uuid, msg});

  //display your msg
  let div = document.createElement('div');
  div.classList.add('msg');
  div.classList.add('myMsg');
  div.innerText = msg;
  chatMsgs.append(div);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
  form.reset();
}
