$(document).ready(function() {
	
	$.getScript("http://disqus.com/forums/joshuaogle/embed.js");
});

var disqus_developer = 1;

function twitterCallback(obj) {
	var id = obj[0].user.id;
	document.getElementById('twitter_status').innerHTML = obj[0].text;
	document.getElementById('twitter_status_time').innerHTML = relative_time(obj[0].created_at);
}