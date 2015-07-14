(function(){
  function provideFeedback(res) {
    // provide feedback to user
    alert(res);
  }
  function checkRes(res) {
    // checks if results contain an error
    if(res.Error) {
      // no search results were returned
      provideFeedback(res.Error);
    }
  }
  function displayMovieQuerySet(querySet, displayCB) {
    // Displays a list of movies. expects a querySet and display call back 
    // nodeParent is like the app main
    var nodeParent = document.querySelector('#search-results'); // save the li parent so we don't query dom twice
    nodeParent.innerHTML = '';  // remove exisiting search results from the DOM
    for(var i = 0; i < querySet.length; i++){
      var node = document.createElement('li');
      node.innerHTML = displayCB(querySet[i]);
      nodeParent.appendChild(node);  // append search result to nodeParent '<ul>'
    }
  }
  function getMovie(oid, displayTarget, displayCB) {
    // gets a movie from omdbapi and executes diplay callback
    var xhr = new XMLHttpRequest();
    // GET the object details using the imdbID and pass other options in request
    xhr.open('get', 'http://omdbapi.com/?i='+imdbID+'&plot=full&r=json&tomatoes=true', true);
    xhr.addEventListener('load', function(response) {
      var res = JSON.parse(this.response);
      displayCB(res, displayTarget);  // display result
    });
    xhr.send();
  }
  function getMovieDisplay(res) {
    // Displays details of a movie
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
    return nodeParent;
  }
  function displayMovie(res, displayTarget) {
    // displays a movie res in the displayTarget
    nodeParent = getMovieDisplay(res);
    // insert the list of attributes after the anchor
    displayTarget.insertAdjacentHTML('afterEnd', nodeParent.outerHTML);
    // create a new favorite button
    btnNode = createFavoriteButtonNode(res, displayTarget);
    // insert favorite button after link text
    displayTarget.insertBefore(btnNode, displayTarget.childNodes[1]);
  }
  function createFavoriteButtonNode(res, eventTarget)  {
    // creates and returns a favorite button node and deactivates event target
    var btnNode = document.createElement('button');
    btnNode.innerText = 'favorite';
    btnNode.setAttribute('name', res.Title);
    btnNode.setAttribute('oid', eventTarget.getAttribute('href'));
    // save this buttons attributes onclick
    btnNode.setAttribute('onclick', 'favoritesCtrl.save(this)');
    // save the oid as oid attr before removing incase its needed again
    eventTarget.setAttribute('oid', eventTarget.getAttribute('href'));
    eventTarget.removeAttribute('href');  // set href to none so results aren't loaded again
    return btnNode;
  }
  favoritesCtrl = (function() {
      // creates, saves and lists favorite movies
      function listFavorites(resultsCallback) {
        // returns a list of  favorite objects
          var xhr = new XMLHttpRequest();
          xhr.open('get', '/favorites', true);
          xhr.addEventListener('load', function(response) {
            var res = JSON.parse(this.response);
            checkRes(res);  // check for errors
            resultsCallback(res);
          });
          xhr.send();
      }
      function displayFavorites(res) {
        // displays a list of favorite objects
        function displayCallback(obj) {
          return '<a href="'+obj.oid+'">'+obj.name+'</span>';
        }
        displayMovieQuerySet(res, displayCallback); // display the favorites
      }
      return {
        save: function(btnNode) {
          // saves a favorite
          var xhr = new XMLHttpRequest();
          // GET the object details using the imdbID and pass other options in request
          xhr.open('post', '/favorites', true);
          xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
          xhr.addEventListener('load', function(response) {
            var res = JSON.parse(this.response);
            provideFeedback('Saved '+res.name);
          });
          var btnName = encodeURIComponent(btnNode.getAttribute('name'));
          // send post data to server
          xhr.send('name='+btnName+'&oid='+btnNode.getAttribute('oid'));
        },
        list: function() {
          // returns favorites list
          return listFavorites(displayFavorites);
        },
      };
  })();
  document.querySelector('#search-results').addEventListener('click', function(event){
    // display details of a movie when clicked
    event.preventDefault();
    imdbID = event.target.getAttribute('href');  // href is imdb id so store it
    // if no imdb id
    if(!imdbID) {
      // this event should only trigger if its on an anchor
      return;  // do not run sequence
    }
    getMovie(imdbID, event.target, displayMovie);
  });
  document.querySelector('form').addEventListener('submit', function(event){
    // list movies match query
    event.preventDefault();
    var input = document.querySelector('input').value;
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'http://omdbapi.com/?s=' + encodeURIComponent(input), true);
    xhr.addEventListener('load', function(response){
      var res = JSON.parse(this.response);
      checkRes(res);  // check for errors
      // no errors
      function listItemDisplay(obj) {
        // set id in the href for the id query for use later when fetching details of this movie
        return '<a href="'+obj.imdbID+'">'+obj.Title+'</span>';
      }
      displayMovieQuerySet(res.Search, listItemDisplay);
  });
    xhr.send();
  });
})();
