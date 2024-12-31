var container = document.getElementById('animatee');
var emoji = ['😊', '🥰', '😍', '😍', '💖', '💗', '💓', '💞', '🩷', '🧡', '💛', '💚', '💙', '🩵', '💜', '🤎', '🤍', '🫶', '🦋', '🎂', '🥳', '🎊', '🎉'];
var circles = [];
let popup = document.getElementById('popup')
for (var i = 0; i < 15; i++) {
  addCircle(i * 150, [10 + 0, 300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 + 0, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 - 200, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 + 200, 300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 - 400, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 + 400, 300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 - 600, -300], emoji[Math.floor(Math.random() * emoji.length)]);
  addCircle(i * 150, [10 + 600, 300], emoji[Math.floor(Math.random() * emoji.length)]);
}



function addCircle(delay, range, color) {
  setTimeout(function() {
    var c = new Circle(range[0] + Math.random() * range[1], 80 + Math.random() * 4, color, {
      x: -0.15 + Math.random() * 0.3,
      y: 1 + Math.random() * 1
    }, range);
    circles.push(c);
  }, delay);
}

function Circle(x, y, c, v, range) {
  var _this = this;
  this.x = x;
  this.y = y;
  this.color = c;
  this.v = v;
  this.range = range;
  this.element = document.createElement('span');
  /*this.element.style.display = 'block';*/
  this.element.style.opacity = 0;
  this.element.style.position = 'absolute';
  this.element.style.fontSize = '26px';
  this.element.style.color = 'hsl('+(Math.random()*360|0)+',80%,50%)';
  this.element.innerHTML = c;
  container.appendChild(this.element);

  this.update = function() {
    if (_this.y > 1100) {
      _this.y = 80 + Math.random() * 4;
      _this.x = _this.range[0] + Math.random() * _this.range[1];
    }
    _this.y += _this.v.y;
    _this.x += _this.v.x;
    this.element.style.opacity = 1;
    this.element.style.transform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
    this.element.style.webkitTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
    this.element.style.mozTransform = 'translate3d(' + _this.x + 'px, ' + _this.y + 'px, 0px)';
  };
}

function animate() {
  for (var i in circles) {
    circles[i].update();
  }
  requestAnimationFrame(animate);
}

animate();

let a = 0.001
function myMove() {
  const elemWidth = document.getElementById("f1").offsetWidth;
  var pos = document.getElementById("fad");
  var pos1 = document.getElementById("f1");
  let id = null;
  let posy = pos.offsetTop
  let posy1 = pos1.offsetLeft
  const elem = document.getElementById("fad");
  const elem1 = document.getElementById("f1");
  clearInterval(id);
  id = setInterval(frame, 5);
  function frame() {
    if (posy <= -800) {
    clearInterval(id);
    setTimeout(function(){Fadebg()},1000);
    setTimeout(function(){Fadein_img1()},3000);
    setTimeout(function(){Fadeout_img1()},8000);
    setTimeout(function(){Fadein_img2()},10000);
    setTimeout(function(){Fadeout_img2()},15000);
    setTimeout(function(){Fadein_img3()},17000);
    setTimeout(function(){Fadein_img3_3()},19000);
    setTimeout(function(){Fadeout_img3()},24000);
    setTimeout(function(){Fadein_img4()},26000);
    setTimeout(function(){Fadeout_img44()},31000);
    setTimeout(function(){Fadein_img5()},33000);
    setTimeout(function(){Fadein_img5_5()},35000);
    setTimeout(function(){Fadeout_img55()},43000);
    setTimeout(function(){Fadein_img6_6()},48000);
    setTimeout(function(){Fadeout_img66()},53000);
    setTimeout(function(){Fadein_img9_9()},55000);
    setTimeout(function(){Fadeout_img99()},60000);
    setTimeout(function(){Fadein_img10_10()},62000);
    setTimeout(function(){Fadeout_img1010()},67000);
    setTimeout(function(){Fadein_img11_11()},72000);
    setTimeout(function(){popup.classList.add('open-popup')},78000);
    } else {
      a += 0.01
      posy -= 1+a;
      elem.style.top = posy + "px"; 
    }
  }
}

var opacity_bg = 0;
function Fadebg() {
   document.getElementById("p1").src = "img/1.jpg";
   if (opacity_bg<1) {
      opacity_bg += .01;
      setTimeout(function(){Fadebg()},10);
   }
   document.getElementById('p1').style.opacity = opacity_bg;
   document.getElementById('f1').style.opacity = opacity_bg;
}

var opacity_img1 = 0;
function Fadein_img1() {
   if (opacity_img1<1) {
      opacity_img1 += .01;
      setTimeout(function(){Fadein_img1()},10);
   }
   document.getElementById('t1').style.opacity = opacity_img1;
}

var opacity_img11 = 1;
function Fadeout_img1() {
   if (opacity_img11>0) {
      opacity_img11 -= .01;
      setTimeout(function(){Fadeout_img1()},10);
   }
   document.getElementById('t1').style.opacity = opacity_img11;
}

var opacity_img2 = 0;
function Fadein_img2() {
  document.getElementById("t1").innerHTML = "You're just a woman who's passed and gone.";
   if (opacity_img2<1) {
      opacity_img2 += .01;
      setTimeout(function(){Fadein_img2()},10);
   }
   document.getElementById('t1').style.opacity = opacity_img2;
}

var opacity_img22 = 1;
function Fadeout_img2() {
   if (opacity_img22>0) {
      opacity_img22 -= .01;
      setTimeout(function(){Fadeout_img2()},10);
   }
   document.getElementById('t1').style.opacity = opacity_img22;
   document.getElementById('p1').style.opacity = opacity_img22;
}

var opacity_img3_t = 0;
var opacity_img3_p = 0;
function Fadein_img3() {
  document.getElementById("p1").src = "img/2.jpg";
  if (opacity_img3_p<1) {
      opacity_img3_p += .01;
      setTimeout(function(){Fadein_img3()},10);
   }
   document.getElementById('p1').style.opacity = opacity_img3_p;
}
function Fadein_img3_3() {
  document.getElementById("t1").innerHTML = "But today you are in my arms.";
   if (opacity_img3_t<1) {
      opacity_img3_t += .01;
      setTimeout(function(){Fadein_img3_3()},10);
   }
   document.getElementById('t1').style.opacity = opacity_img3_t;
}

var opacity_img33 = 1;
function Fadeout_img3() {
   if (opacity_img33>0) {
      opacity_img33 -= .01;
      setTimeout(function(){Fadeout_img3()},10);
   }
   document.getElementById('t1').style.opacity = opacity_img33;
}

var opacity_img4 = 0;
function Fadein_img4() {
  document.getElementById("t1").innerHTML = "I can't believe it! but it really happened.";
   if (opacity_img4<1) {
      opacity_img4 += .01;
      setTimeout(function(){Fadein_img4()},10);
   }
   document.getElementById('t1').style.opacity = opacity_img4;
}

var opacity_img44 = 1;
function Fadeout_img44() {
   if (opacity_img44>0) {
      opacity_img44 -= .01;
      setTimeout(function(){Fadeout_img44()},10);
   }
   document.getElementById('t1').style.opacity = opacity_img44;
   document.getElementById('p1').style.opacity = opacity_img44;
}

var opacity_img5_p = 0;
function Fadein_img5() {
  document.getElementById("p1").src = "img/3.jpg";
  if (opacity_img5_p<1) {
      opacity_img5_p += .01;
      setTimeout(function(){Fadein_img5()},10);
   }
   document.getElementById('p1').style.opacity = opacity_img5_p;
}

var opacity_img5_t = 0;
function Fadein_img5_5() {
  document.getElementById("t1").innerHTML = "I'm glad it's you.";
   if (opacity_img5_t<1) {
      opacity_img5_t += .01;
      setTimeout(function(){Fadein_img5_5()},10);
   }
   document.getElementById('t1').style.opacity = opacity_img5_t;
}

var opacity_img55 = 1;
function Fadeout_img55() {
   if (opacity_img55>0) {
      opacity_img55 -= .01;
      setTimeout(function(){Fadeout_img55()},10);
   }
   document.getElementById('t1').style.opacity = opacity_img55;
   document.getElementById('p1').style.opacity = opacity_img55;
}

var opacity_img6_t = 0;
function Fadein_img6_6() {
  document.getElementById("t0").innerHTML = "Welcome to 21 year.";
   if (opacity_img6_t<1) {
      opacity_img6_t += .01;
      setTimeout(function(){Fadein_img6_6()},10);
   }
   document.getElementById('t0').style.opacity = opacity_img6_t;
}

var opacity_img66 = 1;
function Fadeout_img66() {
   if (opacity_img66>0) {
      opacity_img66 -= .01;
      setTimeout(function(){Fadeout_img66()},10);
   }
   document.getElementById('t0').style.opacity = opacity_img66;
}

var opacity_img9_t = 0;
function Fadein_img9_9() {
  document.getElementById("t0").innerHTML = "sorry I couldn't be with you today.";
   if (opacity_img9_t<1) {
      opacity_img9_t += .01;
      setTimeout(function(){Fadein_img9_9()},10);
   }
   document.getElementById('t0').style.opacity = opacity_img9_t;
}

var opacity_img99 = 1;
function Fadeout_img99() {
   if (opacity_img99>0) {
      opacity_img99 -= .01;
      setTimeout(function(){Fadeout_img99()},10);
   }
   document.getElementById('t0').style.opacity = opacity_img99;
}

var opacity_img10_t = 0;
function Fadein_img10_10() {
  document.getElementById("t0").innerHTML = "But I will tell you that..";
   if (opacity_img10_t<1) {
      opacity_img10_t += .01;
      setTimeout(function(){Fadein_img10_10()},10);
   }
   document.getElementById('t0').style.opacity = opacity_img10_t;
}

var opacity_img1010 = 1;
function Fadeout_img1010() {
   if (opacity_img1010>0) {
      opacity_img1010 -= .01;
      setTimeout(function(){Fadeout_img1010()},10);
   }
   document.getElementById('t0').style.opacity = opacity_img1010;
}

var opacity_img11_t = 0;
function Fadein_img11_11() {
  document.getElementById("t1").innerHTML = "🩷 I LOVE YOU FOREVER 🩷";
  document.getElementById("p1").src = "img/4.jpg";
   if (opacity_img11_t<1) {
      opacity_img11_t += .01;
      setTimeout(function(){Fadein_img11_11()},10);
   }
   document.getElementById('t1').style.opacity = opacity_img11_t;
   document.getElementById('p1').style.opacity = opacity_img11_t;
}  

const targetDate = new Date('January 1, 2025 21:00:00').getTime();
// const targetDate = new Date('December 31, 2024 12:43:00').getTime();

// ฟังก์ชันสำหรับการอัปเดตตัวนับถอยหลัง
function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    // คำนวณเวลาที่เหลือในวัน ชั่วโมง นาที และวินาที
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // แสดงผลเวลาที่เหลือใน HTML
    document.getElementById('countdown').innerHTML =
        `<span class='time'>${days}</span>D <span class='time'>${hours}</span>h <span class='time'>${minutes}</span>m <span class='time'>${seconds}</span>s`;

    // หากถึงวันเป้าหมายแล้ว ให้เปลี่ยนหน้าไปยังเว็บไซต์ใหม่
    if (timeLeft <= 0) {
        clearInterval(interval);
        window.location.href = 'HBD-FIRST.html'; // แก้ไข URL ตามที่คุณต้องการ
    }
}

// อัปเดตตัวนับถอยหลังทุก ๆ 1 วินาที
const interval = setInterval(updateCountdown, 1000);