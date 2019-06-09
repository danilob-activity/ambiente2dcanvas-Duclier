document.getElementById("info-object").style.display = "none";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = window.innerWidth;
const HEIGHT = window.outerHeight;

canvas.width = WIDTH;
canvas.height = HEIGHT;
//faz o desenho do triângulo

var flag = 0 ;

var objects = []; //lista de objetos
var objectSelected = null;

function drawCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (var i = 0; i < objects.length; i++) {
        objects[i].draw();
    }
    drawAxis();
}


function drawAxis() {
    ctx.strokeStyle = "#f3c1c6";
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.setLineDash([1, 1]);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);


}

window.addEventListener("load", drawCanvas);

function pushBox() {
    var obj = new Box();
    objects.push(obj);
    objectSelected = objects[objects.length - 1];
    updateDisplay(objectSelected);
    document.getElementById("info-object").style.display = "block";
    drawCanvas();

}



function checkCollisions(event){
    
    for (var i = 0; i < objects.length; i++) {
       var test = objects[i].intersection(event.offsetX,event.offsetY);
       if(test){
         
            objectSelected = objects[i];
           
            objectSelected.setStroke("green");
            drawCanvas();
            break;
        }
    };
}
function mouseDown(event){
    //console.log("Down,  "  +event.offsetX, event.offsetY);
    for (var i = 0; i < objects.length; i++) {
       var test = objects[i].intersection(event.offsetX,event.offsetY);
       if(test){
            //console.log("test entrou");
            objectSelected = objects[i];
            //console.log(objectSelected);
            objectSelected.stroke = "green";
            flag = 1 ;
            drawCanvas();
            break;
        }
    };
}
function mouseUp(event){
   
    objectSelected.stroke = objectSelected.original_stroke;
    flag = 0 ;
    
    drawCanvas();
}
function mouseMove(event){
    
    if(flag == 1){
        //console.log("asd");
        var x = event.offsetX;
        var y = event.offsetY;

        
        var position = multVec(transformUsual(WIDTH,HEIGHT), [x,y,1]);

        objectSelected.setTranslate(position[0], position[1]);
        
        drawCanvas();
    }

}


function pushCircle() {
    var obj = new Circle();
    objects.push(obj);
    objectSelected = objects[objects.length - 1];
    updateDisplay(objectSelected);
    document.getElementById("info-object").style.display = "block";
    drawCanvas();
}

function updateDisplay(objectSelected) {
    document.getElementById("posx").value = objectSelected.getTranslate()[0];
    document.getElementById("posy").value = objectSelected.getTranslate()[1];
}

function updatePosition() {
    if (objectSelected != null) {
        try {
            posx = parseFloat(document.getElementById("posx").value);
            posy = parseFloat(document.getElementById("posy").value);
            angle = parseFloat(document.getElementById("angle").value);
            scale_x = parseFloat(document.getElementById("scale_x").value);
            scale_y = parseFloat(document.getElementById("scale_y").value);
            objectSelected.setTranslate(posx, posy);
            objectSelected.setRotate(angle);
            objectSelected.setScale(scale_x,scale_y);
            drawCanvas();
        } catch (error) {
            alert(error);
        }
    }
}
