const canf = document.getElementById("my");
const ctx = canf.getContext("2d")
let rightMove = false
let leftMove = false
let upMove = false
let downMove = false
const starArray = []
let xCors = []
let yCors = []
let sizeStar = []
let starBarray = []
let xCorsB = []
let yCorsB = []
let sizeStarB = []
let dx = 1
let dxCntr = 0
let skyBck = window.getComputedStyle(canf)
let chk = skyBck.getPropertyValue('background-color')
let alternator = 1
// console.log(chk)
// console.log(typeof(chk))

// Useful fucntions

function sig(z){
    return 10/(1+Math.exp(-z+1))
}

// My classes

class Star {
    constructor(x,y,rad){
        this.x = x
        this.y = y
        this.rad = rad
    }
    drawStar(){
        ctx.beginPath()
        ctx.arc(this.x, this.y,this.rad,0,Math.PI*2)
        ctx.fillStyle = "#fcfafc"
        ctx.fill()
        ctx.closePath() 
    }
    drawTrail(){
        for (let ii = 0; ii<= dx; ii++){
            ctx.beginPath()
            ctx.arc(this.x+1*dx*ii, this.y,this.rad, 0, Math.PI*2)
            ctx.fillStyle = "#fcfafc"
            ctx.fill()
            ctx.closePath()
        }
    }
}

class Rocket {
    constructor(width, height){
        this.width = width;
        this.height = height;
    }
    changewidth(l){
        this.width = l
    }
    drawrocket(){
        ctx.beginPath();
        ctx.moveTo(canf.width - canf.width*48/50, canf.height/2);
        ctx.lineTo(canf.width - canf.width*49/50, canf.height/2 + this.height/2);
        ctx.lineTo(canf.width - canf.width*49/50, canf.height/2 - this.height/2);
        ctx.fillStyle = "#f9faf7";
 /*       ctx.fillStyle = chk for testing */
        ctx.fill();
        ctx.closePath()
    }
}

class bHole {
    constructor(x,y,rad){
        this.x = x
        this.y = y
        this.rad = rad
    }
    drawbhole(){
        ctx.lineWidth = this.rad/10
        ctx.beginPath();
        ctx.arc(this.x, this.y,this.rad,0,Math.PI*2)
        ctx.strokeStyle = "rgb(255,255,255)"
        ctx.fillStyle = chk
        ctx.fill()
        ctx.stroke()
        ctx.closePath() 
    }
    drawextralhole(){
        for (let i = 0; i < 5 ; i++){
            ctx.lineWidth = this.rad * (5-i)/50
            for(let j = 0; j <40; j=j+2){
                ctx.beginPath()
//                ctx.arc(this.x,this.y, this.rad*(1+0.8*i), Math.PI * 2 * (j+Math.floor(alternator*i)+1)/40, Math.PI*2*(j+1+Math.floor(alternator*i)+1+ Math.floor(alternator))/40) 
                ctx.arc(this.x,this.y, this.rad*(1+0.8*i), Math.PI * 2 * (j+i+1+Math.floor(alternator*(5-i)))/40, Math.PI*2*(j+1+i+1+ Math.floor(alternator*(5-i)))/40) /* i+1 term is to stagger the rings)*/
                ctx.strokeStyle = "rgb(255,255,255)"
    //           ctx.fillStyle = chk
                ctx.stroke()
                ctx.closePath()
            }
        }
        if (alternator >40){
            alternator = 1
        }
        else{
            alternator = alternator+0.001
        }
    }
}


// tesitng instance
const testb = new bHole(50, 60, 10)

// Create the stars

for (let i = 0; i<500; i++ ) {
    xCors.push(Math.floor(Math.random() * canf.width * 3))
    yCors.push(Math.floor(Math.random() * canf.height * 3))
    sizeStar.push(Math.floor(Math.random() * 4))
    starArray.push(new Star(xCors[i], yCors[i],sizeStar[i]))
    starArray[i].drawStar()
}

// Create the Bholes
for (let i=0; i < 20 ; i++) {
    let tempxCorB = Math.floor(canf.width*3*i/20)
    let tempyCorB = Math.floor(canf.height*1/3 + Math.random()*(canf.height*1/3))
    xCorsB.push(tempxCorB)
    yCorsB.push(tempyCorB)
    sizeStarB.push(Math.floor(1 + Math.random()*10))
    starBarray.push(new bHole(xCorsB[i], yCorsB[i], sizeStarB[i]))
}


// Keyboard and swipe handling
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightMove = true
        if (dxCntr > 100) {
            dxCntr = 100
        } else {dxCntr++}
        dx = Math.floor(Math.max(1, sig(dxCntr/10)))
//        console.log(dx)
    } else if (e.key === "Left" || e.key === "ArrowLeft") { 
        leftMove = true
    } else if (e.key === "Up" || e.key=== "ArrowUp") {
        upMove = true
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        downMove = true
    }
}
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightMove = false
        dx = 1
        dxCntr = 1
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftMove = false
    } else if (e.key === "Up" || e.key=== "ArrowUp") {
    upMove = false
    } else if (e.key === "Down" || e.key === "ArrowDown") {
    downMove = false
    }
}


//the draw function that will run at every interval
function draw() {
    ctx.clearRect(0, 0, canf.width, canf.height);
    testb.drawbhole()
    testb.drawextralhole()
    console.log(alternator)
    if(rightMove || !rightMove){
        starArray.forEach(function(part,index){
            this[index].x = this[index].x-dx
            if (this[index].x <0) {
                this[index].x = this[index].x+canf.width*3
            } else if (this[index].x > canf.width*3){
                this[index].x = canf.width*3 - this[index].x
            }
        }, starArray)
        starBarray.forEach(function(part,index){
            this[index].x = this[index].x-dx/3
            if (this[index].x <0) {
                this[index].x = this[index].x+canf.width*3
            } else if (this[index].x > canf.width*3){
                this[index].x = canf.width*3 - this[index].x
            }
        }, starBarray)
    }
    starArray.forEach(function(part, index){
        this[index].drawTrail()
    },starArray);
    starBarray.forEach(function(part,index){
        this[index].drawbhole()
        this[index].drawextralhole()
//        console.log('this firing')
    },starBarray)
    r.drawrocket()
}

let interval = setInterval(draw,10)

const r = new Rocket(5,5);