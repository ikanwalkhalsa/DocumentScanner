const controls = document.querySelector('.controls');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.getElementById('ss');
const buttons = [...controls.querySelectorAll('button')];
const livefeed = document.getElementById('corners');
var mask = document.getElementById("mask");
let streamStarted = false;
let camera = true;
var imgs = new Array();



const [play, screenshot] = buttons;

const constraints = {
  video: {
    width: {
      min: 480,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 360,
      ideal: 1080,
      max: 1440
    },
    facingmode: "environment"
  }
};


play.onclick = () => {
  if (streamStarted) {
    video.play();
    play.classList.add('d-none');
    return;
  }
  startStream(constraints);
};

const startStream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  window.localstream = stream;
  handleStream(stream);
};

const handleStream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  screenshot.classList.remove('d-none');
  streamStarted = true;
};

$(function(){
  let feed = window.setInterval(function(){
    if(camera){
      if(streamStarted)
        realTimeDocScan();
    }
    else
      window.clearInterval(feed);
  }, 1000/2)

  function realTimeDocScan(){
    curr = currentFrame();
    const frames = new Array();
    frames.push(curr);
    $.ajax({
      url:"/livefeed",
      type:"POST",
      dataType:"json",
      data:{"frame":curr},
      success: function(data){
        delete frames;
        livefeed.src=data['data_uri'];
      }
    });
  }
});

currentFrame = ()=>{
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  return canvas.toDataURL('image/jpg');
}

const doScreenshot = () => {
  if (livefeed.src[0] != 'd')
    screenshotImage.src = currentFrame();
  else
    screenshotImage.src = livefeed.src;
  imgs.push({
    cropCoords : null,
    croppedImg : null,
    enhanced : null,
    original : screenshotImage.src,
    src: 'original',
  });
  screenshotImage.classList.remove('d-none');
};

screenshot.onclick = doScreenshot;
screenshotImage.onclick = async ()=>{
  window.localstream.getTracks().forEach(function(track) {
    if (track.readyState == 'live') {
        track.stop();
    }
  });
  camera = false;
  $.ajax({
    url:"/preview",
    type:"POST",
    dataType:"json",
    success: function(data){
      $(mainblock).replaceWith(data);
      displayImages();
    }
  });
};