let background1 = document.querySelector('.background1');
let background2 = document.querySelector('.background2');
let background3 = document.querySelector('.background3');
let bgContainer = document.querySelector('.backgroundContainer');
let downloadBox = document.querySelector('.download-box');
let moreFiles = document.querySelector('.more-files');

let counter = 0;
setInterval(() => {
  counter ++;
  if(counter == 3) counter = 0;
  switch (counter) {
    case 0 : {
      background1.style.zIndex = "0";
      background2.style.zIndex = "-2";
      background3.style.zIndex = "-2";

      background1.style.opacity = "1";
      background2.style.opacity = "0";
      background3.style.opacity = "0";
      break;
    }

    case 1 : {
      background2.style.zIndex = "0";
      background1.style.zIndex = "-2";
      background3.style.zIndex = "-2";

      background2.style.opacity = "1";
      background3.style.opacity = "0";
      background1.style.opacity = "0";
      break;
    }

    case 2 : {
      background3.style.zIndex = "0";
      background1.style.zIndex = "-2";
      background2.style.zIndex = "-2";

      background3.style.opacity = "1";
      background1.style.opacity = "0";
      background2.style.opacity = "0";
      break;
    }
  }
}, 40000);

import {socket} from './chat.js';
import axios from 'axios';
const uuid = document.querySelector('.uuid').innerText;
socket.emit('join', uuid); //joining the same room as sender
socket.emit('active', uuid);//send active signal to the sender
document.querySelector('.chat-btn').style.display = "block"; //displaying the chat button

//for more incoming files
socket.on('moreFiles', number => {
  moreFiles.style.display = "block";
  moreFiles.children[1].innerText = `${number} incoming files...`;
});

//once more files sending finishes
socket.on('moreReceived', () => {
  moreFiles.style.display = ""; //cleanups
  //query the database and fetch the uploaded files
  axios.post('/files/fetch-more-files', {uuid}).then(res => {
    let newFiles = res.data.newFiles;
    newFiles.forEach(file => {
      let markup = `
        <li>File name : ${file.fileOriginalName} </li>
        <li> File size : ${(file.fileSize / 2 ** 20).toFixed(3)} MB </li>
        <a class="download-btn" href="${file.downloadLink}"><i class="fas fa-download"></i></a>
      `;
      let ul = document.createElement('ul');
      ul.innerHTML = markup;
      downloadBox.append(ul);
    });
  });
});
