$(document).ready(function() {
	$.getScript("http://disqus.com/forums/joshuaogle/embed.js");
});

var disqus_developer = 1;

function twitterCallback(obj) {
	var id = obj[0].user.id;
	document.getElementById('twitter_status').innerHTML = obj[0].text;
	document.getElementById('twitter_status_time').innerHTML = relative_time(obj[0].created_at);
}


function relative_time(time_value) {
  var parsed_date = Date.parse(time_value);
  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
  var pluralize = function (singular, n) {
    return '' + n + ' ' + singular + (n == 1 ? '' : 's');
  };
  if(delta < 60) {
  return 'less than a minute ago';
  } else if(delta < (45*60)) {
  return 'about ' + pluralize("minute", parseInt(delta / 60)) + ' ago';
  } else if(delta < (24*60*60)) {
  return 'about ' + pluralize("hour", parseInt(delta / 3600)) + ' ago';
  } else {
  return 'about ' + pluralize("day", parseInt(delta / 86400)) + ' ago';
  }
}