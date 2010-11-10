$(document).ready(function() {
	$.getScript("http://disqus.com/forums/joshuaogle/embed.js");
	ChiliBook.recipeFolder = "/js/chili/"; 
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

/* Reusable Effects */
$('[id*=toggle-]').live('click',function() {
	var container = $(this).attr("id").replace("toggle-","");
	$('#'+container).toggle();
	return false;
});
$('[id*=slide-]').live('click',function() {
	var container = $(this).attr("id").replace("slide-","");
	$('#'+container).slideToggle();
	return false;
});
$('[id*=fade-]').live('click',function() {
	var container = $(this).attr("id").replace("fade-","");
	if ($('#'+container) .is(':hidden')) {
		$('#'+container).fadeIn();
	} else if ($('#'+container) .is(':visible')){
		$('#'+container).fadeOut();
	}
	return false;
});