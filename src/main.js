



import '@/assets/css/index.css'
import Stage from './js/basic/Stage'
import Utils from './js/utils'
import Drawable from './js/basic/Drawable'
import TweenLite from 'gsap/TweenLite'
import Rectangle from './js/basic/Rectangle';
import Sprite from './js/basic/Sprite';
import { Bounce, Linear } from 'gsap';
import utils from './js/utils';
import Ascii from './js/ascii';








window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;




const canvas = document.getElementById('textCanvas');
canvas.innerHTML = 'o';

const charWidth = canvas.offsetWidth;
const charHeight = canvas.offsetHeight;
const stageWidth = Math.floor(document.body.clientWidth/charWidth);
const stageHeight = Math.floor(document.body.clientHeight/charHeight);
canvas.innerHTML = '';






function* pcFlow() {
  const stage = new Stage(stageWidth, stageHeight, 'textCanvas');
  (function tick() {
    stage.render();
    window.requestAnimationFrame(tick);
  })()

  var text = 
  utils.parseContent(
`              ANALYSING..............................

              CORE:"${window.navigator.product}"
              PLATFORM:"${window.navigator.platform}"
              VENDOR:"${window.navigator.vendor}"
              VIEWPORT_RES:${document.body.clientWidth}px * ${document.body.clientHeight}px @ DPR:${window.devicePixelRatio}
              CHAR_SIZE:${charWidth}px * ${charHeight}px
              GRID_SIZE:${stageWidth}*${stageHeight}

              Done............... CLICK to initialize`);
  var introText = new Drawable();
  introText.x = stageWidth/2-40;
  introText.y = stageHeight/2;
  introText.rawData=[[]];
  introText.compute = function() {
    if(text.length==0) {
      this.compute = function(){};
      return;
    }
    if (text[0].length!=0) {
      this.rawData[this.rawData.length-1].push(text[0].shift());
    } else {
      text.shift();
      this.rawData.push([[]]);
      this.y-=this.rawData.length%2;
    }
  }
  stage.addChild(introText);

  yield;

  let rects = ["#","/"," ","@", "0", "+", ".", " "];
  for (var i = 0; i < rects.length; i++) {
    var rect = new Rectangle(0, 0);
    rect.x = stageWidth/2;
    rect.y = stageHeight/2;
    rect.lineStyle = rects[i];
    rect.fillStyle = rects[i];
    stage.addChild(rect);
      TweenLite.to(rect, 1, { width: stageWidth, height: stageHeight, x:0, y: 0, transition: Linear.easeIn, delay: i * 0.2 });
  }


  yield;

  var text = new Drawable();
  text.rawData = ['ヾ(◍°∇°◍)ﾉﾞThank u for watching!'];

  stage.addChild(text);

  yield;

}

function* mobileFlow() {
  const stage = new Stage(stageWidth, stageHeight, 'textCanvas');
  (function tick() {
    stage.render();
    window.requestAnimationFrame(tick);
  })()

  var text = new Drawable();
  text.rawData = utils.parseContent(Ascii.qr);
  text.x = stageWidth/2 - text.width / 2;
  text.y = stageHeight/2-text.height/2;
  stage.addChild(text);

  yield;

  stage.removeChild(text);
  let rects = ["#", "0", "+", ".", " "];
  for (let i = 0; i < rects.length; i++) {
    var rect = new Rectangle(1, 1);
    rect.x = stageWidth/2;
    rect.y = stageHeight/2;
    rect.lineStyle = rects[i];
    rect.fillStyle = rects[i];
    stage.addChild(rect);
    TweenLite.to(rect, 0.8, { width: stageWidth*2, height: stageHeight, x: -stageWidth/2, y: 0, transition: Linear.easeIn, delay: i * 0.2 });
  }


  yield;

  var text = new Drawable();
  text.rawData = ['ヾ(◍°∇°◍)ﾉﾞThank u for watching!'];

  stage.addChild(text);

  yield;

}


var flow;

if (utils.isPC) {

  flow = pcFlow();

  document.addEventListener('click', () => {
    flow.next();
  })

} else {
  flow = mobileFlow();

  document.addEventListener('touchend', () => {
    flow.next();
  })

}
flow.next();