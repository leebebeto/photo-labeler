(function(){

  var emptyFn = function(){};

  function Sonic(d) {
    this.convert = d.convert //New Code
    this.background = d.background
    this.data = d.path || d.data;
    this.imageData = [];

    this.multiplier = d.multiplier || 1;
    this.padding = d.padding || 0;

    this.fps = d.fps || 25;

    this.stepsPerFrame = ~~d.stepsPerFrame || 1;
    this.trailLength = d.trailLength || 1;
    this.pointDistance = d.pointDistance || .05;

    this.domClass = d.domClass || 'sonic';

    this.fillColor = d.fillColor || '#FFF';
    this.strokeColor = d.strokeColor || '#FFF';

    this.stepMethod = typeof d.step == 'string' ?
      stepMethods[d.step] :
      d.step || stepMethods.square;

    this._setup = d.setup || emptyFn;
    this._teardown = d.teardown || emptyFn;
    this._preStep = d.preStep || emptyFn;

    this.width = d.width;
    this.height = d.height;

    this.fullWidth = this.width + 2*this.padding;
    this.fullHeight = this.height + 2*this.padding;

    this.domClass = d.domClass || 'sonic';

    this.setup();

  }

  var argTypes = Sonic.argTypes = {
    DIM: 1,
    DEGREE: 2,
    RADIUS: 3,
    OTHER: 0
  };

  var argSignatures = Sonic.argSignatures = {
    arc: [1, 1, 3, 2, 2, 0],
    bezier: [1, 1, 1, 1, 1, 1, 1, 1],
    line: [1,1,1,1]
  };

  var pathMethods = Sonic.pathMethods = {
    bezier: function(t, p0x, p0y, p1x, p1y, c0x, c0y, c1x, c1y) {
      
        t = 1-t;

        var i = 1-t,
            x = t*t,
            y = i*i,
            a = x*t,
            b = 3 * x * i,
            c = 3 * t * y,
            d = y * i;

        return [
            a * p0x + b * c0x + c * c1x + d * p1x,
            a * p0y + b * c0y + c * c1y + d * p1y
        ]

    },
    arc: function(t, cx, cy, radius, start, end) {

        var point = (end - start) * t + start;

        var ret = [
            (Math.cos(point) * radius) + cx,
            (Math.sin(point) * radius) + cy
        ];

        ret.angle = point;
        ret.t = t;

        return ret;

    },
    line: function(t, sx, sy, ex, ey) {
      return [
        (ex - sx) * t + sx,
        (ey - sy) * t + sy
      ]
    }
  };

  var stepMethods = Sonic.stepMethods = {
    
    square: function(point, i, f, color, alpha) {
      this._.fillRect(point.x - 3, point.y - 3, 6, 6);
    },

    fader: function(point, i, f, color, alpha) {

      this._.beginPath();

      if (this._last) {
        this._.moveTo(this._last.x, this._last.y);
      }

      this._.lineTo(point.x, point.y);
      this._.closePath();
      this._.stroke();

      this._last = point;

    }

  }

  Sonic.prototype = {
    setup: function() {

      var args,
        type,
        method,
        value,
        data = this.data;

      this.canvas = document.createElement('canvas');
      this._ = this.canvas.getContext('2d');

      this.canvas.className = this.domClass;

      this.canvas.height = this.fullHeight;
      this.canvas.width = this.fullWidth;

      this.points = [];

      for (var i = -1, l = data.length; ++i < l;) {

        args = data[i].slice(1);
        method = data[i][0];

        if (method in argSignatures) for (var a = -1, al = args.length; ++a < al;) {

          type = argSignatures[method][a];
          value = args[a];

          switch (type) {
            case argTypes.RADIUS:
              value *= this.multiplier;
              break;
            case argTypes.DIM:
              value *= this.multiplier;
              value += this.padding;
              break;
            case argTypes.DEGREE:
              value *= Math.PI/180;
              break;
          };

          args[a] = value;

        }

        args.unshift(0);

        for (var r, pd = this.pointDistance, t = pd; t <= 1; t += pd) {
          
          // Avoid crap like 0.15000000000000002
          t = Math.round(t*1/pd) / (1/pd);

          args[0] = t;

          r = pathMethods[method].apply(null, args);

          this.points.push({
            x: r[0],
            y: r[1],
            progress: t
          });

        }

      }

      this.frame = 0;
      //this.prep(this.frame);
      
      //Here's The New Code
      if(this.convert){
        this.encoder = new GIFEncoder();
        this.encoder.setRepeat(0);//loop forever
        var delay
        if(this.fps>10){
          delay = 0
        } else {
          delay = 2.8+(1010/this.fps)
        }
        this.encoder.setDelay(delay);//delay before next frame unfortunately there's a limit
        this.encoder.start();
      }
      this.img = document.createElement("img")

    },

    prep: function(frame) {

      if (frame in this.imageData) {
        return;
      }

      this._.clearRect(0, 0, this.fullWidth, this.fullHeight);
      if(this.convert){
        this._.fillStyle = this.background;
        this._.fillRect(0,0,this.fullWidth, this.fullHeight);
      }
      
      var points = this.points,
        pointsLength = points.length,
        pd = this.pointDistance,
        point,
        index,
        frameD;

      this._setup();

      for (var i = -1, l = pointsLength*this.trailLength; ++i < l && !this.stopped;) {

        index = frame + i;

        point = points[index] || points[index - pointsLength];

        if (!point) continue;

        this.alpha = Math.round(1000*(i/(l-1)))/1000;

        this._.globalAlpha = this.alpha;

        this._.fillStyle = this.fillColor;
        this._.strokeStyle = this.strokeColor;

        frameD = frame/(this.points.length-1);
        indexD = i/(l-1);

        this._preStep(point, indexD, frameD);
        this.stepMethod(point, indexD, frameD);

      } 

      this._teardown();

      this.imageData[frame] = (
        this._.getImageData(0, 0, this.fullWidth, this.fullWidth)
      );

      return true;

    },

    draw: function() {
      
      if (!this.prep(this.frame)) {

        this._.clearRect(0, 0, this.fullWidth, this.fullWidth);

        this._.putImageData(
          this.imageData[this.frame],
          0, 0
        );

      }

      this.iterateFrame();

    },

    iterateFrame: function() {
      
      this.frame += this.stepsPerFrame;
      
      //More code added
      if(this.encoder){
        this.encoder.addFrame(this._)
      }
      
      if (this.frame >= this.points.length) {
        this.frame = 0;
        
        //last bit of code added
        if(this.encoder){
          this.encoder.finish()
          this.img.src = 'data:image/gif;base64,'+encode64(this.encoder.stream().getData())
          this.encoder = null
        }
      }

    },

    play: function() {

      this.stopped = false;

      var hoc = this;

      this.timer = setInterval(function(){
        hoc.draw();
      }, 1000 / this.fps);

    },
    stop: function() {

      this.stopped = true;
      this.timer && clearInterval(this.timer);

    }
  };

  window.Sonic = Sonic;

}());


var icon = new Sonic({
  
  width: 100,
  height: 100,
  
  backgroundColor: '#111',
      
  stepsPerFrame: 4,
  trailLength: 1,
  pointDistance: 0.01,
  fps: 25,

  setup: function() {
    this._.lineWidth = 10;
  },

  step: function(point, i, f) {

    var progress = point.progress,
      degAngle = 360 * progress,
      angle = Math.PI/180 * degAngle,
      angleB = Math.PI/180 * (degAngle - 180),
      size = i*5;
      
    this._.fillStyle = '#FF7B24';

    this._.fillRect(
      Math.cos(angle) * 25 + (50-size/2),
      Math.sin(angle) * 15 + (50-size/2),
      size,
      size
    ); 

    this._.fillStyle = '#63D3FF';

    this._.fillRect(
      Math.cos(angleB) * 15 + (50-size/2),
      Math.sin(angleB) * 25 + (50-size/2),
      size,
      size
    );

    if (point.progress == 1) {

      this._.globalAlpha = f < .5 ? 1-f : f;

      this._.fillStyle = '#EEE';

      this._.beginPath();
      this._.arc(50, 50, 5, 0, 360, 0);
      this._.closePath();
      this._.fill();

    }


  },

  path: [
    ['line', 0, 0, 1, 1] // stub -- not actually rendered
  ]

});




/*-----------------------------------------reload define-----------------------------------------*/


/*마우스 기능 */
let itemsContainer = document.getElementById("items-container");
let todosContainer = document.getElementById("todos-container");

let mouseOffset = {x:0, y:0};
let isMouseDown = false;
let currentTodo = null;

let doElsCollide = function(el1, el2) { 
  if(el1 !=null && el2 != null){

     el1.offsetBottom= el1.offsetTop + el1.offsetHeight;
     el1.offsetRight = el1.offsetLeft + el1.offsetWidth;
     el2.offsetBottom = el2.offsetTop + el2.offsetHeight;
     el2.offsetRight = el2.offsetLeft + el2.offsetWidth;

     return !((el1.offsetBottom < el2.offsetTop) ||
               (el1.offsetTop > el2.offsetBottom) ||
               (el1.offsetRight < el2.offsetLeft) ||
               (el1.offsetLeft > el2.offsetRight))
  }

};

function onMouseDown(e, item) {
  isMouseDown = true;
  currentTodo = item;

  mouseOffset = {x: item.offsetLeft - e.clientX, y: item.offsetTop - e.clientY};
  
  item.style.filter = "brightness(50%)";
}

function onMouseMove(e) {
  e.preventDefault();  
  if(isMouseDown) {
    currentTodo.style.left = e.clientX + mouseOffset.x + "px";
    currentTodo.style.top = e.clientY + mouseOffset.y + "px";
    }
}

function onMouseUp(e, item) {
  isMouseDown = false;
  item.style.filter = "brightness(100%)";
}

function onMouseOver(e, item) {
  if(!isMouseDown){
    item.style.filter = "brightness(130%)";
  }
}
function onMouseOut(e, item) {
  if(!isMouseDown){
    item.style.filter = "brightness(100%)";
  }
}

function setListeners(todoItems) {
  for(let i = 0; i < todoItems.length; i++) {
  let item = todoItems[i];
  item.addEventListener("mousedown", (e) => { onMouseDown(e, item); });
  item.addEventListener("mouseover", (e) => { onMouseOver(e, item); });
  item.addEventListener("mouseout", (e) => { onMouseOut(e, item); });
  document.body.addEventListener("mousemove", (e) => {
    onMouseMove(e);
  });
  item.addEventListener("mouseup", (e) => {
    onMouseUp(e, item);
  });
  
}}

function setListener(todoItem) {
  
  todoItem.addEventListener("mousedown", (e) => { onMouseDown(e, todoItem); });
  todoItem.addEventListener("mouseover", (e) => { onMouseOver(e, todoItem); });
  todoItem.addEventListener("mouseout", (e) => { onMouseOut(e, todoItem); });
  document.body.addEventListener("mousemove", (e) => {
    onMouseMove(e);
  });
  todoItem.addEventListener("mouseup", (e) => {
    onMouseUp(e, todoItem);
  });
  
}

setInterval(() => {
  let areas = document.getElementsByClassName("red-blue");
  for(let i = 0; i < areas.length; i++) {
       
    areas[i].className = areas[i].className.replace("over", "");
    if(doElsCollide(currentTodo, areas[i])) {
      areas[i].className += " over"; 
      if(!isMouseDown) {
        snapTodo(currentTodo, areas[i], i);
      }
    }
  }
}, 100);

function snapTodo(todo, container,index) {
  area_list = ["left","right"];
    temp_list = document.getElementsByClassName(area_list[index]);
    for(let i=0;i<temp_list.length;i++){
      let item = temp_list[i];
      if(!item.hasChildNodes()){
        let box = item.getBoundingClientRect();
        todo_clone = todo.cloneNode();
        todo.remove();
        item.append(todo_clone);
        setListener(todo_clone);
        todo_clone.style.left = box.x + "px";
        todo_clone.style.top = box.y - 10 + "px";
        currentTodo = null;
        

        break;
      }
    }

  }




/*------------------------------------------------------------------*/

class Queue {
  constructor() {
    this._arr = [];
    this.cnt = 0;
  }
  enqueue(item) {
    this._arr.push(item);
    this.cnt += 1;
  }
  dequeue() {
    this.cnt -= 1;
    return this._arr.shift();
  }
  pop(){
    return this._arr[0];
  }
  length(){
    return this.cnt;
  }
}

function confirm_click(){
  clearAll();
  // icon.play();
  
  // $('.neutral').append(icon);

  // 경민이형 여기에 ajax 기능 추가해줘
  if(total_queue.cnt > 0){
  init();
  }
  else{
    alert("done!")
  }
}

function getSyncScriptParams() {
   var scripts = document.getElementsByTagName('script');
   var lastScript = scripts[scripts.length-1];
   var scriptName = lastScript;
   return {
       keywords : scriptName.getAttribute('keywords'),
       images : scriptName.getAttribute('images'),
   };
 }

var blue_test_number = 6;
var red_test_number = 6;
var neutral_test_number = 2;
var params = new getSyncScriptParams();
var images = JSON.parse(params.images);
  
/* create queues */  
var total_queue = new Queue();
total_queue._arr = Object.values(images);
total_queue.cnt = total_queue._arr.length;
const neutral_queue = new Queue();
const blue_queue = new Queue();
const red_queue = new Queue();

function description(){
  var keyword_list = JSON.parse(params.keywords);
  var left_word = "more likely "+ keyword_list[0];
  var right_word = "more likely not " + keyword_list[0];
  $('#adjective1').append(left_word);
  $('#adjective2').append(right_word);
  var sec_description = "Images in the left box will be labeled as \"" + keyword_list[0] +
  "\", in the middle box as \"NEUTRAL\", and in the right box as \"not "+ keyword_list[0]+"\"."
  $('#description2').append(sec_description);
}

function selectList(total_queue,b,n,r)
  {
    blue_temp = []
    neutral_temp = []
    red_temp = []
    
    for(var i=0;i<b;i++){
      blue_temp.push(total_queue.dequeue());
    }
    for(var i=0;i<n;i++){
      neutral_temp.push(total_queue.dequeue());
    }
    for(var i=0;i<r;i++){
      red_temp.push(total_queue.dequeue());
    }
    
    return [blue_temp, neutral_temp, red_temp]
  }
/* selectList에서 연산 결과값 반환*/

  
function clearQueue(queue){
  queue._arr = [];
  queue.cnt = 0;
}


function clearAll(){
  clearQueue(blue_queue);
  clearQueue(neutral_queue);
  clearQueue(red_queue);
  
  $('.todo-item').remove();
}

function reloadQueue(queue, nextComponents){
  for(var i=0; i < nextComponents.length; i++){
    queue.enqueue(nextComponents[i]);
  }
}

function enQueues(blue_queue, blue_list, neutral_queue, neutral_list, red_queue,red_list) {
  /* 나중에 백엔드 구축 나눠야함*/
  reloadQueue(blue_queue, blue_list);
  reloadQueue(red_queue, red_list);
  reloadQueue(neutral_queue, neutral_list);
  return blue_queue, neutral_queue, red_queue;
}


function displayImages(queue){
    
  for(var i=1;i<=queue.cnt;i++){
    if(queue._arr[i-1] != null){
      var img_node = document.createElement('img');
      img_node.setAttribute("class","todo-item");
      img_node.src = 'static/image/FFHQ_SAMPLE/' + queue._arr[i-1];
      var side = ""

      if(queue == blue_queue){
        side = "L"
      }
      else if(queue == red_queue){
        side = "R"
      }
      else{
        side = "N"
      }
      var ID = '#'.concat(side,String(i))
      $(ID).append(img_node);
    }
  }
}


function init(){
  clearAll();
  var getLists = new selectList(total_queue,blue_test_number,neutral_test_number,red_test_number);
  var blue_list = getLists[0];
  var neutral_list = getLists[1];
  var red_list = getLists[2];
  enQueues(blue_queue,blue_list,neutral_queue,neutral_list, red_queue,red_list);

  displayImages(blue_queue);
  displayImages(red_queue);
  displayImages(neutral_queue);
  
  todoItems = document.getElementsByClassName("todo-item");
  setListeners(todoItems);

}

var pageLoader = (function()
{ var ov = document.createElement("div");
  ov.className = "page-loader";
  ov.innerHTML = '<div class="loader"><p></p></div>';
  document.getElementsByTagName('body')[0].appendChild(ov);
  
  var info = document.createElement("div");
  info.className = "info";
  ov.appendChild(info);

  return {  
    show: function() 
    { ov.style.display = 'block';
      setTimeout (function(){ ov.className = "page-loader"; }, 500);
    },
    hide: function() 
    { ov.className = "page-loader hidden";
      setTimeout (function(){ ov.style.display = 'none'; }, 500);
    },
    info: function(i)
    { info.innerHTML = i || "";
    }
  };
})();


description();
init();



   setInterval(() => {
     let snaps = document.getElementsByClassName("snap");
     for(let i = 0; i < snaps.length; i++) {
          
       //Clear the Over class every time (Hide Elements are not under collision)
       snaps[i].className = snaps[i].className.replace("over", "");
       if(doElsCollide(currentTodo, snaps[i])) {
         //There is a collision then we are good to
         snaps[i].className += " over"; ///< Over class will show the snap container 
     
         if(!isMouseDown) {
          //Snap Current Todo under Current Snap Container :)
          snapTodo(currentTodo, snaps[i]);
          
        }
     }
     }
  }, 100);




