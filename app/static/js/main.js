 /* create queues */
 
function confirm_click(){
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
             images : scriptName.getAttribute('images')
         };
 }

 var blue_test_number = 6;
 var red_test_number = 6;
 var neutral_test_number = 2;
 var params = new getSyncScriptParams();
 var images = JSON.parse(params.images);
 console.log(Object.values(images));
      /* create queues */
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

  
  
  var total_queue = new Queue();
  total_queue._arr = Object.values(images);
  total_queue.cnt = total_queue._arr.length;
  console.log(total_queue);


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
        
        $('.current_img').remove();

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
            img_node.setAttribute("class","current_img");
            img_node.style.width = '100%';
            img_node.style.height = '100%';
            // img_node.style.border = 'solid';
            img_node.style.padding = '10px';
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
            console.log(ID)
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

        enQueues(blue_queue,blue_list,
          neutral_queue,neutral_list,
          red_queue,red_list);

        displayImages(blue_queue);
        displayImages(red_queue);
        displayImages(neutral_queue);
      }
      description();
      init();
 
