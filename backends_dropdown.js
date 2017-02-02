function populateBackendsList() {
  // Dynamically populate backends dropdown

  var url = "http://localhost:7878/trusted/backends/names";

  fetch(url).then(resp => {
    return resp.json();
  }).then(backends => {
    select = document.getElementById('backend');

    for(var i = 0; i < backends.length; i++){
        var opt = document.createElement('option');
        opt.value = backends[i];
        opt.innerHTML = backends[i];
        select.appendChild(opt);
    }
  })
};

window.addEventListener('load', populateBackendsList);
