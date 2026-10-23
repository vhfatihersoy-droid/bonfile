const destination = new URL('https://bonfile.tarimakademi.chatgpt.site/');
destination.hash = window.location.hash;
destination.search = window.location.search;
const link = document.getElementById('destination');
if (link) link.href = destination.href;
window.location.replace(destination.href);
