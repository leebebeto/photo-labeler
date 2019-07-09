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
      }
      const neutral_queue = new Queue();
      const blue_queue = new Queue();
      const red_queue = new Queue();


      /* parse data from flask and display on each grids */
      var keyword_list = JSON.parse('{{keyword_list | tojson | safe}}');
      var left_word = "more likely "+ keyword_list[0];
      var right_word = "more likely not " + keyword_list[0];
      $('#adjective1').append(left_word);
      $('#adjective2').append(right_word);
      var sec_description = "Images in the left box will be labeled as \"" + keyword_list[0] +
      "\", in the middle box as \"NEUTRAL\", and in the right box as \"not "+ keyword_list[0]+"\"."
      $('#description2').append(sec_description);
      var images = JSON.parse('{{images | tojson | safe}}');
      console.log(images);
      var index =0;
      
      //  blue queue
      for(var i=0; i< 6;i++){
          blue_queue.enqueue(images[i]);
          index +=1;          
      }
      for(var i=0; i<blue_queue._arr.length; i++){
        var img_node = document.createElement('img');
        img_node.setAttribute("class","current_img");
        img_node.style.width = '100%';
        img_node.style.height = '100%';
        img_node.style.padding = '10px';
        img_node.src = 'static/image/FFHQ_SAMPLE/' + blue_queue._arr[i];
        console.log(img_node.src);
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
            $('#L7').append(img_node);
            break;
          case 5:
            $('#L11').append(img_node);
            break;
        }
      }

      //  red queue
        for(var i=6; i< 12;i++){
            red_queue.enqueue(images[i]);
            index +=1;          
        }
        for(var i=0; i<red_queue._arr.length; i++){
        var node = document.createElement('div');
        var img_node = document.createElement('img');
        img_node.setAttribute("class","current_img");
        img_node.style.width = '100%';
        img_node.style.height = '100%';
        img_node.style.padding = '10px';

        img_node.src = 'static/image/FFHQ_SAMPLE/' + red_queue._arr[i];
        console.log(img_node.src);
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
            $('#R7').append(img_node);
            break;
          case 5:
            $('#R11').append(img_node);
            break;
        }
      }

      //  neutral queue
        for(var i=12; i< 14;i++){
            neutral_queue.enqueue(images[i]);
            index +=1;          
        }
        for(var i=0; i<neutral_queue._arr.length; i++){
        var img_node = document.createElement('img');
        img_node.setAttribute("class","current_img");
        img_node.style.width = '100%';
        img_node.style.height = '100%';
        img_node.style.padding = '10px';

        img_node.src = 'static/image/FFHQ_SAMPLE/' + neutral_queue._arr[i];
        console.log(img_node.src);
        switch(i){
          case 0:
            $('#N1').append(img_node);
            break;
          case 1:
            $('#N2').append(img_node);
            break;
        }
      }
