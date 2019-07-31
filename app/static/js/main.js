/* 패러미터 */
const NUMBER_OF_ADJECTIVE = 3;
const BLUE_IMAGE_NUMBER = 6;
const RED_IMAGE_NUMBER = 6;
const NEUTRAL_IMAGE_NUMBER = 2;
const IMAGE_PATH ="static/image/FFHQ_SAMPLE2/"


/* Tool 기능 관련 변수들 */

let itemsContainer = document.getElementById("items-container");
let todosContainer = document.getElementById("todos-container");
let temp = document.getElementsByClassName("img_temp")[0];
let confirm_button = document.getElementsByClassName("button-confirm")[0];
confirm_button.disabled = false;

let history_list_left = [];
let history_list_right = [];
let history_list_middle = [];
let mouseOffset = {x:0, y:0};
let isMouseDown = false;

let currentTodo = null;
let currentList = [];
let tempTodo = null;
let tempTodo_list = [];

let ctrlPressed = false;
let multiChoice = false;
let totalDisplay = null;

let beforeLabel = [];

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

function onMouseDown_clone(e, item) {
  
  let isOver = tempTodo.className.includes("over");
  if(ctrlPressed){
    if(isOver){
      tempTodo.className = tempTodo.className.replace(" over","");
      item.className = tempTodo.className.replace(" over","");

    }
    else{
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
  e.preventDefault();
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

function onMouseMove_clone(e) {
  e.preventDefault();
  if(isMouseDown) {
    for(let i=0;i<currentList.length;i++){
      currentList[i].style.left = e.clientX + mouseOffset_list[i].x + "px";
      currentList[i].style.top = e.clientY + mouseOffset_list[i].y + "px";
    }
  }
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
    todo_clone.style.left = document.getElementsByClassName('col-sm-12')[0].offsetLeft
                          + item.parentNode.offsetLeft - 15 + "px";
    // console.log(item.parentNode, item.parentNode.left);
    // console.log(item.parentNode.parentNode,item.parentNode.parentNode.left);

    var top = document.body.scrollTop;

    if(item.parentNode.className == "left"){
      todo_clone.style.top = item.parentNode.offsetTop - top + "px";
      todo_clone.setAttribute('id', 0);
    }
    else if(item.parentNode.className == "right"){
      todo_clone.style.top = item.parentNode.offsetTop - top + "px";
      todo_clone.setAttribute('id', 2);
    }
    else{
      todo_clone.style.top = item.parentNode.offsetTop - top + "px";
      todo_clone.setAttribute('id', 1);
    }
    todo_clone.setAttribute('slot', item.parentNode.id);
    return todo_clone;
}

function createAttributes(item){
  var item_src = item.src.split("/").pop(-1);
  console.log(item_src);
  var temp = attr_list[String(item_src)];
  console.log(temp);
  for (var i =0; i< temp.length; i++){
    var tag_node = document.createElement('div');
    tag_node.setAttribute('class', 'attr-tag');
    tag_node.innerText = temp[i];     
    $('#attribute1').append(tag_node);
  }
}

function onMouseOver_clone(e, item) {
  if(!isMouseDown){
    item.style.filter = "brightness(130%)";
    createAttributes(item);
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
    $('#attribute1').children().remove();
  }
}

function setListeners(todoItems) {
  for(let i = 0; i < todoItems.length; i++) {
  let item = todoItems[i];
  item.addEventListener("mouseout", (e) => {onMouseOut(e, item); });
  item.addEventListener("mouseover", (e) => { onMouseOver(e, item); });
  }
}
 
function setListener(todoItem) {
  todoItem.addEventListener("mouseout", (e) => {onMouseOut(e, todoItem); });
  todoItem.addEventListener("mouseover", (e) => { onMouseOver(e, todoItem); });
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

/* 매 0.1초마다 실행하는 함수 */
setInterval(() => {
  let areas = document.getElementsByClassName("red-blue");
  
  /* 매 0.1초마다 emptyCheck 변수로 마지막 row가 비어있으면 image row를 삭제해 동적으로 container의 크기를 결정*/
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
    // doElsCollide 함수로 현재 드래그 중인 아이템과 container area가 위치상 겹쳐지게 되면 container area에 빨간 줄을 띄우고
    // 그 상태에서 마우스 버튼이 올라가게 되면 그 container로 드래그 중인 이미지를 삽입

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
    

  //check ==0, 드래그 중인 이미지가 겹쳐지는 container가 없을 때, 마우스 버튼이 올라가게 되면
  // 해당 이미지의 원래 container로 이미지를 삽입
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

//container에 todo이미지를 삽입하는 함수
function snapTodo(todo, container,index) {
  area_list = ["left","center","right"];
  id_list = ["L","N","R"];
  
//log data를 저장하기 위한 jObject 선언
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

//ajax 통신을 통해 이미지가 어디서 어디로 옮겨졌는지 데이터베이스에 로그데이터 저장
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

  // 드래그 중인 이미지가 image row에 여유 공간이 있으면 해당 image row에 image를 append
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

    // 만약 full count가 전체 row의 개수와 같다(모든 image row가 image로 가득 찼다면) 새로운 image row를 만들어 div 확장
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
    }
  }
/*------------------------------------------------------------------*/
/* 키보드 기능 */

document.addEventListener("keydown", checkKeyPressed, false);
document.addEventListener("keyup", checkKeyUp, false);
document.addEventListener("mousedown", checkMousedown, false);

//multiChoice 상태에서 외부 지점을 클릭하면 multiChoice된 image 모두 해제
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

//키보드 관련 컨트롤 함수

//control 키 눌림
function checkKeyPressed(e) {
  if (e.keyCode == "17" || e.keyCode == "91") {
      ctrlPressed = true;
      console.log(ctrlPressed);
  }
}

function checkKeyUp(e) {

//control 키 떼짐
  if (e.keyCode == "17"|| e.keyCode == "91") {
    ctrlPressed = false;
  }

//multi_choice된 상태에서 'a' key가 떼지면 모두 왼쪽으로 이동
  else if (e.keyCode == "65"){
  if ( temp.hasChildNodes() ) { temp.removeChild( temp.firstChild ); }
  let multi_list = document.querySelectorAll('.over');
  let areas = document.getElementsByClassName("red-blue");
  
  for(let i=0;i<multi_list.length;i++){
    console.log(multi_list.item(i));
      snapTodo(multi_list.item(i),areas[0],0);
    }
  }

//multi_choice된 상태에서 's' key가 떼지면 모두 가운데쪽으로 이동
  else if (e.keyCode == "87"){
    if ( temp.hasChildNodes() ) { temp.removeChild( temp.firstChild ); }
  let multi_list = document.querySelectorAll('.over');  
  let areas = document.getElementsByClassName("red-blue");
    for(let i=0;i<multi_list.length;i++){
      console.log(multi_list.item(i));
      snapTodo(multi_list.item(i),areas[1],1);
    }
  }
  
//multi_choice된 상태에서 'd' key가 떼지면 모두 오른쪽으로 이동
  else if (e.keyCode == "68"){
  if ( temp.hasChildNodes() ) { temp.removeChild( temp.firstChild ); }
  let multi_list = document.querySelectorAll('.over');
  let areas = document.getElementsByClassName("red-blue");
    for(let i=0;i<multi_list.length;i++){
      console.log(multi_list.item(i));
      snapTodo(multi_list.item(i),areas[2],2);
    }
  }

//'space bar' key가 떼지면 confirm
  else if (e.keyCode == "83"){
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

//백엔드의 변수를 가져오는 함수
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
      count_num : scriptName.getAttribute("count_num"),
      cluster : scriptName.getAttribute("cluster"),
      current_cluster : scriptName.getAttribute("current_cluster"),
      label : scriptName.getAttribute("label"),
      attr_list : scriptName.getAttribute("attr_list")
  };
}

//화면 image 로딩 완료하면 confirm 버튼 활성화
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
    }
  }
});

//confirm 누름
function confirm_click(){
  timeEnd = Date.now();
    confirm_button.disabled = true;
    classifyImages();
}

//logout 누름
function logout_click(){
  window.location = "http://130.211.240.166:5000//logout";
  // window.location.href = "http://127.0.0.1:5000/logout";
}  

//
function history_visualization(list, newcnt){
  var divNode = document.createElement("div");
  divNode.style.width = "136px";
  divNode.style.height = "146.7px";
  divNode.style.position = "relative";
  // divNode.style.border = "solid";
  divNode.style.float = "left";
  divNode.style.margin = "0px";
  for (var i=0; i<newcnt; i++){
    let idx = list.length-newcnt+i;
    var temp = divNode.cloneNode();
    list[idx].classList.remove("todo-item");
    list[idx].setAttribute("class","history-image");
    list[idx].style.padding = '0px';
    list[idx].style.margin = '0px';
    if (list == history_list_left){
      $('.history_image_left').append(temp);
      $('.history_image_left').children()[idx].append(list[idx]);
      console.log(list.length-newcnt+i);
    }
    else if (list == history_list_right){
      $('.history_image_right').append(temp);
      $('.history_image_right').children()[idx].append(list[idx]);
      console.log(list.length-newcnt+i);
    }
    else {
      $('.history_image_middle').append(temp);
      $('.history_image_middle').children()[idx].append(list[idx]);
      console.log(list.length-newcnt+i);
    }
  }
}

function classifyImages(){
  let cnt_l = 0;
  let cnt_n = 0;
  let cnt_r = 0;

  // 배치된 image를 jarray형식으로 백엔드(/getData)로 전송
  let todo_list = document.getElementsByClassName("row")[0].getElementsByClassName("todo-item");
  let Jarray = new Array();
  let timeStamp= timeEnd - timeStart;
  timeStamp = JSON.stringify(timeStamp);
  

  for(let i=0;i<todo_list.length;i++){
    let left_right = 0;
    if(todo_list[i].parentNode.className=='left'){
      left_right = 1;
      var temp = todo_list[i].cloneNode();
      history_list_left.push(temp);
      cnt_l = cnt_l + 1;
    }
    else if(todo_list[i].parentNode.className=='right'){
      left_right = -1;
      var temp = todo_list[i].cloneNode();
      history_list_right.push(temp);
      cnt_r = cnt_r + 1;
    }
    else{
      left_right = 0;
      var temp = todo_list[i].cloneNode();
      history_list_middle.push(temp);
      cnt_n = cnt_n + 1;
    }

    let jObject = new Object();
    jObject.user_id = user_id;
    jObject.image_id = todo_list[i].src.split(/[/]+/).pop();
    jObject.adjective = keyword;
    jObject.label = left_right;
    jObject.time = timeStamp;
    Jarray.push(jObject);
  }

  history_visualization(history_list_left, cnt_l);  
  history_visualization(history_list_right, cnt_r);
  history_visualization(history_list_middle, cnt_n);

  let outParam = JSON.stringify(Jarray);
  jQuery.ajaxSettings.traditional = true;
  $.ajax({
    url : "/getData",
    type: 'POST',
    data: {"jsonData" : outParam},
    dataType:'json',
    success: function(data) {
      //NUMBER_OF_ADJECTIVE만큼 실험을 안 했다면 화면 초기화(init)
      //NUMBER_OF_ADJECTIVE만큼 실험을 했다면 로그아웃 (이 때, user db의 isDone 필드가 True로 바뀌며 재접속 불가능)
      if(data['index'] < NUMBER_OF_ADJECTIVE){
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

/* 백엔드 parameter 받는 변수 선언 */
var params = new getSyncScriptParams();

var images = JSON.parse(params.images);
var current_cluster = JSON.parse(params.current_cluster);
var label = JSON.parse(params.label);
var attr_list = JSON.parse(params.attr_list);
var total_num = JSON.parse(params.total_num);
var count_num = JSON.parse(params.count_num);
var keyword =params.keyword;
var user_id = params.user_id;

var timeEnd = 0;
var timeStart = 0;

/* create queues */  
var total_queue = new Queue();
total_queue._arr = Object.values(images);
total_queue.cnt = total_queue._arr.length;
let neutral_queue = [];
let blue_queue = [];
let red_queue = [];


function selectList(total_queue,b,n,r)
  {
    for(var i=0;i<b;i++){
      blue_queue.push(total_queue.dequeue());
    }
    for(var i=0;i<n;i++){
      neutral_queue.push(total_queue.dequeue());
    }
    for(var i=0;i<r;i++){
      red_queue.push(total_queue.dequeue());
    } 
  }

function clearAll(){
  blue_queue = [];
  red_queue = [];
  neutral_queue = [];
  
  $('.todo-item').remove();
}

// function reloadQueue(queue, nextComponents){
//   for(var i=0; i < nextComponents.length; i++){
//     queue.enqueue(nextComponents[i]);
//   }
// }

// function enQueues(blue_queue, blue_list, neutral_queue, neutral_list, red_queue,red_list) {
//   reloadQueue(blue_queue, blue_list);
//   reloadQueue(red_queue, red_list);
//   reloadQueue(neutral_queue, neutral_list);
//   return blue_queue, neutral_queue, red_queue;
// }

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

/* array에 있는 image를 보여주는 함수 */
function displayImages(queue){
  onLoadcount = 0;
  for(var i=1;i<=queue.length;i++){
    if(queue[i-1] != null){
      var img_node = document.createElement('img');
      img_node.setAttribute("class","todo-item");
      img_node.src = IMAGE_PATH + queue[i-1];

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
        onLoadcount++;
      if(onLoadcount == totalDisplay){
        confirm_button.disabled = false;  
        timeStart = Date.now();
      }};
    }
  }
}

function init(data){
  clearAll();

  if(typeof data != "undefined"){
    
    blue_queue = data['blue'];
    neutral_queue = data['neutral'];  
    red_queue = data['red'];
    keyword = data['keyword'];
    count_num = data['image_count'];
    isNewset = data['isNewset'];
    score = data['score'];
    current_cluster = data['current_cluster'];

    var temp_dots = []
    for(x in dots)
    temp_dots.push(dots[x].image_id);

    for(let i=0;i<score.length;i++){
      score[i].score = parseFloat(dots[temp_dots.indexOf(score[i].image_id)].score) + score[i].score;
      dots[temp_dots.indexOf(score[i].image_id)].score = score[i].score;
    }   

    markLabel(score);
    returnCurrent(beforeLabel);
    currentLabeling(current_cluster);

    if(isNewset){
      returnMark();
    }
  }
  else{
    selectList(total_queue,BLUE_IMAGE_NUMBER,NEUTRAL_IMAGE_NUMBER,RED_IMAGE_NUMBER);
  }

  $('.keyword').text(keyword);
  $('.count').text(count_num);
  $('.total').text(total_num);


  totalDisplay = blue_queue.length + neutral_queue.length + red_queue.length;

  displayImages(blue_queue);
  displayImages(red_queue);
  displayImages(neutral_queue);
  todoItems = document.getElementsByClassName("todo-item");
  setListeners(todoItems);
}

/*--------------------------- tsne 그래프 ----------------------------------------*/

var margin = { top: 0, right: 30, bottom: 0, left: 0},
// width = 600 - margin.left - margin.right,
// height = 640 - margin.top - margin.bottom;
width = 350;
height = 1017;
var svg = d3.select("#tsne_div")
          .append("svg")
          // .attr("width", 570 + "px")
          // .attr("height",  height + margin.top + margin.bottom + "px")
          .attr("width", 330 + "px")
          .attr("height",  1017 + "px")
          .style("border","none") 
          .style("background-color", "none")
          .call(d3.zoom()
                 .on("zoom", function () {
          svg.attr("transform", d3.event.transform)
                 })
                 .scaleExtent([1,4])
                 // .translateExtent([[0,0],[570,640]])
                 .translateExtent([[0,0],[350,1017]])
            )
          .append("g");

var svg1 = d3.select('svg')

svg1.append('rect')
    .attr('x',1)
    .attr('y',height-100)
    .attr("width",130)
    .attr("height",100)
    .attr("stroke","#151515")
    .attr("stroke-width",1)
    .style("fill","#FFFFFF");


    tsne_img = d3.select('body').append('div')
    .attr("class","tsne_img");

                

// legend 정의
var legend = svg1.selectAll(".legend")
                 .data([{text:'Positive', color:'rgb(65,122,255,1)', border:"transparent"},
                       {text:'Negative', color:'rgb(242,108,108,1)', border:"transparent"},
                      {text: 'Not labeled', color:'#AAAAAA', border:"transparent"},
                      {text: 'Current Image', color:'#FFFFFF', border:"#FF0000"}])
                 .enter().append("g")
                 .attr("class","legend")
                 .attr("transform", function(d, i) {return "translate(0," + i*20 + ")";});

legend.append("circle").attr("cx",15)
                       .attr("cy",height - 80)
                       .attr("r", 6)
                       .style("fill", function(d){return d.color})
                       .attr("stroke-width", 2)
                       .attr("stroke", function(d){return d.border});


legend.append("text").attr("x", 30)
                     .attr("y", height - 80)
                     .attr("dy", ".35em")
                     .attr("font-size",13)
                     .text(function(d) { return d.text});

var rect = svg.append("rect")
.attr("width", width)
.attr("height", height)
.style("fill", "none")
.style("pointer-events", "all");

var container = svg.append("g");

container.append("g")
.attr("class", "x axis")
.selectAll("line")
.data(d3.range(0, width, 10))
.enter().append("line")
.attr("x1", function (d) { return d; })
.attr("y1", 0)
.attr("x2", function (d) { return d; })
.attr("y2", height);

container.append("g")
.attr("class", "y axis")
.selectAll("line")
.data(d3.range(0, height, 10))
.enter().append("line")
.attr("x1", 0)
.attr("y1", function (d) { return d; })
.attr("x2", width)
.attr("y2", function (d) { return d; });

xList = [];
yList = [];

dots = JSON.parse(params.cluster);

for(let i=0;i<dots.length;i++){
  dots[i].x = parseFloat(dots[i].x);
  xList.push(dots[i].x);
  dots[i].y = parseFloat(dots[i].y);
  yList.push(dots[i].y);
}

function scaleData(data,xList,yList){
  for(let i =0;i<data.length;i++){
    // data[i].x = ( data[i].x - d3.min(xList) ) / (d3.max(xList) - d3.min(xList)) * 500 d3.quantile(xList,0.15);
    // data[i].y = ( data[i].y - d3.min(yList) ) / (d3.max(yList) - d3.min(yList)) * 600 + d3.quantile(yList,0.15);

    data[i].x = ( data[i].x - d3.min(xList) ) / (d3.max(xList) - d3.min(xList)) * 300 + d3.quantile(xList,0.15);
    data[i].y = ( data[i].y - d3.min(yList) ) / (d3.max(yList) - d3.min(yList)) * 1000 + d3.quantile(yList,0.15);
  }
}
scaleData(dots,xList,yList);
var color_scale = d3.scaleLinear()
                    .domain([-1,1])
                    .range(['#F26C6C', "#417AFF"]);


// dots = [{x:127,y:127}, {x:133,y:133} , {x:155,y:155}, {x:156.5,y:156.5}];

var tempStroke = null;

dot = container.append("g")
    .attr("class", "dot")
    .selectAll("circle")
    .data(dots)
    .enter().append("circle")
    .attr("r", 5)
    .attr("id", function (d) { return d.image_id;})
    .attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) { return d.y; })
    .style("fill","#AAAAAA")
    .style("stroke", "transparent")
    .style("stroke-width", 2)
    .on("mouseover",function(d){
      tempStroke = d3.select(this).style("stroke");
      
      d3.select(this).style("cursor","pointer");
      d3.select(this).style("stroke","green");
      
      tsne_img
        .style('opacity',0.9)
        .style('left',d3.event.pageX + "px")
        .style('top',d3.event.pageY + "px");

      tsne_img
      .append('img')
      .transition().duration(500)
      .attr('src','static/image/FFHQ_SAMPLE2/'+d.image_id)
      .attr('width',100)
      .attr('height',100);
    })
    .on("mouseout", function(d) {      
      d3.select(this).style("stroke",tempStroke);

      tsne_img.select('img').remove();
      tsne_img.style("opacity", 0);  

    })
    .on("click", function(d) {
      console.log("clicked");
      let jObject = new Object(); 
      jObject.image_id = d.image_id;
      $.ajax({
        url : "/getCurrent",
        type: 'POST',
        data: jObject,
        dataType:'json',
        success: function(data) {
          init(data);
        },
        error: function(x, e) {
            alert("error");
        }
    });
    });



function currentLabeling(data){
  for(let i=0;i<data.length;i++){
    var circle = container.select('[id="'.concat(data[i],'"]'));
   
    circle
        .transition()
        .duration(750)
        .style("stroke", "#FF0000")
        .style("stroke-width", 2);  
  }
  beforeLabel = data;
}

function returnCurrent(data){
  for(let i=0;i<data.length;i++){
    var circle = container.select('[id="'.concat(data[i],'"]'));
    
    circle
        .transition()
        .duration(750)
        .style("stroke", "transparent")
        .style("stroke-width", 2);
  }
}

function returnMark(){
  var circle = container.selectAll('circle');
  circle
        .style("fill","#AAAAAA");
}

function markLabel(data){
  for(let i=0;i<data.length;i++){
    if(data[i].labeled){
      var circle = container.select('[id="'.concat(data[i].image_id,'"]'));
      let color = color_scale(parseFloat(data[i]['score']));
      circle
        .style("fill",color);  
    }  
  }
}


/* main */

init();
currentLabeling(current_cluster);
markLabel(dots);

