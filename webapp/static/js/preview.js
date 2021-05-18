img_models = [];
for(let i = 0; i < imgs.length; i++){
    img_models.push({
        index : i,
        enhansed : false,
        cropcoord : null,
        cropped_img : null,
        src : imgs[i],
    });
}
console.log(img_models);