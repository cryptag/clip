// This callback function is called when the content script has been
// injected and returned its results
function onPageDetailsReceived(pageDetails)  {
    document.getElementById('title').value = pageDetails.title;
    document.getElementById('url').value = pageDetails.url;
    document.getElementById('summary').innerText = pageDetails.summary;
}

// Global reference to the status display SPAN
var statusDisplay = null;

// POST the data to the server using XMLHttpRequest
function addBookmark() {
    // Cancel the form submit
    event.preventDefault();

    // The URL to POST our data to
    var postUrl = 'http://localhost:7878/trusted/rows';

    // Set up an asynchronous AJAX POST request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);

    // Prepare the data to be POSTed by URLEncoding each field's contents
    var title = document.getElementById('title').value;
    var url = document.getElementById('url').value;
    var summary = document.getElementById('summary').value;
    var tags = document.getElementById('tags').value;

    var plaintags = ['title:'+title, 'url:'+url, 'type:text',
                     'type:webclip', 'app:cryptagclip'];

    var fields = tags.trim().replace(',', ' ').split(/\s+/g);
    for (let i = 0; i < fields.length; i++) {
        if (fields[i] !== '') {
            plaintags.push(fields[i]);
        }
    }

    var row = {
        unencrypted: btoa(summary),
        plaintags: plaintags
    }

    // Set correct header for form data
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Handle request state change events
    xhr.onreadystatechange = function() {
        // If the request completed
        if (xhr.readyState == 4) {
            statusDisplay.innerHTML = '';
            if (xhr.status == 201) {
                // If it was a success, close the popup after a short delay
                statusDisplay.innerHTML = 'Saved!';
                window.setTimeout(window.close, 1000);
            } else {
                // Show what went wrong
                statusDisplay.innerHTML = 'Make sure cryptagd is running! Error saving: ' + xhr.statusText;
            }
        }
    };

    // Send the request and set status
    xhr.send(JSON.stringify(row));
    statusDisplay.innerHTML = 'Saving...';
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);
    // Get the event page
    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Call the getPageInfo function in the event page, passing in
        // our onPageDetailsReceived function as the callback. This injects
        // content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});