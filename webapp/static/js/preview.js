var curr_index = 0;

const createNavBar = () => {
    let navBar = document.querySelector(".fileinfo");
    let nameBar = document .createElement("input");
    navBar.appendChild(nameBar);
    nameBar.setAttribute("type", "text");
    nameBar.value = "freedocscanner.png"
    let download = document.createElement("button");
    navBar.appendChild(download);
    download.setAttribute("class","btn");
    let icon = document.createElement("i");
    download.appendChild(icon);
    icon.setAttribute("class","fa fa-arrow-right");
    icon.setAttribute("aria-hidden","true");
};

const displayImages = ()=>{
    createNavBar();
    let view = document.getElementById("preview-window");
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
        let calcImgToEdge = ((w - imgWidth) / 2)-60;

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