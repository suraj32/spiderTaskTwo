var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.globalCompositeOperation = 'destination-over';

let spaceCraft = new Image();
let alien1 = new Image();
let alien2 = new Image();
spaceCraft.src = "spaceCraft.jpg";
alien1.src = "alien1.jpg";
alien2.src = "alien2.jpg";
spaceCraft.onload = function () {
    ctx.drawImage(spaceCraft, 100, 210, 100, 80);
};
alien1.onload = function () {
    ctx.drawImage(alien1, 0, 0, 0, 0);
};
alien2.onload = function () {
    ctx.drawImage(alien2, 0, 0, 0, 0);
};


function replay() { location.reload(); }

laser = new Audio("laser.mp3");
bgm = new Audio("bgm.mp3");
bgm.loop = true;
bgm.play();

ctx.clearRect(0, 0, 800, 500); // clear canvas

var craft = {
    x: 100,
    y: 210,
    draw: function () {
        ctx.drawImage(spaceCraft, this.x, this.y, 100, 80);
    }
};

status = 1;
var bullet = {
    x: -20,
    y: -6,
    draw: function () {
        ctx.fillStyle = "rgb(206, 40, 40)";
        ctx.fillRect(this.x, this.y, 20, 6);
    }
}

var alien = {
    x: 800,
    y: 250,
    draw: function () {
        if (status == 1) {
            ctx.drawImage(alien1, this.x, this.y, 70, 70);
            status = 2;
        }
        else {
            ctx.drawImage(alien2, this.x, this.y, 70, 70);
            status = 1;
        }
    }
}
document.body.addEventListener('keydown', function (e) {
    key = e.keyCode;
    window.requestAnimationFrame(moveOrShoot);
});

function moveOrShoot() {
    console.log(key);
    switch (key) {
        case 32://Spacebar
            laser.play();
            bullet.x = craft.x + 80;
            bullet.y = craft.y + 37;
            window.requestAnimationFrame(shoot);
            break;
        case 37://left arrow
            if (craft.x > 0) { craft.x -= 5; }
            break;
        case 38://up arrow
            if (craft.y > 0) { craft.y -= 5; }
            break;
        case 39://right arrow
            if (craft.x < 700) { craft.x += 5; }
            break;
        case 40://down arrow
            if (craft.y < 420) { craft.y += 5; }
            break;
    }
    ctx.clearRect(0, 0, 800, 500);
    craft.draw();
    bullet.draw();
    alien.draw();
}

function shoot() {
    ctx.clearRect(0, 0, 800, 500);
    bullet.draw();
    craft.draw();
    alien.draw();
    if (bullet.x < 800) {
        bullet.x += 5;
        window.requestAnimationFrame(shoot);
    }
    else {
        window.cancelAnimationFrame(shoot);
    }
}

let sec = 0;
function timer() {
    sec += 0.1;
}
var start = document.getElementById('start');
start.addEventListener('click', function () {
    interval = window.setInterval(timer, 100);
    start.style.display = "none";
    interval2 = window.setInterval(commence,3000);
});
function commence(){
    alien.y = 431*Math.random();
    alienMove();
}
function alienMove(){
    ctx.clearRect(0,0,800,500);
    bullet.draw();
    craft.draw();
    alien.draw();
    console.log(alien.x);
    if(alien.x > -70){
        alien.x -= 5;
        setTimeout(alienMove,100);
    }
    else{
        alien.x = 800;
    }
}

