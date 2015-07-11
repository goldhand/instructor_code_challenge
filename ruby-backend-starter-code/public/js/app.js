(function(){

  document.querySelector('form').addEventListener('submit', function(event){
    event.preventDefault();
    var input = document.querySelector('input').value;
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'http://omdbapi.com/?s=' + encodeURIComponent(input), true);
    xhr.addEventListener('load', function(response){
      var res =  JSON.parse(this.response).Search;
      var nodeParent = document.querySelector('ul'); // save the li parent so we don't query dom twice
      nodeParent.innerHTML = '';  // remove exisiting search results from the DOM
      for(var i = 0; i < res.length; i++){
        var node = document.createElement('li');
        node.innerText = res[i].Title;
        nodeParent.appendChild(node);  // append search result to nodeParent '<ul>'
      }
  });
    xhr.send();
  });
})();
