function getSyncScriptParams() {
         var scripts = document.getElementsByTagName('script');
         console.log(scripts);
         var lastScript = scripts[scripts.length-1];
         var scriptName = lastScript;
         return {
             a : scriptName.getAttribute('data-a'),
             b : scriptName.getAttribute('data-b')
         };
 }


document.addEventListener("DOMContentLoaded", function(event) {
     var param = new getSyncScriptParams();
     var sel = $("script").data()
     var keyword_list = JSON.parse(param.a)
     var text = document.createTextNode("Hello World");
     document.querySelector("body").appendChild(text);
     console.log(param.a);
     console.log(param.b);
     console.log(sel);
     console.log(keyword_list["1"]);
         
});