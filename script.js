const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

//global variables w default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () =>{
    //set canvas height and width offsetwidth and height returns viewable w/h of element
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
setCanvasBackground();
});

const drawRect = (e) => {
    if(!fillColor.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY); //strokeRect() method draws a rectangle 
        //(no fill) by taking strokeRect(x, y, width, height) for rect
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY); 
}

const drawCircle = (e) => { //arc() draws a circle (x, y, radius, start angle, end angle)
    ctx.beginPath();
    //gets radius of circle based on mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2)+Math.pow((prevMouseY - e.offsetY), 2));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2*Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillcolor is checked fill circle else draw border of circle
 }

const drawTriangle = (e) => {
    ctx.beginPath(); //creates new path to draw triangle
    ctx.moveTo(prevMouseX, prevMouseY); //moves triangle to mouse ptr
    ctx.lineTo(e.offsetX, e.offsetY); //creates first line according to mouse ptr
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //bottom line of triangle
    ctx.closePath(); //closing path of a triangle so the last line draws automatically
    fillColor.checked ? ctx.fill() : ctx.stroke(); //if fillcolor is checked fill triangle else draw border of triangle
}

/**
 * //draw straight line :) add feature
 * const drawLine = (e) => {
    ctx.beginPath(); //creates new path to draw triangle
    ctx.moveTo(prevMouseX, prevMouseY); //moves triangle to mouse ptr
    lineTo(e.offsetX, e.offsetY); //creates first line according to mouse ptr
    ctx.stroke();
}
 */

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; //pass current mouseX position as prevMouseX val
    prevMouseY = e.offsetY; // same ^^
    ctx.beginPath(); //creating new path to draw
    ctx.lineWidth = brushWidth; // passes brushSize as line width
    ctx.strokeStyle = selectedColor; //pass slected color as stroke style
    ctx.fillStyle = selectedColor; //same ^^ for fillstyle
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height); // copies canvas data and passes as snapshot value which wont drag the image (like rectangle)
}

const drawing = (e) => { //lineTo() method creates new line..
    if(!isDrawing) return; //if isDrwing is false return from this pt
    ctx.putImageData(snapshot, 0, 0); //adds copied canvas data onto the canvas
    if(selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor; // if selected tool is eraser then 
        //set stroke style to white to paint white on canvas, else set the stroke color to selected color
        ctx.lineTo(e.offsetX, e.offsetY); // offsetX and Y returns coordinates of the mouse ptr
        ctx.stroke(); //draws line w color
    }
    else if (selectedTool === "rectangle"){
        drawRect(e);
    }
    else if (selectedTool === "circle"){
        drawCircle(e);
    }
    else {
        drawTriangle(e);
    }
}
    

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adds click event to all tool options
        document.querySelector(".options .active").classList.remove("active"); //removes active class from previous option and adds to current clicked option
        btn.classList.add("active");
        selectedTool = btn.id; //passing slected tool id as slectedtool value
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); //passing slider value as brushSlider

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { //adds click event to all color buttons
        document.querySelector(".options .selected").classList.remove("selected"); //removes active class from previous option and adds to current clicked option
        btn.classList.add("selected");
       selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color"); //passes selected cbtn background as selected color val
    });
});

colorPicker.addEventListener("change", () => {
    //pass picked color val from color picker to last btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clears canvas
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
   const link = document.createElement("a"); // creates <a> element
   link.download = `${Date.now()}.jpg`; // passes current date as link download val
   link.href = canvas.toDataURL(); //passes canvasData as link href value
   link.click(); // click link to download image
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);