feather.replace();

const controls = document.querySelector('.controls');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.getElementById('ss');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;
var imgs = new Array();
var mask = document.getElementById("mask");
const livefeed = document.getElementById('corners');

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
  imgs = new Array();
  handleStream(stream);
};

const handleStream = (stream) => {
  video.srcObject = stream;
  play.classList.add('d-none');
  screenshot.classList.remove('d-none');
  streamStarted = true;
};

$(function(){
  window.setInterval(function(){
    realTimeDocScan()
  }, 1000/24)

  function realTimeDocScan(){
    const curr = currentFrame();
    $.ajax({
      url:"/livefeed",
      type:"POST",
      dataType:"json",
      data:{frame:curr},
      success: function(data){
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
  screenshotImage.src = currentFrame();
  imgs.push(screenshotImage.src);
  screenshotImage.classList.remove('d-none');
};

screenshot.onclick = doScreenshot;
screenshotImage.onclick = ()=>{
  console.log("clicked");
  console.log(imgs);
};