//predefined colors
white = "#ffffff65"; //com transparencia
black = "#000000";
purple = "#d7bde2";
blue = "#a9cce3";
green = "#7dcea0";
yellow ="#f4d03f";
orange ="#f5b041";
gray ="#f5b041";

SEGMENTS_CIRCLE = 30;

function Box(center = [0, 0, 1], height = 50, width = 50) {
    this.center = center;
    this.height = height;
    this.width = width;
    this.T = identity(); //matriz 3x3 de translação 
    this.R = identity(); //matriz 3x3 de rotação
    this.S = identity(); //matriz 3x3 de escala
    this.points = [];
    this.fill = white; //cor de preenchimento -> aceita cor hex, ex.: this.fill = "#4592af"
    this.stroke = black; //cor da borda -> aceita cor hex, ex.: this.stroke = "#a34a28"
    this.original_stroke = this.stroke;
    this.name = "";
}

Box.prototype.setName = function(name) {
    this.name = name;
}

Box.prototype.setTranslate = function(x, y) {
    this.T = translate(x, y);
}

Box.prototype.getTranslate = function() {
    return this.T;
}

Box.prototype.setRotate = function(theta) {
    this.R = rotate(theta);
}

Box.prototype.getRotate = function() {
    return this.R;
}

Box.prototype.setScale = function(x, y) {
    this.S = scale(x, y);
}

Box.prototype.getScale = function() {
    return this.S;
}

Box.prototype.setFill = function(colors){
    this.fill = colors;
}

Box.prototype.setStroke = function(colors){
    this.stroke = colors;
    this.original_stroke = this.stroke;
}

Box.prototype.intersection =function(x,y){
    var SRT = inverseTRS(this.T,this.R, this.S);
    SRT = mult(SRT, transformUsual(WIDTH,HEIGHT));
    //mouse point
    var mp = [x,y,1];
    mp = multVec(SRT, mp);
    
    var pontos_tranformados = [];

    for(var i = 0 ; i < this.points.length; i++){
         pontos_tranformados[i] = multVec(SRT, this.points[i]);
    }
    if((pontos_tranformados[0][0] >= mp[0]) && (pontos_tranformados[1][0] <= mp[0]) && 
    ((pontos_tranformados[0][1] >= mp[1]) && (pontos_tranformados[2][1] <= mp[1]))){
             return true;
    }else{
         return false;
    }
}
Box.prototype.draw = function(canv = ctx) { //requer o contexto de desenho
    //pega matriz de tranformação de coordenadas canônicas para coordenadas do canvas
    var M = transformCanvas(WIDTH, HEIGHT);
    var Mg = mult(M, mult(mult(this.T, this.R), this.S));
    canv.lineWidth = 2; //largura da borda
    canv.strokeStyle = this.stroke;
    canv.fillStyle = this.fill;
    //criação dos pontos do retângulo de acordo com o centro, largura e altura
    var points = [];
    points.push([this.center[0] + this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] + this.height / 2, 1]);
    points.push([this.center[0] - this.width / 2, this.center[1] - this.height / 2, 1]);
    points.push([this.center[0] + this.width / 2, this.center[1] - this.height / 2, 1]);

    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
        points[i] = multVec(Mg, points[i]); //transformando o ponto em coordenadas canonicas em coordenadas do canvas
        if (i == 0) canv.moveTo(points[i][0], points[i][1]);
        else canv.lineTo(points[i][0], points[i][1]);
    }
    canv.lineTo(points[0][0], points[0][1]); //fechando o retângulo
    canv.fill(); //aplica cor de preenchimento
    canv.strokeStyle = this.stroke;
    canv.stroke(); //aplica cor de contorno
    this.points = points;

    //desenho do nome
    canv.beginPath();
    canv.fillStyle = this.stroke;
    canv.font = "16px Courier";
    var center = multVec(Mg, this.center);
    canv.fillText(this.name, center[0] - this.name.length * 16 / 3, center[1] + 3); //deixa o texto mais ou menos centralizado no meio da caixa
}


function Circle(center = [0, 0, 1], radius = 50) {
    this.center = center;
    this.radius = radius;
     this.points = [];
    this.T = identity(); //matriz 3x3 de translação 
    this.R = identity(); //matriz 3x3 de rotação
    this.S = identity(); //matriz 3x3 de escala
    this.fill = white; //cor de preenchimento -> aceita cor hex, ex.: this.fill = "#4592af"
    this.stroke = black; //cor da borda -> aceita cor hex, ex.: this.stroke = "#a34a28"
    this.original_stroke = this.stroke;
    this.name = "";
}

Circle.prototype.setName = function(name) {
    this.name = name;
}

Circle.prototype.setTranslate = function(x, y) {
    this.T = translate(x, y);
    this.center = [x,y];
}

Circle.prototype.getTranslate = function() {
    return [this.T[0][2], this.T[1][2], 1];
}

Circle.prototype.setRotate = function(theta) {
    this.R = rotate(theta);
}


Circle.prototype.setScale = function(x, y) {
    this.S = scale(x, y);
}

Circle.prototype.setRadius = function(r) {
    this.radius = r;
}

Circle.prototype.setFill = function(fill) {
    this.fill = fill;
}

Circle.prototype.setStroke = function(colors){
    this.stroke = colors;
    this.original_stroke = this.stroke;
}

Circle.prototype.intersection = function(x,y){
    var SRT = inverseTRS(this.T,this.R,this.S);
    //mouse point
    var mp = [x,y,1];
    mp = multVec(SRT, mp);
    mp = multVec(transformUsual(WIDTH,HEIGHT),mp);

    return distance(this.radius, mp);
}



Circle.prototype.draw = function(canv = ctx) { //requer o contexto de desenho
    //pega matriz de tranformação de coordenadas canônicas para coordenadas do canvas
    var M = transformCanvas(WIDTH, HEIGHT);
    var Mg = mult(M, mult(mult(this.R, this.S), this.T));
    canv.lineWidth = 2; //largura da borda
    canv.strokeStyle = this.stroke;
    canv.fillStyle = this.fill;
    //criação dos pontos do retângulo de acordo com o centro, largura e altura
    var points = [];
    var alpha = 2 * Math.PI / SEGMENTS_CIRCLE;
    for (i = 0; i < SEGMENTS_CIRCLE; i++) {
        points.push([Math.cos(alpha * i) * this.radius + this.center[0], Math.sin(alpha * i) * this.radius + this.center[1], 1]);
    }
    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
        points[i] = multVec(Mg, points[i]); //transformando o ponto em coordenadas canonicas em coordenadas do canvas
        if (i == 0) canv.moveTo(points[i][0], points[i][1]);
        else canv.lineTo(points[i][0], points[i][1]);
    }
    canv.lineTo(points[0][0], points[0][1]); //fechando o retângulo
    canv.fill(); //aplica cor de preenchimento
    canv.strokeStyle = this.stroke;
    canv.stroke(); //aplica cor de contorno
    this.points = points;

    //desenho do nome
    canv.beginPath();
    canv.fillStyle = this.stroke;
    canv.font = "16px Courier";
    var center = multVec(Mg, this.center);
    canv.fillText(this.name, center[0] - this.name.length * 16 / 3, center[1] + 3); //deixa o texto mais ou menos centralizado no meio da caixa
}
