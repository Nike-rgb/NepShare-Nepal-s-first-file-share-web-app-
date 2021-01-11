import axios from 'axios';

let background1 = document.querySelector('.background1');
let background2 = document.querySelector('.background2');
let background3 = document.querySelector('.background3');
let bgContainer = document.querySelector('.backgroundContainer');
let dropZone = document.querySelector('.drop-zone');
let browse = document.querySelector('.browse');
let browseBtn = document.querySelector('.browseBtn');
let uploadForm = document.querySelector('.upload-form')
let progressBar = document.querySelector('.progress');
let uploadMore = document.querySelector('.upload-more');

//making sure the viewport size remains constant on opening the keyboard
document.documentElement.onresize = e => {
  e.currentTarget.style.setProperty('overflow', 'auto');
  const metaViewport = document.querySelector('meta[name=viewport]')
  metaViewport.setAttribute('content', 'height=' + 100 + 'vh, width=device-width, initial-scale=1.0');
}

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


//listening for drag over dropzone
dropZone.addEventListener('dragover', dragHandler);
function dragHandler (e){
  e.preventDefault();
  if(!dropZone.classList.contains('dragged')) dropZone.classList.add('dragged');
}

dropZone.addEventListener('dragleave', dragLeaveHandler);
function dragLeaveHandler(e) {
  e.preventDefault();
  dropZone.classList.remove('dragged');
}

dropZone.addEventListener('drop', dropHandler);
function dropHandler(e) {
  e.preventDefault();
  if(e.dataTransfer.files.length) browse.files = e.dataTransfer.files;
  browse.dispatchEvent(new Event('change'));
  dropZone.classList.remove('dragged');
};

browseBtn.onclick = () => {  //on clicking on browse
  browse.click();
}

//function to display error
function showError(msg) {
  let div = document.createElement('div');
  div.innerText = msg;
  div.className = "error-msg";
  document.body.append(div);
  setTimeout(() => div.remove(), 3000);
}

browse.onchange = () => {
  progressBar.style.opacity = "1"; //display the progress bar

  const xhr = new XMLHttpRequest();  //to send file with ajax
  //to track upload progress
  xhr.upload.onprogress = (event) => {
    let widthPercent = event.loaded / event.total * 90;
    progressBar.firstElementChild.style.width = widthPercent + '%';
  }

  //after the response is Received
  xhr.onload = () => {
    uploadMore.style.display = "block";
    //perform cleanups

    //removing what drop on dropzone does
    dropZone.removeEventListener('drop', dropHandler);
    dropZone.removeEventListener('dragover', dragHandler);
    dropZone.removeEventListener('dragleave', dragLeaveHandler);

    progressBar.style.opacity = 0;
    setTimeout(() => {
      progressBar.firstElementChild.style.width = "1%";
    }, 2500);

    //handle the download page link in response
    if(xhr.response.error) return showError(xhr.response.error);
    let {uuid, downloadPageLink} = xhr.response;
    let markup = `
      <div class="uuid" style="display : none">${uuid}</div>
      <i style="color : black ; padding : 10px; font-size : 45px;" class="is-active fas fa-user"></i>
      <input class="copy-link" style="display : block; position : relative; top : 25px; left : 3%; width : 90%; color : white; background : black; padding : 10px; margin-top : 20px; font-size : 14px;" value="${xhr.response.downloadPageLink}">
        <div class="copy-instruction">Copy & send the link below (you can email too right here) to the receiver. You can also chat after s/he visits the link(icon turn green).</div>
      <button id="execCopy" style="position: absolute; left: 42%; top: 82%;">Copy</button>
    `;
    dropZone.innerHTML = markup;

    //add socket.io handling script
    let script = document.createElement('script');
    script.src = "/js/socket.io.js";
    document.head.append(script);
  }

  //send the files
  let formData = new FormData(uploadForm);
  xhr.open('POST', '/api/file-upload');
  xhr.responseType = "json";
  xhr.send(formData);
}
