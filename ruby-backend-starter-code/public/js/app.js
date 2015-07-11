(function(){

  document.querySelector('ul').addEventListener('click', function(event){
    event.preventDefault();
    imdbID = event.target.getAttribute('href');  // href is imdb id so store it
    // if no imdb id
    if(!imdbID) {
      return;  // do not run sequence
    }
    var xhr = new XMLHttpRequest();
    // GET the object details using the imdbID and pass other options in request
    xhr.open('get', 'http://omdbapi.com/?i='+imdbID+'&plot=full&r=json&tomatoes=true', true);
    xhr.addEventListener('load', function(response) {
      var res = JSON.parse(this.response);
      var nodeParent = document.createElement('ul');
      for (var attr in res) {
        // loop through responses attributes
        if(res.hasOwnProperty(attr)) {
          var node = document.createElement('li');
          // inner text of <li> is the attribute key and value
          node.innerText = attr+': '+res[attr];
          nodeParent.appendChild(node); // append this attribute text to <ul>
        }
      }
      // insert the list of attributes after the anchor
      event.target.insertAdjacentHTML('afterEnd', nodeParent.outerHTML);
      event.target.setAttribute('href', '');  // set href to none so results aren't loaded again
    });
    xhr.send();
  });

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
        node.innerHTML = '<a href="'+res[i].imdbID+'">'+res[i].Title+'</span>';
        nodeParent.appendChild(node);  // append search result to nodeParent '<ul>'

      }
  });
    xhr.send();
  });
})();
