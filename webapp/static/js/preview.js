var curr_index = 0;

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
      "",
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
    img.src = imgs[curr_index]["original"];
    imgs[curr_index]["src"] = "original";
    enhanceBtn.tite = "enhance";
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
