/*마우스 기능 */
let itemsContainer = document.getElementById("items-container");
let todosContainer = document.getElementById("todos-container");
let temp = document.getElementsByClassName("img_temp")[0];
let confirm_button = document.getElementsByClassName("button-confirm")[0];
confirm_button.disabled = false;
console.log("dis",confirm_button.disabled);

let history_list_left = [];
let history_list_right = [];
let history_list_middle = [];
let mouseOffset_list = [];
let mouseOffset = {x:0, y:0};
let isMouseDown = false;
let currentTodo = null;
let currentList = [];
let tempTodo = null;
let tempTodo_list = [];
let ctrlPressed = false;
let multiChoice = false;
let outData = null;
let onLoadcount = 0;
let totalDisplay = 14;

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
  console.log("bug?");
  e.preventDefault();  
  isMouseDown = true;
  currentTodo = item;
  currentTodo.style.zIndex = "2";
  mouseOffset = {x: item.offsetLeft - e.clientX, y: item.offsetTop - e.clientY};
  item.style.filter = "brightness(50%)";
}

function onMouseDown_clone(e, item) {
  
  let isOver = tempTodo.className.includes("over");
  if(ctrlPressed){
    if(isOver){
      console.log("ctrl down over");
      tempTodo.className = tempTodo.className.replace(" over","");
      item.className = tempTodo.className.replace(" over","");

    }
    else{
      console.log("ctrl down");
      multiChoice = true;
      tempTodo.className +=' over';
      let multi_list = document.getElementsByClassName('over');   
      console.log(multi_list);
    }
  }
  else{
    if(isOver){
      console.log("over");
  e.preventDefault();  
  isMouseDown = true;
  currentTodo = item;
  currentList = [];
  let multi_items = document.getElementsByClassName('over');
  tempTodo_list = [];
  for(let i=0;i<multi_items.length;i++){
    tempTodo_list.push(multi_items[i]);
    
    let multi_clone = cloneImage(multi_items[i]);
    if(multi_clone.getAttribute('slot') != item.getAttribute('slot')){
      $(".img_temp").append(multi_clone);
      currentList.push(multi_clone)
    }
    else{
      currentList.push(item);
    }
  }

  for(let i=0;i<currentList.length;i++){
    currentList[i].style.zIndex = "2";  
    currentList[i].style.filter = "brightness(50%)";
  }
  mouseOffset_list = [];
  for(let i=0;i<currentList.length;i++){
    mouseOffset_list.push({x: currentList[i].offsetLeft - e.clientX, y: currentList[i].offsetTop - e.clientY});
    tempTodo_list[i].remove();
  }
}
    else{
  console.log("down");
  e.preventDefault();
  console.log(multiChoice);
  isMouseDown = true;
  item.style.zIndex = "2";
  currentList = [];
  currentList.push(item);
  currentTodo = item;
  mouseOffset_list = [];
  mouseOffset_list.push({x: item.offsetLeft - e.clientX, y: item.offsetTop - e.clientY});
  tempTodo.remove();
  item.style.filter = "brightness(50%)";
    }
  }
}

function onMouseMove(e) {
  e.preventDefault();
  if(isMouseDown) {
    // if($('.img_temp').children().length == 1){
    //   currentTodo.style.left = e.clientX + mouseOffset.x + "px";
    //   currentTodo.style.top = e.clientY + mouseOffset.y + "px";
    // }
  }  
}

function onMouseMove_clone(e) {
  e.preventDefault();
  if(isMouseDown) {
    for(let i=0;i<currentList.length;i++){
      currentList[i].style.left = e.clientX + mouseOffset_list[i].x + "px";
      currentList[i].style.top = e.clientY + mouseOffset_list[i].y + "px";  
    
  }
  }
}

function onMouseUp(e, item) {
  currentTodo.style.zIndex = "1";
  isMouseDown = false;
  item.style.filter = "brightness(100%)";
  console.log('up1');
}

function onMouseUp_clone(e, item) {
  if(ctrlPressed){

  }
  else{
    currentTodo.style.zIndex = "1";
    isMouseDown = false;
    item.style.filter = "brightness(100%)";
  }
}

function onMouseOver(e, item) {
  if(!isMouseDown){

    item.style.filter = "brightness(130%)";
    todo_clone = cloneImage(item);
    tempTodo = item;
    
    if ( temp.hasChildNodes() ) { temp.removeChild( temp.firstChild ); }

    $(".img_temp").append(todo_clone);
    setListener_clone(todo_clone);
  }
}

function cloneImage(item){
  todo_clone = item.cloneNode();
    todo_clone.position = "absolute";
    todo_clone.className = todo_clone.className.replace(" over","");
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
    todo_clone.setAttribute('slot', item.parentNode.id);
    return todo_clone;
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
    emptyCheck = 0;
    let lastRows = areas[i].getElementsByClassName('image_row')[areas[i].getElementsByClassName('image_row').length-1].getElementsByTagName('div');
    for(let j=0; j < lastRows.length; j++){
      if(!lastRows[j].hasChildNodes()){
        emptyCheck = emptyCheck + 1;
      }
    }
    if(
      emptyCheck == lastRows.length
      && areas[i].getElementsByClassName('image_row').length > 3){
      areas[i].getElementsByClassName('image_row')[areas[i].getElementsByClassName('image_row').length-1].remove();
    }
    

    //check : 아이템이 속한 container의 수를 체크하는 변수
    areas[i].className = areas[i].className.replace("cont_on", "");
    
      if(doElsCollide(currentTodo, areas[i])) {
        areas[i].className += " cont_on";
        check = check + 1;
        if(!isMouseDown) {
          for(let j=0; j < currentList.length; j++){
            snapTodo(currentList[j], areas[i], i);
          }
          currentList = [];
        
      }
    }
  }  
    

  //다른 곳 놨을 때, 원래 자리로 놓는 코드
    if(check == 0 && currentTodo != null) {
      if(!isMouseDown) {
        let i = currentTodo.getAttribute('id');
        for(let j=0; j < currentList.length; j++){
          snapTodo(currentList[j], areas[i], i);
        }
        currentList = [];
      }
    }
  

  
}, 100);

function snapTodo(todo, container,index) {
  area_list = ["left","center","right"];
  id_list = ["L","N","R"];
  
  let jObject = new Object();
  jObject.Time = js_yyyy_mm_dd_hh_mm_ss ();
  jObject.adjective = keyword;
  jObject.What = todo.src.split(/[/]+/).pop();
  if(todo.getAttribute('id') == 0){
    jObject.From = "left"
  }
  else if(todo.getAttribute('id') == 1){
    jObject.From = "center"
  }
  else{
    jObject.From = "right"
  }
  jObject.To = area_list[index]
  logParam = JSON.stringify(jObject)
  
  jQuery.ajaxSettings.traditional = true;
  $.ajax({
    url : "/getLog",
    type: 'POST',
    data: {"jsonData" : logParam},
    dataType:'json',
    success: function(data) {

    },
    error: function(x, e) {
        alert("error");
    }
});
  let fullCount = 0;
  let lastID = "";
  let row_count = container.getElementsByClassName('image_row')[0].childElementCount;
    temp_list = document.getElementsByClassName(area_list[index]);
    for(let i=0;i<temp_list.length;i++){
      let item = temp_list[i];
      fullCount = fullCount + 1;
      if(i == (temp_list.length - 1)){
        lastID = item.id;
      }
      if(!item.hasChildNodes()){
        let box = item.getBoundingClientRect();
        todo_clone = todo.cloneNode();
        todo.remove();
        item.append(todo_clone);
        todo_clone.className = todo_clone.className.replace(" over","");
        setListener(todo_clone);
        todo_clone.style.left = 0 + "px";
        todo_clone.style.top = 0 + "px";
        todo_clone.style.filter = "brightness(100%)";
        currentTodo = null;
        fullCount = 0;
        break;
      }
    }

    if(fullCount == temp_list.length){
      console.log(row_count);
      new_row = document.createElement('div');
      for(let i=1;i<=row_count;i++){  
        new_slot = document.createElement('div');
        new_slot.className = area_list[index];
        new_slot.id = id_list[index] + (parseInt(lastID.replace(id_list[index],""))+i);
        
        if(i==1){
          todo_clone = todo.cloneNode();
          todo.remove();
          new_slot.append(todo_clone);
          todo_clone.className = todo_clone.className.replace(" over","");  
          setListener(todo_clone);
          todo_clone.style.left = 0 + "px";
          todo_clone.style.top = 0 + "px";
          currentTodo = null;
          fullCount = 0; 
        }
        
        new_row.append(new_slot); 
        
      }
      new_row.className = "image_row";
      container.append(new_row);
      


      console.log("full");
    }
  }
/*------------------------------------------------------------------*/
/* 키보드 기능 */

document.addEventListener("keydown", checkKeyPressed, false);
document.addEventListener("keyup", checkKeyUp, false);
document.addEventListener("mousedown", checkMousedown, false);

function checkMousedown(e) {
  if(multiChoice && !ctrlPressed){
    let multi_list = document.getElementsByClassName('over');
    let multi_length = multi_list.length;
    console.log(multi_length);
    for(let i=0;i<multi_length;i++){
      multi_list[0].className = multi_list[0].className.replace(" over","");
      
    }
  }
}

function checkKeyPressed(e) {
  if (e.keyCode == "17" || e.keyCode == "91") {
      ctrlPressed = true;
      console.log(ctrlPressed);
  }
}
function checkKeyUp(e) {

  if (e.keyCode == "17"|| e.keyCode == "91") {
    ctrlPressed = false;
  }
  else if (e.keyCode == "65"){
  console.log("pressed");
  if ( temp.hasChildNodes() ) { temp.removeChild( temp.firstChild ); }
  let multi_list = document.querySelectorAll('.over');
  let areas = document.getElementsByClassName("red-blue");
  
  for(let i=0;i<multi_list.length;i++){
    console.log(multi_list.item(i));
      snapTodo(multi_list.item(i),areas[0],0);
    }
  }
  else if (e.keyCode == "83"){
    console.log("pressed");
    if ( temp.hasChildNodes() ) { temp.removeChild( temp.firstChild ); }
  let multi_list = document.querySelectorAll('.over');  
  let areas = document.getElementsByClassName("red-blue");
    for(let i=0;i<multi_list.length;i++){
      console.log(multi_list.item(i));
      snapTodo(multi_list.item(i),areas[1],1);
    }
  }
  else if (e.keyCode == "68"){
  console.log("pressed");
  if ( temp.hasChildNodes() ) { temp.removeChild( temp.firstChild ); }
  let multi_list = document.querySelectorAll('.over');
  let areas = document.getElementsByClassName("red-blue");
    for(let i=0;i<multi_list.length;i++){
      console.log(multi_list.item(i));
      snapTodo(multi_list.item(i),areas[2],2);
    }
  }
  else if (e.keyCode == "32"){
    if(confirm_button.disabled == false){
      confirm_click();

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
    confirm_button.disabled = true;
    classifyImages();
}

function logout_click(){
  window.location = "http://130.211.240.166:5000//logout";
  // window.location.href = "http://127.0.0.1:5000/logout";
}  

function history_visualization(list){
  var divNode = document.createElement("div");
  divNode.style.width = "136px";
  divNode.style.height = "146.7px";
  divNode.style.position = "relative";
  divNode.style.float = "left";
  divNode.style.margin = "0px";
  for (var i=0; i<list.length; i++){
    var temp = divNode.cloneNode();
    if (list == history_list_left){
      list[i].classList.remove("todo-item");
      list[i].setAttribute("class","history-image");
      list[i].style.margin = '0px';
      $('.history_image_left').append(temp);
      $('.history_image_left').children()[i].append(list[i]);
    }
    else if (list == history_list_right){
      list[i].classList.remove("todo-item");
      list[i].setAttribute("class","history-image");
      list[i].style.margin = '0px';
      $('.history_image_right').append(temp);
      $('.history_image_right').children()[i].append(list[i]);
    }
    else {
      list[i].classList.remove("todo-item");
      list[i].setAttribute("class","history-image");
      list[i].style.margin = '0px';
      $('.history_image_middle').append(temp);
      $('.history_image_middle').children()[i].append(list[i]);
    }
  }
}

// 백엔드 ajax 통신 
function classifyImages(){
  
  let todo_list = document.getElementsByClassName("row")[0].getElementsByClassName("todo-item");
  let Jarray = new Array();
  let timeStamp= timeEnd - timeStart;
  timeStamp = JSON.stringify(timeStamp);
  console.log(timeStart);
  console.log(timeEnd);
  console.log(timeStamp);


  for(let i=0;i<todo_list.length;i++){
    let left_right = 0;
    if(todo_list[i].parentNode.className=='left'){
      left_right = 1;
      var temp = todo_list[i].cloneNode();
      history_list_left.push(temp);
    }
    else if(todo_list[i].parentNode.className=='right'){
      left_right = -1;
      var temp = todo_list[i].cloneNode();
      history_list_right.push(temp);

    }
    else{
      left_right = 0;
      var temp = todo_list[i].cloneNode();
      history_list_middle.push(temp);
    }

    let jObject = new Object();
    console.log(user_id);
    jObject.user_id = user_id;
    jObject.image_id = todo_list[i].src.split(/[/]+/).pop();
    jObject.adjective = keyword;
    jObject.label = left_right;
    jObject.time = timeStamp;
    Jarray.push(jObject);
    console.log(jObject);
  }
  history_visualization(history_list_left);  
  history_visualization(history_list_right);
  history_visualization(history_list_middle);

  let outParam = JSON.stringify(Jarray);
  jQuery.ajaxSettings.traditional = true;
  $.ajax({
    url : "/getData",
    type: 'POST',
    data: {"jsonData" : outParam},
    dataType:'json',
    success: function(data) {
      if(data['index'] < 3){
        init(data);
      }
      else{
        // window.location = "http://127.0.0.1:5000/logIn";
        window.location = "http://130.211.240.166:5000/logIn";
      }
    },
    error: function(x, e) {
        alert("error");
    }
});
  

};

$(document).ready(function() {
  var imagesLoaded = 0;
  var totalImages = $('img').length;

  $('img').each(function(idx, img) {
    $('<img>').on('load', imageLoaded).attr('src', $(img).attr('src'));
  });
  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded == totalImages) {
      confirm_button.disabled = false;
      console.log("good");
    }
  }
});

function getSyncScriptParams() {
   var scripts = document.getElementsByTagName('script');
   var lastScript = scripts[scripts.length-1];
   var scriptName = lastScript;
   return {
       keyword : scriptName.getAttribute('keyword'),
       images : scriptName.getAttribute('images'),
       user_id : scriptName.getAttribute('user_id'),
       test : scriptName.getAttribute("test"),
       total_num : scriptName.getAttribute("total_num"),
       count_num : scriptName.getAttribute("count_num")
   };
 }

var blue_test_number = 6;
var red_test_number = 6;
var neutral_test_number = 2;
var params = new getSyncScriptParams();
var images = JSON.parse(params.images);
var user_id = params.user_id;
var batch_count=1;
var total_num = JSON.parse(params.total_num);
var count_num = JSON.parse(params.count_num);
var timeEnd = 0;
var timeStart = 0;

/* create queues */  
var total_queue = new Queue();
total_queue._arr = Object.values(images);
total_queue.cnt = total_queue._arr.length;
const neutral_queue = new Queue();
const blue_queue = new Queue();
const red_queue = new Queue();
var keyword =params.keyword;


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

function js_yyyy_mm_dd_hh_mm_ss () {
  now = new Date();
  year = "" + now.getFullYear();
  month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}


function displayImages(queue){
  onLoadcount = 0;
  let displaycount = queue.cnt;
  for(var i=1;i<=queue.cnt;i++){
    if(queue._arr[i-1] != null){
      var img_node = document.createElement('img');
      img_node.setAttribute("class","todo-item");
      img_node.src = 'static/image/FFHQ_SAMPLE2/' + queue._arr[i-1];
      var side = "";

      if(queue == blue_queue){
        side = "L";
        img_node.setAttribute("id",0);
      }
      else if(queue == red_queue){
        side = "R";
        img_node.setAttribute("id",2);
      }
      else{
        side = "N";
        img_node.setAttribute("id",1);
      }
      var ID = '#'.concat(side,String(i));
      $(ID).append(img_node);
      img_node.onload = function(){
        console.log(onLoadcount, totalDisplay);
        onLoadcount++;
      if(onLoadcount == totalDisplay){
        confirm_button.disabled = false;
      }};
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

function init(data){
  clearAll();
  timeStart = Date.now();
  var getLists = null;
  var blue_list = null;
  var neutral_list = null;
  var red_list = null;


  if(typeof data != "undefined"){
    
    blue_list = data['blue'];
    neutral_list = data['neutral'];  
    red_list = data['red'];
    keyword = data['keyword'];
    count_num = data['image_count'];

  }
  else{
  
    getLists = new selectList(total_queue,blue_test_number,neutral_test_number,red_test_number);
    blue_list = getLists[0];
    neutral_list = getLists[1];
    red_list = getLists[2];
    
  }
  console.log(keyword);
  $('.keyword').text(keyword);
  $('.count').text(count_num);
  $('.total').text(total_num);


  enQueues(blue_queue,blue_list,neutral_queue,neutral_list, red_queue,red_list);
  totalDisplay = blue_queue.cnt + neutral_queue.cnt + red_queue.cnt;

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

init();
