var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.globalCompositeOperation = 'destination-over';

let spaceCraft = new Image();
let alien_1 = new Image();
let alien_2 = new Image();
spaceCraft.src = "spaceCraft.jpg";
alien_1.src = "alien1.jpg";
alien_2.src = "alien2.jpg";
spaceCraft.onload = function () {
    ctx.drawImage(spaceCraft, 100, 210, 100, 80);
};
alien_1.onload = function () {
    ctx.drawImage(alien_1, 0, 0, 0, 0);
};
alien_2.onload = function () {
    ctx.drawImage(alien_2, 0, 0, 0, 0);
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

var bullet = {
    x: -20,
    y: -6,
    draw: function () {
        ctx.fillStyle = "rgb(206, 40, 40)";
        ctx.fillRect(this.x, this.y, 20, 6);
    }
}

var alien1 = {
    x: 800,
    y: 250,
    draw: function () {
        ctx.drawImage(alien_1, this.x, this.y, 70, 70);
    }
}
var alien2 = {
    x: 800,
    y: 250,
    draw: function () {
        ctx.drawImage(alien_2, this.x, this.y, 70, 70);
    }
}

document.body.addEventListener('keydown', function (e) {
    key = e.keyCode;
    moveOrShoot();
});

function moveOrShoot() {
    console.log(key);
    switch (key) {
        case 32://Spacebar
            laser.play();
            bullet.x = craft.x + 80;
            bullet.y = craft.y + 37;
            motion1 = window.requestAnimationFrame(shoot);
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
    alien1.draw();
    alien2.draw();
}

function shoot() {
    ctx.clearRect(0, 0, 800, 500);
    bullet.draw();
    craft.draw();
    alien1.draw();
    alien2.draw();
    if (bullet.x < 800) {
        bullet.x += 5;
        motion1 = window.requestAnimationFrame(shoot);
    }
    else {
        window.cancelAnimationFrame(motion1);
    }
}

let sec = 0;
function timer() {
    sec += 0.1;
    changeScore();
}
var start = document.getElementById('start');
start.addEventListener('click', function () {
    interval = window.setInterval(timer, 100);
    start.style.display = "none";
    alien1.y = 431 * Math.random();
    alien2.y = 431 * Math.random();
    motion2 = window.requestAnimationFrame(alien1Move);
    timeout = setTimeout(function () { motion3 = window.requestAnimationFrame(alien2Move); }, 1500);
});
function alien1Move() {
    if (alien1.x > -70) {
        alien1.x -= 5;
        motion2 = window.requestAnimationFrame(alien1Move);
    }
    else {
        alien1.x = 800;
        alien1.y = 431 * Math.random();
        window.requestAnimationFrame(alien1Move);
    }
    if ((Math.abs(craft.x - alien1.x) < 100) && (Math.abs(craft.y + 40 - alien1.y - 35) <= 75)) {
        endGame();
        console.log(craft.x);
        console.log("alien2 " + alien1.x);
    }
    ctx.clearRect(0, 0, 800, 500);
    bullet.draw();
    craft.draw();
    alien1.draw();
    alien2.draw();
}
function alien2Move() {
    if (alien2.x > -70) {
        alien2.x -= 5;
        motion3 = window.requestAnimationFrame(alien2Move);
    }
    else {
        alien2.x = 800;
        alien2.y = 431 * Math.random();
        window.requestAnimationFrame(alien2Move);
    }
    if ((Math.abs(craft.x - alien2.x) < 100) && (Math.abs(craft.y + 40 - alien2.y - 35) <= 75)) {
        endGame();
        console.log(craft.x);
        console.log("alien1 " + alien1.x);
    }
    ctx.clearRect(0, 0, 800, 500);
    bullet.draw();
    craft.draw();
    alien1.draw();
    alien2.draw();
}

var modal = document.getElementById("modal");
motion1 = 0;
motion3 = 0;
function endGame() {
    new Audio("Disgruntled Gramophone.mp3").play();
    console.log("...interference...");
    window.cancelAnimationFrame(motion1);
    window.cancelAnimationFrame(motion2);
    window.cancelAnimationFrame(motion3);
    window.clearInterval(interval);
    window.clearTimeout(timeout);
    //document.body.removeEventListener('keydown', function (e) {});
    console.log("Sec:" + sec);
    modal.style.display = "block";
    displayScore();
}

let r;
function changeScore() {
    distance = 60 * 5 * sec; //in px //animation is in 60 frames per sec and speed is 5
    //Bonus score for more distance
    r = distance < 6000 ? 1 : distance < 12000 ? 1.5 : distance < 24000 ? 2 : distance < 48000 ? 2.5 : 3;
    score = Math.floor(distance * r * 0.01);
    document.getElementById("scoreBoard").innerHTML = "🎯Score: " + score;
}

function displayScore() {
    changeScore();
    hs = localStorage.getItem("BEST");
    if (hs == Infinity) {
        hs = score;
    } else if (score > hs) {
        hs = score;
    }
    localStorage.setItem("BEST", hs);
    document.getElementById("score").innerHTML = "Your Score: " + score;
    document.getElementById("highscore").innerHTML = "⚡High Score:" + hs;
}

