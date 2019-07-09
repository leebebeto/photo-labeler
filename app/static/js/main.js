 /* create queues */
 
function getSyncScriptParams() {
         var scripts = document.getElementsByTagName('script');
         var lastScript = scripts[scripts.length-1];
         var scriptName = lastScript;
         return {
             keywords : scriptName.getAttribute('keywords'),
             images : scriptName.getAttribute('images')
         };
 }

document.addEventListener("DOMContentLoaded", function(event) { 

 var params = new getSyncScriptParams();
 var images = JSON.parse(params.images);
 console.log(images)
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

      function createQueues(blue_queue, neutral_queue, red_queue) {
        /* 나중에 백엔드 구축 나눠야함*/
        var blue_images = [images[0], images[1], images[2], images[3], images[4], images[5]];
        var neutral_images = [images[6], images[7]];
        var red_images = [images[8], images[9], images[10], images[11], images[12], images[13]];
        for(var i=0; i< blue_images.length;i++){
          blue_queue.enqueue(blue_images[i]);
        }
        for(var i=0; i< neutral_images.length;i++){
          neutral_queue.enqueue(neutral_images[i]);
        }
        for(var i=0; i< red_images.length;i++){
          red_queue.enqueue(red_images[i]);
        }
        return blue_queue, neutral_queue, red_queue
      }


      function displayImages(queue){
        for (var i=0; i< queue.length(); i++){
          var img_node = document.createElement('img');
          img_node.setAttribute("class","current_img");
          img_node.style.width = '100%';
          img_node.style.height = '100%';
          // img_node.style.border = 'solid';
          img_node.style.padding = '10px';
          img_node.src = 'static/image/FFHQ_SAMPLE/' + queue._arr[i];
        
        if (queue == blue_queue){
          switch(i){
            case 0:
              $('#L1').append(img_node);
              break;
            case 1:
              $('#L2').append(img_node);
              break;
            case 2:
              $('#L3').append(img_node);
              break;
            case 3:
              $('#L4').append(img_node);
              break;
            case 4:
              $('#L5').append(img_node);
              break;
            case 5:
              $('#L6').append(img_node);
              break;
           }
        }
        else if ( queue == red_queue){
          switch(i){
            case 0:
              $('#R1').append(img_node);
              break;
            case 1:
              $('#R2').append(img_node);
              break;
            case 2:
              $('#R3').append(img_node);
              break;
            case 3:
              $('#R4').append(img_node);
              break;
            case 4:
              $('#R5').append(img_node);
              break;
            case 5:
              $('#R15').append(img_node);
              break;
           }
        }
        else {
          switch(i){
            case 0:
              $('#N1').append(img_node);
              break;
            case 1:
              $('#N2').append(img_node);
              break;
            case 2:
              $('#N3').append(img_node);
              break;
            case 3:
              $('#N4').append(img_node);
              break;
            case 4:
              $('#N5').append(img_node);
              break;
           }
        }
      }
    }
    function init(){
        description();
        createQueues(blue_queue, neutral_queue, red_queue);
        displayImages(blue_queue);
        displayImages(neutral_queue);
        displayImages(red_queue);
      }
      init();
  });
