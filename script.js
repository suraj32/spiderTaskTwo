var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.globalCompositeOperation = 'source-over';

function replay() { location.reload(); }
let kills = 0;
let level = 1;

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

status1 = "live";
status2 = "live";
speed = 1;
var alien1 = {
    x: 800,
    y: 250,
    draw: function () {
        if (status1 != "hit") {
            speed = sec < 20 ? 1 : sec < 40 ? 1.3 : sec < 80 ? 1.6 : sec < 120 ? 1.8 : 2 //speed variance a/c to level up
            console.log(speed);
            ctx.drawImage(alien_1, this.x, this.y, 70, 70);
        }
    }
}
var alien2 = {
    x: 800,
    y: 250,
    draw: function () {
        if (status2 != "hit") {
            ctx.drawImage(alien_2, this.x, this.y, 70, 70);
        }
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
    if ((Math.abs(bullet.x - alien1.x) <= 20) && (Math.abs(bullet.y + 3 - alien1.y - 35) <= 38)) {
        status1 = "hit";
        bullet.x = 900;
        new Audio("kill.mpeg").play();
        kills++;
    }
    if ((Math.abs(bullet.x - alien2.x) <= 20) && (Math.abs(bullet.y + 3 - alien2.y - 35) <= 38)) {
        status2 = "hit";
        bullet.x = 900;
        new Audio("kill.mpeg").play();
        kills++;
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
        alien1.x -= 5 * speed;
        motion2 = window.requestAnimationFrame(alien1Move);
    }
    else {
        status1 = "live"; //revive
        alien1.x = 800;
        alien1.y = 431 * Math.random();
        window.requestAnimationFrame(alien1Move);
    }
    if (status1 == "live" && (Math.abs(craft.x - alien1.x) < 80) && (Math.abs(craft.y + 40 - alien1.y - 35) <= 75)) {
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
        alien2.x -= 5 * speed;
        motion3 = window.requestAnimationFrame(alien2Move);
    }
    else {
        status2 = "live"; //revive
        alien2.x = 800;
        alien2.y = 431 * Math.random();
        window.requestAnimationFrame(alien2Move);
    }
    if (status2 == "live" && (Math.abs(craft.x - alien2.x) < 80) && (Math.abs(craft.y + 40 - alien2.y - 35) <= 75)) {
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
    r = distance < 6000 ? 1 : distance < 12000 ? 1.5 : distance < 24000 ? 2 : distance < 48000 ? 2.5 : 3; //According to level up
    level = sec < 20 ? 1 : sec < 40 ? 2 : sec < 80 ? 3 : sec < 120 ? 4 : 5;
    console.log("level:" + level);
    bonus = level == 1 ? 0 : level == 2 ? 1000 : level == 3 ? 1500 : level == 4 ? 2000 : 2500; //bonus points
    score = Math.floor(distance * r * 0.01 + kills * 100 * speed + bonus);
    document.getElementById("scoreBoard").innerHTML = "Level: " + level + "||🎯Score: " + score;
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
    document.getElementById("score").innerHTML = "Kills = " + kills + " ,Your Score: " + score;
    document.getElementById("highscore").innerHTML = "⚡High Score:" + hs;
}

