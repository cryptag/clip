var selection = window.getSelection().toString();
if (selection) {
    selection = '> ' + selection + '\n\n'
}

// Send a message containing the page details back to the event page
chrome.runtime.sendMessage({
    'title': document.title,
    'url': window.location.href,
    'summary': 'URL: <' + window.location.href + '>\n\n' + selection
});