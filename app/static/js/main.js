/*마우스 기능 */
let itemsContainer = document.getElementById("items-container");
let todosContainer = document.getElementById("todos-container");
let temp = document.getElementsByClassName("img_temp")[0];

let mouseOffset = {x:0, y:0};
let isMouseDown = false;
let currentTodo = null;
let tempTodo = null;

let doElsCollide = function(el1, el2) { 
  if(el1 != null && el2 != null){
 
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
  e.preventDefault();  
  isMouseDown = true;
  currentTodo = item;
  currentTodo.style.zIndex = "2";
  mouseOffset = {x: item.offsetLeft - e.clientX, y: item.offsetTop - e.clientY};
  item.style.filter = "brightness(50%)";
}

function onMouseDown_clone(e, item) {
  e.preventDefault();  
  isMouseDown = true;
  currentTodo = item;
  currentTodo.style.zIndex = "2";
  mouseOffset = {x: item.offsetLeft - e.clientX, y: item.offsetTop - e.clientY};
  tempTodo.remove();
  item.style.filter = "brightness(50%)";

}

function onMouseMove(e) {
  e.preventDefault();
  if(isMouseDown) {
    currentTodo.style.left = e.clientX + mouseOffset.x + "px";
    currentTodo.style.top = e.clientY + mouseOffset.y + "px";
    }  
}

function onMouseMove_clone(e) {
  e.preventDefault();
  if(isMouseDown) {
    currentTodo.style.left = e.clientX + mouseOffset.x + "px";
    currentTodo.style.top = e.clientY + mouseOffset.y + "px";
    }
}

function onMouseUp(e, item) {
  currentTodo.style.zIndex = "1";
  isMouseDown = false;
  item.style.filter = "brightness(100%)";
  console.log('up1');
}

function onMouseUp_clone(e, item) {
  currentTodo.style.zIndex = "1";
  isMouseDown = false;
  item.style.filter = "brightness(100%)";
}

function onMouseOver(e, item) {
  if(!isMouseDown){
    todo_clone = item.cloneNode();
    todo_clone.position = "absolute";
    
    todo_clone.style.left = item.parentNode.offsetLeft - 15 + "px";
    
    if(item.parentNode.className == "left"){
      todo_clone.style.top = item.parentNode.offsetTop - $('.blue').scrollTop() + "px";
      todo_clone.setAttribute('id', 0);
    }
    else if(item.parentNode.className == "right"){
      todo_clone.style.top = item.parentNode.offsetTop - $('.red').scrollTop() + "px";
      todo_clone.setAttribute('id', 2);
    }
    else{
      todo_clone.style.top = item.parentNode.offsetTop - $('.neutral').scrollTop() + "px";
      todo_clone.setAttribute('id', 1);
    }
    tempTodo = item;
    
    if ( temp.hasChildNodes() ) { temp.removeChild( temp.firstChild ); }
    
    $(".img_temp").append(todo_clone);
    setListener_clone(todo_clone);
  }
}

function onMouseOver_clone(e, item) {
  if(!isMouseDown){
    item.style.filter = "brightness(130%)";
  }
}

function onMouseOut(e, item) {
  if(!isMouseDown){
    item.style.filter = "brightness(100%)";
  }
}

function onMouseOut_clone(e, item) {
  if(!isMouseDown){
    item.style.filter = "brightness(100%)";
    item.remove();
    if ( temp.hasChildNodes() ) { temp.removeChild( temp.firstChild ); }
  }
}

function setListeners(todoItems) {
  for(let i = 0; i < todoItems.length; i++) {
  let item = todoItems[i];
  item.setAttribute('multi', 'false');
  item.addEventListener("mousedown", (e) => { onMouseDown(e, item); });
  item.addEventListener("mouseover", (e) => { onMouseOver(e, item); });
  item.addEventListener("mouseout", (e) => { onMouseOut(e, item); });
  document.body.addEventListener("mousemove", (e) => {
    onMouseMove(e);
  });
  item.addEventListener("mouseup", (e) => {
    onMouseUp(e, item);
  });
  }
}
 
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
  console.log(0);

}
  
function setListener_clone(todoItem) {
  
  todoItem.addEventListener("mousedown", (e) => { onMouseDown_clone(e, todoItem); });
  todoItem.addEventListener("mouseover", (e) => { onMouseOver_clone(e, todoItem); });
  todoItem.addEventListener("mouseout", (e) => { onMouseOut_clone(e, todoItem); });
  document.body.addEventListener("mousemove", (e) => {
    onMouseMove_clone(e);
  });
  todoItem.addEventListener("mouseup", (e) => {
    onMouseUp_clone(e, todoItem);
  }); 


}

setInterval(() => {
  let areas = document.getElementsByClassName("red-blue");
  let check = 0;
  for(let i = 0; i < areas.length; i++) {
       
    areas[i].className = areas[i].className.replace("over", "");
    if(doElsCollide(currentTodo, areas[i])) {
      areas[i].className += " over";
      console.log("good");
      check = check + 1;
      if(!isMouseDown) {
        snapTodo(currentTodo, areas[i], i);
      }
    }
  }  
    
    if(check == 0 && currentTodo != null) {
      if(!isMouseDown) {
        let i = currentTodo.getAttribute('id');
        snapTodo(currentTodo, areas[i], i);
      }
    }
  
}, 100);

function snapTodo(todo, container,index) {
  area_list = ["left","center","right"];
    temp_list = document.getElementsByClassName(area_list[index]);
    for(let i=0;i<temp_list.length;i++){
      let item = temp_list[i];
      if(!item.hasChildNodes()){
        let box = item.getBoundingClientRect();
        todo_clone = todo.cloneNode();
        console.log(todo_clone);
        todo.remove();
        console.log(todo);
        item.append(todo_clone);
        setListener(todo_clone);
        todo_clone.style.left = 0 + "px";
        todo_clone.style.top = 0 + "px";
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
  timeEnd = Date.now();
  batch_count += 1;
  $("#description0").empty();
  $('#description0').append(batch_count + ' / ' + batch_size);

  if(total_queue.cnt > 0){
    // timeStamp();
    classifyImages();
    init();
  }
  else{
    alert("done!")
  }
}  



function classifyImages(){
  
  let todo_list =  document.getElementsByClassName("todo-item");
  let Jarray = new Array();
  let timeStamp= timeEnd - timeStart;
  timeStamp = JSON.stringify(timeStamp);
  console.log(timeStart);
  console.log(timeEnd);
  console.log(timeStamp);

  for(let i=0;i<todo_list.length;i++){
    let left_right = 0
    if(todo_list[i].parentNode.className=='left'){
      left_right = 1;
    }
    else if(todo_list[i].parentNode.className=='right'){
      left_right = -1;
    }
    else{
      left_right = 0;
    }
    let jObject = new Object();
    jObject.image_id = '('.concat(todo_list[i].src.split(/[(]+/).pop());
    jObject.adjective = keyword_list[0];
    jObject.label = left_right;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    jObject.time = timeStamp;
=======
>>>>>>> parent of ce097c8... scroll function added
=======
>>>>>>> parent of ce097c8... scroll function added
=======
>>>>>>> parent of ce097c8... scroll function added
=======
>>>>>>> parent of ce097c8... scroll function added
    Jarray.push(jObject);
    
  }
  Jarray.push(timeStamp);
  let outParam = JSON.stringify(Jarray);
  jQuery.ajaxSettings.traditional = true;
  $.ajax({
    url : "/getData",
    type: 'POST',
    data: {"jsonData" : outParam},
    dataType:'json',
    success: function(data) {

    },
    error: function(x, e) {
        alert("error");
    }
});
  

};




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
var batch_count=1;
var batch_size = parseInt(Object.keys(images).length/12) + 1;
var timeEnd = 0;
var timeStart = 0;

/* create queues */  
var total_queue = new Queue();
total_queue._arr = Object.values(images);
total_queue.cnt = total_queue._arr.length;
const neutral_queue = new Queue();
const blue_queue = new Queue();
const red_queue = new Queue();
var keyword_list = JSON.parse(params.keywords);

function description(){
  var left_word = "more likely "+ keyword_list[0];
  var right_word = "more likely not " + keyword_list[0];
  $('#description0').append("1 / "+batch_size);
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
  timeStart = Date.now();
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