var curr_index = 0;

const displayImages = ()=>{
    let view = document.getElementById("preview-window");
    if(imgs.length>0){
        imgs.forEach((img,index) => {
            let newImgDiv = document.createElement("div");
            view.appendChild(newImgDiv);
            newImgDiv.setAttribute("class","images");
            let imgSpan = document.createElement("span");
            newImgDiv.appendChild(imgSpan);
            let newImg = document.createElement("img");
            imgSpan.appendChild(newImg);
            newImg.setAttribute("src",img['src']);
            newImg.onclick = () => {expandImage(img,index)};
        });
    }
    else{
        view.innerHTML = "<button title = 'open camera' id='back-btn' onclick= 'location.reload()'><i class='fa fa-camera' aria-hidden='true'></i></button>"
        view.style.position = "absolute";
        view.style.top = 0;
        view.style.left = 0;
    }
};

const expandImage = (img,index) => {
    
    let container = document.body;
    let expandedWindow = document.createElement("div");
    container.append(expandedWindow);
    expandedWindow.setAttribute("class","img-window");

    let expandedImg = document.createElement("img");
    expandedWindow.appendChild(expandedImg);
    expandedImg.setAttribute("src",img["src"]);  
    expandedImg.setAttribute("id","current");  
    curr_index = index;

    expandedImg.onload = () => {
        const w = window.innerWidth;
        let imgWidth = $(expandedImg).width();
        let calcImgToEdge = Math.ceil((w - imgWidth) / 2) - 60;

        createButton(
            expandedWindow,
            "next", 
            "changeImg("+index+",1)", 
            "fa fa-arrow-right", 
            "top:48vh;right: "+calcImgToEdge+"px;"
        );
        createButton(
            expandedWindow,
            "prev", 
            "changeImg("+index+",-1)", 
            "fa fa-arrow-left", 
            "top:48vh;left: "+calcImgToEdge+"px;"
        );
        createButton(
            expandedWindow,
            "close-image", 
            "closeImg()", 
            "fa fa-close", 
            "top:10vh;right: "+calcImgToEdge+"px;"
        );
        createButton(
            expandedWindow,
            "close-image", 
            "", 
            "fa fa-crop", 
            "top:17vh;right: "+calcImgToEdge+"px;"
        );
        createButton(
            expandedWindow,
            "close-image", 
            "", 
            "fa fa-adjust", 
            "top:24vh;right: "+calcImgToEdge+"px;"
        );
        createButton(
            expandedWindow,
            "close-image", 
            "delImg("+index+")", 
            "fa fa-trash", 
            "top:31vh;right: "+calcImgToEdge+"px;"
        );
    };
};

const closeImg = () => {
    document.querySelector(".img-window").remove();
    document.querySelectorAll(".img-window .btn").forEach(()=>{this.remove();});
};

const createButton = (container, name, click, i, css)=>{
    let btn = document.createElement("button");
    container.appendChild(btn);
    btn.setAttribute("class","btn");
    btn.setAttribute("title",name);
    btn.setAttribute("id",name);
    btn.setAttribute("onclick",""+click);
    let icon = document.createElement("i");
    btn.appendChild(icon);
    icon.setAttribute("class",i);
    icon.setAttribute("aria-hidden","true");
    btn.style.cssText = ""+css;
};

const changeImg = (index, command) => {
    let newindex  = (imgs.length + curr_index + command) % imgs.length;
    document.querySelector("#current").remove();
    let nextWin = document.querySelector(".img-window");
    let nextImg = document.createElement("img");
    nextWin.appendChild(nextImg);
    nextImg.setAttribute("src",imgs[newindex]["src"]);  
    nextImg.setAttribute("id","current");
    curr_index=newindex;
};

const download =async()=>{
    let loader = document.querySelector("#loading");
    loader.style.display = "block";
    let fileName = document.querySelector(".fileinfo input[type=text]");
    let doc = new jsPDF('p', 'px', [2480, 3508], true);
    let pageWidth = 2480;
    let pageHeight = 3508;
    document.querySelectorAll(".main-window .images img").forEach((img)=>{
        let iw = img.naturalWidth;
        let ih = img.naturalHeight;
        let aratio = 1;
        if(iw > ih){
            aratio = (iw/ih).toFixed(2);
            iw = img.naturalWidth > pageWidth ? pageWidth - 20 : img.naturalWidth;
            ih = Math.floor(iw / aratio);
        }
        else{
            aratio = (ih/iw).toFixed(2);
            ih = img.naturalHeight > pageHeight ? pageHeight - 20 : img.naturalHeight;
            iw = Math.floor(ih / aratio);
        }
        let x = Math.round((pageWidth - iw)/2);
        let y = Math.round((pageHeight - ih)/2);
        doc.addImage(img.src, "PNG", x, y, iw, ih, '', 'FAST');
        doc.addPage();
    });
    doc.deletePage(doc.internal.getNumberOfPages());
    doc.save(fileName.value);
    loader.style.display="none";
};

const delImg = (index) => {
    document.querySelector(".img-window").remove();
    document.querySelectorAll(".img-window .btn").forEach(()=>{this.remove();});
    document.getElementById("preview-window").innerHTML="";
    imgs.splice(index, 1);
    displayImages();
}