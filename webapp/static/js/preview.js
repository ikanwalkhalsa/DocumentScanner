var curr_index = 0;
var points = ["0px 0px", "100% 0px", "100% 100%", "0px 100%"];

const displayImages = () => {
  let view = document.getElementById("preview-window");
  if (imgs.length > 0) {
    imgs.forEach((img, index) => {
      let newImgDiv = document.createElement("div");
      view.appendChild(newImgDiv);
      newImgDiv.setAttribute("class", "images");
      let imgSpan = document.createElement("span");
      newImgDiv.appendChild(imgSpan);
      let newImg = document.createElement("img");
      imgSpan.appendChild(newImg);
      newImg.setAttribute("src", img[img["src"]]);
      newImg.onclick = () => {
        expandImage(img, index);
      };
    });
  } else {
    view.innerHTML =
      "<button title = 'open camera' id='back-btn' onclick= 'location.reload()'><i class='fa fa-camera' aria-hidden='true'></i></button>";
    view.style.position = "absolute";
    view.style.top = 0;
    view.style.left = 0;
  }
};

const expandImage = (img, index) => {
  let container = document.body;
  let expandedWindow = document.createElement("div");
  container.append(expandedWindow);
  expandedWindow.setAttribute("class", "img-window");

  let expandedImg = document.createElement("img");
  expandedWindow.appendChild(expandedImg);
  expandedImg.setAttribute("src", img[img["src"]]);
  expandedImg.setAttribute("id", "current");
  curr_index = index;

  let loader = document.createElement("div");
  loader.setAttribute("class","processing");
  expandedWindow.appendChild(loader);

  expandedImg.onload = () => {
    const w = window.innerWidth;
    let imgWidth = $(expandedImg).width();
    let calcImgToEdge = Math.ceil((w - imgWidth) / 2) - 60;

    createButton(
      expandedWindow,
      "next",
      "changeImg(" + index + ",1)",
      "fa fa-arrow-right",
      "top:48vh;right: " + calcImgToEdge + "px;"
    );
    createButton(
      expandedWindow,
      "prev",
      "changeImg(" + index + ",-1)",
      "fa fa-arrow-left",
      "top:48vh;left: " + calcImgToEdge + "px;"
    );
    createButton(
      expandedWindow,
      "close",
      "closeImg()",
      "fa fa-close",
      "top:10vh;right: " + calcImgToEdge + "px;"
    );
    createButton(
      expandedWindow,
      "crop",
      "cropImg()",
      "fa fa-crop",
      "top:17vh;right: " + calcImgToEdge + "px;"
    );
    createButton(
      expandedWindow,
      "enhance",
      "enhanceImg(" + index + ")",
      "fa fa-adjust",
      "top:24vh;right: " + calcImgToEdge + "px;"
    );
    createButton(
      expandedWindow,
      "delete",
      "delImg(" + index + ")",
      "fa fa-trash",
      "top:31vh;right: " + calcImgToEdge + "px;"
    );
  };
};

const closeImg = () => {
  document.querySelector(".img-window").remove();
  document.querySelectorAll(".img-window .btn").forEach(() => {
    this.remove();
  });
  document.getElementById("preview-window").innerHTML = "";
  displayImages();
};

const createButton = (container, name, click, i, css) => {
  let btn = document.createElement("button");
  container.appendChild(btn);
  btn.setAttribute("class", "btn");
  btn.setAttribute("title", name);
  btn.setAttribute("id", name);
  btn.setAttribute("onclick", "" + click);
  let icon = document.createElement("i");
  btn.appendChild(icon);
  icon.setAttribute("class", i);
  icon.setAttribute("aria-hidden", "true");
  btn.style.cssText = "" + css;
};

const changeImg = (index, command) => {
  let newindex = (imgs.length + curr_index + command) % imgs.length;
  document.querySelector("#current").remove();
  let nextWin = document.querySelector(".img-window");
  let nextImg = document.createElement("img");
  nextWin.appendChild(nextImg);
  nextImg.setAttribute("src", imgs[newindex][imgs[newindex]["src"]]);
  nextImg.setAttribute("id", "current");
  curr_index = newindex;
  nextImg.onload = () => {
    let calcImgToEdge = Math.ceil((window.innerWidth - nextImg.width) / 2) - 60;
    document.querySelector("#prev").style.cssText = "top:48vh;left: " + calcImgToEdge + "px;";
    document.querySelector("#next").style.cssText = "top:48vh;right: " + calcImgToEdge + "px;";
    document.querySelector("#close").style.cssText = "top:10vh;right: " + calcImgToEdge + "px;";
    document.querySelector("#enhance").style.cssText = "top:24vh;right: " + calcImgToEdge + "px;";
    document.querySelector("#crop").style.cssText = "top:17vh;right: " + calcImgToEdge + "px;";
    document.querySelector("#delete").style.cssText = "top:31vh;right: " + calcImgToEdge + "px;";
  };
};

const download = async () => {
  let loader = document.querySelector(".loading");
  loader.style.display = "block";
  let fileName = document.querySelector(".fileinfo input[type=text]");
  let doc = new jsPDF("p", "px", [2480, 3508], true);
  let pageWidth = 2480;
  let pageHeight = 3508;
  document.querySelectorAll(".main-window .images img").forEach((img) => {
    let iw = img.naturalWidth;
    let ih = img.naturalHeight;
    let aratio = 1;
    if (iw > ih) {
      aratio = (iw / ih).toFixed(2);
      iw = pageWidth - 200;
      ih = Math.floor(iw / aratio);
    } else {
      aratio = (ih / iw).toFixed(2);
      ih = pageHeight - 200;
      iw = Math.floor(ih / aratio);
    }
    let x = Math.round((pageWidth - iw) / 2);
    let y = Math.round((pageHeight - ih) / 2);
    doc.addImage(img.src, "PNG", x, y, iw, ih, "", "FAST");
    doc.addPage();
  });
  doc.deletePage(doc.internal.getNumberOfPages());
  doc.save(fileName.value);
  loader.style.display = "none";
};

const delImg = (index) => {
  document.querySelector(".img-window").remove();
  document.querySelectorAll(".img-window .btn").forEach(() => {
    this.remove();
  });
  document.getElementById("preview-window").innerHTML = "";
  imgs.splice(index, 1);
  displayImages();
};

const enhanceImg = (index) => {
  let processing = document.querySelector(".processing");
  let enhanceBtn = document.querySelector("#enhance");
  let img = document.querySelector("#current");
  processing.style.top = img.offsetTop+"px";
  processing.style.left = img.offsetLeft+"px";
  processing.style.width = img.offsetWidth+"px";
  processing.style.height = img.offsetHeight+"px";
  processing.style.display = "flex";
  if (imgs[curr_index]["src"] == "enhanced") {
    if(imgs[curr_index]['cropped']){
      img.src = imgs[curr_index]["cropped"];
      imgs[curr_index]["src"] = "cropped";
      enhanceBtn.tite = "enhance";
    }
    else{
      img.src = imgs[curr_index]["original"];
      imgs[curr_index]["src"] = "original";
      enhanceBtn.tite = "enhance";
    }
  } else {
    if (imgs[curr_index]["enhanced"]) {
      img.src = imgs[curr_index]["enhanced"];
      imgs[curr_index]["src"] = "enhanced";
    } else {
      $.ajax({
        url: "enhance",
        type: "post",
        dataType: "json",
        data: { doc: img.src },
        success: (data) => {
          img.src = data["enhanced"];
          imgs[curr_index]["enhanced"] = data["enhanced"];
          imgs[curr_index]["src"] = "enhanced";
        },
      });
    }
    enhanceBtn.title = "original";
  }
  enhanceBtn.blur();
  processing.style.display="none";
};

const cropImg = () =>{

  

  document.querySelectorAll(".img-window .btn").forEach((btn)=>{
    btn.style.display = "none";
  });
  
  let extendedWindow = document.querySelector(".img-window");
  createButton(
    extendedWindow,
    "exit",
    "exitCrop()",
    "fa fa-close",
    "top:1.5vh;left:43vw;"
  );
  createButton(
    extendedWindow,
    "done",
    "crop()",
    "fa fa-check",
    "top:1.5vh;left:50vw;"
  );

  let mask = document.createElement("div");
  mask.setAttribute("id","cropper");
  extendedWindow.appendChild(mask);
  img = document.querySelector("#current");
  img.src = imgs[curr_index]['original'];
  
  
  img.onload = () => {
    
    mask.style.width = img.width+"px";
    mask.style.height = img.height+"px";
    mask.style.top = img.offsetTop+"px";
    mask.style.left = img.offsetLeft+"px";

    let topleft = document.createElement("div");
    mask.appendChild(topleft);
    topleft.setAttribute("id", "tl");
    topleft.setAttribute("class", "point");
    topleft.style.top = 0;
    topleft.style.left = 0;
    topleft.onmousedown = tlmove;

    let topright = document.createElement("div");
    mask.appendChild(topright);
    topright.setAttribute("id", "tr");
    topright.setAttribute("class", "point");
    topright.style.top = 0;
    topright.style.left = "" + img.width - topright.offsetWidth + "px";
    topright.onmousedown = trmove;

    let bottomleft = document.createElement("div");
    mask.appendChild(bottomleft);
    bottomleft.setAttribute("id", "bl");
    bottomleft.setAttribute("class", "point");
    bottomleft.style.top = "" + img.height - bottomleft.offsetHeight + "px";
    bottomleft.style.left = 0;
    bottomleft.onmousedown = blmove;

    let bottomright = document.createElement("div");
    mask.appendChild(bottomright);
    bottomright.setAttribute("id", "br");
    bottomright.setAttribute("class", "point");
    bottomright.style.top =
      "" + img.height - bottomright.offsetHeight + "px";
    bottomright.style.left = "" + img.width - bottomright.offsetWidth + "px";
    bottomright.onmousedown = brmove;

    if(imgs[curr_index]['cropcoords']){
      let tl = document.querySelector("#tl");
      let tr = document.querySelector("#tr");
      let bl = document.querySelector("#bl");
      let br = document.querySelector("#br");
      points = imgs[curr_index]['cropcoords'];
      mask.style.webkitClipPath ="polygon(" +points[0] +"," +points[1] +"," +points[2] +"," +points[3] +")";
      let coords = []
      points.forEach((pt)=>{
        pt1=[]
        xy = pt.split(" ");
        pt1[0] = Math.round(xy[0].includes("px")?xy[0].slice(0,-2):img.width*(xy[0].slice(0,-1)/100));
        pt1[1] = Math.round(xy[1].includes("px")?xy[1].slice(0,-2):img.height*(xy[1].slice(0,-1)/100));
        coords.push(pt1);
      });

      tl.style.left = coords[0][0]+"px";
      tl.style.top = coords[0][1]+"px";
      tr.style.left = (coords[1][0] - tr.offsetWidth)+"px";
      tr.style.top = coords[1][1]+"px";
      br.style.left = (coords[2][0] - br.offsetWidth)+"px";
      br.style.top = (coords[2][1] - br.offsetHeight)+"px";
      bl.style.left = coords[3][0]+"px";
      bl.style.top = (coords[3][1] - br.offsetHeight)+"px";
    }
  }

  function move(x,y, point, cr) {
        let top =
          y -
          (window.innerHeight - cr.offsetHeight) / 2 -
          point.offsetHeight / 2;
        let left =
          x -
          (window.innerWidth - cr.offsetWidth) / 2 -
          point.offsetWidth / 2;
        if (top < 0) top = 0;
        if (top > cr.offsetHeight - point.offsetHeight)
          top = cr.offsetHeight - point.offsetHeight;
        if (left < 0) left = 0;
        if (left > cr.offsetWidth - point.offsetWidth)
          left = cr.offsetWidth - point.offsetWidth;
        point.style.top = "" + top + "px";
        point.style.left = "" + left + "px";
        return [left, top];
      }

      function tlmove(e) {
        var tl = document.querySelector("#tl");
        var cr = document.querySelector("#cropper");
        let moveEvent = (e) => {
          point = move(e.clientX,e.clientY, tl, cr);
          points[0] = "" + point[0] + "px " + point[1] + "px";
          cr.style.webkitClipPath =
            "polygon(" +
            points[0] +
            "," +
            points[1] +
            "," +
            points[2] +
            "," +
            points[3] +
            ")";
        };
        moveEvent(e);
        document.addEventListener("mousemove", moveEvent);
        tl.onmouseup = function () {
          document.removeEventListener("mousemove", moveEvent);
          tl.onmouseup = null;
        };
        tl.ondragstart = function () {
          return false;
        };
      }

      function trmove(e) {
        var tr = document.querySelector("#tr");
        var cr = document.querySelector("#cropper");
        let moveEvent = (e) => {
          point = move(e.clientX,e.clientY, tr, cr);
          points[1] =
            "" + (point[0] + tr.offsetWidth) + "px " + point[1] + "px";
          cr.style.webkitClipPath =
            "polygon(" +
            points[0] +
            "," +
            points[1] +
            "," +
            points[2] +
            "," +
            points[3] +
            ")";
        };
        moveEvent(e);
        document.addEventListener("mousemove", moveEvent);
        tr.onmouseup = function () {
          document.removeEventListener("mousemove", moveEvent);
          tr.onmouseup = null;
        };
        tr.ondragstart = function () {
          return false;
        };
      }

      function blmove(e) {
        var bl = document.querySelector("#bl");
        var cr = document.querySelector("#cropper");
        let moveEvent = (e) => {
          point = move(e.clientX,e.clientY, bl, cr);
          points[3] =
            "" + point[0] + "px " + (point[1] + bl.offsetHeight) + "px";
          cr.style.webkitClipPath =
            "polygon(" +
            points[0] +
            "," +
            points[1] +
            "," +
            points[2] +
            "," +
            points[3] +
            ")";
        };
        moveEvent(e);
        document.addEventListener("mousemove", moveEvent);
        bl.onmouseup = function () {
          document.removeEventListener("mousemove", moveEvent);
          bl.onmouseup = null;
        };
        bl.ondragstart = function () {
          return false;
        };
      }

      function brmove(e) {
        var br = document.querySelector("#br");
        var cr = document.querySelector("#cropper");
        let moveEvent = (e) => {
          point = move(e.clientX,e.clientY, br, cr);
          points[2] =
            "" +
            (point[0] + bl.offsetWidth) +
            "px " +
            (point[1] + bl.offsetHeight) +
            "px";
          cr.style.webkitClipPath =
            "polygon(" +
            points[0] +
            "," +
            points[1] +
            "," +
            points[2] +
            "," +
            points[3] +
            ")";
        };
        moveEvent(e);
        document.addEventListener("mousemove", moveEvent);
        br.onmouseup = function () {
          document.removeEventListener("mousemove", moveEvent);
          br.onmouseup = null;
        };
        br.ondragstart = function () {
          return false;
        };
      }
}

const exitCrop = ()=>{
  document.querySelector("#current").src=imgs[curr_index][imgs[curr_index]['src']]
  document.querySelector("#exit").remove();
  document.querySelector("#done").remove();
  document.querySelector("#cropper").remove();
  document.querySelectorAll(".img-window .btn").forEach((btn)=>{
      btn.style.display = "block";
  });
}

const crop = ()=>{
  let processing = document.querySelector(".processing");
  let img = document.querySelector("#current");
  processing.style.top = img.offsetTop+"px";
  processing.style.left = img.offsetLeft+"px";
  processing.style.width = img.offsetWidth+"px";
  processing.style.height = img.offsetHeight+"px";
  processing.style.display = "flex";
  let imnw = img.naturalWidth;
  let imnh = img.naturalHeight;
  let imw = img.width;
  let imh = img.height;
  imgs[curr_index]['cropcoords'] = points;
  let coords = []
  points.forEach((pt)=>{
    pt1=[]
    xy = pt.split(" ");
    pt1[0] = Math.round(xy[0].includes("px")?imnw * (xy[0].slice(0,-2)/imw):imnw*(xy[0].slice(0,-1)/100));
    pt1[1] = Math.round(xy[1].includes("px")?imnh * (xy[1].slice(0,-2)/imh):imnh*(xy[1].slice(0,-1)/100));
    coords.push(pt1);
  });
  $.ajax({
    type:"POST",
    url:"crop",
    dataType:"json",
    data:{croppts:coords,src:imgs[curr_index]['original']},
    success:function(data){
      img.src=data['data_uri'];
      imgs[curr_index]['cropped'] = img.src;
      imgs[curr_index]['src']='cropped';
      imgs[curr_index]['enhanced']=null;
      exitCrop();
      img.onload = () => {
        let calcImgToEdge = Math.ceil((window.innerWidth - img.width) / 2) - 60;
        document.querySelector("#prev").style.cssText = "top:48vh;left: " + calcImgToEdge + "px;";
        document.querySelector("#next").style.cssText = "top:48vh;right: " + calcImgToEdge + "px;";
        document.querySelector("#close").style.cssText = "top:10vh;right: " + calcImgToEdge + "px;";
        document.querySelector("#enhance").style.cssText = "top:24vh;right: " + calcImgToEdge + "px;";
        document.querySelector("#crop").style.cssText = "top:17vh;right: " + calcImgToEdge + "px;";
        document.querySelector("#delete").style.cssText = "top:31vh;right: " + calcImgToEdge + "px;";
      }
    }
  });
  processing.style.display = "none";
}